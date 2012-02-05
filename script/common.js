// KEYCODE CONSTANTS
var VK_BACKSPACE	= 8;
var VK_SHIFT		= 16;
var VK_CONTROL		= 17;
var VK_ALT			= 18;
var VK_ENTER		= 13;
var VK_ESCAPE		= 27;
var VK_DELETE		= 46;
var VK_SPACE		= 32;


// create cu with a namespace-creating function
window.JAP = window.JAP || {
	"namespace" : function (n){
		var parts = n.split(".");
		var parent = window;
		for (var i = 0; i < parts.length; i++)
			parent = parent[parts[i]] = parent[parts[i]] || {};
		return parent;
	}
};

if(typeof(String.prototype.trim) === "undefined"){
	String.prototype.trim = function() {
		return String(this).replace(/^\s+|\s+$/g, '');
	};
}

window.URL 		= window.URL || window.webkitURL;
document.head 	= document.head || document.getElementsByTagName("head")[0];

// AT.util namespace
(function (ns){

	ns.WEEK_DAYS = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];

	ns.MONTHS = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	// --
	// Layout functions
	// --

	/********************************************************************
	 * centreElem - centres the given element in the window
	 *******************************************************************/
	ns.centreElem = function (elem, winW, winH){
		elem.style.position = "absolute";
		elem.style.left	= parseInt(winW/2 	- 	elem.clientWidth/2) 	+ "px";
		elem.style.top	= parseInt(winH/2   - 	elem.clientHeight/2) 	+ "px";
	};

	/********************************************************************
	 * getAbsolutePosition - returns the absolute position of element by 
	 * recursively adding the offset of containing parents
	 *******************************************************************/
	ns.getAbsolutePosition = function (el){
		var x = el.offsetLeft;
		var y = el.offsetTop;

		if (el.offsetParent){
			var p = ns.getAbsolutePosition(el.offsetParent);
			x += p[0];
			y += p[1];
		}

		return [x, y];
	};

	/********************************************************************
	 * getScrollXY - returns the amount that the page has scrolled in X 
	 * and Y
	 *******************************************************************/
	ns.getScrollXY = function () {
		var scrOfX = 0, scrOfY = 0;
		if( typeof( window.pageYOffset ) == 'number' ) {
		    //Netscape compliant
		    scrOfY = window.pageYOffset;
		    scrOfX = window.pageXOffset;
		} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
		    //DOM compliant
		    scrOfY = document.body.scrollTop;
		    scrOfX = document.body.scrollLeft;
		} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
		    //IE6 standards compliant mode
		    scrOfY = document.documentElement.scrollTop;
		    scrOfX = document.documentElement.scrollLeft;
		}
		return [ scrOfX, scrOfY ];
	}

	// --
	// Style functions
	// --

	/********************************************************************
	 * addClass - Applies a certain class to the element
	 *******************************************************************/
	ns.addClass = function (elem, cls){
		if (elem.className.indexOf(cls)==-1)
			elem.className += " " + cls;
	};

	ns.exists = function (obj) {
		return typeof obj != "undefined";
	};
	 
	/********************************************************************
	 * removeClass - Removes a certain class from the element
	 *******************************************************************/
	ns.removeClass = function(elem, cls){
		// removes all instances
		elem.className = elem.className.replace(new RegExp("\\s?"+cls, "g"), "");
	};

	/********************************************************************
	 * setOpacity - Cross browser setting of an element's opacity 
	 *******************************************************************/
	ns.setOpacity = function(elem, opacity){
		elem.style.opacity 		= opacity + "";
		elem.style.filter 		= "alpha(opacity="+parseInt(opacity*100)+")";
		elem.style.MozOpacity	= opacity +"";
	};

	// --
	// Event functions
	// --

	/********************************************************************
	 * Sets a function to run very soon after this call
	 *******************************************************************/
	ns.invokeLater = function (fn) {
		setTimeout(fn, 0);
	};
	/********************************************************************
	 * Calls a function after the given time
	 *******************************************************************/
	ns.callAfter = function (fn, delay) {
		delay = delay || 0;
		setTimeout(fn, delay);
	};

	/********************************************************************
	 * addEvent - adds the given event with an associated callback 
	 * function to the given object
	 *******************************************************************/
	ns.addEvent = function (obj, evt, callback){
		if (typeof(obj)=="string")
			obj = ns.getId(obj);
		if (typeof(callback)==="undefined")
			alert("undefined function to handle events - "+(obj.id?obj.id:obj));
		if (obj==window || ns.isNode(obj) || ns.isElement(obj)){
			if (evt=="mousewheel")
				evt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
			if (obj.addEventListener){
				obj.addEventListener(evt, callback, false);
			}else {
				obj.attachEvent("on" + evt, callback);
			}
		}
		// If it's an array of elements/id's
		else if (obj.constructor==Array || obj.constructor==window.NodeList
				|| obj.constructor==window.HTMLCollection || obj.constructor==window.StaticNodeList
				|| (typeof(obj.length)=="number" && typeof(obj.item)=="function")) {
			for (var i = 0; i < obj.length ; i++){
				ns.addEvent(obj[i], evt, callback);
			}
		}
		else{
			alert(obj);
			alert("We have no clue what ancient or strange browser you are using, but"
				+" it's really making it hard to bind events :(");
		}
	}

	/********************************************************************
	 * removeEvent - removes the given event with an associated callback 
	 * function from the given object
	 *******************************************************************/
	ns.removeEvent = function (obj, evt, callback){
		if (typeof(obj)=="string")
			obj = ns.getId(obj);
		if (obj==window || ns.isNode(obj) || ns.isElement(obj)){
			if (evt=="mousewheel")
				evt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
			if (obj.addEventListener){
				obj.removeEventListener(evt, callback, false);
			}else {
				obj.detachEvent("on" + evt, callback);
			}
		}
		// If it's an array of elements/id's
		else if (obj.constructor==Array || obj.constructor==window.NodeList
				|| obj.constructor==window.HTMLCollection || obj.constructor==window.StaticNodeList
				|| (typeof(obj.length)=="number" && typeof(obj.item)=="function")) {
			for (i in obj){
				ns.removeEvent(obj[i], evt, callback);
			}
		}
		else{
			alert(obj);
			alert("We have no clue what ancient or strange browser you are using, but"
				+" it's really making it hard to bind events :(");
		}
	}

	/********************************************************************
	 * cancelEvent - stops the event from being propogated and processed 
	 * by other handlers
	 *******************************************************************/
	ns.cancelEvent = function(evt){
		evt = evt ? evt : window.event;
		if(evt.stopPropagation)
			evt.stopPropagation();
		if(evt.preventDefault)
			evt.preventDefault();
		evt.cancelBubble = true;
		evt.cancel = true;
		evt.returnValue = false;
		return false;
	}

	/********************************************************************
	 * Stops the default browser action for the event
	 *******************************************************************/
	ns.stopDefault = function(evt){
		evt = evt ? evt : window.event;
		if (evt && evt.preventDefault)
			evt.preventDefault();
		//evt.returnValue = false;
		return false;
	};

	// --
	// Util functions
	// --


	/********************************************************************
	 * Checks whether the given object is a DOM Node
	 *******************************************************************/
	ns.isNode = function (o){
	  	return (
			typeof Node === "object" ? o instanceof Node : 
			typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
	 	);
	};

	/********************************************************************
	 * Checks whether the given object is an HTML element
	 *******************************************************************/
	ns.isElement = function(o){
	  	return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
		);
	};

	/**************************************************************************
	 * AJAXRequest - Returns an XMLHttpRequest Object for AJAX requests
	 *************************************************************************/
	ns.createAJAXRequest = function (){
		if (window.XMLHttpRequest){
			return new XMLHttpRequest();
		}else{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	/**************************************************************************
	 * AJAXPost - Creates an AJAX Post request
	 *************************************************************************/
	ns.doAJAXPost = function (request, url, callback){
		var ajax = ns.createAJAXRequest();
		ajax.open("POST", url, true);
		ajax.onreadystatechange = callback;
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		ajax.send(request);
		return ajax;
	}

	/**************************************************************************
	 * AJAXGet - Creates an AJAX Get request
	 *************************************************************************/
	ns.doAJAXGet = function (request, url, callback){
		var ajax = ns.createAJAXRequest();
		ajax.open("GET", url+"?"+request, true);
		ajax.onreadystatechange = callback;
		ajax.send();
		return ajax;
	}

	/********************************************************************
	 * deselectAll - Remove all DOM selections
	 *******************************************************************/
	ns.deselectAll = function (){
		if (document.selection)
			document.selection.empty();
		else if (window.getSelection)
			window.getSelection().removeAllRanges();
	}

	/********************************************************************
	 * escapeHtml - remove html tag characters and replace with codes
	 *******************************************************************/
	ns.escapeHtml = function (unsafe) {
	    return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	/********************************************************************
	 * evalJSON - execute JSON code and return the object
	 *******************************************************************/
	ns.evalJSON = function (json){
		return eval ("(" + json + ")");
	}

	/********************************************************************
	 * getId - quick func to get element from document
	 *******************************************************************/
	ns.getId = function (id){
		return document.getElementById(id);
	};

	/********************************************************************
	 * getCls - return all descendents of ctx (if provided) with class cls
	 *******************************************************************/
	ns.getCls = (function (cls, ctx){
		
		if (typeof document.getElementsByClassName !== "undefined"){
			return function (cls, ctx){
				return (ctx || document).getElementsByClassName(cls);
			};
		}
		else{
			return function (cls, ctx, tag) {
				var elems, regex, results;
				results	= [];
				regex 	= new RegExp("(^|\\s)" + cls + "($|\\s)");
				elems 	= (ctx || document).getElementsByTagName(tag || "*");
				for (var i =0; i < elems.length; i++){
					if (regex.test(elems[i].className)) {
						results.push(elems[i]);
					}
				}
				return results;
			};
		}
	})();

	/********************************************************************
	 * getTag - return all descendents of ctx (if provided) with tag
	 *******************************************************************/
	ns.getTag = function (tag, ctx){
		return (ctx || document).getElementsByTagName(tag);
	};


	/********************************************************************
	 * convertHSVtoRGB - converts colour format. hsv elements are 
	 * between 0 and 1
	 *******************************************************************/
	ns.convertHSVtoRGB = function (hsv){
		var H = hsv[0] * 360;
		var S = hsv[1];
		var V = hsv[2];
		
		var C  = V * S;
		var H_ = H/60;
		var temp = Math.floor(H_ / 2.0);
		var X  = C * (1 - Math.abs(H_ - temp*2.0 - 1));
		
		var rgb;
		if (H_ < 1)
			rgb = [C,X,0];
		else if (H_ < 2)
			rgb = [X,C,0];
		else if (H_ < 3)
			rgb = [0,C,X];
		else if (H_ < 4)
			rgb = [0,X,C];
		else if (H_ < 5)
			rgb = [X,0,C];
		else 
			rgb = [C,0,X];
			
		var m = V-C;
		return [rgb[0] + m, rgb[1] + m, rgb[2] + m];
	}


	/********************************************************************
	 * loadImage - Sets an image's url and callback
	 *******************************************************************/
	ns.loadImage = function (image, url, onload, onerror){
		image.customOnload = onload;
		image.customOnerror= onerror;
		image.onload = function(){
			this.ready = true;
			if (image.customOnload)
				image.customOnload();
		};
		image.onerror= function(){
			this.error= true;
			if (image.customOnerror)
				image.customOnerror();
		};
		image.ready = false;
		// start loading
		image.src = url;
	}

	/********************************************************************
	 * truncNum - Returns a formatted decimal as a string
	 *******************************************************************/
	ns.truncNum = function(f, decPlaces){
		var sz = f + "",
			ind = sz.lastIndexOf("."),
			n = 0;
		if (ind == -1){
			sz+=".";
			n = decPlaces;
		}else{
			n = decPlaces - (sz.length - ind - 1);
			if (n < 0){
				sz = sz.substr(0, ind + 1 + decPlaces);
				n = 0;
			}
		}	
		for (var i = 0; i < n; i++)
			sz += "0";
		return sz;
	}

	/********************************************************************
	 * Class: AJAX -- Provides functionality for handling of repeated
	 * AJAX requests, including timeouts and prevention of duplicates.
	 *******************************************************************/
	ns.AJAXHandler = function (param){
		this.timeout 	= param.timeout;
		this.requestType= param.requestType;
		this.url		= param.url;
		this.onTimeout	= param.onTimeout;
		this.onStateChange 	= param.onStateChange;
		this.timeoutTimer	= null;
	}

	ns.AJAXHandler.prototype.__doTimeout__ = function(self){
		if (self.requestObj){
			self.stop();
			if (self.onTimeout)
				self.onTimeout();
		}
		self.timeoutTimer = null;
	};

	ns.AJAXHandler.prototype.isBusy = function(){
		return this.requestObj != null;
	}

	ns.AJAXHandler.prototype.stop = function(){
		if (this.requestObj)
			this.requestObj.abort();
		this.requestObj = null;
	}

	ns.AJAXHandler.prototype.__processResponse__ = function(ajax){
		if (this.onStateChange){
			ajax.go = this.onStateChange;
			ajax.go();
		}
		if (ajax.readyState==4){
			clearTimeout(this.timeoutTimer);
			this.timeoutTimer = null;
			this.requestObj = null;
		}
	}

	ns.AJAXHandler.prototype.exec = function(queryStr, replaceOrWait){
		var self = this;
		if (this.isBusy()){
			if (replaceOrWait == "replace"){
				// abort the current request first
				this.stop();
			}
			else if (replaceOrWait == "wait"){
				// abort the new request if there's already one
				return false;
			}
			// If not replace or wait, then just start a concurrent request
		}
		
		// Make the new request
		this.requestObj = ns.createAJAXRequest();
		if (this.requestType == "POST")
			this.requestObj.open("POST", this.url, true);
		else
			this.requestObj.open("GET", this.url+"?"+queryStr);
		this.requestObj.onreadystatechange = 
			function(){self.__processResponse__(this);};
		this.requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		this.requestObj.send(queryStr);

		// start a timer for the timeout
		this.timeoutTimer = setTimeout(function(){self.__doTimeout__(self)}, this.timeout);
		return true;
	}

	ns.pad	= function (n) {
		return n < 10 ? "0" + n : n;
	};

	window.$id		= ns.getId;
	window.$cls		= ns.getCls;
	window.$tag		= ns.getTag;
})( JAP.namespace("JAP.util") );
