/**
 * Author: Dee
 * Date: 2014/12/06
 * Version: 1.0.1 
 * Independence: jqlayout.js
 *  
 * Description:
 * It is the default layout definition
 * 
 *			---------------------------------------------
 * 			|				top bar						|
 * 			---------------------------------------------
 * 			|  											|
 * 			|    										|
 * 			|    			container					|
 * 			|    										|
 * 			|    										|
 * 			|    										|
 * 			|	 										|
 * 			---------------------------------------------
 * 			|				footer						|
 * 			---------------------------------------------
 * 
 *   
 */

(function($)
{
	window.console.log("DVM/UI/LAYOUT/MainLayout loaded ... ");

	$.DVM.UI.LAYOUT.MainLayout = function()
	{
		window.console.log("DVM/UI/LAYOUT/MainLayout initial ... ");
				
		return $.DVM.UI.LAYOUT.Layout.call(this);
	};
	
	$.DVM.UI.LAYOUT.MainLayout.prototype = new $.DVM.UI.LAYOUT.Layout();
	
	$.DVM.UI.LAYOUT.MainLayout.prototype.update = function(flag,hintobj,msg)
	{
		window.console.log("DVM/UI/LAYOUT/Layout update: " + flag + "," + msg + " ... ");
		
		if(flag === $.DVM.APP.NEWFILE || flag === $.DVM.APP.OPENFILE)
			hintobj.doc.createlayouts();
		
		return this;		
	};
	
	$.DVM.UI.LAYOUT.MainLayout.prototype.create = function(body)
	{		
		window.console.log("DVM/UI/LAYOUT/MainLayout create ... ");
		
		// remove the selection of the test ...
		$("body").disableSelection();
		
		// the default layout
		this.createtopbar(body);
		this.setcontainer(body);
		
		body.append("<br>");
		this.createfooter(body);
		this.createdialogs($("<div id='dlgcontainer'>").appendTo(body));
	};
	
	$.DVM.UI.LAYOUT.MainLayout.prototype.createtopbar = function(body)
	{
		window.console.log("DVM/UI/LAYOUT/MainLayout createtopbar ... ");
		
		/*
		 * override here to build the topbar
		 * 
		 */
		
		return this;
	};

	$.DVM.UI.LAYOUT.MainLayout.prototype.createfooter = function(body)
	{		
		window.console.log("DVM/UI/LAYOUT/MainLayout createfooter ... ");
	
		/*
		 * override here to build the footer
		 * 
		 */
			
		return this;
	};
	
	$.DVM.UI.LAYOUT.MainLayout.prototype.setcontainer = function(body)
	{
		window.console.log("DVM/UI/LAYOUT/MainLayout setcontainer ... ");
							
		/*
		 * override the function for different the layout
		 * 
		 * all views and toolboxs shall be created here
		 * 
		 */
				
		return this;
	};
	
	$.DVM.UI.LAYOUT.MainLayout.prototype.createdialogs = function(container)
	{
		window.console.log("DVM/UI/LAYOUT/MainLayout createdialogs ... ");
				
		/*
		 * override to create other dialog, append the dialog to the modal container
		 * 
		 */
		
		return this;
	};
	
	$.DVM.UI.LAYOUT.MainLayout.toString = function()
	{
		return "MainLayout from " + this.creator;
	}	
		
})(jQuery);
