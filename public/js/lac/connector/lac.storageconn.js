/**
 * Author: Dee
 * Date: 2015/01/17
 * Independence: lac.base 
 *  
 * Description:
 * The connector is defined to receive data from the local storage, from the local computer  
 * 						
 */

// Create ajax class ...
window.console.log("Create the LAC localstorage ... ");

(function($,L)
{
	$.extend(L.FLAG,
	{
		LOCALREAD : "localread",
		LOCALWRITE : "localwrite",
		LOCALCLEAR : "localclear"
	});
	
	L.CONNECTOR.LocalStorage = function(uuid)
	{
		// constructor ... 
		window.console.log("LAC.CONNECTOR.LocalStorage __constuct(uuid:"+uuid+") ... ");
		
		L.CONNECTOR.Abstract.call(this,uuid);
		return this;
	};
	
	L.CONNECTOR.LocalStorage.prototype = $.extend(new L.CONNECTOR.Abstract(),
	{
		route : function(pack)
		{
			// to see if localstorage support, otherwise error ... 
			window.console.log("LAC.CONNECTOR.LocalStorage route(pack:"+pack+") ... ");
			
			if(window.localStorage)					
			{
				if(pack.flag === L.LOCALREAD)
					pack.result = JSON.parse(window.localStorage[pack.uuid]);
				else if(pack.flag === L.LOCALWRITE)
					window.localStorage.setItem(pack.uuid,JSON.stringify(pack.reesult));
				else if(pack.flag === L.LOCALCLEAR)
					window.localStorage.removeItem(pack.uuid);
			}
			else
			{
				pack.iserror = true;
				pack.msg = "LocalStorage does not support!!";
			}
			
			this.trigger(pack);
			return this;
		},		
		toString : function()
		{
			return "Ajax: "+this.uuid;
		}
	});
	
})(jQuery,jQuery.LAC);