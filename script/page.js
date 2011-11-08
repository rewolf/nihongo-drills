(function (ns) {

	var _ 			= JAP.util;
	
	/***********************************************************
	 * The page - handles all types of dynamic page content : menus/modules
	 ***********************************************************/
	function Page () {
		this.node 		= null;
		this.content	= null;
		this.pageInfo	= null;
		this.hashURL	= null;
	}
	Page.prototype.setup = function(pageInfo) {
		this.pageInfo	= pageInfo;
		this.visible	= false;
	};

	Page.prototype.resize = function () {
	};

	Page.prototype.show = function () {
		this.visible	= true;
	};

	Page.prototype.hide = function () {
		this.visible	= false;
	};

	
	/***********************************************************
	 * The module - subclasses page to provide module-specific functionality
	 ***********************************************************/
	function Module () {
		this.settings = new ModuleSettingsBox();
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
	}
	Menu.prototype = new Page();
	
	// Provide interface for other class
	ns.Page 	= Page;
	ns.Module	= Module;
	ns.Menu		= Menu;
	
})(JAP.namespace("JAP"));
