/**
 * Author: Dee
 * Date: 2014/12/25
 * Version: 1.0.2 
 * Independence: jqfilesystem.js
 * Description:
 * The io operation is to connection with the php page by ajax post method and feed back with action ...
 * 
 * - Work with file obj (uuid = "op" for php, name = http, data = the post data)
 */

(function($)
{
	window.console.log("DVM/IO/PHPConn loaded ... ");
	
	$.extend($.DVM.IO.FILESYSTEM,
	{
		POST : "post"
	});
	
	$.DVM.IO.PHPConn = function(uuid)
	{
		window.console.log("DVM/IO/PHPConn initial: " + uuid + " ... ");
		
		return $.DVM.IO.FileSystem.call(this,uuid);
	};
	
	$.DVM.IO.PHPConn.prototype = $.extend(new $.DVM.IO.FileSystem(),
	{
		request : function(flag,file,handler)
		{
			window.console.log("DVM/IO/PHPConn request: " + flag + " ... ");
			
			$.DVM.IO.FileSystem.prototype.request.call(this,flag,file,handler);
			
			if(flag === $.DVM.IO.FILESYSTEM.POST)
			{
				var self = this;
				var data = {op:file.uuid,params:file.data};
				$.ajax(
				{
					type: "POST",
					url: file.name,
					data:data,
					timeout: 15000,
					dataType:"text",				
					success:function(s)
					{
						if(s.charAt(0) != "{")
							$(document).trigger(self.getevent($.DVM.IO.FILESYSTEM.POST,false,null,s));
						else
						{
							file.data = s;
							$(document).trigger(self.getevent($.DVM.IO.FILESYSTEM.POST,true,file,"Post Success"));
						}
					},
					error:function(xhr,sStatus)
					{
						// connection fail
						var sErr = sStatus + ":" + xhr.responseText;
						$(document).trigger(self.getevent($.DVM.IO.FILESYSTEM.POST,false,null,sErr));					
					}
				});					
			}

			return this;
		},	
		toString : function()
		{
			return "PHPConn System " + this.uuid;
		}
	});
	
})(jQuery);
