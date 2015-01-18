/**
 * Author: Dee
 * Date: 2015/01/17
 * Independence: lac.base
 *				 lac.mainlayout 
 *  
 * Description:
 * The mainlayout structure for iTracker
 * 						
 */

// Create itrmainlayout class ...
window.console.log("Create the LAC itrmainlayout ... ");

(function($,L)
{	
	L.LAYOUT.ItrMainLayout = function()
	{
		// constructor ... 
		window.console.log("LAC.LAYOUT.ItrMainLayout __constuct() ... ");
		
		L.LAYOUT.MainLayout.call(this,"mainlayout"); 
		return this;
	};
	
	L.LAYOUT.ItrMainLayout.prototype = $.extend(new L.LAYOUT.MainLayout(),
	{
		createnavbar : function(collection,parent)
		{
			// setup the navbar here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout createnavbar(parent:"+parent+") ... ");

			collection["loginnavbar"] = $(new EJS({url:"view/navbar.ejs"}).render(
			{
				brand:"iTracker"
			}));
			parent.append(collection["loginnavbar"]);
			
			return this;
		},
		createmainview : function(collection,parent)
		{
			// setup the mainview here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout createmainview(parent:"+parent+") ... ");
			
			return this;
		},
		createfooter : function(collection,parent)
		{
			// setup the footer here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout createfooter(parent:"+parent+") ... ");
			
			return this;
		},
		createdialog : function(collection,parent)
		{
			// setup the dialog here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout createdialog(parent:"+parent+") ... ");

			var form = new EJS({url:"view/loginfrm.ejs"}).render();
			collection["logindlg"] = $(new EJS({url:"view/dialog.ejs"}).render(
			{
				uuid:"dlglogin",
				title:"Login",
				alert:null,
				content:form,
				buttons:
				[
					{uuid:"btnlogin",type:"btn-primary",title:"SignIn"}
				]
			}));
			parent.append(collection["logindlg"]);

			var form = new EJS({url:"view/createacctfrm.ejs"}).render();
			collection["createaccdlg"] = $(new EJS({url:"view/dialog.ejs"}).render(
			{
				uuid:"dlgcreateacc",
				title:"Register new account",
				alert:null,
				content:form,
				buttons:
				[
					{uuid:"btncreateacc",type:"btn-primary",title:"SignUp"}
				]
			}));
			parent.append(collection["createaccdlg"]);

			return this;
		},
		eventlistener : function(components)
		{
			// setup the eventlistener here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout eventlistener(components:"+components+") ... ");
			
			var self = this;
			
			var logindlg = this.components.dialog["logindlg"];
			logindlg.on("click touch","button",
			function(evt)
			{
				var target = $(evt.target);
				if(target.attr("id") == "btnlogin")
				{
					var email = logindlg.find("#inputemail").val().trim();
					var pw = logindlg.find("#inputpassword").val().trim();					
					self.app.login(email,pw);
				}
			});

			var createaccdlg = this.components.dialog["createaccdlg"];
			createaccdlg.on("click touch","button",
			function(evt)
			{
				var target = $(evt.target);
				if(target.attr("id") == "btncreateacc")
				{
					var email = createaccdlg.find("#inputemail").val().trim();
					var name = createaccdlg.find("#inputname").val().trim();
					var pw = createaccdlg.find("#inputpassword").val().trim();
					var cf = createaccdlg.find("#inputconfirmation").val().trim();
					self.app.createaccount(email,name,pw,cf);					
				}	
			});
			
			return this;
		},		
		update : function(flag,hint)
		{
			// route the receive flag ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout update(flag:"+flag+",hint:"+hint+") ... ");

			if(flag == L.FLAG.NOTSUCCESS)
				alert("diu .... "+hint);
			else if(flag == L.FLAG.LOGIN)
				alert("diu lee .... "+hint.data["account_uuid"]);
			else if(flag == L.FLAG.CREATEACCOUNT)
				alert("diu lee ... "+hint.data["account_uuid"]);
			
			return L.LAYOUT.MainLayout.prototype.update.call(this,flag,hint);			
		},
		error : function(errorobj)
		{
			// error handler ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout error(errorobj:"+errorobj+") ... ");
			$("body").append(errorobj);
			
			return this;			
		},
		toString : function()
		{
			return "ItrMainLayout: "+this.uuid;
		}
	});
	
})(jQuery,jQuery.LAC);