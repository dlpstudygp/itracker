/**
 * Author: Dee
 * Date: 2014/12/26
 * Version: 1.0.2 
 * Independence: -
 * Description:
 * The abstract operation for the file io including read, write, find, browse, remove, rename file
 * 
 * - File object to assist the operation between filesystem ...
 */

(function($)
{
	window.console.log("DVM/IO/File loaded ... ");
	
	$.DVM.IO.File = function(uuid,name,data,date)
	{
		window.console.log("DVM/IO/File initial: "  + uuid + " ... ");
		
		this.uuid = (uuid) ? uuid.toString() : $.uuid();
		this.date = (date instanceof Date) ? date.valueOf() : ((typeof(date) === "number") ?  date : (new Date()).valueOf());
		this.data = (data instanceof Object) ? JSON.stringify(data) : ((typeof(data) === "string") ? data : "");
		this.name = (name) ? name : "New File";
		
		return this;
	};
	
	$.DVM.IO.File.prototype =
	{
		lastupdate : function()
		{
			window.console.log("DVM/IO/File lastupdate: ... ");
			
			var obj = new Date(this.date);
			return obj.toLocaleFormat("%F %T");
		},
		dataobj : function()
		{
			window.console.log("DVM/IO/File dataobj ... ");
			
			return JSON.parse(this.data);
		},
		toString : function()
		{
			return "File: " + this.uuid + ": " + this.name;
		}
	};
	
	window.console.log("DVM/IO/FileSystem loaded ... ");
	
	$.DVM.IO.FILESYSTEM =
	{
		READY : "ready",
		CREATE : "create",
		READ : "read",
		WRITE : "write",
		FIND : "find",
		REMOVE : "remove",
		BROWSE : "browse",
		RENAME : "rename"	
	};
	
	$.DVM.IO.FileSystem = function(uuid)
	{
		window.console.log("DVM/IO/FileSystem initial: "  + uuid + " ... ");
		
		this.uuid = (uuid) ? uuid.toString() : $.uuid();
		return this;
	};
	
	$.DVM.IO.FileSystem.prototype = 
	{
		request : function(flag,file,handler)
		{
			window.console.log("DVM/IO/FileSystem request: " + flag + " ... ");
			
			var self = this;
			$(document).bind(this.uuid+flag,function(ev)
			{
				window.console.log("DVM/IO/FileSystem request/bind: " + ev.type + " ... ");
				
				var isunbind = true;	
				if(typeof(handler) == "function")
					isunbind = handler(ev.ret,ev.issuccess,ev.msg);
					
				if(isunbind)
					$(document).unbind(self.uuid+flag);	
			});
			
			if(flag==$.DVM.IO.FILESYSTEM.READY)
				this.ready();
			else if(flag==$.DVM.IO.FILESYSTEM.CREATE)
				this.create(file);
			else if(flag==$.DVM.IO.FILESYSTEM.READ)
				this.read(file);
			else if(flag==$.DVM.IO.FILESYSTEM.WRITE)
				this.write(file);
			else if(flag==$.DVM.IO.FILESYSTEM.RENAME)
				this.rename(file);
			else if(flag==$.DVM.IO.FILESYSTEM.REMOVE)
				this.remove(file);
			else if(flag==$.DVM.IO.FILESYSTEM.BROWSE)
				this.browse();
			
			return this;	
		},
		ready : function()
		{
			window.console.log("DVM/IO/FileSystem ready ... ");
			
			$(document).trigger(this.getevent($.DVM.IO.FILESYSTEM.READY,true,null,""));
			return this;
		},
		create : function(file)
		{
			window.console.log("DVM/IO/FileSystem create: " + file + " ... ");
			
			$(document).trigger(this.getevent($.DVM.IO.FILESYSTEM.CREATE,true,file,""));
			return this;
		},
		read : function(file)
		{
			window.console.log("DVM/IO/FileSystem read: " + file + " ... ");
			
			$(document).trigger(this.getevent($.DVM.IO.FILESYSTEM.READ,true,file,""));
			return this;
		},
		write : function(file)
		{
			window.console.log("DVM/IO/FileSystem write: " + file + " ... ");
			
			$(document).trigger(this.getevent($.DVM.IO.FILESYSTEM.WRITE,true,file,""));
			return this;
		},
		rename : function(file)
		{
			window.console.log("DVM/IO/FileSystem rename: " + file + " ... ");
			
			$(document).trigger(this.getevent($.DVM.IO.FILESYSTEM.RENAME,true,file,""));
			return this;
		},
		remove : function(file)
		{
			window.console.log("DVM/IO/FileSystem remove: " + file + " ... ");
			
			$(document).trigger(this.getevent($.DVM.IO.FILESYSTEM.REMOVE,true,file,""));
			return this;
		},
		browse : function()
		{
			window.console.log("DVM/IO/FileSystem browse ... ");
			
			$(document).trigger(this.getevent($.DVM.IO.FILESYSTEM.BROWSE,true,null,""));
			return this;
		},
		getevent : function(flag,issuccess,ret,msg)
		{
			window.console.log("DVM/IO/FileSystem getevent: " + flag + "," + issuccess + "," + msg + " ... ");
			
			var ev = $.Event(this.uuid+flag);
			ev.issuccess = issuccess;
			ev.ret = ret;
			ev.msg = msg;
			
			return ev;
		},										
		toString : function()
		{
			return "File System " + this.uuid;
		}
	};
	
})(jQuery);
