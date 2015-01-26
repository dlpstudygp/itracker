/**
 * Author: Dee
 * Date: 2015/01/14
 * Version: 1.0.2
 * Independence: jqplus
 *  
 * Description:
 * 
 * Page:
 * - The content page, with initial function and show function ...
 * 
 * PageCollection:
 * - The collection of all pages ... 
 *   
 */

(function($)
{
	window.console.log("$.Page loaded ... ");
	
	$.Page = function()
	{
		window.console.log("$.Page __construct() ... ");
		
		this.component = null;
		
		this.isinit = false;
		this.data = null;
		this.inithandler = null;
		this.showhandler = null;
		this.hidehandler = null;
		
		return this;
	};
	
	window.console.log("$.PageCollection loaded ... ");
	
	$.PageCollection = function(uuid,cls,at)
	{
		window.console.log("$.PageCollection __construct() ... ");
		
		this.collection = [];
		this.activepage = null;
		this.component = $("<div></div>");
		if(typeof(cls) === 'string')
			this.component.addClass(cls);
		if(at instanceof Object)
			this.component.attr(at);		
		
		return this;
	};
	
	$.PageCollection.prototype = 
	{
		additem : function(uuid,cls,at)
		{
			window.console.log("$.PageCollection additem(" + uuid + "," + cls + "," + attr + ") ... ");			
			
			var page = new $.Page();
			page.component = $("<div></div>");
			if(typeof(cls) === 'string')
				page.component.addClass(cls);
			if(at instanceof Object)
				page.component.attr(at);			
			
			this.collection[uuid] = page;			
			this.component.append(page.component);

			return page;
		},
		removeitem : function(uuid)
		{
			window.console.log("$.PageCollection removeitem(" + uuid + ") ... ");	
			
			if(this.activepage == this.collection[uuid])
			{
				if(typeof(this.activepage.hidehandler) === "function")
					this.activepage.hidehandler(this.activepage.component,this.activepage.data);
				
				this.activepage.component.display(false);
				this.activepage = null;
			}
			
			delete this.collection[uuid];
			return this;
		},
		activepage : function(uuid)
		{
			window.console.log("$.PageCollection activepage(" + uuid + ") ... ");		

			if(this.activepage)
			{
				if(typeof(this.activepage.hidehandler) === "function")
					this.activepage.hidehandler(this.activepage.component,this.activepage.data);
				
				this.activepage.component.display(false);
				this.activepage = null;
			}
			
			var page = this.collection[uuid];
			if(page)
			{
				if(!page.isinit)
					if(typeof(page.inithandler) === "function")
						page.isinit = page.inithandler(page.component,page.data);
				
				if(typeof(page.showhandler) === "function")
					page.showhandler(page.component,page.data);
				
				page.component.display(true);
				this.activepage = page;
			}
	
			return this;
		},
		toString : function()
		{
			return "PageCollection: "+this.component.attr("id");
		}
	};
		
})(jQuery);
