/**
 * Author: Dee
 * Date: 2015/01/17
 * Independence: lac.base
 *				 lac.mainapp
 *				 lac.itrmainlayout 
 *				 lac.ajaxconn
 *				 lac.storageconn
 *  
 * Description:
 * The itrmainapp ... 
 * - connector: Ajax, LocalStorage
 * 						
 */

// Create mainapp class ...
window.console.log("Create the LAC itrmainapp ... ");

(function($,L)
{
	$.extend(L.FLAG,
	{
		// New Flag to be defined ...
		 LOGIN : "login",
		 LOGOUT : "logout",
		 CREATEACCOUNT : "createaccount",
		 RESETPASSWORD : "resetpassword",
		 FORGOTPASSWORD : "forgotpassword",
		 UPDATEACCOUNT : "updateaccount",
		 FINDFRIEND : "findfriend",
		 BROWSEFRIENDS : "browsefriend",
		 FRIENDREQUEST : "friendrequest",
		 REPLYFRIENDREQUEST : "replyfriendreqest",
		 UNFRIEND : "unfriend",
		 CREATEEVENT : "createevent",
		 UPDATEEVENT : "updateevent",
		 REMOVEEVENT : "removeevent",
		 BROWSEEVENT : "browseevent",
		 BROWSEEVENTDETAIL : "browseeventdetail",				
		 INVITEFRIENDEVENT : "invitefriendevent",
		 CREATEEVENTDETAIL : "createeventdetail",
		 UPDATEEVENTDETAIL : "updateeventdetail",
		 REMOVEEVENTDETAIL : "removeeventdetail",
		 NOTSUCCESS : "notsuccess"
	});
	
	L.APP.ItrMainApp = function()
	{
		// constructor ... 
		window.console.log("LAC.APP.ItrMainApp __constuct() ... ");
		
		L.APP.MainApp.call(this,new L.LAYOUT.ItrMainLayout());
		this.layouts.mainlayout.create($("body"));
		
		this.pushconnector(new L.CONNECTOR.Ajax("ajax"));
		this.pushconnector(new L.CONNECTOR.LocalStorage("localstorage"));
		
		var self = this;
		this.connectors["localstorage"].request("itr.account",L.FLAG.LOCALREAD,null,null,
		function(pack)
		{
			self.data = pack.result;
			if(self.data.length > 0)
				self.updatealllayouts(L.FLAG.LOGIN,self.data,null);
			
			return true;
		});
		
		return this;
	};
	
	L.APP.ItrMainApp.prototype = $.extend(new L.APP.MainApp(),
	{
		post : function(flag,params)
		{
			// send request to server setting ... 
			window.console.log("LAC.APP.ItrMainApp post(flag:"+flag+",params:"+params+") ... ");
			var sentobj = {op:flag,params:JSON.stringify(params)};
			var reqinfo = {type:"POST",url:"routes/request.php",responseprocess:
			function(s,p)
			{
				if(s.charAt(0) != "{")
				{
					p.iserror = true;
					p.msg = s;
				}
				else
				{
					p.result.params = params;
					p.result.response = JSON.parse(s);
				}	
			}};
			
			var self = this;
			this.connectors["ajax"].request(null,flag,sentobj,reqinfo,
			function(p)
			{
				// update data here ... 
				if(!p.result.response.issuccess)
					self.updatealllayouts(L.FLAG.NOTSUCCESS,p.result.response.msg);	
				else
				{
					if(p.flag == L.FLAG.LOGIN || p.flag == L.FLAG.CREATEACCOUNT)
						$.extend(self.data,p.result.response.data);
					
					self.updatealllayouts(p.flag,{msg:p.result.response.msg,data:self.data},null);	
				}
				
				return true;
			});
			
			return this;
		},
		login : function(email,pw)
		{
			// login ... 
			window.console.log("LAC.APP.ItrMainApp login(email:"+email+",pw:"+pw+") ... ");
			
			if(email.length == 0 || pw.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Please fill in email and password!!");
			else
				this.post(L.FLAG.LOGIN,{email:email,password:pw});
			
			return this;
		},
		createaccount : function(email,name,pw,confirmpw)
		{
			// createaccount ... 
			window.console.log("LAC.APP.ItrMainApp login(email:"+email+",name:"+name+",pw:"+pw+",confirmpw:"+confirmpw+") ... ");
			
			if(email.length == 0 || pw.length == 0 || name.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Please fill in email, password and name!!");
			else if(pw != confirmpw)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Password confirmation incorrect!!");
			else if(!$.isemail(email))
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Invalid email format!!");
			else
				this.post(L.FLAG.CREATEACCOUNT,{email:email,name:name,password:pw});			
			
			return this;
		},
		findfriend : function(name)
		{
			// findfriend ... 
			window.console.log("LAC.APP.ItrMainApp findfriend(name:"+name+") ... ");
			
			if(name.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"No friend name is filled in!!");
			else
				this.post(L.FLAG.FINDFRIEND,{name:name});			
			
			return this;
		},
		browsefriend : function()
		{
			// browsefriend ... 
			window.console.log("LAC.APP.ItrMainApp browsefriend() ... ");
			
			this.post(L.FLAG.BROWSEFRIENDS,{accountuuid:this.data["account.uuid"]});			
			return this;			
		},
		friendrequest : function(frienduuid)
		{
			// friendrequest ... 
			window.console.log("LAC.APP.ItrMainApp friendrequest(frienduuid:"+frienduuid+") ... ");
			
			this.post(L.FLAG.FRIENDREQUEST,{accountuuid:this.data["account.uuid"],frienduuid:frienduuid});			
			return this;			
		},
		replyfriendrequest : function(frienduuid,isaccept)
		{
			// replyfriendreqest ... 
			window.console.log("LAC.APP.ItrMainApp replyfriendrequest(frienduuid:"+frienduuid+",isaccept:"+isaccept+") ... ");
			
			this.post(L.FLAG.REPLYFRIENDREQUEST,
					 {
						accountuuid:this.data["account.uuid"],
						frienduuid:frienduuid,
						status:((isaccept) ? "ACCEPTED" : "DENY")
					 });			
			return this;			
		},
		unfriend : function(frienduuid)
		{
			// unfriend ... 
			window.console.log("LAC.APP.ItrMainApp unfriend(frienduuid:"+frienduuid+") ... ");
			
			this.post(L.FLAG.UNFRIEND,{accountuuid:this.data["account.uuid"],frienduuid:frienduuid});			
			return this;				
		},
		createevent : function(name,isprivate,date,desc)
		{
			// createevent ... 
			window.console.log("LAC.APP.ItrMainApp createevent(name:"+name+",isprivate:"+isprivate+",date:"+date+",desc:"+desc+") ... ");

			if(name.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Please fill in the event name!!");
			else
			{	
				var data = {creatoruuid:this.data["account.uuid"],name:name,type:((isprivate) ? "PRIVATE" : "PUBLIC"),date:date};
				if(desc.length > 0)
					data.description = desc;
				
				this.post(L.FLAG.CREATEEVENT,data);
			}
			
			return this;
		},
		updateevent : function(eventuuid,name,desc)
		{
			// updateevent ... 
			window.console.log("LAC.APP.ItrMainApp updateevent(eventuuid:"+eventuuid+",name:"+name+",desc:"+desc+") ... ");

			if(name.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Please fill in the event name!!");
			else
			{	
				var data = {eventuuid:eventuuid};
				for(var i in this.data.created)
				{	
					if(this.data.created[i]["events.uuid"] == eventuuid)
					{
						if(desc != this.data.created[i]["events.description"])
							data.description = desc;
						if(name != this.data.created[i]["events.name"])
							data.name = name;
						
						break;
					}	
				}		

				if(data.hasOwnProperty("description") || data.hasOwnProperty("name"))
					this.post(L.FLAG.UPDATEEVENT,data);		
			}
			
			return this;
		},
		removeevent : function(eventuuid)
		{
			// removeevent ... 
			window.console.log("LAC.APP.ItrMainApp removeevent(eventuuid:"+eventuuid+") ... ");
			
			this.post(L.FLAG.REMOVEEVENT,{eventuuid:eventuuid});
			return this;
		},
		browseevent : function()
		{
			// browseevent ... 
			window.console.log("LAC.APP.ItrMainApp browseevent() ... ");
			
			this.post(L.FLAG.BROWSEEVENT,{accountuuid:this.data["account.uuid"]});
			return this;			
		},
		browseeventdetail : function(eventuuid)
		{
			// browseeventdetail ... 
			window.console.log("LAC.APP.ItrMainApp browseeventdetail(eventuuid:"+eventuuid+") ... ");
			
			this.post(L.FLAG.BROWSEEVENTDETAIL,{eventuuid:eventuuid});
			return this;						
		},
		invitefriendevent : function(eventuuid,partyuuid)
		{
			// invitefriendevent ... 
			window.console.log("LAC.APP.ItrMainApp invitefriendevent(eventuuid:"+eventuuid+",partyuuid:"+partyuuid+") ... ");
			
			this.post(L.FLAG.INVITEFRIENDEVENT,{eventuuid:eventuuid,partyuuid:partyuuid});
			return this;									
		},
		createeventdetail : function(eventuuid,lat,lng,time,desc)
		{
			// createeventdetail ... 
			window.console.log("LAC.APP.ItrMainApp createeventdetail(eventuuid:"+eventuuid+",lat:"+lat+",lng:"+lng+",time:"+time+",desc:"+desc+") ... ");
			
			var data = {eventuuid:eventuuid,lat:lat,lng:lng,time:time};
			if(desc)
				data.description = desc;
			
			this.post(L.FLAG.CREATEEVENTDETAIL,data);
			return this;			
		},
		updateeventdetail : function(eventuuid,eventdetailuuid,lat,lng,time,desc)
		{
			// updateeventdetail ... 
			window.console.log("LAC.APP.ItrMainApp updateeventdetail(eventuuid:"+eventuuid+",lat:"+lat+",lng:"+lng+",time:"+time+",desc:"+desc+") ... ");
			
			var data = {eventdetailuuid:eventdetailuuid};
			for(var i in this.data.created)
			{	
				if(this.data.created[i]["events.uuid"] == eventuuid)
				{
					for(var j in this.data.created[i].detail)
					{	
						if(this.data.created[i].detail[j]["eventdetail.uuid"] == eventdetailuuid)
						{
							if(lat != this.data.created[i].detail[j]["eventdetail.lat"])
								data.lat = lat;
							if(lng != this.data.created[i].detail[j]["eventdetail.lng"])
								data.lng = lng;
							if(time != this.data.created[i].detail[j]["eventdetail.time"])
								data.time = time;							
							if(desc != this.data.created[i].detail[j]["eventdetail.description"])
								data.description = desc;
						}	
						
						break;
					}
					
					break;
				}	
			}

			if(data.hasOwnProperty("description") || data.hasOwnProperty("lat") ||  data.hasOwnProperty("lng") ||  data.hasOwnProperty("time"))
				this.post(L.FLAG.UPDATEEVENTDETAIL,data);		
			
			return this;
		},
		removeeventdetail : function(eventdetailuuid)
		{
			// removeeventdetail ... 
			window.console.log("LAC.APP.ItrMainApp removeeventdetail(eventdetailuuid:"+eventdetailuuid+") ... ");
			
			this.post(L.FLAG.REMOVEEVENTDETAIL,{eventdetailuuid:eventdetailuuid});
			return this;			
		},
		updateaccount : function(name,imgpath,info)
		{
			// updateaccount ... 
			window.console.log("LAC.APP.ItrMainApp updateaccount(name:"+name+",imgpath:"+imgpath+",info:"+info+")... ");

			var data = {accountuuid:this.data["account.uuid"]};
			if(name.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"No name detected!!");
			else
			{
				if(name != this.data["account.name"])
					data.name = name;
				if(imgpath != this.data["account.imgpath"])
					data.imgpath = imgpath;
				if(info != this.data["account.info"])
					data.info = info;
				
				if(data.hasOwnProperty("name") || data.hasOwnProperty("imgpath") || data.hasOwnProperty("info"))
					this.post(L.FLAG.UPDATEACCOUNT,data);
			}
		},
		logout : function()
		{
			// logout ...
			window.console.log("LAC.APP.ItrMainApp logout() ... ");

			this.data = null;
			this.connectors["localstorage"].request("itr.account",L.FLAG.LOCALCLEAR,null,null,null);
			this.updatealllayouts(L.FLAG.LOGOUT,null);
			
			return this;
		},
		resetpw : function(oldpw,newpw,cf)
		{
			// resetpw ... 
			window.console.log("LAC.APP.ItrMainApp resetpw(oldpw:"+oldpw+",newpw:"+newpw+",cf:"+cf+") ... ");

			if(oldpw.length == 0 || newpw.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Please fill in the old and new password!!");
			else if(newpw != cf)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Confirmation password fail!!");
			else
				this.post(L.FLAG.RESETPASSWORD,{accountuuid:this.data["account.uuid"],newpassword:newpw,oldpassword:oldpw});
			
			return this;
		},
		forgotpw : function(email)
		{
			// forgotpw ... 
			window.console.log("LAC.APP.ItrMainApp forgotpw(email:"+email+") ... ");

			if(email.length == 0)
				this.updatealllayouts(L.FLAG.NOTSUCCESS,"Please fill in email!!");
			else
				this.post(L.FLAG.FORGETPASSWORD,{email:email});
			
			return this;
		},		
		toString : function()
		{
			return "ItrMainApp: "+this.uuid;
		}
	});
	
})(jQuery,jQuery.LAC);