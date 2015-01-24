/**
 * Author: Dee
 * Date: 2014/12/08
 * Version: 1.0.1 
 * Independence: -
 *  
 * Description:
 * It is the extend of the jquery library, there is a new $.DATA object to store the data record by 
 * setting the element attribute with dataid.
 * 
 */

(function($)
{
	window.console.log("$.extend loaded ... ");
	
	$.extend(jQuery,
	{
		DATA : {}, // {dataid:DATA, dataid:DATA, ... }
		isInt : function(n)
		{
			if(!$.isNumeric(n))
				return false;
			
			return (n%1==0);	
		},
		isPositive : function(n)
		{
			if(!$.isNumeric(n))
				return false;
				
			return (n>=0);	
		},
		isPositiveInt : function(n)
		{
			if(!$.isInt(n))
				return false;
			
			return $.isPositive(n);	
		},
		isemail : function(s)
		{
			return /^(\w+)@([\w.]+)/.test(s);
		},
		getArrayItem : function(a,n)
		{
			if(!$.isArray(a))
				return a;
			
			var i = ($.isPositiveInt(n)) ? n : 0;
			if(i >= a.length)
				i = 0;
				
			return a[i];	
		},
		combine : function(a,o)
		{
			if(!$.isArray(a))
				return a+o;
			
			var ret = [];
			for(var i in a)
				ret.push(a[i]+o);
				
			return ret;			
		},
		uuid : function()
		{
			var uuid = (new Date()).valueOf() * Math.floor(Math.random()*10 + 1);
			return uuid.toString();
		},
		browser : function()
		{
			var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
			if(/trident/i.test(M[1]))
			{
				tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
				return 'IE '+(tem[1]||'');
			}   
			if(M[1]==='Chrome')
			{
				tem=ua.match(/\bOPR\/(\d+)/)
				if(tem!=null){return 'Opera '+tem[1];}
			}	   
			M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
			if((tem=ua.match(/version\/(\d+)/i))!=null){M.splice(1,1,tem[1]);}
			return M[0]+" "+M[1];
		}			
	});
	
	$.fn.extend(
	{
		getitem : function(tag,cls,attr,isalllevel)
		{
			var selector = (typeof(tag) === "string") ? tag : "";
			if(attr instanceof Object)
				for(var i in obj)
					selector += ("["+i+"='"+obj[i]+"']");
			
			if($.isArray(cls))
				for(var i in cls)
					selector += ("."+cls[i]);
			else if(typeof(cls) === "string")
				selector += ("."+cls);
			
			if(isalllevel)
				return this.find(selector);
			
			return this.children(selector);						
		},
		switchclass : function(a,n)
		{
			return this.each(function()
			{
				if($.isArray(a))
					if(a.length > 0)
						$(this).removeClass(a.join(" ")).addClass($.getArrayItem(a,n));
				else
					$(this).addClass(a);
			});
		},
		alterclass : function(removals,additions) 
		{
			var self = this;
			
			if ( removals.indexOf( '*' ) === -1 ) 
			{
				self.removeClass( removals );
				return !additions ? self : self.addClass( additions );
			}
		 
			var patt = new RegExp('\\s' + removals.replace( /\*/g, '[A-Za-z0-9-_]+' ).split( ' ' ).join( '\\s|\\s' ) + '\\s', 'g');
		 
			self.each(function(i,it) 
			{
				var cn = ' ' + it.className + ' ';
				while(patt.test(cn))
					cn = cn.replace( patt, ' ' );
				
				it.className = $.trim( cn );
			});
		 
			return !additions ? self : self.addClass( additions );
		},
		setdata : function(obj)
		{
			return this.each(function()
			{
				if(obj == undefined)
				{
					if($(this).attr("dataid") != undefined)
						delete $.DATA[$(this).attr("dataid")];
				}
				else
				{
					if($(this).attr("dataid") == undefined)
						$(this).attr("dataid",$.uid());
					
					$.DATA[$(this).attr("dataid")] = obj;	
				}	
			});
		},
		getdata : function()
		{
			var arr = [];
			this.each(function()
			{
				if($(this).attr("dataid") == undefined)
					arr.push(undefined);
				else
					arr.push($.DATA[$(this).attr("dataid")]);	
			});
	
			if(arr.length == 0)
				return null;
			else if(arr.length == 1)
				return arr[0];
			
			return arr;		
		},
		set : function(oAttr,sClass,sHtml)
		{
			return this.each(function()
			{
				if(oAttr instanceof Object)												
					$(this).attr(oAttr);
				if(typeof(sClass) === "string")	
					$(this).attr("class",sClass);
				if(typeof(sHtml) === "string")	
					$(this).html(sHtml);		
			});
		},
		setmargin : function(top,bottom,left,right)
		{
			return this.each(function()
			{
				if($.isPositive(top))
					$(this).css("margin-top",top);
				if($.isPositive(bottom))
					$(this).css("margin-bottom",bottom);
				if($.isPositive(left))
					$(this).css("margin-left",left);
				if($.isPositive(right))
					$(this).css("margin-right",right);
			});
		},
		setpadding : function(top,bottom,left,right)
		{
			return this.each(function()
			{
				if($.isPositive(top))
					$(this).css("padding-top",top);
				if($.isPositive(bottom))
					$(this).css("padding-bottom",bottom);
				if($.isPositive(left))
					$(this).css("padding-left",left);
				if($.isPositive(right))
					$(this).css("padding-right",right);
			});			
		},		
		display : function(bIsShown)
		{
			return this.each(function()
			{
				$(this).css("display",(bIsShown) ? "block" : "none");
			});
		},
		reload : function()
		{
			return this.each(function()
			{
				$(this).html($(this).html());
			});
		},
		enable : function(bIsEnable)
		{
			return this.each(function()
			{
				$(this).removeAttr("disabled").removeClass("disabled");
				if(bIsEnable == false)
					$(this).attr("disabled","disabled").addClass("disabled");
			});
		},
		clickex : function(clkhandler,dbclkhandler,reactiontime)
		{
			return this.each(function()
			{
				var elm = this;
								
				if(dbclkhandler == null && clkhandler == null)
					$(elm).unbind("vmouseup mouseup");
				else
				{
					var lastTap = 0;
					var rt = ($.isNumeric(reactiontime)) ? Math.abs(reationtime) : 250;
	
					$(elm).bind('vmouseup mouseup', function(ev)
					{
						var now = (new Date()).valueOf();
						var diff = (now - lastTap);
                    	lastTap = now;
                    	
                    	if (diff < rt) 
                   			if($.isFunction(dbclkhandler))
		            	    	dbclkhandler(ev);
                    	else
                   			if($.isFunction(clkhandler))
		            	    	clkhandler(ev);                  
                   	});
                }	
            });
		},
		clickable : function(b)
		{
			var head = $("head");
			if(!head.attr("initclkable"))
			{
				var css = $("<style type='text/css'>").append("[clickable]:hover {cursor: pointer; cursor: hand;}").appendTo(head);
				head.attr("initclkable",true);
			}
			
			return this.each(function()
			{
				var item = $(this);
				(b) ? item.attr("clickable",true) : item.removeAttr("clickable");
			});
		},
		gettagname : function()
		{
			var arr = [];
			
			this.each(function()
			{arr.push($(this).get(0).tagName.toLowerCase());});
			
			if(arr.length == 0)
				return "";
			else if(arr.length == 1)
				return arr[0];
			
			return arr;		
		},
		appendex : function(obj)
		{
			if($.isArray(obj))
				for(var i in obj)
					this.append(obj[i]);
			else
				this.append(obj);
			
			return this;			
		},
		prependex : function(obj)
		{
			if($.isArray(obj))
				for(var i=obj.length-1;i>=0;i--)
					this.prepend(obj[i]);
			else
				this.prepend(obj);
			
			return this;			
		}		
	});
	
})(jQuery);
