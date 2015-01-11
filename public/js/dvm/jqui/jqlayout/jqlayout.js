/**
 * Author: Dee
 * Date: 2014/11/04
 * Version: 1.0.0 
 * Independence: -
 *  
 * Description:
 * The display ...
 * 
 */

(function($)
{	
	window.console.log("DVM/UI/LAYOUT/Layout loaded ... ");
	
	$.DVM.UI.LAYOUT.Layout = function()
	{
		window.console.log("DVM/UI/LAYOUT/Layout initial ... ");
		
		this.creator = null;
		return this;
	};
	
	$.DVM.UI.LAYOUT.Layout.prototype = 
	{
		attach : function(creator)
		{
			window.console.log("DVM/UI/LAYOUT/Layout attach: " + creator + " ... ");

			this.creator = creator;				
			return this;	
		},
		create : function(parent)
		{
			window.console.log("DVM/UI/LAYOUT/Layout create ... ");

			/*
			 * to be override to create the layout here  
			 */			
			 
			return this;
		},
		update : function(flag,hintobj,msg)
		{
			window.console.log("DVM/UI/LAYOUT/Layout update: " + flag + "," + msg +" ... ");
			
			return this;
		},
		toString : function()
		{
			return "Layout from " + this.creator;
		}
	};

	
})(jQuery);
