/**
 * Author: Dee
 * Date: 2015/01/17
 * Independence: lac.base 
 *  
 * Description:
 * The mainapp is the LAC App object contain and manage the sub-LAC modal. There is only one layouts to be attached (LAC.mainlayout)
 * 						
 */

// Create mainapp class ...
window.console.log("Create the LAC mainapp ... ");

(function($,L)
{
	$.extend(L.FLAG,
	{
		// New Flag to be defined ...
		ATTACHAPP : "attachapp",
		ACTIVEAPP : "activeapp",
		DETACHAPP : "detachapp"
	});
	
	L.APP.MainApp = function(mainlayout)
	{
		// constructor ... 
		window.console.log("LAC.APP.MainApp __constuct(mainlayout:"+mainlayout+") ... ");
		
		L.APP.Abstract.call(this,window);
		this.activeapps = [];			// The list of the active apps stack, z-index order (0,1,2,3, ... )
		this.pushlayout(mainlayout);	// attach the mainlayout ... 
		
		return this;
	};
	
	L.APP.MainApp.prototype = $.extend(new L.APP.Abstract(),
	{
		attachapp : function(app)
		{
			// attach a sub app to the main system ... 
			window.console.log("LAC.APP.MainApp attachapp(app:"+app+") ... ");
			
			if(app instanceof L.APP.Abstract)
			{
				app.parent = this;
				this.activeapps.unshift(app);
				this.updatealllayouts(L.FLAG.ATTACHAPP,app.layouts,null);
			}
			
			return this;
		},
		activeapp : function(app)
		{
			// retrieve the selected app, prepend at the apps list ... 
			window.console.log("LAC.APP.MainApp activeapp(app:"+app+") ... ");
			
			if(this.activeapps[0] != app && this.activeapps.length > 0)
			{
				for(var i in this.activeapps)
				{	
					if(this.activeapps[i] == app)
					{
						this.activeapps.slice(i,1);
						this.activeapps.unshift(app);
						this.updatealllayouts(L.FLAG.ACTIVEAPP,app.layouts,null);
					}	
				}		
			}
			
			return this;
		},
		detachapp : function(app)
		{
			// detach the selected app, remove from the list ... 
			window.console.log("LAC.APP.MainApp detachapp(app:"+app+") ... ");
			
			if(this.activeapps[0] != app && this.activeapps.length > 0)
			{
				for(var i in this.activeapps)
				{	
					if(this.activeapps[i] == app)
					{
						this.activeapps.slice(i,1);
						this.updatealllayouts(L.FLAG.DETACHAPP,app.layouts,null);
					}	
				}		
			}
			
			return this;			
		},
		toString : function()
		{
			return "MainApp: "+this.uuid;
		}
	});
	
})(jQuery,jQuery.LAC);