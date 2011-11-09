(function (ns) {

	var _ 			= JAP.util;
	
	/***********************************************************
	 * The page - handles all types of dynamic page content : menus/modules
	 ***********************************************************/
	function Page () {
		this.node 		= null;
		this.pageInfo	= null;
		this.visible	= false;
		this.hideTime	= 0;
	}
	Page.prototype.setup = function(pageInfo) {
		this.pageInfo	= pageInfo;
		this.visible	= false;
	};

	Page.prototype.resize = function () {
	};

	Page.prototype.show = function () {
		this.visible	= true;
		this.updateNav();
	};

	Page.prototype.hide = function () {
		this.visible	= false;
		this.resize();
	};

	Page.prototype.updateNav = function () {
		var path 	= this.pageInfo.url.substr(3),
			parts	= path.split("/"),
			curPath = "#!/",
			html	= "",
			nav		= $id("footer-nav"),
			anchor, sep;

		_.removeClass(nav, "anim");
		_.addClass(nav, "highlight");
		nav.innerHTML = "";

		if (path.trim() != "") {
			anchor		= document.createElement("a");
			anchor.className= "nav-part"; 
			anchor.href		= curPath;
			anchor.innerHTML= "Japanese";
			nav.appendChild(anchor);

			sep			= document.createElement("span");
			sep.className	= "nav-sep";
			sep.innerHTML	= "&gt;";
			nav.appendChild(sep);
		}

		for (var i = 0; i < parts.length; i++) {
			curPath += parts[i];

			if (i == parts.length-1){
				anchor		= document.createElement("span");
				anchor.className= "nav-current nav-part"; 
			}
			else {
				anchor		= document.createElement("a");
				anchor.href		= curPath;
				anchor.className= "nav-part"; 
			}
			var title	= parts[i];
			anchor.innerHTML= parts[i].split("-").join(" ").replace(/\b([a-z])/g, function(sz){return sz.toUpperCase();});

			nav.appendChild(anchor);

			if (i != parts.length-1){
				curPath			+= "/";
				var sep			= document.createElement("span");
				sep.className	= "nav-sep";
				sep.innerHTML	= "&gt;";
				nav.appendChild(sep);
			}
		}
		_.invokeLater(function(){
			_.addClass(nav, "anim");
			_.removeClass(nav, "highlight");
		});
	};

	
	/***********************************************************
	 * The module - subclasses page to provide module-specific functionality
	 ***********************************************************/
	function Module () {
		Page.call(this);
		this.settings 	= new ModuleSettingsBox();
		this.hideTime	= 500;
	}
	Module.prototype = new Page();
	
	Module.prototype.setup = function (pageInfo) {
		Page.prototype.setup.call(this, pageInfo);
		this.container	= $id("layout-middle");
		this.contentNode= $id("content-pane");
		var html		= pageInfo.content;

		if (!this.contentNode) {
			this.contentNode 			= document.createElement("div");
			
			this.contentNode.className	= "nothing zero-width";
			this.contentNode.id			= "content-pane";
			
			this.container.appendChild(this.contentNode);
		}
		this.contentNode.innerHTML = html;

		this.node = $cls("module", this.contentNode)[0];
	};

	Module.prototype.resize = function () {
		Page.prototype.resize.call(this);

		this.contentWidth	= parseInt(this.container.clientWidth * .666);
		this.contentNode.style.height = this.container.clientHeight + "px";
		if (this.visible) {
			// move to the new centre
			this.contentNode.style.left 	= this.container.clientWidth/2 - this.contentWidth/2 + "px";
			this.contentNode.style.width 	= this.contentWidth + "px";
		}
	};

	Module.prototype.show = function () {
		Page.prototype.show.call(this);
		var self = this;

		_.removeClass(this.contentNode, "nothing");

		// First centre the zero-width pane and make it visible
		var contW	= this.container.clientWidth,
			contH	= this.container.clientHeight;

		this.contentNode.style.left 	= contW/2 + "px";
		this.contentNode.style.top	 	= "0px";
		var dummy = this.contentNode.clientWidth; // reflow before we start the expansion 
		
		// Start the expansion
		_.addClass(this.contentNode, "expandable");
		this.contentNode.style.left 	= contW/2 - this.fullWidth/2 + "px";
		this.contentNode.style.width 	= this.fullWidth + "px";
		_.removeClass(this.contentNode, "zero-width");

		setTimeout(function () {
			_.removeClass(self.contentNode, "expandable");
		}, 500);

		setTimeout(function(){self.settings.show();}, 700);
		this.resize();
	};

	Module.prototype.hide = function () {
		Page.prototype.hide.call(this);
		var self = this;

		this.settings.hide();
		_.addClass(this.contentNode, "expandable");
		_.addClass(this.contentNode, "zero-width");
		this.contentNode.style.left = this.container.clientWidth/2 + "px";
		setTimeout(function () {
			_.addClass(self.contentNode, "nothing");
			_.removeClass(self.contentNode, "expandable");
		}, 500);
	};

	/***********************************************************
	 * A class to manage the settings of the module
	 ***********************************************************/
	function ModuleSettingsBox () {
		this.node			= document.createElement("div");
		this.node.className	= "drill-settings zero-opacity";
		this.table			= document.createElement("table");
		this.node.appendChild(this.table);
	}

	ModuleSettingsBox.prototype.createElem = function (tagName, id, labelText, tooltip, check) {
		var elem = document.createElement(tagName),
			label= document.createElement("label"),
			row	 = document.createElement("tr"),
			cell1= document.createElement("td"),
			cell2= document.createElement("td");
		elem.id			= id;
		elem.setAttribute("title", tooltip);
		label.setAttribute("for", id);
		if (check) {
			elem.setAttribute("type", "checkbox");
		}
		label.innerHTML = labelText;
		cell1.appendChild(label);
		cell2.appendChild(elem);
		row.appendChild(cell1);
		row.appendChild(cell2);
		this.table.appendChild(row);
		return elem;
	};

	ModuleSettingsBox.prototype.show = function () {
		_.removeClass(this.node, "zero-opacity");
	};
	ModuleSettingsBox.prototype.hide = function () {
		_.addClass(this.node, "zero-opacity");
	};
	 
	/***********************************************************
	 * The menu - subclasses page to provide menu-specific functionality
	 ***********************************************************/
	function Menu () {
		Page.call(this);
		this.hideTime = 600;
	}
	Menu.prototype = new Page();

	Menu.prototype.setup = function (pageInfo) {
		Page.prototype.setup.call(this, pageInfo);

		this.container	= $id("layout-middle");
		this.node		= $id("menu-pane");
		var html		= pageInfo.content;

		if (!this.node) {
			this.node 			= document.createElement("div");
			
			this.node.id		= "menu-pane";
			
			this.container.appendChild(this.node);
		}

		this.node.innerHTML = html;
		this.items			= $cls("menu-item", this.node);
		for (var i =0 ; i < this.items.length; i ++) {
			_.addClass(this.items[i], "invisible");
			_.addClass(this.items[i], "offscreen-item");
		}
	};

	Menu.prototype.resize = function () {
		Page.prototype.resize.call(this);

		var midHeight = JAP.winH - $id("layout-top").clientHeight - $id("layout-bottom").clientHeight - 12;
		if (JAP.main.isAppOnePage()) {
			var numCols = $cls("menu-item", $cls("menu-row", this.node)[0]).length;
			var numRows	= $cls("menu-row", this.node).length;

			for (var i = 0; i < this.items.length;  i++) {
				this.items[i].style.width		= Math.floor(this.container.clientWidth/numCols) -14 + "px";
				this.items[i].style.height		= Math.floor(midHeight/numRows) -14 + "px";
			}

			var menuItems = $cls("menu-item-icon");
			for (var i = 0; i < menuItems.length; i++) {
				menuItems[i].style.marginTop = (parseInt(midHeight/numRows)-14)/2 - 40 + "px";
			}
		}
		else {
			for (var i = 0; i < this.items.length;  i++) {
				this.items[i].style.width		= "";
				this.items[i].style.height		= "";
			}
			var menuItems = $cls("menu-item-icon");
			for (var i = 0; i < menuItems.length; i++) {
				menuItems[i].style.marginTop = "";
			}
		}
	};

	Menu.prototype.show = function () {
		Page.prototype.show.call(this);
		var self = this;

		// Put items off screen
		for (var i =0 ; i < this.items.length; i ++) {
			setTimeout( function (mod) {
				return function () {
					_.removeClass(mod, "invisible");
					_.removeClass(mod, "offscreen-item");
				};
			}(this.items[i]), (i%3) * 200 + parseInt(i/3)*100+200);
		}

		this.resize();
	};

	Menu.prototype.hide = function () {
		Page.prototype.hide.call(this);
		var self = this;

		// Put items off screen
		for (var i =0 ; i < this.items.length; i ++) {
			setTimeout( function (mod) {
				return function () {
					_.addClass(mod, "offscreen-item");
				};
			}(this.items[this.items.length - 1 - i]), (i%3) * 200 + parseInt(i/3)*100);
		}

	};
	
	// Provide interface for other class
	ns.Page 	= Page;
	ns.Module	= Module;
	ns.Menu		= Menu;
	
})(JAP.namespace("JAP"));
