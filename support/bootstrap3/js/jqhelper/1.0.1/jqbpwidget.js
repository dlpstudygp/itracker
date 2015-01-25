/**
 * Author: Dee
 * Date: 2014/12/08
 * Version: 1.0.1 
 * Independence: jqplus.js
 * 		 bootstrap.min.js
 *  
 * Description:
 * It is the widget extend for the bootstrap item
 * 
 */

(function($)
{
	window.console.log("$.bp.bpobj loaded ... ");
	
	$.widget("bp.bpobj",
	{
		options : 
		{
			_bplastclk : 0,
			_bptagname : "",
			_bptype : "obj",
			_bpdefaultcls : "",
			prefix : "",
			uuid : "",			
			size : 0,
			type : 0,
			status : 0,
			position : 0,
			bg : 0,
			disabled : false,
			hidden : [false,false,false,false],
			data : null
		},
		_create : function()
		{
			window.console.log("$.bp.bpobj _create ... ");

			this.widgetEventPrefix = this.options.prefix;
			this.element.attr("bp",this.options._bptype);
			this.element.addClass(this.options._bpdefaultcls);
			
			var uuid = this.element.attr("id");
			if(typeof(uuid) === "string" && this.options.uuid.length == 0)
				this.options.uuid = (uuid.length != 0) ? uuid : $.uuid();
			else
			{
				if(this.options.uuid.length == 0)
					this.options.uuid = $.uuid();
				
				this.element.attr("id",this.options.uuid);
			}			

			for(var i in this.options)
				this._bpOptionSetting(i,this.options[i]);
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpobj _bpStyleList ... ");
		
			var o = 			
			{
				size : ["","*-xs","*-sm","*-md","*-lg"],
				type : ["","*-default","*-primary","*-success","*-info","*-warning","*-danger","*-muted","*-link"],
				status : ["","active","success","warning","danger"],
				position : ["","pull-left","pull-right"],
				bg : ["","bg-primary","bg-success","bg-info","bg-warning","bg-danger"]
			};
			
			return o;
		},		
		_setOptions : function()
		{
			window.console.log("$.bp.bpobj _setOptions ... ");

			this._superApply(arguments);	
			
			if(arguments.length == 1)
			{
				if(arguments[0] instanceof Object)
					for(var i in arguments[0])
						this._bpOptionSetting(i,arguments[0][i]);
			}
			else if(arguments.length == 2) 
				this._bpOptionSetting(arguments[0],arguments[1]);

		},
		_destroy : function()
		{
			window.console.log("$.bp.bpobj _destroy ... ");
			
			this.removeClass();
			this._super();
		},		
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpobj _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(key.indexOf("_") == 0)
				return false;
			
			this._bpStyleSetting(key,value);

			if(key === "disabled")
				this.element.enable(!value).find("*").enable(!value);
			else if(key === "items")
			{
				if(value !== null)
				{	
					this.bpRemoveItem(null);
					this.bpAddItem(value,null);
				}				
			}
			else if(key === "attr")
			{
				if(value instanceof Object)
					this.element.attr(value);
			}
			else if(key === "cls")
			{
				if(typeof(value) === "string")
					this.element.addClass(value);
			}
			else if(key === "css")
			{
				if(value instanceof Object)
					this.element.css(value);
			}
			else if(key === "hidden")
			{
				var cls = this._bpStyleList().size.join(" ");
				cls = cls.replace(/\*/g,"hidden").slice(1);
				var a = cls.split(" ");
					
				this.element.removeClass(cls);
				this.options.hidden = [false,false,false,false];
					
				if($.isArray(value))
				{
					for(var i=1;i<5;i++)
					{
						if(value[i])
						{
							this.element.addClass(a[i]);
							this.options.hidden[i-1] = true;
						}
					}
				}
				else
				{
					if(value)
					{
						this.element.addClass(cls);
						for(vari=0;i<4;i++)
							this.options.hidden[i] = true;
					}
				}	
			}
			else if(key === "evt")
			{
				if(value instanceof Object)
					if(value.hasOwnProperty("name") && value.hasOwnProperty("handler"))
							this._bpSetEvt(true,value.name,value.handler,value.target);
				else if($.isArray(value))
					for(var i in value)
						this._bpOptionSetting(key,value[i]);
				else
					this._bpSetEvt(false);	
			}
			else if(key === "tooltip")
			{
				this.element.tooltip("destroy");
				if(value instanceof Object)
					this.element.tooltip(value);
				else if(typeof(value) === "string")
					this.element.tooltip({placement:"auto",title:value});
			}		

			return true;
		},
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bpobj _bpSetEvt: " + isevt + "," + evtname + " ... ");

			var self = this;			
			var clkreation = function(evt)
			{
				var now = (new Date()).valueOf();
				var diff = (now - self.options._bplastclk);
				self.options._bplastclk = now;
								
				evt.isdbclk = (diff < 250);
				return evt;
			};
		
			var n = evtname;
			var fn = handler;
			
			if(evtname === "clickex")
			{
				n = "vmouseup mouseup";
				fn = function(ev)
				{
					if(!self.options.disabled)
						handler(clkreation(ev));								
				};				
			}
			else if(evtname === "selectitem")
			{
				n = "vmouseup mouseup";
				fn = function(ev)
				{
					if(!self.options.disabled)
					{
						self.element.find(".active").each(function()
						{$(this).removeClass("active");});
					
						$(ev.target).addClass("active");
						handler(clkreation(ev));	
					}								
				};				
			}	
			
			this.element.off(n);
			if(isevt && $.isFunction(handler))
			{	
				if(target)
					this.element.on(n,target,fn);
				else
					this.element.on(n,fn);
			}	
		},
		_bpStyleSetting : function(style,n)
		{
			window.console.log("$.bp.bpobj _bpStyleSetting: (" + style + ")," + n + " ... ");
			
			var bpstylelist = this._bpStyleList();
			if(bpstylelist.hasOwnProperty(style))
			{
				var newclass = $.getArrayItem(bpstylelist[style],n).replace(/\*/g,this.widgetEventPrefix);
				var oldclass = bpstylelist[style].join(" ").replace(/\*/g,this.widgetEventPrefix);
				
				this.element.removeClass(oldclass).addClass(newclass);
			}	
		},
		bpAddItem : function(obj,uuidBefore)
		{
			window.console.log("$.bp.bpobj bpAddItem: (" + obj + ")," + uuidBefore + " ... ");

			var item = (uuidBefore) ? ((uuidBefore instanceof $) ? uuidBefore : this.element.find("#"+uuidBefore)) : null;
			
			if($.isArray(obj) && item != null)
				for(var i=obj.length-1;i>=0;i--)
					this._bpAddItem(obj[i],item);
			else if($.isArray(obj) && (item == null || item == undefined))
				for(var i in obj)
					this._bpAddItem(obj[i],null);		
			else
				this._bpAddItem(obj,item);						
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpobj _bpAddItem: " + obj + "," + item + " ... ");

			var bp = null;
			if(obj instanceof $)
				bp = obj;			
			else if(obj instanceof Object)
				bp = $("<div>").bpobj(obj);
			
			if(item && bp instanceof $)
			{
				if(item.length > 0)
					bp.insertBefore(item);
				else
					this.element.appendex(bp);	
			}
			else
				this.element.appendex((bp) ? bp : obj);			
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bpobj bpRemoveItem: " + uuid + " ... ");
			
			if(uuid == null)
				this.element.empty();
			else	
				this.element.children("#"+uuid).remove();
		},
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bpobj bpGetItem: " + uuid + " ... ");

			if(typeof(uuid) === "string")
				return this.element.children("#"+uuid);
			
			return null;	
		}
	});

	// +++++++++++ Static element +++++++++++++++++++++++++++++++++
	window.console.log("$.bp.bptext loaded ... ");

	$.widget("bp.bptext",$.bp.bpobj,
	{
		options : 
		{
			_bptagname : 'p',
			_bptype : "text",
			prefix : "text",
			islead : false,
			transform : 0
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bptext _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.position = ["","*-center","*-right","*-justified","*-nowrap"];
			bpstylelist.transform = ["","*-lowercase","*-uppercase","*-capitalize"];
			
			return bpstylelist;
		},	
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bptext _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "islead")
				this.element.removeClass("lead").addClass((value) ? "lead" : "");

			return true;
		}			
	});

	window.console.log("$.bp.bpblockquote loaded ... ");

	$.widget("bp.bpblockquote",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'blockquote',
			_bptype : "blockquote"
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpblockquote _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.position = ["","*-reverse"];
			
			return bpstylelist;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpblockquote _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				if(obj.hint == "source")
					this._super($("<small>").bptext(obj),item);
				else
					this._super($("<p>").bptext(obj),item);	
			}
			else
				this._super($("<p>").bptext({items:obj}),item);		
		}
	});

	window.console.log("$.bp.bplabel loaded ... ");

	$.widget("bp.bplabel",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'span',
			_bptype : "label",
			_bpdefaultcls : "label",
			prefix : "label",
			type : 1
		}
	});
		
	window.console.log("$.bp.bpbadge loaded ... ");

	$.widget("bp.bpbadge",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'span',
			_bptype : "badge",
			count : 0
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpbadge _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "count")
			{
				var n = this.element.attr("count");
				if(n == undefined || n == null)
				{
					n = 0;
					this.element.attr("count",0);
				}
				
				if(value === "+")
					n = parseInt(n) + 1;
				else if(value === "-")
					n = parseInt(n) - 1;
				else
					n = parseInt(value);
				
				this.options.count = n;
				this.attr("count",n);				
			}
			
			return true;
		}	
	});
	
	window.console.log("$.bp.bpicon loaded ... ");

	$.widget("bp.bpicon",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'span',
			_bptype : "icon",
			_bpdefaultcls : "glyphicon",
			prefix : "glyphicon",
			alt : ""
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpicon _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.type = 
			["","*-asterisk","*-plus","*-euro","*-minus","*-cloud","*-envelope","*-pencil","*-glass","*-music","*-search", 
			 "*-heart","*-star","*-star-empty","*-user","*-film","*-th-large","*-th","*-th-list","*-ok","*-remove","*-zoom-in", 
			 "*-zoom-out","*-off","*-signal","*-cog","*-trash","*-home","*-file","*-time","*-road","*-download-alt","*-download", 
			 "*-upload","*-inbox","*-play-circle","*-repeat","*-refresh","*-list-alt","*-lock","*-flag","*-headphones","*-volume-off", 
			 "*-volume-down","*-volume-up","*-qrcode","*-barcode","*-tag","*-tags","*-book","*-bookmark","*-print","*-camera","*-font", 
			 "*-bold","*-italic","*-text-height","*-text-width","*-align-left","*-align-center","*-align-right","*-align-justify","*-list", 
			 "*-indent-left","*-indent-right","*-facetime-video","*-picture","*-map-marker","*-adjust","*-tint","*-edit","*-share","*-check", 
			 "*-move","*-step-backward","*-fast-backward","*-backward","*-play","*-pause","*-stop","*-forward","*-fast-forward","*-step-forward", 
			 "*-eject","*-chevron-left","*-chevron-right","*-plus-sign","*-minus-sign","*-remove-sign","*-ok-sign","*-question-sign","*-info-sign", 
			 "*-screenshot","*-remove-circle","*-ok-circle","*-ban-circle","*-arrow-left","*-arrow-right","*-arrow-up","*-arrow-down","*-share-alt", 
			 "*-resize-full","*-resize-small","*-exclamation-sign","*-gift","*-leaf","*-fire","*-eye-open","*-eye-close","*-warning-sign","*-plane", 
			 "*-calendar","*-random","*-comment","*-magnet","*-chevron-up","*-chevron-down","*-retweet","*-shopping-cart","*-folder-close","*-folder-open", 
			 "*-resize-vertical","*-resize-horizontal","*-hdd","*-bullhorn","*-bell","*-certificate","*-thumbs-up","*-thumbs-down","*-hand-right","*-hand-left", 
			 "*-hand-up","*-hand-down","*-circle-arrow-right","*-circle-arrow-left","*-circle-arrow-up","*-circle-arrow-down","*-globe","*-wrench","*-tasks", 
			 "*-filter","*-briefcase","*-fullscreen","*-dashboard","*-paperclip","*-heart-empty","*-link","*-phone","*-pushpin","*-usd","*-gbp","*-sort",
			 "*-sort-by-alphabet","*-sort-by-alphabet-alt","*-sort-by-order","*-sort-by-order-alt","*-sort-by-attributes","*-sort-by-attributes-alt","*-unchecked", 
			 "*-expand","*-collapse-down","*-collapse-up","*-log-in","*-flash","*-log-out","*-new-window","*-record","*-save","*-open","*-saved","*-import", 
			 "*-export","*-send","*-floppy-disk","*-floppy-saved","*-floppy-remove","*-floppy-save","*-floppy-open","*-credit-card","*-transfer","*-cutlery", 
			 "*-header","*-compressed","*-earphone","*-phone-alt","*-tower","*-stats","*-sd-video","*-hd-video","*-subtitles","*-sound-stereo","*-sound-dolby", 
			 "*-sound-5-1","*-sound-6-1","*-sound-7-1","*-copyright-mark","*-registration-mark","*-cloud-download","*-cloud-upload","*-tree-conifer","*-tree-deciduous"];
			 
			return bpstylelist; 
		}
	});	

	window.console.log("$.bp.bpimg loaded ... ");

	$.widget("bp.bpimg",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'img',
			_bptype : "img",
			prefix : "img",
			src : "",
			alt : ""
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpimg _bpStyleList ... ");

			var bpstylelist = this._super();
			bpstylelist.type = ["","*-responsive","*-rounded","*-circle","*-thumbnail"];
			
			return bpstylelist;
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpimg _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "src")
				this.element.attr("src",(value) ? value : "");
			else if(key === "alt")
				this.element.attr("alt",(value) ? value : "");					
			
			return true;
		}
	});
	
	window.console.log("$.bp.bpheader loaded ... ");

	$.widget("bp.bpheader",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'div',
			_bptype:"header",
			_bpdefaultcls : "page-header",			
			_bph1:null,
			h1setting : {}
		},
		_create : function()
		{
			window.console.log("$.bp.bpheader _create ... ");
			
			this.options._bph1 = $("<h1>").bptext();
			this.element.append(this.options._bph1);
			
			this._super();
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpheader _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "h1setting" && value instanceof Object && !(value instanceof $))
			{ 
				this.options._bph1.bptext("option",value);	
				this.options.h1setting = this.options._bph1.bptext("option");
			}
			
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpheader _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $)  && !$.isArray(obj))
			{
				if(obj.hint = "subtitle")
					this.options._bph1.bptext("bpAddItem",$("<small>").bptext(obj),item);
				else
					this.options._bph1.bptext("bpAddItem",$("<p>").bptext(obj),item);				
			}
			else
				this.options._bph1.bptext("bpAddItem",obj,item);		
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bpheader bpRemoveItem: " + uuid + " ... ");
			this.options._bph1.bptext("bpRemoveItem",uuid);
		},
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bpheader bpGetItem: " + uuid + " ... ");
			return this.options._bph1.bptext("bpGetItem",uuid);
		}		
	});
	
	window.console.log("$.bp.bpprogress loaded ... ");

	$.widget("bp.bpprogress",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'div',
			_bptype : "progress",
			_bpdefaultcls : "progress",
			_bpprogressbar:null,
			max : 100,
			min : 0,
			current : 0,
			isstriped : false,
			isshown : true,
			text : "*%"
		},
		_create : function()
		{
			window.console.log("$.bp.bpprogress _create ... ");
			
			this.options._bpprogressbar = $("<div>").bpobj({cls:"progress-bar",prefix:"progress-bar",items:$("<span>")});
			this.element.append(this.options._bpprogressbar);
			
			this._super();
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpprogress _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "isstriped")
				this.options._bpprogressbar.removeClass("progress-bar-striped").addClass((value) ? "progress-bar-striped" : "");
			else if(key === "max")
				this.options._bpprogressbar.attr("aria-valuemax",parseFloat(value));					
			else if(key === "min")
				this.options._bpprogressbar.attr("aria-valuemin",parseFloat(value));					
			else if(key === "current")
			{
				var cur = parseFloat(value);
				this.options._bpprogressbar.attr("aria-valuenow",cur).css("width",cur+"%");
			}
			else if(key === "isshown")
				this.options._bpprogressbar.children("span").removeClass("sr-only").addClass((value) ? "sr-only" : "");
			else if(key === "text")
				this.options._bpprogressbar.children("span").text(value.replace("*",this.options.current));
			else if(key === "type")
				this.options._bpprogressbar.bpobj("option","type",value);
			
			return true;
		}
	});	
		
	// +++++++++++++++++++ Layout element +++++++++++++++++++++++++++++++++++++++++++++
	window.console.log("$.bp.bpcontainer loaded ... ");

	$.widget("bp.bpcontainer",$.bp.bpobj,
	{
		options:
		{
			_bptagname:'div',
			_bptype:"container",
			prefix:"container"
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpcontainer _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.type = ["","*","*-fluid"];
			
			return bpstylelist;
		},
	});

	window.console.log("$.bp.bprow loaded ... ");

	$.widget("bp.bprow",$.bp.bpobj,
	{
		options:
		{
			_bptagname:'div',
			_bptype : "row",
			_bpdefaultcls : "row"
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bprow _bpAddItem: " + obj + "," + item + " ... ");
		
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				if(obj.clearfix)
					this._super($("<div>").bpobj({cls:"clearfix",hidden:[false,true,true,true],uuid:obj.uuid}),item);
				else
				{
					var cols = ["col-xs-","col-sm-","col-md-","col-lg-"];
					var offset = ["col-xs-offset-","col-sm-offset-","col-md-offset-","col-lg-offset-"];
					
					var colscls = "";
					var offsetcls = "";
					
					if($.isArray(obj.cols))
						for(var i=0;i<4;i++)
							colscls += (cols[i] + parseInt(obj.cols[i]) + " ");

					if($.isArray(obj.offset))
						for(var i=0;i<4;i++)
							offsetcls += (offset[i] + parseInt(obj.offset[i]) + " ");
							
					var div = $("<div>").bpobj($.extend(obj,{cls:colscls+" "+offsetcls}));		
					this._super(div,item);
				}	
			}
			else
				this._super($("<div>").bpobj({items:obj,cls:"col-xs-12 col-sm-12 col-md-6 col-lg-6"}),item);	
		}
	});
	
	window.console.log("$.bp.bptabcontent loaded ... ");

	$.widget("bp.bptabcontent",$.bp.bpobj,
	{
		options:
		{
			_bptagname:'div',
			_bptype : "tabcontent"
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bptabcontent _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $))
				this._super($("<div>").bpobj($.extend({cls:"tab-pane"},obj)),item);
			else
				this._super($("<div>").bpobj({cls:"tab-pane",items:obj}),item);
		}
	});	

	window.console.log("$.bp.bpthumbnail loaded ... ");

	$.widget("bp.bpthumbnail",$.bp.bpobj,
	{
		options:
		{
			_bptagname:'div',
			_bptype:"thumbnail",
			_bpdefaultcls:"thumbnail",
			_bpcaption:null,
			_bpimg:null,
			imgsetting : {}
		},
		_create : function()
		{
			window.console.log("$.bp.bpthumbnail _create ... ");
			
			this.options._bpcaption = $("<div>").bpobj({cls:"caption"});
			this.options._bpimg = $("<img>").bpimg();
			this.element.appendex([this.options._bpimg,this.options._bpcaption]);
			
			this._super();
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpthumbnail _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "imgsetting")
			{
				this.options._bpimg.bpimg("option",value);
				this.options.imgsetting = this.options._bpimg.bpimg("option");
			}
			
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpthumbnail _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				if(obj.hint == "title")
					this.options._bpcaption.bpobj("bpAddItem",$("<h3>").bptext(obj),item);
				else
					this.options._bpcaption.bpobj("bpAddItem",$("<p>").bptext(obj),item);				
			}
			else
				this.options._bpcaption.bpobj("bpAddItem",$("<p>").bptext({items:obj}),item);
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bpthumbnail bpRemoveItem: " + uuid + " ... ");
			this.options._bpcaption.bpobj("bpRemoveItem",uuid);
		},		
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bpthumbnail bpGetItem: " + uuid + " ... ");
			return this.options._bpcaption.bpobj("bpGetItem",uuid);
		}
	});	

	window.console.log("$.bp.bpmedia loaded ... ");

	$.widget("bp.bpmedia",$.bp.bpobj,
	{
		options:
		{
			_bptagname:'div',
			_bptype:"media",
			_bpdefaultcls:"media",
			_bpbody:null,
			_bpimgbtn:null,	
			imgbtnsetting : {},
			imgalign : 0,
			imgvalign : 1
		},
		_create : function()
		{
			window.console.log("$.bp.bpmedia _create ... ");
			
			this.options._bpbody = $("<div>").bpobj({cls:"media-body"});
			this.options._bpimgbtn = $("<a>").bpimgbtn().removeClass("thumbnail");
			this.element.appendex([this.options._bpimgbtn,this.options._bpbody]);
			
			this._super();
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpmedia _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "imgbtnsetting")
			{
				this.options._bpimgbtn.bpimgbtn("option",value);
				this.options.imgbtnsetting = this.options._bpimgbtn.bpimgbtn("option");				
			}
			else if(key === "imgalign")
			{
				var item = this.element.children("a")
				if(item)
					item.removeClass("media-left media-right").addClass((value == 1) ? "media-right" : "media-left");
			}
			else if(key === "imgvalign")
			{
				var item = this.element.children("a")
				if(item)
					item.removeClass("media-top media-middle media-bottom").addClass((value == 2) ? "media-bottom" : 
																					((value == 1) ? "media-middle" : "media-top"));				
			}
			
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpmedia _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				if(obj.hint == "title")
					this.options._bpbody.bpobj("bpAddItem",$("<h4 class='media-heading'>").bptext(obj),item);
				else
					this.options._bpbody.bpobj("bpAddItem",$("<p>").bptext(obj),item);				
			}
			else
				this.options._bpbody.bpobj("bpAddItem",$("<p>").bptext({items:obj}),item);
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bpmedia bpRemoveItem: " + uuid + " ... ");
			this.options._bpbody.bpobj("bpRemoveItem",uuid);
		},
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bpmedia bpGetItem: " + uuid + " ... ");
			return this.options._bpbody.bpobj("bpGetItem",uuid);
		}	
	});	
			
	// +++++++++++++++++++ List element +++++++++++++++++++++++++++++++++++++++++++++++
	window.console.log("$.bp.bptable loaded ... ");

	$.widget("bp.bptable",$.bp.bpobj,
	{
		options:
		{
			_bptagname:'table',
			_bptype:"table",
			_bpdefaultcls:"table",
			_bphead:null,
			_bpbody:null,		
			prefix : "table",
			striped : 0,
			hover : 0,
			condensed : 0,
			bordered : 0,
			cols : [], // [{uuid:uuid,name:name,width:width,textalign:textalign},....]
		},
		_create : function()
		{
			window.console.log("$.bp.bptable _create ... ");
			
			this.options._bphead = $("<thead>").bpobj().appendTo(this.element);
			this.options._bpbody = $("<tbody>").bpobj().appendTo(this.element);
			
			this._super();
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bptable _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.striped = ["","*-striped"];
			bpstylelist.hover = ["","*-hover"];
			bpstylelist.condensed = ["","*-condensed"];
			bpstylelist.bordered = ["","*-bordered"];	
			
			return bpstylelist;
		},		
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bptable _bpOptionSetting: " + key + "," + value + " ... ");
			
			if(!this._super(key,value))
				return false;
			
			if(key === "cols" && $.isArray(value))
				this._bpResetTable();

			return true;
		},
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bptable _bpSetEvt: " + isevt + "," + evtname + " ... ");
			
			this._super(isevt,evtname,handler,(target) ? target : "tr");
		},
		_bpResetTable : function()
		{
			window.console.log("$.bp.bptable _bpResetTable ... ");
			
			this.options._bphead.empty();
			var tr = $("<tr>").bpobj().appendTo(this.options._bphead);
 			
 			for(var i in this.options.cols)
			{
				var colobj = this.options.cols[i];
				var td = $("<td>").bpobj({items:"<strong>"+colobj.name+"</strong>",css:{width:parseInt(colobj.width),"text-align":colobj.textalign}});
				tr.append(td);
			}			
		},
		_bpAddItem : function(obj,item) /* o = {uid:val,uid:val, ... } */
		{
			window.console.log("$.bp.bptable _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{	
				var tr = $("<tr>").bpobj(obj);							
				for(var i in this.options.cols)
				{
					var colobj = this.options.cols[i];
					var td = null;
					
					if(obj[colobj.uuid] instanceof Object && !(obj[colobj.uuid] instanceof $))
					{
						var o = $.extend({uuid:colobj.uuid,
								  css:{width:parseInt(colobj.width),
								       "text-align":colobj.textalign}},obj[colobj.uuid]);

						td = $("<td>").bpobj(o);
					}
					else
						td = $("<td>").bpobj({uuid:colobj.uuid,items:obj[colobj.uuid],
								   css:{width:parseInt(colobj.width),"text-align":colobj.textalign}});
										  
					tr.bpobj("bpAddItem",td,null);
				}
				
				this.options._bpbody.bpobj("bpAddItem",tr,item);
			}		
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bptable bpRemoveItem: " + uuid + " ... ");
			this.options._bpbody.bpobj("bpRemoveItem",uuid);
		},
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bptable bpGetItem: " + uuid + " ... ");
			return this.options._bpbody.bpobj("bpGetItem",uuid);
		}					
	});

	window.console.log("$.bp.bpmenu loaded ... ");
	
	$.widget("bp.bpmenu",$.bp.bpobj,
	{	
		options:
		{
			_bptagname:'ul',
			_bptype:"menu",
			_bpdefaultcls:"dropdown-menu"
		},
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bpmenu _bpSetEvt: " + isevt + "," + evtname + " ... ");
			
			this._super(isevt,evtname,handler,(target) ? target : "a");
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpmenu _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				var li = null;
			
				if(obj.hint === "header")
					li = $("<li>").bpobj($.extend(obj,{cls:"dropdown-heaader"})).addClass();
				else if(obj.hint === "divider")
					li = $("<li>").bpobj({uuid:obj.uuid,cls:"divider"});
				else
					li = $("<li>").bpobj({uuid:obj.uuid,items:$("<a>").bpbutton($.extend(obj,{attr:{"tabindex":-1}}))});
					
				this._super(li,item);	
			}
			else
			{
				var li = $("<li>").bpobj({items:$("<a>").bpbutton({items:obj,attr:{"tabindex":-1}})});
				this._super(li,item);
			}	
		}
	});

	window.console.log("$.bp.bplistgroup loaded ... ");
	
	$.widget("bp.bplistgroup",$.bp.bpobj,
	{	
		options:
		{
			_bptagname:'ul,div',
			_bptype:"listgroup",
			_bpdefaultcls:"listgroup",
			_bpisstatic:true,
			prefix : "list-group",
			stacked : 0,
			justified : 0
		},
		_create : function()
		{
			window.console.log("$.bp.bplistgroup _create ... ");
			
			var tagname = this.element.gettagname();
			this.options._bpisstatic = (tagname == "div") ? false : true;
			
			this._super();
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bplistgroup _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.stacked = ["","*-stacked"];
			bpstylelist.justified = ["","*-justified"];	
			
			return bpstylelist;
		},		
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bplistgroup _bpSetEvt: " + isevt + "," + evtname + " ... ");
			
			this._super(isevt,evtname,handler,(target) ? target : "li");
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bplistgroup _bpAddItem: " + obj + "," + item + " ... ");

			var fn = function(b,o)
			{
				var setting = {cls:"list-group-item"};
				if(o instanceof Object && !(o instanceof $))
					setting = $.extend(o,setting);
				else
					setting.items = o;
					
				return (b) ? $("<li>").bpobj(setting) : $("<a>").bpbutton(setting);	
			};
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{				
				if(obj.head != undefined && obj.content != undefined)
				{
					var head = (obj.head instanceof Object) ? $.extend({cls:"list-group-item-heading"},obj.head) : 
															  {cls:"list-group-item-heading",items:obj.head};
															  
					var content = (obj.content instanceof Object) ? $.extend({cls:"list-group-item-text"},obj.content) : 
															  		{cls:"list-group-item-text",items:obj.content};
															  
					this._super(fn(this.options._bpisstatic,
								$.extend(obj,{items:[$("<h4>").bptext(head),								
										$("<p>").bptext(content)]								
								})),item);						
				}
				else
					this._super(fn(this.options._bpisstatic,obj),item);
			}
			else
				this._super(fn(this.options._bpisstatic,obj),item);
		}				
	});

	window.console.log("$.bp.bpnav loaded ... ");
	
	$.widget("bp.bpnav",$.bp.bpobj,
	{	
		options:
		{
			_bptagname:'ul',
			_bptype:"nav",
			_bpdefaultcls:"nav",
			prefix : "nav",
			stacked : 0,
			justified : 0,
			type:1
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpnav _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.type = ["","*-tabs","*-pill"];
			bpstylelist.vertical = ["","*-stacked"];
			bpstylelist.justified = ["","*-justified"];	
			
			return bpstylelist;
		},		
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bpnav _bpSetEvt: " + isevt + "," + evtname + " ... ");
			
			this._super(isevt,evtname,handler,(target) ? target : "a");
		},			
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpnav _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				var a = $("<a>").bpbutton(obj);
				var li = $("<li>").bpobj({uuid:obj.uuid});
				
				if($.BP.type(obj.menu) == "menu")
				{	
					a.bpbutton("option",{toggle:"dropdown",cls:"dropdown-toggle"});
					li.bpobj("option",{items:[a,obj.menu],cls:"dropdown"});
				}
				else
					li.bpobj("option",{items:a});
				
				this._super(li,item);
			}
			else
				this._super($("<li>").bpobj({items:$("<a>").bpbutton({items:obj})}),item);
		}		
	});
		
	// +++++++++++++++++++ Form element +++++++++++++++++++++++++++++++++++++++++++++++		
	window.console.log("$.bp.bpctl loaded ... ");
	
	$.widget("bp.bpctl",$.bp.bpobj,
	{
		options :
		{
			_bptagname:'',
			_bptype:"ctl"
		},
		bpVal : function()
		{
			window.console.log("$.bp.bpctl bpVal ... ");
			
			if(arguments.length == 0)
				return this._bpGetVal();
			else if(arguments.length == 1)
				this._bpSetVal(arguments[0]);
			
			return this;		
		},
		_bpSetVal : function(value)
		{
			window.console.log("$.bp.bpctl _bpSetVal: " + value + "... ");
			
			this.element.attr("value",value);
		},
		_bpGetVal : function()
		{
			window.console.log("$.bp.bpctl bpGetVal ... ");
			
			return this.element.attr("value");
		}		
	});		

	window.console.log("$.bp.bpbutton loaded ... ");
	
	$.widget("bp.bpbutton",$.bp.bpctl,
	{	
		options :
		{
			_bptagname:'a',
			_bptype:"button",
			_bpdefaultcls:"btn",
			prefix : "btn",
			block : false,
			href : null,
			toggle : null
		},
		_create : function()
		{
			window.console.log("$.bp.bpbutton _create ... ");
			
			this.element.attr({autocomplete:false});
			this._super();
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpbutton _bpOptionSetting: " + key + "," + value + " ... ");			

			if(!this._super(key,value))					
				return false;
			
			if(key === "block")
				this.element.removeClass("btn-block").addClass((value) ? "btn-block" : "");	
			else if(key === "href")
			{
				this.element.removeAttr("href");
				if(value)
					this.element.attr("href",(value.indexOf("http://") == -1) ? "#"+value : value);
			}
			else if(key === "toggle")
				this.element.attr("data-toggle",(value) ? value : "");
			
			return true;
		},
		bpSetStatus : function(name,text)
		{
			window.console.log("$.bp.bpbutton bpSetStatus: " + name + "," + text + " ... ");			
			this.element.attr("data-"+name+"-text",text);
		},
		bpRemoveStatus : function(name)
		{
			window.console.log("$.bp.bpbutton bpRemoveStatus: " + name + " ... ");			
			this.element.removeAttr("data-"+name+"-text");			
		},
		bpToStatus : function(name)
		{
			window.console.log("$.bp.bpbutton bpToStatus: " + name + " ... ");			

			if(name)
				this.element.button(name);
			else
				this.element.button("reset");	
		}
	});	

	window.console.log("$.bp.bpimgbtn loaded ... ");
	
	$.widget("bp.bpimgbtn",$.bp.bpbutton,
	{
		options :
		{
			_bptagname:'a',
			_bptype:"imgbtn",
			_bpdefaultcls:"thumbnail",
			_bpimg : null,
			prefix : "",
			imgsetting : {}
		},
		_create : function()
		{
			window.console.log("$.bp.bpimgbtn _create ... ");			

			this.options.items = this.options._bpimg = $("<img>").bpimg();
			this._super();					
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpimgbtn _bpOptionSetting: " + key + "," + value + " ... ");			

			if(!this._super(key,value))					
				return false;
			
			if(key === "imgsetting")
			{
				this.options._bpimg.bpimg("option",value);
				this.options.imgsetting = this.options._bpimg.bpimg("option");
			}
			
			return true;
		}
	});
			
	window.console.log("$.bp.bpbtngroup loaded ... ");
	
	$.widget("bp.bpbtngroup",$.bp.bpctl,
	{	
		options:
		{
			_bptagname:'div',
			_bptype:"btngroup",
			_bpdefaultcls:"btn-group",
			prefix : "btn-group",
			vertical : 0,
			justified : 0,
			drop : 0
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpbtngroup _bpStyleList ... ");

			var bpstylelist = this._super();
			bpstylelist.vertical = ["*","*-vertical"];
			bpstylelist.justified = ["","*-justified"];
			bpstylelist.drop = ["","dropup"];
			
			return bpstylelist;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpbtngroup _bpAddItem: " + obj + "," + item + " ... ");
			
			if(obj instanceof $)
				this._super(obj,item);
			else if(obj instanceof Object && !$.isArray(obj))
			{
				var btn = $("<a>").bpbutton(obj);
				this._super(btn,item);
				
				if($.BP.type(obj.menu) == "menu")
				{
					btn.bpbutton("option",{toggle:"dropdown",cls:"dropdown-toggle"});
					obj.menu.insertAfter(btn);
				}
			}
			else
				this._super($("<a>").bpbutton({items:obj}),item);
		}
	});

	window.console.log("$.bp.bpbtntoolbar loaded ... ");

	$.widget("bp.bpbtntoolbar",$.bp.bpbtngroup,
	{
		options:
		{
			_bptype:"btntoolbar",
			_bpdefaultcls : "btn-toolbar",
			prefix:"btn-toolbar"
		}
	});
		
	window.console.log("$.bp.bpinput loaded ... ");
	
	$.widget("bp.bpinput",$.bp.bpctl,
	{	
		options:
		{
			_bptagname:'input',
			_bptype:"input",
			_bpinputtype : ["text","password","checkbox","radio","datetime","datetime-local","date","month","time","week","number","email","url","search","tel","color"],
			_bpdefaultcls : "form-control",
			placeholder:"",
			inputtype:0
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpinput _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
						
			if(key === "placeholder")
				this.element.attr("placeholder",value);
			else if(key === "inputtype")
			{
				var inputtype = $.getArrayItem(this.options._bpinputtype,value);
				var parent = this.element.parent();
				
				if(parent)
				{
					var index = parent.children().index(this.element);
					this.element.detach().attr("type",inputtype);
					
					if(index == 0)
						parent.prepend(this.element);
					else
						this.element.insertAfter(parent.eq(index-1));	
				}
				else
					this.element.attr("type",inputtype);
			}

			return true;
		},
		_bpSetVal : function(value)
		{
			window.console.log("$.bp.bpinput _bpSetVal: " + value + " ... ");
			
			if(this.options.inputtype == 2 || this.options.inputtype == 3)
				(value) ? this.element.attr("checked","checked") : this.element.removeAttr("checked");
			else
				this._super(value);	
		},
		_bpGetVal : function()
		{
			window.console.log("$.bp.bpinput _bpGetVal ... ");
			
			if(this.options.inputtype == 2 || this.options.inputtype == 3)
				return this.element.is(":checked");
			
			return this._super();	
		}		
	});
	
	window.console.log("$.bp.bptextarea loaded ... ");
	
	$.widget("bp.bptextarea",$.bp.bpctl,
	{	
		options :
		{
			_bptagname:'textarea',
			_bptype:"textarea",
			_bpdefaultcls : "form-control",
			placeholder : "",
			rows : 3
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bptextarea _bpOptionSetting: " + key + "," + value + " ... ");			

			if(!this._super(key,value))
				return false;

			if(key === "rows")
				this.element.attr("rows",parseInt(value));			
			else if(key === "placeholder")
				this.element.attr("placeholder",value);
			
			return true;
		}	
	});
	
	window.console.log("$.bp.bpchkboxgroup loaded ... ");
	
	$.widget("bp.bpchkboxgroup",$.bp.bpctl,
	{	
		options :
		{
			_bptagname:'div',
			_bptype:"chkboxgroup",
			isinline : false
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpchkboxgroup _bpOptionSetting: " + key + "," + value + " ... ");			

			if(!this._super(key,value))
				return false;

			if(key === "isinline")
				this.element.children("div").removeClass('checkbox checkbox-inline')
											.addClass((value) ? "checkbox-inline" : "checkbox");				
		
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpchkboxgroup _bpAddItem: " + obj + "," + item + " ... ");			

			var div = (obj instanceof Object && !(obj instanceof $)) ? 
			$("<div>").bpobj({uuid:obj.uuid,items:[$("<input>").bpinput({uuid:obj.uuid,inputtype:2}),obj.items]}) : 
			$("<div>").bpobj({items:[$("<input>").bpinput({inputtype:2}),obj]});				

			this._super(div.addClass((this.options.inline) ? "checkbox-inline" : "checkbox"),item);	
		},
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bpchkboxgroup _bpSetEvt: " + isevt + "," + evtname + " ... ");
			
			this._super(isevt,evtname,handler,(target) ? target : "input:checkbox");		
		},
		_bpGetVal : function()
		{
			window.console.log("$.bp.bpchkboxgroup _bpGetVal ... ");
			
			var list = {};			
			this.element.find("input:checkbox").each(function()
			{
				var uid = $(this).attr("id");
				list[uid] = $(this).is(":checked");				
			});			
			
			return list;
		},
		_bpSetVal : function(value)
		{
			window.console.log("$.bp.bpchkboxgroup _bpSetVal: " + value + " ... ");			
			
			this.element.find("input:checkbox").removeAttr("checked");
			var a = value.split(" ");
			for(var i in a)
				this.element.find("div[id='#"+a[i]+"'] input:checkbox").attr("checked","checked");
		}
	});

	window.console.log("$.bp.bpradiogroup loaded ... ");
	
	$.widget("bp.bpradiogroup",$.bp.bpctl,
	{	
		options :
		{
			_bptagname:'div',
			_bptype:"radiogroup",			
			isinline : false,
			groupname : "RadioGroup"
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpradiogroup _bpOptionSetting: " + key + "," + value + " ... ");			

			if(!this._super(key,value))
					return false;

			if(key === "isinline")
				this.element.children("div").removeClass('radio radio-inline')
											.addClass((value) ? "radio-inline" : "radio");
			else if(key === "groupname")
				this.elememt.find("input:radio").attr("name",value);								
		
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpradiogroup _bpAddItem: " + obj + "," + item + " ... ");			

			var div = (obj instanceof Object && !(obj instanceof $)) ?
			$("<div>").bpobj({uuid:obj.uuid,
							  items:[$("<input>").bpinput({uuid:obj.uuid,
														   inputtype:3,
														   attr:{"name":this.options.groupname}}),obj.items]}) :
			$("<div>").bpobj({items:[$("<input>").bpinput({inputtype:3,attr:{"name":this.options.groupname}}),obj]});				

			this._super(div.addClass((this.options.inline) ? "radio-inline" : "radio"),item);	
		},
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bpradiogroup _bpSetEvt: " + isevt + "," + evtname + " ... ");
			
			this._super(isevt,evtname,handler,(target) ? target : "input:radio");	
		},		
		_bpGetVal : function()
		{
			window.console.log("$.bp.bpradiogroup _bpGetVal ... ");
			
			var list = {};			
			this.element.find("input:radio").each(function()
			{
				var uid = $(this).attr("id");
				list[uid] = $(this).is(":checked");				
			});			
			
			return list;
		},
		_bpSetVal : function(value)
		{
			window.console.log("$.bp.bpradiogroup _bpSetVal: " + value + " ... ");			
			this.element.find("div[id='#"+value+"'] input:radio").attr("checked","checked");
		}
	});

	window.console.log("$.bp.bpinputgroup loaded ... ");
	
	$.widget("bp.bpinputgroup",$.bp.bpctl,
	{	
		options:
		{
			_bptagname:'div',
			_bptype:"inputgroup",
			_bpdefaultcls:"input-group",
			_bpinput:null,
			prefix : "input-group",
			append : null,
			prepend : null,
			inputsetting : {}
		},
		_create : function()
		{
			window.console.log("$.bp.bpinputgroup _create ... ");			
			
			this.options._bpinput = $("<input>").bpinput({inputtype:0});
			this.element.append(this.options._bpinput);
			
			this._super();
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpinputgroup _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
			
			if(key === "append" || key === "prepend")
			{
				var item = null;
				this.element.children(".input-group-"+key).remove();
				if($.BP.type(value) == "btngroup")
					item = value.removeClass().addClass("input-group-btn input-group-"+key);
				else if($.BP.type(value) == "chkboxgroup" || $.BP.type(value) == "radiogroup")
					item = value.removeClass().addClass("input-group-addon input-group-"+key);	
				else if($.BP.type(value) == "button")
					item = $("<span>").bpobj({uuid:value.attr("id"),cls:"input-group-btn",items:value,cls:"input-group-"+key});
				else if(typeof(value) === "string")
					item = $("<span>").addClass("input-group-addon input-group-"+key).appendex(value);
				
				if(item)
					(key === "append") ? this.element.append(item) : this.element.prepend(item);
			}
			else if(key === "inputsetting")
			{
				this.options._bpinput.bpinput("option",value);
				this.options.inputsetting = this.options._bpinput.bpinput("option");
			}

			return true;
		},
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bpinputgroup _bpSetEvt: " + isevt + "," + evtname + " ... ");
			
			this._super(isevt,evtname,handler,(target) ? target : "input a");
		},		
		_bpGetVal : function()
		{
			window.console.log("$.bp.bpinputgroup _bpGetVal ... ");
			return this.options._bpinput.bpinput("bpVal");
		},
		_bpSetVal : function(value)
		{
			window.console.log("$.bp.bpinputgroup _bpSetVal: " + value + " ... ");			
			this.options._bpinput.bpinput("bpVal",value);
		}
	});	
						
	window.console.log("$.bp.bpform loaded ... ");

	$.widget("bp.bpform",$.bp.bpctl,
	{
		options : 
		{
			_bptagname:'form',
			_bptype:"form",
			_bpdefaultcls : "form",
			prefix:"form"
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpform _bpStyleList ... ");

			var bpstylelist = this._super();
			bpstylelist.type = ["","*-inline","*-horizontal"];
			
			return bpstylelist;
		},		
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpform _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
			
			var self = this;
			if(key === "type")
				this.element.children("div.form-group").each(function()
				{self._bpSetFormGpType(this);});
		
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpform _bpAddItem: " + obj + "," + item + " ... ");			
			
			if(obj instanceof Object && !(obj instanceof $))
			{
				if(obj.ctl instanceof $)
				{
					var gp = $("<div>").bpobj({uuid:obj.uuid,prefix:"has",items:
					[
						$("<label>").bpobj({attr:{"for":obj.ctl.attr("id")},items:obj.label}),
						obj.ctl	
					],cls:"form-group",css:{"margin-left":2.5,"margin-right":2.5}});							
					
					gp.find("p").addClass("form-control-static");
					
					this._super(gp,item);
					this._bpSetFormGpType(gp);
				}	
			}
			else if(obj instanceof $)
				this._super(obj.css({"margin-left":2.5,"margin-right":2.5}),item);
		},
		_bpSetEvt : function(isevt,evtname,handler,target)
		{
			window.console.log("$.bp.bpform _bpSetEvt: " + isevt + "," + evtname + " ... ");

			this._super(isevt,evtname,handler,(target) ? target : "input textarea a button");
		},		
		_bpSetFormGpType : function(jq)
		{
			window.console.log("$.bp.bpform _bpSetFormGpType ... ");			
			
			var self = this;
			jq.children().each(function()
			{
				if($(this).gettagname() == "label")
				{
					$(this).removeClass("sr-only");
					if($(this).html().length == 0 || self.options.type == 1)
						$(this).addClass("sr-only");
				}
			});	
		},
		_bpGetVal : function()
		{
			window.console.log("$.bp.bpform _bpGetVal ... ");
			
			var ret = {};
			this.element.find("input, textarea").each(function()
			{
				var id = $(this).attr("id");
				var type = $(this).attr("type");
				
				ret[id] = (type == "checkbox" || type == "radio") ? $(this).is(":checked") : $(this).val().trim();
			});
		
			return ret;
		},
		_bpSetVal : function(value)
		{
			window.console.log("$.bp.bpform _bpSetVal: " + value + " ... ");			
			
			if(value instanceof Object && !(value instanceof $))
			{
				for(var i in value)
				{
					this.element.find("input[id='"+i+"'],textarea[id='"+i+"']").each(function()
					{
						var type = $(this).attr("type");
						if(type == "checkbox" || type == "radio")
							$(this).attr("checked","checked");
						else
							$(this).val(value[i]);
					});
				}
			}
		}				
	});

	// +++++++++++++++++++++ Advance Item +++++++++++++++++++++++++++++++++++++++++++	
	
	window.console.log("$.bp.bpnavbar loaded ... ");

	$.widget("bp.bpnavbar",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'nav',
			_bptype:"navbar",
			_bpdefaultcls:"navbar",
			_bpcollapse:null,
			_bpbrand:null,			
			prefix : "navbar",
			brand : null,
			brandsetting : {}
		},
		_create : function()
		{
			window.console.log("$.bp.bpnavbar _create ... ");	
								
			var collapseid = $.uuid();
			var container = $("<div>").addClass("container-fluid").appendTo(this.element);
			
			this.options._bpbrand = $("<a>").bpbutton({cls:"navbar-brand"});
			$("<div>").addClass("navbar-header").appendex(
			[
				$("<button>").addClass("navbar-toggle collapsed")
							 .attr({"data-toggle":"collapse","data-target":"#"+collapseid,"type":"button"}).appendex(
							 		[
										$("<span>").addClass('sr-only').text("Toggle navigation"),
										$("<span>").addClass('icon-bar'),
										$("<span>").addClass('icon-bar'),
										$("<span>").addClass('icon-bar')
									]),
				this.options._bpbrand					
			]).appendTo(container);
			
			this.options._bpcollapse = $("<div>").bpobj({uuid:collapseid,cls:"collapse navbar-collapse"}).appendTo(container);
			this._super();
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpnavbar _bpStyleList ... ");			
			
			var bpstylelist = this._super();
			bpstylelist.type = ["*-default","*-inverse"];
			bpstylelist.position = ["","*-fixed-top","*-static-top","*-fixed-bottom"];
			
			return bpstylelist;
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpnavbar _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
			
			if(key === "brand")
				this.options._bpbrand.bpbutton("option","items",value);
			else if(key === "brandsetting")	
			{
				this.options._bpbrand.bpbutton("option",value);
				this.options.brandsetting = this.options._bpbrand.bpbutton("option");
			}
			
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpnavbar _bpAddItem: " + obj + "," + item + " ... ");			
			
			if(obj instanceof Object && !(obj instanceof $))
			{
				if(obj.ctl instanceof $)
				{
					var t = $.BP.type(obj.ctl);
					var prefix = (t === "nav") ? "nav" : 
									((t === "form") ? "form" : 
										((t === "button") ? "btn" : "text"));
										
					var cls = "navbar-" + prefix + " " + ((obj.position === 1) ? "navbar-right" : "navbar-left");										
					this.options._bpcollapse.bpobj("bpAddItem",obj.ctl.attr("class",cls),item);				
				}
			}	
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bpnavbar bpRemoveItem: " + uuid + " ... ");
			this.options._bpcollapse.bpobj("bpRemoveItem",uuid);
		},
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bpnavbar bpGetItem: " + uuid + " ... ");
			return this.options._bpcollapse.bpobj("bpGetItem",uuid);
		}			
	});

	window.console.log("$.bp.bpjumbotron loaded ... ");

	$.widget("bp.bpjumbotron",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'div',
			_bptype : "jumbotron",
			_bpdefaultcls : "jumbotron"
		},					
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpjumbotron _bpAddItem: " + obj + "," + item + " ... ");			
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				if(obj.ishead)
					this._super($("<h1>").bptext(obj),item);
				else
					this._super($("<p>").bptext(obj),item);	
			}	
			else
				this._super($("<p>").bptext({items:obj}),item);		
		}
	});

	window.console.log("$.bp.bpwell loaded ... ");
	
	$.widget("bp.bpwell",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'div',
			_bptype : "well",
			_bpdefaultcls : "well"
		}
	});

	window.console.log("$.bp.bpembed loaded ... ");

	$.widget("bp.bpembed",$.bp.bpobj,
	{
		options : 
		{
			_bptagname:'div',
			_bptype:"embed",
			prefix : "embed-responsive",
			src : ""
		},
		_create : function()
		{
			window.console.log("$.bp.bpembed _create ... ");
			
			this.element.append($("<iframe>").addClass('embed-responsive-item'));
			this._super();				
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpembed _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.type = ["*-16by9","*-4by3"];
			return bpstylelist;
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpembed _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
			
			if(key === "src")
				this.element.children("iframe").attr("src",value);
				
			return true;
		}
	});

	window.console.log("$.bp.bpalert loaded ... ");

	$.widget("bp.bpalert",$.bp.bpobj,
	{
		options : 
		{
			_bptagname : 'div',
			_bpclosebtn : $("<button>").attr({type:"button","data-dismiss":"alert"})
									   .addClass("close").appendex(
										[
											$("<span>&times;</span>").attr("aria-hidden","true"),
											$("<span>Close</span>").addClass("sr-only")
										]),
			_bptype:"alert",
			_bpdefaultcls:"alert",
			prefix : "alert",
			dismissible : 0 
		},
		_bpStyleList : function()
		{
			window.console.log("$.bp.bpalert _bpStyleList ... ");
			
			var bpstylelist = this._super();
			bpstylelist.dismissible = ["","*-dismissible"];
			return bpstylelist;
		},		
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpalert _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
			
			if(key === "dismissible")
			{
				this.element.children("button.close").remove();
				if(value == 1)
					this.options._bpclosebtn.prependTo(this.element);
			}

			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpalert _bpAddItem: " + obj + "," + item + " ... ");			
			
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
			{
				if(obj.bp instanceof $)
				{
					obj.bp.addClass((obj.link) ? "alert-link" : "");
					this._super(obj.bp,item);
				}
			}
			else
				this._super(obj,item);			
		}
	});

	window.console.log("$.bp.bppanel loaded ... ");

	$.widget("bp.bppanel",$.bp.bpobj,
	{
		options : 
		{
			_bptagname : 'div',
			_bptype:"panel",
			_bpdefaultcls:"panel",
			_bphead : null,
			_bptitle : null,
			_bpfooter : null,
			prefix : "panel",
			title : null,
			titlesetting : {},
			footer : null,
			footersetting : {}
		},
		_create : function()
		{
			window.console.log("$.bp.bppanel _create ... ");			
			
			this.options._bphead = $("<div>").bpobj({cls:"panel-heading"});
			this.options._bptitle = $("<h3>").bpobj({cls:"panel-title"}).appendTo(this.options._bphead);
			this.options._bpfooter = $("<div>").bpobj({cls:"panel-footer"});
			
			this._super();
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bppanel _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
			
			if(key === "title")
			{
				this.options._bphead.detach();
				if(value)
				{
					this.options._bptitle.bpobj("option","items",value);
					this.element.prepend(this.options._bphead);
				}							   						
			}
			else if(key === "titlesetting")
			{
				this.options._bptitle.bpobj("option",value);
				this.options.titlesetting = this.options._bptitle.bpobj("option");
			}				
			else if(key === "footer")
			{
				this.options._bpfooter.detach();
				if(value)
					this.element.append(this.options._bpfooter.bpobj("option","items",value));
			}
			else if(key === "footersetting")
			{
				this.options._bpfooter.bpobj("option",value);
				this.options.footersetting = this.options._bpfooter.bpobj("option");
			}

			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bppanel _bpAddItem: " + obj + "," + item + " ... ");			
			
			var div = null;
			if(obj instanceof Object && !(obj instanceof $) && !$.isArray(obj))
				div = $("<div>").bpobj($.extend({cls:"panel-item",cls:((obj.isbody) ? "panel-body" : "")},obj));
			else
				div = obj;
							
			if(this.options.footer == null || item)
				this._super(div,item);
			else
				this._super(div,this.options._bpfooter);			
		}
	});
	
	window.console.log("$.bp.bpaccordion loaded ... ");

	$.widget("bp.bpaccordion",$.bp.bpobj,
	{
		options : 
		{
			_bptagname : 'div',
			_bptype:"accordion",
			_bpdefaultcls : "panel-group"
		},
		_bpAddItem : function(obj,item) // {title:title,content,content}
		{
			window.console.log("$.bp.bpaccordion _bpAddItem: " + obj + "," + item + " ... ");			
			
			if(obj instanceof Object && !(obj instanceof $))
			{
				var href = Math.floor(Math.random()*100000+1);
				var div = $("<div>").bppanel({uuid:obj.uuid,
											  items:$("<div>").bpobj({cls:"collapse panel-collapse",
											  						  uuid:href,
											  						  items:$("<div>").bpobj({cls:"panel-body",
											  						  						  items:obj.content,
											  						  						  cls:((obj.isshown) ? "in" : "")})
											  						 })});				
				
				var title = $("<a>").bpbutton({href:href,toggle:"collapse",attr:{"data-parent":div.attr("id")}});
				item.bppanel("option","title",title);
				
				if(obj.isshown)
					this.element.find("panel-collapse").collapse("hide");
				
				this._super(div,item);		
			}	
		}
	});	

	
	window.console.log("$.bp.bpcarousel loaded ... ");

	$.widget("bp.bpcarousel",$.bp.bpobj,
	{
		options : 
		{
			_bptagname : 'div',
			_bptype:"carousel",
			_bpprevbtn : null,
			_bpnextbtn : null,
			_bpindicator : null,
			_bplist : null,
			_bpdefaultcls : "carousel"
		},
		_create : function()
		{
			window.console.log("$.bp.bpcarousel _create ... ");			

			this._super();
						
			this.options._bpindicator = $("<ol>").bpobj({cls:"carousel-indicators"}).appendTo(this.element);
			this.options._bplist = $("<div>").bpobj({cls:"carousel-inner"}).appendTo(this.element);
			this.options._bpprevbtn = $("<a>").bpbutton({cls:"left carousel-control",href:this.options.uuid})
									  .appendex('<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span>')
									  .attr("data-slide","prev").appendTo(this.element); 
			this.options._bpnextbtn = $("<a>").bpbutton({cls:"right carousel-control",href:this.options.uuid})
									  .appendex('<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span>')
									  .attr("data-slide","next").appendTo(this.element); 

		},
		_bpAddItem : function(obj,item) // {imgsetting:imgsetting,content:content}
		{
			window.console.log("$.bp.bpcarousel _bpAddItem: " + obj + "," + item + " ... ");			
			
			if(obj instanceof Object && !(obj instanceof $))
			{				
				var div = $("<div>").bpobj({cls:"item",uuid:obj.uuid,
											 items:
											 [
											 	$("<img>").bpimg(obj.imgsetting),
									 			$("<div>").bpobj({cls:"carousel-caption",items:obj.content})	
									 		 ]});
				
				var uuidBefore = (item instanceof $) ? item.attr("id") : null;
				this.options._bpindicator.bpobj("bpAddItem",$("<li>").attr({"data-target":this.options.uuid,id:div.bpobj("option","uuid")}),uuidBefore);
				
				if(obj.isactive)
				{
					this.options._bplist.children("div.active").removeClass("active");
					this.options._bpindicator.children("div.active").removeClass("active");
				}
														 
				this.options._bplist.bpobj("bpAddItem",div,item);
				this._bpReset();
			}	
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bpcarousel bpRemoveItem: " + uuid + " ... ");			
			
			var activeid = this.options._bpindicator.children("div.active").attr("id");
			this.options._bpindicator.bpobj("bpRemoveItem",uuid);
			this.options._bplist.bpobj("bpRemoveItem",uuid);
			
			this._bpReset();
			
			if(uuid == activeid && this.options._bpindicator.children().length > 0)
			{
				this.options._bpindicator.children("li:nth-child(1)").addClass('active');
				this.options._bplist.children("div:nth-child(1)").addClass('active');
			}	
		},
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bpcarousel bpGetItem: " + uuid + " ... ");			
			return this.options._bplist.bpobj("bpGetItem",uuid);
		},
		_bpReset : function()
		{
			window.console.log("$.bp.bpcarousel bpReset ... ");			
			
			var count = 0;
			this.options._bpindicator.children("li").each(function()
			{
				$(this).attr("data-slide-to",count);
				count++;
			});
		}
	});

	window.console.log("$.bp.bpmodal loaded ... ");

	$.widget("bp.bpmodal",$.bp.bpobj,
	{
		options : 
		{
			_bptagname : 'div',
			_bptype:"modal",
			_bpclosebtn : null,
			_bptitle : null,
			_bpcontent : null,
			_bphead : null,	
			_bpbody : null,
			_bpfooter : null,			
			_bpdefaultcls : "modal",
			title : "",
			isclosebtn : true,
			footer : null,
			isfade : true
		},
		_create : function()
		{
			window.console.log("$.bp.bpmodal _create ... ");			
			
			this.options._bpclosebtn = $("<button>").bpobj({cls:"close",attr:{"data-dismiss":"modal"},items:
								[
									"<span aria-hidden='true'>&times;</span>",
									"<span class='sr-only'>Close</span>"
								]});
			this.options._bptitle = $("<h4>").bptext({cls:"modal-title"});
			this.options._bphead = $("<div>").bpobj({cls:"modal-header",items:this.options._bptitle});			

			this.options._bpbody = $("<div>").bpobj({cls:"modal-body"});
			this.options._bpfooter = $("<div>").bpobj({cls:"modal-footer"});
			this.options._bpcontent = $("<div>").bpobj({cls:"modal-content",items:[this.options._bphead,this.options._bpbody]});
			
			this.element.appendex($("<div>").bpobj({cls:"modal-dialog",items:this.options._bpcontent}));
			this._super();			
		},
		_bpOptionSetting : function(key,value)
		{
			window.console.log("$.bp.bpmodal _bpOptionSetting: " + key + "," + value + " ... ");			
			
			if(!this._super(key,value))
				return false;
			
			if(key === "title" && value)
				this.options._bptitle.bptext("option","items",value);
			else if(key === "isclosebtn")
			{
				this.options._bpclosebtn.detach();
				if(value)
					this.options._bphead.prepend(this.options._bpclosebtn);
			}
			else if(key === "footer")
			{
				this.options._bpfooter.detach();
				if(value)
					this.options._bpcontent.bpobj("bpAddItem",this.options._bpfooter.bpobj("option","items",value));
			}
			else if(key === "isfade")
				this.element.removeClass("fade").addClass((value) ? "fade" : "");
			
			return true;
		},
		_bpAddItem : function(obj,item)
		{
			window.console.log("$.bp.bpmodal _bpAddItem: " + obj + "," + item + " ... ");			
			this.options._bpbody.bpobj("bpAddItem",obj,item);
		},
		bpRemoveItem : function(uuid)
		{
			window.console.log("$.bp.bpmodal bpRemoveItem: " + uuid + " ... ");			
			this.options._bpbody.bpobj("bpRemoveItem",uuid);
		},
		bpGetItem : function(uuid)
		{
			window.console.log("$.bp.bpmodal bpGetItem: " + uuid + " ... ");			
			return this.options._bpbody.bpobj("bpGetItem",uuid);
		}
	});
								
	// +++++++++++++++++++++ Caller (default basic setting) +++++++++++++++++++++++++++++++++++++++++++++++++
	window.console.log("$.BP loaded ... ");
	
	$.BP = 
	{
		// validation
		type : function(bp)
		{
			if(bp instanceof $)
				return bp.attr("bp");
			
			return null;
		},
		
		// static item ... 
		text : function(islead,position,content,option)
		{return $("<p>").bptext($.extend({islead:islead,position:position,items:content},option));},
		blockquote : function(issource,content,option)
		{return $("<blockquote>").bpblockquote($.extend({items:{hint:"source",content:content}},option));},
		label : function(type,size,content,option)
		{return $("<span>").bplabel($.extend({type:type,size:size,items:content},option));},
		badge : function(count,option)
		{return $("<span>").bpbadge($.extend({count:count},option));},
		img : function(src,alt,type,option)
		{return $("<img>").bpimg($.extend({src:src,alt:alt,type:type},option));},
		header : function(title,subtitle,option)
		{return $("<div>").bpheader($.extend({items:[title,{hint:"subtitle",items:subtitle}]},option));},
		progressbar : function(isstriped,isshown,option)
		{return $("<div>").bpprogress($.extend({isstriped:isstriped,isshown:isshown},option));},
		caret : function()
		{return $("<span>").bpobj({cls:"caret"});},
		sronly : function(content)
		{return $("<span>").bpobj({cls:"sr-only",items:content});},
		icon : function(type)
		{return $("<span>").bpicon({type:type});},
		
		// layout item ... 
		container : function(isfluid,content,option)
		{return $("<div>").bpcontainer($.extend({type:((isfluid) ? 1 : 0),items:content},option));},
		row : function(content,option)
		{return $("<div>").bprow($.extend({items:content},option));},
		rowitem : function(uuid,colxs,colsm,colmd,collg,offsetxs,offsetsm,offsetmd,offsetlg,content,option)
		{return $.extend({uuid:uuid,cols:[colxs,colsm,colmd,collg],offset:[offsetxs,offsetsm,offsetmd,offsetlg],items:content},option);},
		thumbnail : function(src,alt,title,content,option)
		{return $("<div>").bpthumbnail($.extend({imgsetting:{src:src,alt:alt},items:[{hint:"title",items:title},content]},option));},
		tabcontent : function(content,option)
		{return $("<div>").bptabcontent($.extend({items:content},option));},
		tabcontentitem : function(uuid,data,content,option)
		{return $.extend({uuid:uuid,data:data,items:content},option);},
		media : function(src,alt,title,content,option)
		{return $("<div>").bpmedia($.extend({imgbtnsetting:{imgsetting:{src:src,alt:alt}},
									items:[{hint:"title",items:title},content]},option));},

		// list item ... 
		table : function(striped,hover,condensed,bordered,head,content,option)
		{return $("<table>").bptable($.extend({striped:striped,hover:hover,condensed:condensed,bordered:bordered,cols:head,items:content},option));},
		tablehead : function(uuid,name,width,textalign,option)
		{return $.extend({uuid:uuid,name:name,width:width,textalign:textalign},option);},
		tabletditem : function(coluuid,status,content)
		{
			var o = {};
			o[coluuid] = {status:status,items:content};
			return o;
		},
		tabletritem : function(uuid,status,data,content)
		{
			content.push({uuid:uuid,data:data,status:status});
			return $.extend.apply({},content);
		},
		menu : function(content,option)
		{return $("<ul>").bpmenu($.extend({items:content},option));},
		menuitem : function(uuid,istitle,data,content,option)
		{return $.extend({uuid:uuid,hint:((istitle) ? "header" : ""),data:data,items:content},option);},
		menudivider : function(uuid)
		{return {uuid:uuid,hint:"divider"};},
		list : function(stacked,justified,isclickable,content,option)
		{return $((isclickable) ? "<div>" : "<ul>").bplistgroup($.extend({stacked:stacked,justified:justified,items:content},option));},
		listitem : function(uuid,type,title,data,content,option)
		{return $.extend(((title) ? {uuid:uuid,type:type,data:data,head:{items:title},content:{items:content}} :
				{uuid:uuid,type:type,data:data,items:content}),option);},
		nav : function(type,stacked,justified,content,option)
		{return $("<ul>").bpnav($.extend({type:type,stacked:stacked,justified:justified,items:content},option));},
		navitem : function(uuid,content,option)
		{return $.extend({uuid:uuid,items:content},option);},
		
		// form item
		button : function(type,size,clkhandler,content,option)
		{return $("<a>").bpbutton($.extend({type:type,size:size,evt:{name:"click touch",handler:clkhandler},items:content},option));},
		link : function(type,size,href,toggle,content,option)
		{return $("<a>").bpbutton($.extend({type:type,size:size,href:href,toggle:toggle,items:content},option));},
		imgbutton : function(src,alt,type,size,content,option)
		{return $("<a>").bpimgbtn($.extend({imgsetting:{src:src,alt:alt},type:type,size:size,items:content},option));},
		btngroup : function(type,size,content,option)
		{return $("<div>").bpbtngroup($.extend({type:type,size:size,items:content},option));},
		dropdown : function(type,size,menu,content,option)
		{return $("<div>").bpbtngroup($.extend({type:type,size:size,items:{menu:menu,items:content}},option));},
		btntoolbar : function(type,size,content,option)
		{return $("<div>").bpbtntoolbar($.extend({type:type,size:size,items:content},option));},
		input : function(uuid,type,placeholder,option)
		{return $("<input>").bpinput($.extend({inputtype:type,placeholder:placeholder,uuid:uuid},option));},
		textarea : function(uuid,row,placeholder,option)
		{return $("<textarea>").bptextarea($.extend({rows:row,uuid:uuid,placeholder:placeholder},option));},
		chkboxgroup : function(uuid,isinline,content,option)
		{return $("<div>").bpchkboxgroup($.extend({uuid:uuid,isinline:isinline,items:content},option));},
		radiogroup : function(uuid,isinline,groupname,content,option)
		{return $("<div>").bpchkboxgroup($.extend({uuid:uuid,isinline:isinline,groupname:groupname,items:content},option));},
		chkradiogroupitem : function(uuid,content,option)
		{return $.extend({uuid:uuid,items:content},option);},
		inputgroup : function(uuid,size,prepend,append,placeholder,option)
		{return $("<div>").bpinputgroup($.extend({uuid:uuid,size:size,prepend:prepend,append:append,inputsetting:{placeholder:placeholder}},option));},
		combo : function(uuid,size,btntype,menu,placeholder,content,option)
		{
			var dropdown = $.BP.dropdown(btntype,size,menu,content);								  
			var inputgp = $.BP.inputgroup(uuid,size,null,dropdown,placeholder,option);
			menu.bpmenu("option","evt",{name:"clickex",handler:function(ev)
										{
											var s = $(ev.target).html();
											inputgp.bpinputgroup("bpVal",s);	
										}});
			
			return inputgp;					  			
		},
		closebtn : function()
		{
			return $("<button>").bpobj({cls:"close",attr:{"type":"button"},items:
			[
				$("<span>").attr("aria-hidden",true).html("&times;"),
				$.BP.sronly("Close")
			]});
		},
		form : function(type,content,option)
		{return $("<form>").bpform($.extend({type:type,items:content},option));},
		formitem : function(label,bpctl,option)
		{return $.extend({label:label,ctl:bpctl},option);},
		
		// advance item
		navbar : function(type,position,brand,content,option)
		{return $("<div>").bpnavbar($.extend({type:type,position:position,brand:brand,items:content},option));},
		navbaritem : function(position,bpctl,option)
		{return $.extend({position:position,ctl:bpctl},option);},
		jumbotron : function(title,content,option)
		{
			var item = [{ishead:true,items:title}];
			if($.isArray(content))
				item = item.concat(content);
			else
				item.push(content);
			
			return $("<div>").bpjumbotron($.extend({items:item},option));
		},
		well : function(size,content,option)
		{return $("<div>").bpwell($.extend({size:size,items:content},option));},
		embed : function(type,src,option)
		{return $("<div>").bpembed($.extend({type:type,src:src},option));},
		alert : function(type,dismissible,content,option)
		{return $("<div>").bpalert($.extend({type:type,dismissible:dismissible,items:content},option));},
		panel : function(type,title,footer,content,option)
		{return $("<div>").bppanel($.extend({type:type,title:title,footer:footer,items:content},option));},
		panelitem : function(isbody,content,option)
		{return $.extend({isbody:isbody,items:content},option);},
		accordion : function(content,option)
		{return $("<div>").bpaccordion($.extend({items:content},option));},
		accordionitem : function(title,isshown,content,option)
		{return $.extend({title:title,isshown:isshown,content:content},option);},
		carousel : function(content,option)
		{return $("<div>").bpcarousel($.extend({items:content},option));},
		carouselitem : function(uuid,src,content,option)
		{return $.extend({uuid:uuid,imgsetting:{src:src},content:content},option);},
		modal : function(title,footer,content,option)
		{return $("<div>").bpmodal($.extend({title:title,footer:footer,items:content},option));}				
	}
				
})(jQuery);
