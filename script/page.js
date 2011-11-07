(function (ns) {

	var _ 			= JAP.util;
	
	/***********************************************************
	 * The page - handles all types of dynamic page content : menus/modules
	 ***********************************************************/
	function Page () {
		this.node 		= null;
		this.content	= null;
		this.infoObj	= null;
		this.hashURL	= null;
	}
	
	
	/***********************************************************
	 * The module - subclasses page to provide module-specific functionality
	 ***********************************************************/
	function Module () {
		this.settings = new ModuleSettingsBox();
	}
	Module.prototype = new Page();
	
	Module.prototype.setContent = function (html) {
		var container = $id("layout-middle");
		if (!$id("content-pane")) {
			var holder 		= document.createElement("div"),
				contentPane	= document.createElement("div");
			
			contentPane.className	= "nothing zero-width";
			contentPane.id			= "content-pane";
			
			holder.id				= "content-holder";
			
			contentPane.appendChild(holder);
			container.appendChild(contentPane);
			container = holder;		
		}
		else {
			container = $id("content-holder");
		}
		container.innerHTML = html;

		this.node = $cls("module", container)[0];
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
