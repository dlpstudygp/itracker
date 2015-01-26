/**
 * Author: Dee
 * Date: 2015/01/17
 * Independence: lac.base
 *				 lac.mainlayout 
 *  
 * Description:
 * The mainlayout structure for iTracker
 * 						
 */

// Create itrmainlayout class ...
window.console.log("Create the LAC itrmainlayout ... ");

(function($,L)
{	
	L.LAYOUT.ItrMainLayout = function()
	{
		// constructor ... 
		window.console.log("LAC.LAYOUT.ItrMainLayout __construct() ... ");
		
		L.LAYOUT.MainLayout.call(this,"mainlayout");
		
		// disable selection ... 
		$("body").disableSelection();
		
		return this;
	};
	
	L.LAYOUT.ItrMainLayout.prototype = $.extend(new L.LAYOUT.MainLayout(),
	{
		createnavbar : function(collection,parent)
		{
			// setup the navbar here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout createnavbar(parent:"+parent+") ... ");
			
			collection["main"] = $(new EJS({url:"view/navbar.ejs"}).render(
			{
				items: 
				[
					{uuid: "signin", title: "SignIn"},
					{uuid: "signup", title: "SignUp"}		
				]
			}));
			
			parent.append(collection["main"]);
			return this;
		},
		createmainview : function(collection,parent)
		{
			// setup the mainview here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout createmainview(parent:"+parent+") ... ");
			
			// builder wrapper container ...
			collection["wrapper"] = $("<div id='wrapper' class='toggled'></div>").appendTo(parent);
			
			// build the sidebar ...
			collection["sidebar"] = $(new EJS({url:"view/sidebar.ejs"}).render(
			{
				brand: "iTracker",
				items: 
				[
					{uuid: "myprofile", title: "MyProfile"},
					{uuid: "myevt", title: "MyEvents"},
					{uuid: "publicevt", title: "PublicEvents"}
				]
			})).appendTo(collection["wrapper"]);
			
			// build page ... 
			var container = $("<div id='page-content-wrapper'><div class='container-fluid'></div></div>").appendTo(collection["wrapper"]);
			collection["pagecollection"] = new $.PageCollection("pagecollection","row",null);
			container.append(collection["pagecollection"].component);
			
			// add page here ... 
		
			parent.append(container);
			return this;
		},
		createdialog : function(collection,parent)
		{
			// setup the dialog here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout createdialog(parent:"+parent+") ... ");

			var form = new EJS({url:"view/loginfrm.ejs"}).render();
			collection["logindlg"] = $(new EJS({url:"view/dialog.ejs"}).render(
			{
				uuid:"dlglogin",
				title:"Login",
				alert:null,
				content:form,
				buttons:
				[
					{uuid:"btnlogin",type:"btn-primary",title:"SignIn"}
				]
			}));
			parent.append(collection["logindlg"]);

			var form = new EJS({url:"view/createacctfrm.ejs"}).render();
			collection["createaccdlg"] = $(new EJS({url:"view/dialog.ejs"}).render(
			{
				uuid:"dlgcreateacc",
				title:"Register new account",
				alert:null,
				content:form,
				buttons:
				[
					{uuid:"btncreateacc",type:"btn-primary",title:"SignUp"}
				]
			}));
			parent.append(collection["createaccdlg"]);

			return this;
		},
		eventlistener : function(components)
		{
			// setup the eventlistener here ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout eventlistener(components:"+components+") ... ");
			
			var self = this;
			var mainnavbar = components.navbar["main"];
			var logindlg = components.dialog["logindlg"];
			var createaccdlg = components.dialog["createaccdlg"];
			var wrapper = components.mainview["wrapper"];
			var sidebar = components.mainview["sidebar"];
			
			// navbar event ...
			mainnavbar.on("click touch","a",
			function(evt)
			{
				var target = $(evt.target);
				
				if(target.hasClass("navbar-brand") || target.parent().hasClass("navbar-brand"))
				{
					wrapper.toggleClass('toggled');
					mainnavbar.toggleClass('toggled');
				}
				else if(target.attr("id") == "signin")
					logindlg.modal('show');
				else if(target.attr("id") == "signup")
					createaccdlg.modal('show');
			});
			
			// login dlg event ...
			logindlg.on("click touch","button",
			function(evt)
			{
				var target = $(evt.target);
				if(target.attr("id") == "btnlogin")
				{
					var email = logindlg.find("#inputemail").val().trim();
					var pw = logindlg.find("#inputpassword").val().trim();					
					self.app.login(email,pw);
				}
			});

			// create account dlg event ... 
			createaccdlg.on("click touch","button",
			function(evt)
			{
				var target = $(evt.target);
				if(target.attr("id") == "btncreateacc")
				{
					var email = createaccdlg.find("#inputemail").val().trim();
					var name = createaccdlg.find("#inputname").val().trim();
					var pw = createaccdlg.find("#inputpassword").val().trim();
					var cf = createaccdlg.find("#inputconfirmation").val().trim();
					self.app.createaccount(email,name,pw,cf);					
				}	
			});
			
			return this;
		},		
		update : function(flag,hint)
		{
			// route the receive flag ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout update(flag:"+flag+",hint:"+hint+") ... ");

			if(flag == L.FLAG.NOTSUCCESS)
				alert("diu .... "+hint);
			else if(flag == L.FLAG.LOGIN)
				alert("diu lee .... "+hint.data["account_uuid"]);
			else if(flag == L.FLAG.CREATEACCOUNT)
				alert("diu lee ... "+hint.data["account_uuid"]);
			
			return L.LAYOUT.MainLayout.prototype.update.call(this,flag,hint);			
		},
		error : function(errorobj)
		{
			// error handler ... 
			window.console.log("LAC.LAYOUT.ItrMainLayout error(errorobj:"+errorobj+") ... ");
			//$("body").append(errorobj);
			
			return this;			
		},
		toString : function()
		{
			return "ItrMainLayout: "+this.uuid;
		}
	});
	
})(jQuery,jQuery.LAC);