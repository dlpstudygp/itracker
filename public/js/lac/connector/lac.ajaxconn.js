/**
 * Author: Dee
 * Date: 2015/01/17
 * Independence: lac.base 
 *  
 * Description:
 * The connector is defined to receive data from server through ajax method 
 * 						
 */

// Create ajax class ...
window.console.log("Create the LAC ajax ... ");

(function($,L)
{	
	L.CONNECTOR.Ajax = function(uuid)
	{
		// constructor ... 
		window.console.log("LAC.CONNECTOR.Ajax __constuct(uuid:"+uuid+") ... ");
		
		L.CONNECTOR.Abstract.call(this,uuid);
		return this;
	};
	
	L.CONNECTOR.Ajax.prototype = $.extend(new L.CONNECTOR.Abstract(),
	{
		route : function(pack)
		{
			// send request through ajax call, update the package after the ajax complete, ... 
			// the package reqinfo as follow:
			// - type = POST,GET,PUT,DELETE ... 
			// - url = source path ...
			// - timeout = connection time allowance ... 
			// - responseprocess = is function to process the feedback data from server ... 
			
			window.console.log("LAC.CONNECTOR.Ajax route(pack:"+pack+") ... ");
			
			var self = this;
			$.ajax(
			{
				type:pack.reqinfo.type || "POST",
				url:pack.reqinfo.url || "/",
				data:pack.result,
				timeout:pack.reqinfo.timeout || 15000,
				dataType:"text",				
				success:function(s)
				{
					// success attach to the package ...
					if(typeof(pack.reqinfo.responseprocess) === "function")	
						pack.reqinfo.responseprocess(s,pack);
					else
						$.extend(pack.result,{response:s});
					
					self.trigger(pack);
				},
				error:function(xhr,status)
				{
					// connection fail
					pack.msg = status + ":" + xhr.responseText;
					pack.iserror = true;
					self.trigger(pack);					
				}
			});								
			
			return this;
		},		
		toString : function()
		{
			return "Ajax: "+this.uuid;
		}
	});
	
})(jQuery,jQuery.LAC);