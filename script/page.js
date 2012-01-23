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
		this.pageHash	= "";
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
		document.title	= this.pageInfo.title;
	};

	Page.prototype.hide = function () {
		this.visible	= false;
		this.resize();
	};

	Page.prototype.updateNav = function () {
		var path 	= this.pageInfo.url.substr(3),
			parts	= path.replace("_","").split("/"),
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
			anchor.innerHTML= "Home";
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
		//this.container.innerHTML ="";
		var html		= pageInfo.content;

		this.contentNode 			= document.createElement("div");
		
		this.contentNode.className	= "nothing zero-width";
		this.contentNode.id			= "content-pane";
		
		this.container.appendChild(this.contentNode);

		this.contentNode.innerHTML = html;

		this.node = $cls("module", this.contentNode)[0];
	};

	Module.prototype.addSettingsHideToggle = function (){
		// button to show settings
		var setBut 			= document.createElement("button"),
			self			= this;
		setBut.innerHTML	= "[show drill options]";
		setBut.className	= "mobile-only show-settings-but";
		_.addEvent(setBut, "click", function () {
			if (self.settings.node.className.indexOf("mobile-hidden") != -1){
				_.removeClass(self.settings.node, "mobile-hidden");
				setBut.innerHTML = "[hide drill options]";
			}
			else {
				_.addClass(self.settings.node, "mobile-hidden");
				setBut.innerHTML = "[show drill options]";
			}

		});
		this.node.appendChild(setBut);
	};

	Module.prototype.resize = function () {
		Page.prototype.resize.call(this);

		this.contentWidth	= parseInt(this.container.clientWidth * .666);
		if (JAP.main.isAppOnePage()) {
			this.contentNode.style.height = this.container.clientHeight + "px";
			if (this.visible) {
				// move to the new centre
				this.contentNode.style.left 	= this.container.clientWidth/2 - this.contentWidth/2 + "px";
				this.contentNode.style.width 	= this.contentWidth + "px";
			}
		}
		else {
			this.contentNode.style.height = "";
			this.contentNode.style.left 	= "";
			this.contentNode.style.width 	= "";
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
		this.node.className	= "drill-settings mobile-hidden zero-opacity";
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
		//this.container.innerHTML = "";
		var html		= pageInfo.content;

		this.node 			= document.createElement("div");
		
		this.node.id		= "menu-pane";
		this.node.className	= "page menu-"+pageInfo.url.substr(pageInfo.url.lastIndexOf("/")+1);

		this.hasIcons		= !pageInfo.noicon;
		
		this.container.appendChild(this.node);

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
			// For full desktop with a single-page layout -> fits to screen
			var numCols = $cls("menu-item", $cls("menu-row", this.node)[0]).length,
				numRows	= $cls("menu-row", this.node).length,
				itemW	= Math.floor(this.container.clientWidth/numCols) -14,
				itemH	= Math.floor(midHeight/numRows) -14 ;

			for (var i = 0; i < this.items.length;  i++) {
				this.items[i].style.width		= itemW + "px"; 
				this.items[i].style.height		= itemH + "px";
			}

			// Adjust sizing 
			var itemIcons = $cls("menu-item-icon"),
				iconH,
				textH	= $cls("menu-item-label")[0].clientHeight;

			// First remove all sizing classes
			for (var i = 0; i < itemIcons.length; i++) {
				_.removeClass(itemIcons[i], "too-small");
				_.removeClass(itemIcons[i], "small");
			}
			// Now check the current item sizes to deduce icon sizes
			if (itemH > 140 && itemW > 330 && this.hasIcons) {
				// Maximum size for icons
				iconH = 80;
			}
			else if (itemH > 95 && itemW > 110 && this.hasIcons) {
				// Medium size for icons
				iconH = 42;
				for (var i = 0; i < itemIcons.length; i++) {
					_.addClass(itemIcons[i], "small");
				}
			}
			else {
				// No icons
				iconH = 0;
				for (var i = 0; i < itemIcons.length; i++) {
					_.addClass(itemIcons[i], "too-small");
				}
			}
			for (var i = 0; i < itemIcons.length; i++) {
				itemIcons[i].style.marginTop 	= itemH/2 - iconH/2 -textH/2 + "px";
				itemIcons[i].style.height 		= iconH + "px";
			}
		}
		else {
			// For a mobile, scrollable layout
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

		_.addClass($id("side-ad"), "zero-opacity");
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
		_.removeClass($id("side-ad"), "zero-opacity");
	};
	
	// Provide interface for other class
	ns.Page 	= Page;
	ns.Module	= Module;
	ns.Menu		= Menu;
	
})(JAP.namespace("JAP"));
