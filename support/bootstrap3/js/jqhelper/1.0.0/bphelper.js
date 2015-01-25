/**
 * Author: Dee
 * Date: 2014/06/02
 *  
 * Define the usual bootstrap component 
 *  
 */

(function($)
{
	$.obpHelper =
	{
		Obj : function()
		{
			this.jq = $("<div></div>");
			
			if(arguments.length == 4)
			{
				var sHtmlType = $.V.tostr(arguments[0]);
				var oAttr = arguments[1];
				var sClass = arguments[2];
				var sHtml = arguments[3];
				
				this.jq = $("<"+sHtmlType+"></"+sHtmlType+">").set(oAttr,sClass,sHtml,null);
			}
			else if(arguments.length == 1)
			{
				var jq = arguments[0];
				if($.V.iscls(jq,$))
					this.jq = jq;	
			}
				
			this.oItem = {};
			return this;
		},
		Div : function(oAttr,sClass)
		{
			return $.obpHelper.Obj.call(this,"div",oAttr,sClass,null);
		},
		Span : function(oAttr,sClass,sHtml)
		{
			return $.obpHelper.Obj.call(this,"span",oAttr,sClass,sHtml);			
		},
		Img : function(nType,src,alt)
		{
			var sClass = "img-responsive "+$.V.toarritem($.obpHelper.Img.TYPE,nType);
			return $.obpHelper.Obj.call(this,"img",{"src":$.V.tostr(src),"alt":$.V.tostr(alt)},sClass,null);
		},
		P : function(sHtml,nBg,nType)
		{
			return $.obpHelper.Obj.call(this,"p",null,$.V.toarritem($.obpHelper.P.BG,nBg)+" "+$.V.toarritem($.obpHelper.P.TEXT,nType),sHtml);
		},
		H : function(nSize,sClass,sHtml)
		{
			var aSize = ["h1","h2","h3","h4","h5","h6"];
			var sHTMLType = $.V.toarritem(aSize,nSize);
			
			return $.obpHelper.Obj.call(this,sHTMLType,null,sClass,sHtml);	
		},
		Ul : function()
		{
			return $.obpHelper.Obj.call(this,"ul",null,"list-group",null);	
		},
		ListGroup : function()
		{
			return $.obpHelper.Div.call(this,null,"list-group");				
		},
		Input : function(sType,sPlaceholder,sVal,nH,nW)
		{
			var oAttr = {};
			oAttr["type"] = ($.inArray(sType,["button","color","email","file","checkbox",
											  "hidden","image","month","number","radio",
											  "password","range","tel",
											  "text","url","week"]) != -1) ? sType : "text";

			oAttr["placeholder"] = $.V.tostr(sPlaceholder);
			oAttr["value"] = $.V.tostr(sVal);
			
			$.obpHelper.Obj.call(this,"input",oAttr,"form-control",null);
			this.height(nH);
			this.width(nW);
			
			return this;
		},
		LabelInput : function(sType,nSize,sPlaceholder,sVal)
		{
			$.obpHelper.Div.call(this,null,"input-group "+$.V.toarritem($.obpHelper.LabelInput.SIZE,nSize));
			var bpInput = new $.obpHelper.Input(sType,sPlaceholder,sVal,null);
			return this.additem("input",bpInput,null,false,null);
		},
		InputBtn : function(nSize,sPlaceholder,sVal,sBtnText)
		{			
			$.obpHelper.LabelInput.call(this,"text",nSize,sPlaceholder,sVal);
			var bpDiv = new $.obpHelper.Div(null,"input-group-btn");
			bpDiv.additem("btn",new $.obpHelper.Btn(nSize,0,false,sBtnText),null,false,null);
			
			return this.additem("div",bpDiv,null,false,null);
		},
		Combo : function(nSize,sPlaceholder,sVal)
		{
			var bpSpan = new $.obpHelper.Span(null,$.obpHelper.Span.CARET,null);
			$.obpHelper.InputBtn.call(this,nSize,sPlaceholder,sVal,bpSpan.toString());
			
			var bpDiv = this.getitemctl("div");
			var bpInput = this.getitemctl("input");
			
			bpDiv.getitemctl("btn").jq.addClass("dropdown-toggle").attr("data-toggle","dropdown");
			bpDiv.additem("menu",(new $.obpHelper.Menu(1)).setitemclick(
						  function(uid,data)
						  {
						  	bpInput.val(data.text);
						  	bpInput.jq.trigger("change");
						  }),null,false,null);
			
			return this;
		},
		Btn : function(nSize,nType,bIsBlock,sName)
		{			
			var sTypeCls = $.V.toarritem($.obpHelper.Btn.TYPE,nType);				
			var sSizeCls = $.V.toarritem($.obpHelper.Btn.SIZE,nSize);		
			var sBlockCls = (bIsBlock) ? $.obpHelper.Btn.BLOCK : "";
			
			var sClass = "btn "+ sSizeCls + " " + sTypeCls + " " + sBlockCls;
			return $.obpHelper.Obj.call(this,"button",{type:"button"},sClass,sName);			
		},
		Menu : function(nPos)
		{
			return $.obpHelper.Obj.call(this,"ul",
									    {role:"menu"},
									    "dropdown-menu "+$.V.toarritem($.obpHelper.Menu.POSITION,nPos),
									     null);
		},		
		Nav : function(nType,bIsStack,bIsJust)
		{
			var sClass = "nav ";
			sClass += $.V.toarritem($.obpHelper.Nav.TYPE,nType);
			sClass += " ";
			sClass += (bIsStack) ? $.obpHelper.Nav.STACK : "";
			sClass += " ";
			sClass += (bIsJust) ? $.obpHelper.Nav.JUST : "";
			
			return $.obpHelper.Obj.call(this,"ul",null,sClass,null);			
		},		
		Frm : function(bIsInline)
		{
			var sClass = (bIsInline) ? $.obpHelper.Frm.INLINE : "";		
			return $.obpHelper.Obj.call(this,"form",{role:"form"},sClass,null);	
		},
		NavBar : function(sHead,nType,nPos)
		{
			var sClass = "navbar ";
			sClass += $.V.toarritem($.obpHelper.NavBar.TYPE,nType);
			sClass += " ";
			sClass += $.V.toarritem($.obpHelper.NavBar.POSITION,nPos);
			
			$.obpHelper.Div.call(this,{role:"navigation"},sClass);
			
			var bpContainer = new $.obpHelper.Div(null,"container");
			this.additem("navbarcontainer",bpContainer,null,false,null);			

			this.bpNavHeader = new $.obpHelper.Div(null,"navbar-header");
			bpContainer.additem("navbarheader",this.bpNavHeader,null,false,null);
			
			var bpBtn = new $.obpHelper.Obj("button",{"data-toggle":"collapse","data-target":"navbar-collapse"},"navbar-toggle",null);
			this.bpNavHeader.additem("button",bpBtn,null,false,null);			

			bpBtn.additem("span0",new $.obpHelper.Span(null,"sr-only","Toggle navigation"),null,false,null);
			for(var i=1;i<4;i++)
				bpBtn.additem("span"+i,new $.obpHelper.Span(null,"icon-bar",null),null,false,null);
			
			this.bpNavHeader.additem("navbarbrand",new $.obpHelper.Obj("a",null,"navbar-brand",sHead),null,false,null);		
			this.bpNavCollapse = new $.obpHelper.Div(null,"collapse navbar-collapse navbar-ex1-collapse");
			bpContainer.additem("navbarcollapse",this.bpNavCollapse,null,false,null);
	
			return this;			
		},
		Banner : function(sHeader)
		{
			$.obpHelper.Div.call(this,null,"jumbotron");
			var bpP = new $.obpHelper.H(0,null,sHeader);
			this.additem("header",bpP,null,false,null);
			
			return this;
		},
		Panel : function(nType)
		{
			$.obpHelper.Div.call(this,null,"panel "+$.V.toarritem($.obpHelper.Panel.TYPE,nType));
			return this.additem("body",new $.obpHelper.Div(null,"panel-body"),null,false,null);			
		},
		Modal : function(sTitle,bIsCloseBtn,nSize)
		{
			var sClass = $.V.toarritem($.obpHelper.Modal.SIZE,nSize);
			
			$.obpHelper.Div.call(this,{"tabindex":"-1","role":"dialog","aria-hidden":"true"},"modal fade");
			var bpDlg = new $.obpHelper.Div(null,"modal-dialog "+sClass);
			var bpContent = new $.obpHelper.Div(null,"modal-content");
			this.bpHeader = new $.obpHelper.Div(null,"modal-header");
			this.bpBody = new $.obpHelper.Div(null,"modal-body");
						
			this.additem("dlg",bpDlg,null,false,null);
			bpDlg.additem("content",bpContent,null,false,null);
			bpContent.additem("header",this.bpHeader,null,false,null)
					 .additem("body",this.bpBody,null,false,null);
			
			this.bpHeader.additem("title",new $.obpHelper.H(1,"modal-title",sTitle),null,false,null);
			this.enableclosebtn(bIsCloseBtn);
			
			return this;
		},
		Grid : 
		{
			Container : function(bIsFluid)
			{
				return $.obpHelper.Div.call(this,null,(bIsFluid) ? $.obpHelper.Grid.FLUID : $.obpHelper.Grid.NONFLUID,null);
			},
			Row : function()
			{
				return $.obpHelper.Div.call(this,null,"row");	
			},
			Col : function(sTitle,nPhone,nTablet,nNormalPC,nLargePC)
			{
				var sClass = $.V.toarritem($.obpHelper.Grid.PHONE,nPhone) + " " +
							 $.V.toarritem($.obpHelper.Grid.TABLET,nTablet) + " " +
							 $.V.toarritem($.obpHelper.Grid.NORMALPC,nNormalPC) + " " +
							 $.V.toarritem($.obpHelper.Grid.LARGEPC,nLargePC);
				
				$.obpHelper.Div.call(this,null,sClass);
				this.additem("title",new $.obpHelper.H(1,null,$.V.tostr(sTitle)),null,false,null);
				
				return this;
			}	
		},
		Table : function(bIsStriped,bIsHover,bIsBorder,bIsCondensed,nH)
		{
			var sClass = (bIsStriped) ? $.obpHelper.Table.STRIPED : "";
			sClass += " ";
			sClass += (bIsHover) ? $.obpHelper.Table.HOVER : "";
			sClass += " ";
			sClass += (bIsBorder) ? $.obpHelper.Table.BORDER : "";
			sClass += " ";
			sClass += (bIsCondensed) ? $.obpHelper.Table.CONDENSED : "";
			this.aHeader = [];
			
			$.obpHelper.Div.call(this,null,"table-responsive");
			this.height(nH);
			
			this.bpTable = new $.obpHelper.Obj("table",null,"table "+sClass,null);
			this.bpHeader = new $.obpHelper.Obj("thead",null,null,null);
			this.bpBody = new $.obpHelper.Obj("tbody",null,null,null);
			
			this.bpTable.additem("header",this.bpHeader,null,false,null)
						.additem("body",this.bpBody,null,true,null);
		
			return this.additem("table",this.bpTable,null,false,null);
		},
		Alert : function(nType,sTitle)
		{
			var sType = $.V.toarritem($.obpHelper.Alert.TYPE,nType);
			$.obpHelper.Div.call(this,null,"alert fade in"+sType);
			
			var jq = this.jq.display(false);
			var bpBtn = new $.obpHelper.Obj("button",{"type":"button","aria-hidden":"true"},"close","&times;");
			bpBtn.jq.bind("click touch",function(ev)
			{
				jq.display(false);	
			});
			
			var bpTitle = new $.obpHelper.H(3,"alert-heading",$.V.tostr(sTitle));
			this.additem("btn",bpBtn,null,false,null).additem("title",bpTitle,null,false,null);

			return this;	
		}
	};
	
	$.obpHelper.Obj.prototype = 
	{
		additem : function(uid,obp,data,bIsClickable,uidBefore)
		{
			var s = ($.V.istype(uid,"string")) ? uid : (Math.floor((Math.random() * 10000) + 1)).toString();
			var sb = $.V.tostr(uidBefore);
		
			if($.V.iscls(obp,$.obpHelper.Obj))
			{
				if(this.oItem[s])
					this.removeitem(s,"uid");
										
				this.oItem[s] = {ctl:obp,data:data,isclickallow:bIsClickable};
				obp.jq.attr("itemid",s);
		
				var jq = this.jq;
				if(sb == "")
					jq.append(obp.jq);
				else if(this.oItem[sb])
					obp.jq.insertBefore(this.oItem[sb].ctl.jq);
				
				if(bIsClickable)
				{
					obp.jq.bind("click touch",function(ev)
					{
						if($(this).hasClass("disabled") == false)
							jq.trigger("itemclick",[$(this).attr("itemid"),$(this).getdata()]);
					});	
				}
			}
			
			return this;
		},
		getitemctl : function(uid)
		{
			var s = $.V.tostr(uid);
			if(this.oItem[s])
				return this.oItem[s].ctl;
			
			return null;	
		},
		getitemdata : function(uid)
		{
			var s = $.V.tostr(uid);
			if(this.oItem[s])
				return this.oItem[s].data;
			
			return null;
		},		
		removeitem : function(sItem,sType)
		{
			var s = $.V.tostr(sItem) 
			if(sType == "uid")
			{
				if(this.oItem[s])
				{
					this.oItem[s].ctl.jq.remove();
					delete this.oItem[s];
				}
			}
			else
			{
				var oSelf = this;
				var oItem = this.jq.find(s);
				oItem.each(function()
				{
					var sItemId = $(this).attr("itemid");
					if(sItemId)
						oSelf.removeitem(sItemId,"uid");
					else
						$(this).remove();
				});	
			}
			
			return this;
		},
		removeallitems : function()
		{
			this.jq.empty();
			this.oItem = {};

			return this;	
		},
		setitemclick : function(fn)
		{
			if($.V.istype(fn,"function"))
				this.jq.bind("itemclick",fn);
			else
				this.jq.unbind("itemclick");
				
			return this;		
		},
		enable : function(bIsEnable)
		{
			this.jq.removeAttr("disabled").removeClass("disabled");
			if(!bIsEnable)
				this.jq.attr("disabled","disabled").addClass("disabled");

			for(var uid in this.oItem)
				this.oItem[uid].ctl.enable(bIsEnable);	
				
			return this;	
		},
		toString : function()
		{
			var parent = this.jq.parent();
			if(parent.length)
				return parent.html();
				
			var s = $("<div></div>").append(this.jq).html();
			return s;
		},
		height : function(nH)
		{
			if($.V.istype(nH,"number") || $.V.istype(nH,"string"))
			{
				this.jq.css("height",nH);
				return this;
			}
			
			return this.jq.css("height");
		},
		width : function(nW)
		{
			if($.V.istype(nW,"number") || $.V.istype(nW,"string"))
			{
				this.jq.css("width",nW);
				return this;
			}
			
			return this.jq.css("width");			
		},
		setmargin : function(top,bottom,left,right)
		{
			if($.V.istype(top,"number"))
				this.jq.css("margin-top",top);	
			if($.V.istype(bottom,"number"))
				this.jq.css("margin-bottom",bottom);	
			if($.V.istype(left,"number"))
				this.jq.css("margin-left",left);	
			if($.V.istype(right,"number"))
				this.jq.css("margin-right",right);	

			return this;
		},
		settooltip : function(nPos,title,trigger,showperiod,hideperiod)
		{
			var o = {};
			var aPos = ["left","right","top","bottom"];
			
			if($.V.iscls(this,[$.obpHelper.LabelInput]))
				o["container"] = "body";
			
			o["placement"] = "auto "+$.V.toarritem(nPos,aPos);
			o["title"] = $.V.tostr(title);
			
			if($.V.istype(trigger,"string"))
				o["trigger"] = trigger;
				
			var oDelay = {};	
			if($.V.istype(showperiod,"number"))	
				oDelay["show"] = showperiod;
			if($.V.istype(hideperiod,"number"))	
				oDelay["hide"] = hideperiod;
				
			if(oDelay != null)
				o["delay"] = oDelay;	
							
			this.jq.tooltip(o);
			return this;
		},
		showtooltip : function(nPos,sTitle,trigger)
		{
			this.hidetooltip(true).settooltip(nPos,sTitle,($.V.istype(trigger,"string")) ? trigger : "manual",null,null);
			this.jq.tooltip("show");

			return this;
		},
		hidetooltip : function(bDestroy)
		{
			this.jq.tooltip((bDestroy) ? "destroy" : "hide");
			return this;
		}		
	};

	$.obpHelper.Div.prototype = new $.obpHelper.Obj();
	
	$.obpHelper.P.BG = ["","bg-primary","bg-success","bg-info","bg-warning","bg-danger"];
	$.obpHelper.P.TEXT = ["","text-muted","text-primary","text-success","text-info","text-warning","text-danger"];
	$.obpHelper.P.prototype = new $.obpHelper.Obj();
	$.obpHelper.P.prototype.setbg = function(nBg)
	{
		this.jq.switchclass($.obpHelper.P.BG,nBg);
		return this;
	};
	$.obpHelper.P.prototype.settexttype = function(nType)
	{
		this.jq.switchclass($.obpHelper.P.TEXT,nType);		
		return this;
	};	
	
	$.obpHelper.H.prototype = new $.obpHelper.Obj();
	
	$.obpHelper.Ul.TYPE = ["","list-group-item-success","list-group-item-warning","list-group-item-info","list-group-item-danger"];
	$.obpHelper.Ul.prototype = new $.obpHelper.Obj();
	$.obpHelper.Ul.prototype.addulitemtext = function(uid,data,sText,nType,uidBefore)
	{
		var sClass = "list-group-item " + $.V.toarritem($.obpHelper.Ul.TYPE,nType);
		var bpli = new $.obpHelper.Obj("li",null,sClass,$.V.tostr(sText));
		
		return this.additem(uid,bpli,data,false,uidBefore);
	};
	$.obpHelper.Ul.prototype.setulitemtype = function(uid,nType)
	{
		var bpli = this.getitemctl(uid);
		if(bpli)
			bpli.jq.switchclass($.obpHelper.Ul.TYPE,nType);
		
		return this;
	};	
	
	$.obpHelper.ListGroup.prototype = new $.obpHelper.Div();
	$.obpHelper.ListGroup.prototype.addlistgpitemtext = function(uid,data,sText,uidBefore)
	{
		var bpa = new $.obpHelper.Obj("a",null,"list-group-item",$.V.tostr(sText));	
		return this.additem(uid,bpa,data,true,uidBefore);		
	};
	$.obpHelper.ListGroup.prototype.addlistgpitempara = function(uid,data,sHead,sContent,uidBefore)
	{
		var bpa = new $.obpHelper.Obj("a",null,"list-group-item",null);
		bpa.additem("head",new $.obpHelper.H(3,"list-group-item-heading",$.V.tostr(sHead)),null,false,null);	
		bpa.additem("content",new $.obpHelper.Obj("p",null,"list-group-item-text",$.V.tostr(sContent)),null,false,null);	

		return this.additem(uid,bpa,data,true,uidBefore);
	};
	$.obpHelper.ListGroup.prototype.setlistgpitemactive = function(uid,bIsActive)
	{
		var bpa = this.getitemctl(uid);
		if(bpa)
		{			
			bpa.jq.removeClass("active");
			if(bIsActive)
				this.jq.trigger("itemclick",[uid,this.getitemdata(uid)]);
		}
		
		return this;		
	};
	$.obpHelper.ListGroup.prototype.setitemclick = function(fn)
	{
		var oSelf = this;
		if($.V.istype(fn,"function"))
			this.jq.bind("itemclick",function(ev,uid,data)
			{
				for(var i in oSelf.oItem)
					oSelf.oItem[i].ctl.jq.removeClass("active");
				
				var bpa = oSelf.getitemctl(uid);
				bpa.addClass("active");
				
				fn(ev,uid,data);
			});
		else
			this.jq.unbind("itemclick");	
			
		return this;	
	};
				
	$.obpHelper.Input.prototype = new $.obpHelper.Obj();
	$.obpHelper.Input.prototype.val = function(s)
	{
		if($.V.istype(s,"string"))
		{
			this.jq.val(s);
			return this;
		}
			
		return this.jq.val();				
	};

	$.obpHelper.Input.prototype.change = function(fn)
	{
		if($.V.istype(fn,"function"))
			this.jq.bind("change",fn);
		else
			this.jq.unbind("change");	
			
		return this;			
	};
			
	$.obpHelper.Btn.SIZE = ["btn-xs","btn-sm","","btn-lg"];
	$.obpHelper.Btn.TYPE = ["btn-default","btn-primary","btn-success","btn-info","btn-warning","btn-danger","btn-link"];
	$.obpHelper.Btn.BLOCK = "btn-block";	
	$.obpHelper.Btn.prototype = new $.obpHelper.Obj();
	$.obpHelper.Btn.prototype.settype = function(n)
	{
		this.jq.switchclass($.obpHelper.Btn.TYPE,n);			
		return this;
	};
		
	$.obpHelper.Btn.prototype.setsize = function(n)
	{
		this.jq.switchclass($.obpHelper.Btn.SIZE,n);			
		return this;		
	};
		
	$.obpHelper.Btn.prototype.setblock = function(b)
	{
		this.jq.removeClass($.obpHelper.Btn.BLOCK);
		if(b)
			this.jq.addClass($.obpHelper.Btn.BLOCK);
			
		return this;	
	};
		
	$.obpHelper.Btn.prototype.click = function(fn)
	{
		if($.V.istype(fn,"function"))
			this.jq.bind("click touch",fn);
		else
			this.jq.unbind("click touch");	
			
		return this;	
	};
	
	$.obpHelper.LabelInput.SIZE = ["input-group-sm",""," input-group-lg"];
	$.obpHelper.LabelInput.prototype = new $.obpHelper.Div();
	$.obpHelper.LabelInput.prototype.setsize = function(nSize)
	{
		this.jq.switchclass($.obpHelper.LabelInput.SIZE,nType);		
		return this;		
	};
	
	$.obpHelper.LabelInput.prototype.val = function(s)
	{
		var bpInput = this.getitemctl("input");
		if(s!=null && s!=undefined)
			return bpInput.val(s);
		
		return this;
	};
	
	$.obpHelper.LabelInput.prototype.setlabel = function(s,nW)
	{
		this.removeitem("label","uid");
		if(s!=null)
		{
			var bpSpan = new $.obpHelper.Span(null,"input-group-addon",$.V.tostr(s));
			bpSpan.width(nW);
			
			this.additem("label",bpSpan,null,false,"input");
		}
		
		return this;		
	};		

	$.obpHelper.LabelInput.prototype.width = function(nW)
	{
		this.getitemctl("input").width(nW);
		return this;	
	};
	
	$.obpHelper.LabelInput.prototype.change = function(fn)
	{
		this.getitemctl("input").change(fn);
		return this;	
	};
		
	$.obpHelper.InputBtn.prototype = new $.obpHelper.LabelInput();
	$.obpHelper.InputBtn.prototype.btnclick = function(fn)
	{
		var bpBtn = this.getitemctl("div").getitemctl("btn");
		var bpInput = this.getitemctl("input");
		
		bpBtn.click(function(ev)
		{
			var sVal = bpInput.val();
			if($.V.istype(fn,"function"))
				fn(ev,$.trim(sVal));
		});		
		
		return this;
	};
	
	$.obpHelper.Combo.prototype = new $.obpHelper.InputBtn();
	$.obpHelper.Combo.prototype.getmenu = function()
	{
		return this.getitemctl("div").getitemctl("menu");
	};
				
	$.obpHelper.Span.CARET = "caret";
	$.obpHelper.Span.TIME = "glyphicon glyphicon-time";
	$.obpHelper.Span.CALENDAR = "glyphicon glyphicon-calendar";
	$.obpHelper.Span.RIGHT = "glyphicon glyphicon-chevron-right";
	$.obpHelper.Span.LEFT = "glyphicon glyphicon-chevron-left";
	$.obpHelper.Span.HOME = "glyphicon glyphicon-home";
	$.obpHelper.Span.PLUS = "glyphicon glyphicon-plus";
	$.obpHelper.Span.MINUS = "glyphicon glyphicon-minus";		
	$.obpHelper.Span.TRASH = "glyphicon glyphicon-trash";
	$.obpHelper.Span.USER = "glyphicon glyphicon-user";
	$.obpHelper.Span.OFF = "glyphicon glyphicon-off";
	$.obpHelper.Span.SEARCH = "glyphicon glyphicon-search";
	$.obpHelper.Span.PENCIL = "glyphicon glyphicon-pencil";
	$.obpHelper.Span.prototype = new $.obpHelper.Obj();
	
	$.obpHelper.Img.TYPE = ["img-rounded","img-circle","img-thumbnail"];
	$.obpHelper.Img.prototype = new $.obpHelper.Obj();
	$.obpHelper.Img.prototype.settype = function(nType)
	{
		this.jq.switchclass($.obpHelper.Img.TYPE,nType);
		return this;
	};
	$.obpHelper.Img.prototype.click = function(fnClick,fnOver,fnOut)
	{
		if($.V.istype(fnClick,"function"))
		{
			var oSelf = this;
			this.jq.bind("click touch",fnClick);
			this.jq.hover(function(ev)
			{
				$(this).css('cursor','pointer').css("opacity",0.6);
				if($.V.istype(fnOver,"function"))
					fnOver(oSelf);
										
			},function(ev)
			{
				$(this).css('cursor','default').css("opacity",1);
				if($.V.istype(fnOut,"function"))
					fnOut(oSelf);				
			});	
		}
		else
		{
			this.jq.unbind("click touch mouseenter mouseleave");
		}
		
		return this;
	};
	$.obpHelper.Img.prototype.setgrey = function(bIsGrey)
	{
		this.jq.css("filter","none").css("-webkit-filter","grayscale(0)"); 	
		if(bIsGrey)
			this.jq.css("filter","gray").css("-webkit-filter","grayscale(1)"); 		
	};
	
	$.obpHelper.Menu.POSITION = ["pull-left","pull-right"];
	$.obpHelper.Menu.prototype = new $.obpHelper.Obj();
	$.obpHelper.Menu.prototype.setposition = function(n)
	{
		this.jq.switchclass($.obpHelper.Menu.POSITION,n);
		return this;
	};
		
	$.obpHelper.Menu.prototype.addtext = function(uid,sText,data,uidBefore)
	{
		var obp = new $.obpHelper.Obj("li",null,null,"<a href='#'>"+$.V.tostr(sText)+"</a>");
		return this.additem(uid,obp,{text:$.V.tostr(sText),data:data},true,uidBefore);
	};
		
	$.obpHelper.Menu.prototype.addseperator = function(uid,uidBefore)
	{
		var obp = new $.obpHelper.Obj("li",null,"divider",null);
		return this.additem(uid,obp,null,false,uidBefore);
	};
	
	$.obpHelper.Nav.TYPE = ["nav-tabs","nav-pills"];
	$.obpHelper.Nav.STACK = "nav-stacked";
	$.obpHelper.Nav.JUST = "nav-justified";	
	$.obpHelper.Nav.prototype = new $.obpHelper.Obj();	
	$.obpHelper.Nav.prototype.addnavitem = function(uid,sName,data,oMenu,uidBefore)
	{
		var obp = null;
		if($.V.iscls(oMenu,$.obpHelper.Menu))
		{
			var bpSpan = new $.obpHelper.Span(null,$.obpHelper.Span.CARET,null);
			obp = new $.obpHelper.Obj("li",null,"dropdown","<a class='dropdown-toggle' data-toggle='dropdown'>"+$.V.tostr(sName)+bpSpan.toString()+"</a>");
			obp.additem("menu",oMenu,null,false,null);
		}
		else
			obp = new $.obpHelper.Obj("li",null,null,"<a href='#'>"+$.V.tostr(sName)+"</a>");			
				
		this.additem(uid,obp,data,true,uidBefore);
		return this;
	};
	
	$.obpHelper.Nav.prototype.settype = function(nType)
	{
		this.jq.switchclass($.obpHelper.Nav.TYPE,nType);		
		return this;	
	};
		
	$.obpHelper.Nav.prototype.setstack = function(bIsStack)
	{
		this.jq.removeClass($.obpHelper.Nav.STACK);
		if(bIsStack)
			this.jq.addClass($.obpHelper.Nav.STACK);
			
		return this;
	};
	
	$.obpHelper.Nav.prototype.setjust = function(bIsJust)
	{
		this.jq.removeClass($.obpHelper.Nav.JUST);
		if(bIsJUST)
			this.jq.addClass($.obpHelper.Nav.JUST);
							
		return this;
	};
		
	$.obpHelper.Frm.INLINE = "form-inline";
	$.obpHelper.Frm.prototype = new $.obpHelper.Obj();	
	$.obpHelper.Frm.prototype.addfrminput = function(uid,oItem,uidBefore)
	{
		if($.V.iscls(oItem,[$.obpHelper.Input,$.obpHelper.LabelInput]))
		{
			var bpdiv = new $.obpHelper.Div(null,"form-group");
			bpdiv.jq.css("margin-left","2.5px").css("margin-right","2.5px");
			bpdiv.additem("input",oItem,null,false,null);
			this.additem(uid,bpdiv,null,false,uidBefore);							
		}
			
		return this;
	};

	$.obpHelper.Frm.prototype.addfrmbtn = function(uid,oItem,uidBefore)
	{
		if($.V.iscls(oItem,$.obpHelper.Btn))
		{
			oItem.jq.css("margin-left","2.5px").css("margin-right","2.5px");
			this.additem(uid,oItem,null,false,uidBefore);							
		}
			
		return this;
	};
			
	$.obpHelper.Frm.prototype.setinline = function(bIsInline)
	{
		this.jq.removeClass($.obpHelper.Frm.INLINE);
		if(bIsInline)
			this.jq.addClass($.obpHelper.Frm.INLINE);
			
		return this;	
	};
	
	$.obpHelper.Frm.prototype.getallvals = function()
	{
		var oRet = {};
		for(var uid in this.oItem)
		{
			var sVal = this.getval(uid);
			if(sVal)
				oRet[uid] = sVal;
		}
				
		return oRet;
	};
	
	$.obpHelper.Frm.prototype.getval = function(uid)
	{
		var s = $.V.tostr(uid);
		if(this.oItem[s])
		{
			if(this.oItem[s].ctl.oItem["input"])
			{
				var oCtl = this.oItem[s].ctl.oItem["input"].ctl;
				if($.V.iscls(oCtl,$.obpHelper.Input))
					return oCtl.val();
				else if($.V.iscls(oCtl,$.obpHelper.DataTimePicker))
					return oCtl.getdate();
				else if($.V.iscls(oCtl,$.obpHelper.InputGroup))		
					return oCtl.val();				
			}					
		}
			
		return null;		
	};
	
	$.obpHelper.NavBar.TYPE = ["navbar-default","navbar-inverse"];
	$.obpHelper.NavBar.POSITION = ["","navbar-fixed-top","navbar-fixed-bottom","navbar-static-top"];
	$.obpHelper.NavBar.ITEMPOS = ["navbar-left","navbar-right"];	
	$.obpHelper.NavBar.prototype = new $.obpHelper.Div();	
	$.obpHelper.NavBar.prototype.settype = function(nType)
	{
		this.jq.switchclass($.obpHelper.NavBar.TYPE,nType);
		return this;
	};
		
	$.obpHelper.NavBar.prototype.setpos = function(nPos)
	{		
		this.jq.switchclass($.obpHelper.NavBar.POSITION,nPos);
		return this;
	};

	$.obpHelper.NavBar.prototype.setheader = function(s)
	{
		this.bpNavHeader.getitemctl("navbarbrand").jq.text($.V.tostr(s));
		return this;
	};
		
	$.obpHelper.NavBar.prototype.setitempos = function(uid,nPos)
	{
		var bpItem = this.bpNavCollapse.oItem[$.V.tostr(uid)];
		if(bpItem)
			bpItem.ctl.jq.switchclass($.obpHelper.NavBar.ITEMPOS,nPos);

		return this;
	};		
		
	$.obpHelper.NavBar.prototype.addnavbarfrm = function(uid,bpForm,nPos,uidBefore)
	{
		if($.V.iscls(bpForm,$.obpHelper.Frm))
		{
			bpForm.jq.attr("class","navbar-form "+$.V.toarritem($.obpHelper.NavBar.ITEMPOS,nPos));
			this.bpNavCollapse.additem(uid,bpForm,null,false,uidBefore);	
		}
		
		return this;
	};
	
	$.obpHelper.NavBar.prototype.addnavbarnav = function(uid,bpNav,nPos,uidBefore)
	{
		if($.V.iscls(bpNav,$.obpHelper.Nav))
		{
			bpNav.jq.attr("class","nav navbar-nav "+$.V.toarritem($.obpHelper.NavBar.ITEMPOS,nPos));
			this.bpNavCollapse.additem(uid,bpNav,null,false,uidBefore);
		}
						
		return this;
	};	
	
	$.obpHelper.Banner.prototype = new $.obpHelper.Div();	
	$.obpHelper.Banner.prototype.setheadertext = function(s)
	{
		var bpH1 = this.oItem["header"].ctl;
		bpH1.jq.text($.V.tostr(s));
		
		return this;
	};
	
	$.obpHelper.Banner.prototype.addbannertext = function(uid,s,uidBefore)
	{
		var bpP = new $.obpHelper.P($.V.tostr(s));
		this.additem(uid,bpP,null,false,uidBefore);
		
		return this;
	};
	
	$.obpHelper.Banner.prototype.addbanneritem = function(uid,bpItem,uidBefore)
	{
		if($.V.iscls(bpItem,$.obpHelper.Obj))
		{
			var bpP = new $.obpHelper.P(null);
			bpP.additem("ctl",bpItem,null,false,null);
			this.additem(uid,bpP,null,false,uidBefore);
		}
		
		return this;
	};	

	$.obpHelper.Panel.TYPE = ["panel-default","panel-primary","panel-success","panel-info","panel-warning","panel-danger"];
	$.obpHelper.Panel.prototype = new $.obpHelper.Div();
	$.obpHelper.Panel.prototype.settype = function(nType)
	{
		this.jq.switchclass($.obpHelper.Panel.TYPE,nType);
		return this;
	};
	$.obpHelper.Panel.prototype.settitle = function(s)
	{
		this.removeitem("head","uid");
		
		var bpHead = new $.obpHelper.Div(null,"panel-heading");
		bpHead.additem("title",new $.obpHelper.H(2,"panel-title",$.V.tostr(s)),null,false,null);
		
		return this.additem("head",bpHead,null,false,null);
	};	
	$.obpHelper.Panel.prototype.addcontentitem = function(uid,bpItem,uidBefore)
	{
		var bpBody = this.getitemctl("body");
		bpBody.additem(uid,bpItem,null,false,uidBefore);		
		return this;
	};
	$.obpHelper.Panel.prototype.getcontentitemctl = function(uid)
	{
		var bpBody = this.getitemctl("body");				
		return bpBody.getitemctl(uid);
	};
	$.obpHelper.Panel.prototype.removecontentitem = function(uid)
	{
		var bpBody = this.getitemctl("body");
		bpBody.removeitem(uid,"uid");		
		return this;
	};
	$.obpHelper.Panel.prototype.removeallcontentitems = function()
	{
		var bpBody = this.getitemctl("body");		
		bpBody.removeallitems();		
		return this;
	};	
		
	$.obpHelper.Modal.SIZE = ["modal-sm","","modal-lg"];
	$.obpHelper.Modal.prototype = new $.obpHelper.Div();	
	$.obpHelper.Modal.prototype.enableclosebtn = function(bIsCloseBtn)
	{
		this.bpHeader.removeitem("closebtn","uid");
		if(bIsCloseBtn)
			this.bpHeader.additem("closebtn",
								  new $.obpHelper.Obj("button",{"type":"button","data-dismiss":"modal","aria-hidden":"true"},"close","&times;"),
								  null,false,"title");
			
		return this;
	};
	
	$.obpHelper.Modal.prototype.settitle = function(sTitle)
	{
		var jq = this.bpHeader.oItem["title"].ctl.jq;
		jq.text($.V.tostr(sTitle));
		
		return this;
	};
	
	$.obpHelper.Modal.prototype.show = function(bIsShow)
	{
		if(bIsShow)
			this.jq.modal("show");
		else
			this.jq.modal("hide");
			
		return this;
	};	
	$.obpHelper.Modal.prototype.setsize = function(n)
	{
		var jq = this.oItem["dlg"].ctl.jq;
		jq.switchclass($.obpHelper.Modal.SIZE,n);			
		
		return this;		
	};
	$.obpHelper.Modal.prototype.addbodyitem = function(uid,oItem,uidBefore)
	{
		if($.V.iscls(oItem,$.obpHelper.Obj))
		{
			var bpP = new $.obpHelper.P(null);
			bpP.additem(null,oItem,null,false,null);
			this.bpBody.additem(uid,bpP,null,false,uidBefore);
		}
		
		return this;		
	};	
	$.obpHelper.Modal.prototype.removebodyitem = function(uid)
	{
		this.bpBody.removeitem(uid,"uid");
		return this;		
	};
	
	$.obpHelper.Grid.NONFLUID = "container";
	$.obpHelper.Grid.FLUID = "container-fluid";
	$.obpHelper.Grid.PHONE = ["col-xs-1","col-xs-2","col-xs-3","col-xs-4","col-xs-5","col-xs-6","col-xs-7","col-xs-8","col-xs-9","col-xs-10","col-xs-11","col-xs-12",];	
	$.obpHelper.Grid.TABLET = ["col-sm-1","col-sm-2","col-sm-3","col-sm-4","col-sm-5","col-sm-6","col-sm-7","col-sm-8","col-sm-9","col-sm-10","col-sm-11","col-sm-12"];	
	$.obpHelper.Grid.NORMALPC = ["col-md-1","col-md-2","col-md-3","col-md-4","col-md-5","col-md-6","col-md-7","col-md-8","col-md-9","col-md-10","col-md-11","col-md-12"];	
	$.obpHelper.Grid.LARGEPC = ["col-lg-1","col-lg-2","col-lg-3","col-lg-4","col-lg-5","col-lg-6","col-lg-7","col-lg-8","col-lg-9","col-lg-10","col-lg-11","col-lg-12"];			
	$.obpHelper.Grid.Container.prototype = new $.obpHelper.Div();
	$.obpHelper.Grid.Container.prototype.addrow = function(uid,bpRow,data,uidBefore)
	{
		if($.V.iscls(bpRow,$.obpHelper.Grid.Row))
			this.additem(uid,bpRow,data,false,uidBefore);
		
		return this;
	};

	$.obpHelper.Grid.Container.prototype.setfluid = function(bIsFluid)
	{
		this.jq.removeClass($.obpHelper.Grid.NONFLUID+" "+$.obpHelper.Grid.FLUID);
		if(bIsFluid)
			this.jq.addClass($.obpHelper.Grid.FLUID);
		else
			this.jq.addClass($.obpHelper.Grid.NONFLUID);
				
		return this;
	};
	
	$.obpHelper.Grid.Container.prototype.getgrid = function(uidrow,uidcol)
	{
		var bprow = this.getitemctl(uidrow);
		if(bprow)
			return bprow.getitemctl(uidcol);
			
		return null;	
	};
		
	$.obpHelper.Grid.Row.prototype = new $.obpHelper.Div();
	$.obpHelper.Grid.Row.prototype.addcol = function(uid,bpCol,data,uidBefore)
	{
		if($.V.iscls(bpCol,$.obpHelper.Grid.Col))
			this.additem(uid,bpCol,data,false,uidBefore);
		
		return this;
	};
		
	$.obpHelper.Grid.Col.prototype = new $.obpHelper.Div();
	$.obpHelper.Grid.Col.prototype.settitle = function(sTitle)
	{
		this.oItem["title"].ctl.jq.text($.V.tostr(sTitle));	
		return this;
	};

	$.obpHelper.Grid.Col.prototype.addtext = function(uid,s,uidBefore)
	{
		this.additem(uid,new $.obpHelper.P($.V.tostr(s)),null,false,uidBefore);
		return this;
	};	
		
	$.obpHelper.Grid.Col.prototype.addbpitem = function(uid,bpItem,uidBefore)
	{
		if($.V.iscls(bpItem,$.obpHelper.Obj))
			this.additem(uid,(new $.obpHelper.P(null,0,0)).additem(null,bpItem,null,false,null),
						 null,false,uidBefore);
		
		return this;
	};		

	$.obpHelper.Grid.Col.prototype.setsize = function(nPhoneSize,nTabletSize,nNormalPCSize,nLargePCSize)
	{
		this.jq.switchclass($.obpHelper.Grid.PHONE,nPhoneSize)
			   .switchclass($.obpHelper.Grid.TABLET,nTabletSize)
			   .switchclass($.obpHelper.Grid.NORMALPC,nNormalPCSize)
			   .switchclass($.obpHelper.Grid.LARGEPC,nLargePCSize);
		
		return this;
	};
	
	$.obpHelper.Table.STRIPED = "table-striped";
	$.obpHelper.Table.BORDER = "table-bordered";
	$.obpHelper.Table.CONDENSED = "table-condensed";
	$.obpHelper.Table.HOVER = "table-hover";
	$.obpHelper.Table.prototype = new $.obpHelper.Div();
	$.obpHelper.Table.prototype.setstriped = function(bIsStriped)
	{
		this.bpTable.jq.removeClass($.obpHelper.Table.STRIPED);
		if(bIsStriped)
			this.bpTable.jq.addClass($.obpHelper.Table.STRIPED);
			
		return this;	
	};
	$.obpHelper.Table.prototype.setbordered = function(bIsBordered)
	{
		this.bpTable.jq.removeClass($.obpHelper.Table.BORDER);
		if(bIsBordered)
			this.bpTable.jq.addClass($.obpHelper.Table.BORDER);
			
		return this;	
	};
	$.obpHelper.Table.prototype.setcondensed = function(bIsCondensed)
	{
		this.bpTable.jq.removeClass($.obpHelper.Table.CONDENSED);
		if(bIsCondensed)
			this.bpTable.jq.addClass($.obpHelper.Table.CONDENSED);
			
		return this;	
	};
	$.obpHelper.Table.prototype.sethover = function(bIsHover)
	{
		this.bpTable.jq.removeClass($.obpHelper.Table.HOVER);
		if(bIsHover)
			this.bpTable.jq.addClass($.obpHelper.Table.HOVER);
			
		return this;	
	};
	$.obpHelper.Table.prototype.setheader = function(aDisplayText,aWidth,aName)
	{
		this.bpHeader.removeallitems();
		this.bpBody.removeallitems();
		
		if($.isArray(aDisplayText) && $.isArray(aWidth) && $.isArray(aName))
		{
			var bptr = new $.obpHelper.Obj("tr",null,null,null);
			this.bpHeader.additem("tr",bptr,null,false,null);
			
			for(var i=0;i<aDisplayText.length;i++)
			{
				var sText = $.V.tostr(aDisplayText[i]);
				var sWidth = $.V.tostr(aWidth[i]);
				var sName = $.V.tostr(aName[i]);
					
				this.aHeader.push({text:sText,width:sWidth,name:sName});
				var bptd = new $.obpHelper.Obj("td",null,null,"<strong>"+sText+"</strong>");
				bptr.additem(sName,bptd,null,false,null);
			}	
		}
		
		return this;
	};
	$.obpHelper.Table.prototype.addrowitem = function(uid,data,uidBefore)
	{
		var bptr = new $.obpHelper.Obj("tr",null,null,null);
		for(var i in this.aHeader)
		{
			var sName = this.aHeader[i].name;
			var bptd = new $.obpHelper.Obj("td",null,null,null);
			bptd.width(this.aHeader[i].width);
			
			if($.V.iscls(data[sName],$.obpHelper.Obj))
				bptd.additem("item",data[sName],null,false,null);
			else
				bptd.jq.text($.V.tostr(data[sName]));
			
			bptr.additem(sName,bptd,null,false,null);	
		}
		
		this.bpBody.additem(uid,bptr,data,true,uidBefore);
		return this;
	};
	$.obpHelper.Table.prototype.removerowitem = function(uid)
	{
		this.bpBody.removeitem(uid,"uid");
		return this;
	};
	$.obpHelper.Table.prototype.removeallrowitems = function()
	{
		this.bpBody.removeallitems();
		return this;
	};
	$.obpHelper.Table.prototype.setrowdata = function(uid,dataid,data)
	{
		var bptr = this.bpBody.getitemctl(uid);
		var currentdata = this.bpBody.getitemdata(uid);
		
		if(bptr)
		{
			currentdata[dataid] = data;
			if(bptr.oItem[dataid])
			{
				var bptd = bptr.oItem[dataid].ctl;
				
				bptd.removeallitems();
				if($.V.iscls(data,$.obpHelper.Obj))
					bptd.additem("item",data,null,false,null);
				else
					bptd.jq.text($.V.tostr(data));	
			}		
		}
		
		return this;
	};
	$.obpHelper.Table.prototype.getrowctl = function(uid)
	{
		return this.bpBody.getitemctl(uid);
	};	
	$.obpHelper.Table.prototype.getrowdata = function(uid)
	{
		return this.bpBody.getitemdata(uid);
	};
	$.obpHelper.Table.prototype.setrowitemclick = function(fn)
	{
		var bpBody = this.bpBody;
		if($.V.istype(fn,"function"))
			bpBody.jq.bind("itemclick",function(ev,uid,data)
			{
				for(var i in bpBody.oItem)
					bpBody.oItem[i].ctl.jq.removeClass("active");
				
				var bptr = bpBody.getitemctl(uid);
				bptr.addClass("active");
				
				fn(ev,uid,data);
			});
		else
			bpBody.jq.unbind("itemclick");			
			
		return this;		
	};
	$.obpHelper.Table.prototype.setrowitemactive = function(uid,bIsActive)
	{
		var bptr = this.bpBody.getitemctl(uid);
		if(bptr)
		{			
			bptr.jq.removeClass("active");
			if(bIsActive)
				this.bpBody.jq.trigger("itemclick",[uid,this.bpBody.getitemdata(uid)]);
		}
		
		return this;		
	};
				
	$.obpHelper.Alert.TYPE = ["alert-danger","alert-warning","alert-error","alert-info","alert-success"];
	$.obpHelper.Alert.prototype = new $.obpHelper.Div();
	$.obpHelper.Alert.prototype.settype = function(nType)
	{
		this.jq.switchclass($.obpHelper.Alert.TYPE,nType);
		return this;
	};
	
	$.obpHelper.Alert.prototype.settitle = function(sTitle)
	{
		var bpctl = this.getitemctl("title");
		bpctl.jq.text($.V.tostr(sTitle));
		
		return this;
	};
	
	$.obpHelper.Alert.prototype.addtext = function(uid,s,uidBefore)
	{
		this.additem(uid,new $.obpHelper.P($.V.tostr(s)),null,false,uidBefore);
		return this;		
	};
	
	$.obpHelper.Alert.prototype.settext = function(uid,s)
	{
		var bpctl = this.getitemctl(uid);
		bpctl.jq.text($.V.tostr(s));

		return this;		
	};											

	$.obpHelper.Alert.prototype.addbpitem = function(uid,bpitem,uidBefore)
	{
		if($.V.iscls(bpItem,$.obpHelper.Obj))
			this.additem(uid,(new $.obpHelper.P(null)).additem(null,bpItem,null,false,null),
						 null,false,uidBefore);
		
		return this;		
	};
	
	$.obpHelper.Alert.prototype.show = function(bIsShow)
	{
		if(bIsShow)
			this.jq.display(true);
		else
			this.jq.display(false);
			
		return this;		
	};	
})(jQuery);
