/**
 * Author: Dee
 * Date: 2014/12/06
 * Version: 1.0.1 
 * Independence: jqlayout.js
 * 				 jqapp.js
 *  
 * Description:
 * One of the abstract components of the DVM corresponding to the data manipulation  
 * 
 */

(function($)
{		
	window.console.log("DVM/DOC/Document loaded ... ");
	
	$.DVM.DOC.DOCUMENT = 
	{
		CLOSE : "close",
		UNDO : "undo",
		REDO : "redo",
		SAVE : "save",
		ACTIVE : "active",
		ERROR : "error"
	};
	
	$.DVM.DOC.Document = function(filename,app)
	{		
		window.console.log("DVM/DOC/Document initial: " + filename + "," + app + "... ");

		this.data = {};									 // Raw data storage
		this.uuid = $.uuid();  							 // a unique id for the document
		this.filename = filename;						 // the filename of the document
		this.app = app;									 // the creator
		this.layouts = [];								 // layouts for the document
		this.commandstack = ($.DVM.UTIL.CommandStack) ? new $.DVM.UTIL.CommandStack() : null;
		this.issaverequest = true;
		this.isnewfile = false;
		
		return this;
	};
	
	$.DVM.DOC.Document.prototype =
	{
		createlayouts : function()
		{
			window.console.log("DVM/DOC/Document createlayouts ... ");
			
			/*
			 * override to build the layouts 
			 */
			
			this.pushlayout(new $.DVM.UI.LAYOUT.Layout());
			return this;
		},
		pushlayout : function(layout)
		{
			window.console.log("DVM/DOC/Document pushlayout: " + layout + " ... ");
			
			if(layout instanceof $.DVM.UI.LAYOUT.Layout)
			{	
				this.layouts.push(layout);
				layout.attach(this);
				layout.create(this.app.mainlayout);
			}
			
			return this;	
		},
		updatealllayouts : function(flag,hintobj,msg,caller)
		{
			window.console.log("DVM/DOC/Document updatealllayouts: " + flag + " ... ");
			
			for(var i in this.layouts)
				if(this.layouts[i]!=caller)
					this.layouts[i].update(flag,hintobj,msg);	
			
			return this;		
		},
		undo : function()
		{
			window.console.log("DVM/DOC/Document undo ... ");
			
			if(this.commandstack)
				this.commandstack.undo();
		},
		redo : function()
		{
			window.console.log("DVM/DOC/Document redo ... ");

			if(this.commandstack)
				this.commandstack.redo();
		},
		setactive : function(caller)
		{
			window.console.log("DVM/DOC/Document setactive ... ");

			this.updatealllayouts($.DVM.DOC.DOCUMENT.ACTIVE,null,"Active document ... ",caller);												
			this.app.activedoc(this);
			return this;
		},
		close : function(caller)
		{
			window.console.log("DVM/DOC/Document close ... ");

			this.updatealllayouts($.DVM.DOC.DOCUMENT.CLOSE,null,"Close document ... ",caller);									
			this.app.closefile(this);						
			return this;
		},
		save : function(ioname,caller)
		{
			window.console.log("DVM/DOC/Document save ... ");
			
			this.updatealllayouts($.DVM.DOC.DOCUMENT.SAVE,null,"Save document ... ",caller);						
			this.app.savefile(ioname,this);
			this.issaverequest = false;
			
			return this;			
		},
		error : function(msg)
		{
			window.console.log("DVM/DOC/Document error: " + msg + " ... ");
			
			this.updatealllayouts($.DVM.DOC.DOCUMENT.ERROR,null,msg,caller);			
			this.app.error(msg);
			
			return this;			
		},
		toString : function()
		{
			return "Document " + this.filename;
		}
	};
	
})(jQuery);
