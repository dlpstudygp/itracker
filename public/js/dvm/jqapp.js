/**
 * Author: Dee
 * Date: 2014/12/26
 * Version: 1.0.2 
 * Independence: jqfilesystem.js
 * 		 		 jqlayout.js
 *  
 * Description:
 * It is the abstract life of the app here, work with the io request and feed back to the mainlayout for further action. 
 * The io system and the mainlayout shall be defined here
 * 
 * In DVM/App => io list, mainlayout, activedoc
 * 
 * - File object ... 
 */

(function($)
{
	window.console.log("DVM/App loaded ... ");

	// flag definition here
	$.DVM.APP = 
	{
		FINDFILE:"findfile",
		NEWFILE:"newfile",
		SAVEFILE:"savefile",
		OPENFILE:"openfile",
		REMOVEFILE:"removefile",
		CLOSEFILE:"closefile",
		BROWSEFILE:"browsefile",
		RENAMEFILE:"renamefile",
		ACTIVEDOC:"activedoc",
		ERROR:"error"
	};
	
	$.DVM.App = function(layout,doccls)
	{		
		window.console.log("DVM/App initial: " + layout + " ... ");

		this.browser($.browser());
		this.doccls = (doccls) ? doccls : $.DVM.DOC.Document;		
		this.ios = {};
		this.activedoclist = []; // [{name:name,doc:doc},{...},...]																	 
		
		this.mainlayout = (layout instanceof $.DVM.UI.LAYOUT.Layout) ? layout : new $.DVM.UI.LAYOUT.Layout();																
		this.mainlayout.attach(this);
		this.mainlayout.create($("body"));
		
		return this;
	};
	
	$.DVM.App.prototype =
	{
		browser : function(version)
		{
			window.console.log("DVM/App browser: " + version + " ... ");
			
			return this;
		},
		newfile : function(filename)
		{
			window.console.log("DVM/App newfile: " + filename + " ... ");
			
			if(!this.activedoc(filename))
			{
				var doc = new this.doccls(filename,this);
				doc.isnewfile = true;
				
				this.activedoclist.unshift(doc);	
				this.mainlayout.update($.DVM.APP.NEWFILE,{doc:doc},"New file success");
				
				return true;
			}
				
			return false;
		},
		closefile : function(doc)
		{
			window.console.log("DVM/App closefile ... ");
			
			var n = this.activedoclist.indexOf(doc);
			if(n!=-1)
			{
				this.mainlayout.update($.DVM.APP.CLOSEFILE,{doc:doc},"Close file success");			
				this.activedoclist.splice(n,1);
				
				return true;
			}
			
			return false;
		},		
		savefile : function(ioname,doc)
		{
			window.console.log("DVM/App savefile: " + ioname + "," + doc + " ... ");
			
			if(this.ios.hasOwnProperty(ioname) && doc instanceof this.doccls)
			{
				var self = this;
				var handler = function(ret,issuccess,msg)
				{
					if(issuccess)
					{
						self.mainlayout.update($.DVM.APP.SAVEFILE,{io:ioname,doc:doc,isnewfile:doc.isnewfile},msg);
						doc.isnewfile = false;
					}
					else
						self.error(msg);
						
					return true;		
				};
					
				this.ios[ioname].request((doc.isnewfile) ? $.DVM.IO.FILESYSTEM.CREATE : $.DVM.IO.FILESYSTEM.WRITE,
				 						  {file:new $.DVM.IO.File(doc.uuid,doc.filename,doc.data,null)},
				 						  handler);
					 						  
				return true; 						  
			}	
			
			return false;
		},
		openfile : function(ioname,filename)
		{
			window.console.log("DVM/App openfile: " + ioname + "," + filename + " ... ");
			
			if(!this.activedoc(filename))
			{
				if(this.ios.hasOwnProperty(ioname))
				{
					var self = this;
					this.ios[ioname].request($.DVM.IO.FILESYSTEM.READ,
					{file:new $.DVM.IO.File(null,filename,null,null)},
					function(ret,issuccess,msg)
					{
						if(issuccess)
						{
							var doc = new self.doccls(filename,self);
							doc.data = ret.file.dataobj();
							doc.uuid = ret.file.uuid;
							
							self.activedoclist.unshift(doc);
							self.mainlayout.update($.DVM.APP.OPENFILE,{io:ioname,doc:doc},msg);
						}
						else
							self.error(msg);				 	
						
						return true;	
					});
					 						  
					return true; 						  
				}
			}		
			
			return false;			
		},
		activedoc : function(doc)
		{
			window.console.log("DVM/App activedoc: " + doc + " ... ");

			if(doc instanceof this.doccls)
			{
				var n = this.activedoclist.indexOf(doc);
				if(n > 0)
				{
					var obj = this.activedoclist[n];
					this.activedoclist.splice(n,1);
					this.activedoclist.unshift(obj);
					
					this.mainlayout.update($.DVM.APP.ACTIVEDOC,{doc:this.activedoclist[0].doc},"Active doc success");
					return true;
				}
			}
			
			return false;
		},
		removefile : function(ioname,uuid)
		{
			window.console.log("DVM/App removefile: " + ioname + "," + uuid + " ... ");
			
			if(this.ios.hasOwnProperty(ioname) && typeof(uuid) === "string")
			{
				var self = this;
				this.ios[ioname].request($.DVM.IO.FILESYSTEM.REMOVE,{uuid:uuid},function(ret,issuccess,msg)
				{
					if(issuccess)
					{
						var n = self.isfileopen(uuid);
						if(n != -1)
							self.mainlayout.update($.DVM.APP.CLOSEFILE,{doc:self.activedoclist[n]},msg);
						
						self.mainlayout.update($.DVM.APP.REMOVEFILE,{io:ioname,uuid:uuid},msg);
					}
					else
						self.error(msg);				 	
						
					return true;	
				});				
				
				return true;
			}
			
			return false;				
		},
		findfile : function(ioname,filename)
		{
			window.console.log("DVM/App findfile: " + ioname + "," + filename + " ... ");

			if(this.ios.hasOwnProperty(ioname) && typeof(filename) === "string")
			{
				var self = this;
				this.ios[ioname].request($.DVM.IO.FILESYSTEM.FIND,{filename:filename},function(ret,issuccess,msg)
				{
					if(issuccess)
						self.mainlayout.update($.DVM.APP.FINDFILE,{io:ioname,isexist:ret.isexist},msg);
					else
						self.error(msg);				 	
						
					return true;	
				});				
				
				return true;
			}
			
			return false;			
		},
		browsefile : function(ioname,key,datefrom,dateto)
		{
			window.console.log("DVM/App browsefile: " + ioname + "," + key + "," + datefrom + "," + dateto + " ... ");

			if(this.ios.hasOwnProperty(ioname))
			{
				var self = this;
				this.ios[ioname].request($.DVM.IO.FILESYSTEM.BROWSE,{key:key,datefrom:datefrom,dateto:dateto},function(ret,issuccess,msg)
				{
					if(issuccess)
					{
						if(ret.iscomplete)
							self.mainlayout.update($.DVM.APP.BROWSEFILE,{io:ioname,iscomplete:true},msg);
						else
							self.mainlayout.update($.DVM.APP.BROWSEFILE,{io:ioname,
																		 uuid:ret.file.uuid,
																		 filename:ret.file.name,
																		 date:ret.file.lastupdate(),
																		 iscomplete:false},msg);
					}
					else
						self.error(msg);				 	
						
					return ret.iscomplete;	
				});				
				
				return true;
			}
			
			return false;			
		},
		renamefile : function(ioname,uuid,newname)
		{
			window.console.log("DVM/App renamefile: " + ioname + "," + uuid + "," + newname + "... ");

			if(this.ios.hasOwnProperty(ioname) && typeof(uuid) === "string" && typeof(newname) === "string")
			{
				var self = this;
				this.ios[ioname].request($.DVM.IO.FILESYSTEM.RENAME,
				{file:new $.DVM.IO.File(uuid,newname,null,null)},
				function(ret,issuccess,msg)
				{
					if(issuccess)
					{
						var n = self.isfileopen(uuid);
						var doc = null;
						if(n != -1)
						{	
							doc = self.activedoclist[n]
							doc.filename = newname;		
						}
						
						self.mainlayout.update($.DVM.APP.RENAMEFILE,
						{io:ioname,uuid:uuid,newname:newname,doc:doc},msg);
					}
					else
						self.error(msg);				 	
						
					return true;	
				});				
				
				return true;
			}
			
			return false;
		},
		error : function(msg,code)
		{
			window.console.log("DVM/App error: " + msg + " ... ");
			
			this.mainlayout.update($.DVM.APP.ERROR,{code:code,msg:msg},msg);
			return this;
		},
		isfileopen : function(uuid,filename)
		{
			window.console.log("DVM/App isfileopen: " + uuid + " ... ");
			
			if(typeof(uuid) !== "string" && typeof(filename) !== "string")
				return -1;
			
			for(var i in this.activedoclist)
				if((this.activedoclist[i].uuid == uuid && this.activedoclist[i].filename == filename) ||
					(this.activedoclist[i].uuid == uuid && typeof(filename) !== "string") ||
					(typeof(uuid) !== "string" && this.activedoclist[i].filename == filename)
					return i;
			
			return -1;		
		},
		toString : function()
		{
			return "App Name";
		}
	};
	
})(jQuery);