/**
 * Author: Dee
 * Date: 2015/01/17
 * Independence: lac.base 
 *  
 * Description:
 * The mainlayout structure is defined with navbar at top, mainview, and a footer at bottom
 * 						
 */

// Create mainlayout class ...
window.console.log("Create the LAC mainlayout ... ");

(function($,L)
{	
	L.LAYOUT.MainLayout = function(uuid)
	{
		// constructor ... 
		window.console.log("LAC.LAYOUT.MainLayout __constuct(uuid:"+uuid+") ... ");
		
		L.LAYOUT.Abstract.call(this,uuid); 
		return this;
	};
	
	L.LAYOUT.MainLayout.prototype = $.extend(new L.LAYOUT.Abstract(),
	{
		create : function(parent)
		{
			// setup the layout here ... 
			window.console.log("LAC.LAYOUT.MainLayout create(parent:"+parent+") ... ");
			
			this.components = 
			{
				"navbar" : {},
				"mainview" : {},
				"footer" : {},
				"dialog" : {}
			};
			
			return this.createnavbar(this.components["navbar"],parent)
					   .createmainview(this.components["mainview"],parent)
					   .createfooter(this.components["footer"],parent)
					   .createdialog(this.components["dialog"],parent)
					   .eventlistener(this.components);
		},
		createnavbar : function(components,parent)
		{
			// setup the navbar here ... 
			window.console.log("LAC.LAYOUT.MainLayout createnavbar(parent:"+parent+") ... ");
			
			return this;
		},
		createmainview : function(components,parent)
		{
			// setup the mainview here ... 
			window.console.log("LAC.LAYOUT.MainLayout createmainview(parent:"+parent+") ... ");
			
			return this;
		},
		createfooter : function(components,parent)
		{
			// setup the footer here ... 
			window.console.log("LAC.LAYOUT.MainLayout createfooter(parent:"+parent+") ... ");
			
			return this;
		},
		createdialog : function(components,parent)
		{
			// setup the dialog here ... 
			window.console.log("LAC.LAYOUT.MainLayout createdialog(parent:"+parent+") ... ");
			
			return this;
		},
		eventlistener : function(components)
		{
			// setup the eventlistener here ... 
			window.console.log("LAC.LAYOUT.MainLayout eventlistener(components:"+components+") ... ");
			
			return this;
		},
		toString : function()
		{
			return "MainLayout: "+this.uuid;
		}
	});
	
})(jQuery,jQuery.LAC);