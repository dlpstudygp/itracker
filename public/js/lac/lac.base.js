/**
 * Author: Dee
 * Date: 2015/01/16
 * Independence: jquery 
 *  
 * Description:
 * LAC modal is the well-founded structure for app development. This file contain the base function/class of LAC
 *
 * - $.LAC.APP: The core of the app contain all necessary data for application
 * - $.LAC.CONNECTOR: The communication between the database/server through Package Object, perform as an io with event driven programming
 * - $.LAC.LAYOUT: The display of the data, (view template)
 * - $.LAC.FLAG: The protocol between app-layout-connector 
 * 						
 */

// Create LAC interface ... 
window.console.log("Create the LAC interface ... ");

jQuery.LAC = 
{
	APP : 
	{
		Abstract : function(parent)
		{
			// The abstract constructor of the APP
			window.console.log("LAC.APP.Abstract __construct(parent:"+parent+") ... ");
			
			this.parent = parent;				// The creator ... 
			this.uuid = (new Date()).valueOf(); // The identity of the app ...
			this.data = null; 					// The data retrieved from the connector and display at layout ...
			this.connectors = {}; 				// The collection of the connectors for communication ...
			this.layouts = {};					// The layout attached to the app ...
			
			return this;
		}
	},
	CONNECTOR:
	{
		Package : function(uuid,flag,params,reqinfo)
		{
			// The constructor of the CONNECTOR.Package
			window.console.log("LAC.CONNECTOR.Package __construct(uuid:"+uuid+",flag:"+flag+",params:"+params+",reqinfo:"+reqinfo+") ... ");			
			
			this.uuid = (typeof(uuid) === "string") ? uuid : (new Date()).valueOf(); // The identity of the package for the event listener ...
			
			this.reqinfo = {};														 // The all information required for the request ... 
			if(reqinfo instanceof Object)
				$.extend(this.reqinfo,reqinfo);	
			
			this.flag = flag;														 // Define the connection type ... 
			this.result = (params instanceof Object) ? params : {};					 // The input params feed to the source, the return data will be appended here ...
			this.msg = "";															 // The feedback from the source ...
			this.iserror = false;													 // Is the connection fail ... 
			return this;
		},
		Abstract : function(uuid)
		{
			// The abstract constructor of the CONNECTOR
			window.console.log("LAC.CONNECTOR.Abstract __construct(uuid:"+uuid+") ... ");			

			this.uuid = (typeof(uuid) === "string") ? uuid : (new Date()).valueOf(); // The identity of the connector ...
			this.app = null;														 // The creator ... 
			return this;
		}
	},
	LAYOUT:
	{
		Abstract : function(uuid)
		{
			// The abstract constructor of the LAYOUT
			window.console.log("LAC.LAYOUT.Abstract __construct(uuid:"+uuid+") ... ");			

			this.uuid = (typeof(uuid) === "string") ? uuid : (new Date()).valueOf(); // The identity of the layout ...			
			this.app = null; 														 // The creator ... 						 // The app created by .. 
			this.components = {};													 // The storage of the layouts components ...
			
			return this;
		}
	},
	FLAG:
	{
		// self defined
		ERROR : "error"
	}
};

jQuery.LAC.APP.Abstract.prototype = 
{
	pushlayout : function(layout)
	{
		// Set the necessary layout to the app, ... 
		window.console.log("LAC.APP.Abstract pushlayout(layout:"+layout+") ... ");			
		
		if(layout instanceof jQuery.LAC.LAYOUT.Abstract)
		{	
			this.layouts[layout.uuid] = layout;
			layout.attachapp(this);
		}
		
		return this;
	},
	pushconnector : function(connector)
	{
		// Set the necessary connector to the app, ... 
		window.console.log("LAC.APP.Abstract pushconnector(connector:"+connector+") ... ");			
		
		if(connector instanceof jQuery.LAC.CONNECTOR.Abstract)
		{	
			this.connectors[connector.uuid] = connector;
			connector.attachapp(this);
		}
		
		return this;
	},
	updatealllayouts : function(flag,data,caller)
	{
		// Update all attached layouts for any changing of the data set ... 
		window.console.log("LAC.APP.Abstract updatealllayouts(flag:"+flag+",data:"+data+"caller:"+caller+") ... ");			
			
		for(var i in this.layouts)
			if(this.layouts[i] != caller)
				this.layouts[i].update(flag,data);
			
		return this;
	},
	error : function(errorobj)
	{
		// error handler (updatealllayouts of error) ... 
		window.console.log("LAC.APP.Abstract error(errorobj:"+errorobj+") ... ");			
		
		this.updatealllayouts($.LAC.FLAG.ERROR,errorobj,null);
		return this;
	},
	toString : function()
	{
		return "Abstract App "+this.uuid;
	}
};

jQuery.LAC.CONNECTOR.Abstract.prototype = 
{
	attachapp : function(app)
	{
		// attach the app ... 
		window.console.log("LAC.CONNECTOR.Abstract attach(app:"+app+") ... ");

		if(this.app == null)
			this.app = (app instanceof jQuery.LAC.APP.Abstract) ? app : null;

		return this;
	},
	request : function(uuid,flag,params,reqinfo,callback)
	{
		// set event listener for the request ... 
		window.console.log("LAC.CONNECTOR.Abstract request(uuid:"+uuid+",flag:"+flag+",params:"+params+",reqinfo:"+reqinfo+",callback:"+callback+") ... ");

		var self = this;
		$(document).bind(this.uuid+flag,function(ev)
		{
			var isunbind = true;
			if(ev.pack.iserror)
				self.app.error(ev.pack.msg);
			else if(typeof(callback) == "function")
				isunbind = callback(ev.pack);
			
			if(isunbind)
				$(document).unbind(self.uuid+ev.pack.flag);	
		});
		
		this.route(new $.LAC.CONNECTOR.Package(uuid,flag,params,reqinfo));
		return this;
	},
	route : function(pack)
	{
		// to classify the request type here ... 
		window.console.log("LAC.CONNECTOR.Abstract route(pack:"+pack+") ... ");
		
		return this;
	},
	trigger : function(pack)
	{
		// trigger the event after server/source response ... 		
		window.console.log("LAC.CONNECTOR.Abstract request(pack:"+pack+") ... ");

		var ev = $.Event(this.uuid+pack.flag);
		ev.pack = pack;
		
		$(document).trigger(ev);
		return this;
	},
	toString : function()
	{
		return "Abstract Connector "+this.uuid;
	}
};

jQuery.LAC.LAYOUT.Abstract.prototype = 
{
	attachapp : function(app)
	{
		// attach the app ... 
		window.console.log("LAC.LAYOUT.Abstract attach(app:"+app+") ... ");

		if(this.app == null)
			this.app = (app instanceof jQuery.LAC.APP.Abstract) ? app : null;

		return this;		
	},
	create : function(parent)
	{
		// setup the layout here ... 
		window.console.log("LAC.LAYOUT.Abstract create(parent:"+parent+") ... ");
		
		return this;
	},
	update : function(flag,data)
	{
		// route the receive flag ... 
		window.console.log("LAC.LAYOUT.Abstract update(flag:"+flag+",data:"+data+") ... ");

		if(flag == jQuery.LAC.FLAG.ERROR)
			this.error(data);
		
		return this;
	},
	error : function(errorobj)
	{
		// error handler ... 
		window.console.log("LAC.LAYOUT.Abstract error(errorobj:"+errorobj+") ... ");
		
		return this;
	},
	toString : function()
	{
		return "Abstract Layout "+this.uuid;
	}
};