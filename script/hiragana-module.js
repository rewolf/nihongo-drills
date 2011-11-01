
(function (ns) {

	var _ = JAP.util;

	ns.UNICODE_MAP	= [
		12354,  12356,  12358,  12360,  12362,  //
		12363,  12365,  12367,  12369,  12371,  // k
		12373,  12375,  12377,  12379,  12381,  // s
		12383,  12385,  12388,  12390,  12392,  // t
		12394,  12395,  12396,  12397,  12398,  // n
		12399,  12402,  12405,  12408,  12411,  // h
		12414,  12415,  12416,  12417,  12418,  // m
		12420,  00000,  12422,  00000,  12424,  // y
		12425,  12426,  12427,  12428,  12429,  // r
		12431,  12432,  00000,  12433,  12434, 	// w
		12435,  00000,  00000,  00000,  00000  	// ng
	];
	
	/***********************************************************
	 * The module class - to represent a drill module
	 ***********************************************************/
	function Module () {
		this.build();
	}

	Module.prototype.show = function () {
		var self=  this;
		$id("content-holder").innerHTML = "";
		$id("content-holder").appendChild(this.node);
		setTimeout(function(){self.settings.show();}, 700);
	};

	Module.prototype.hide = function () {
		this.settings.hide();
		var self = this;
		setTimeout(function () {
			try {
				$id("content-holder").removeChild(self.node);
			} catch (e) {}
		}, 300);

	};

	Module.prototype.build = function () {
		this.node			= document.createElement("div");
		this.node.className	= "module";

		this.settings		= new ModuleSettingsBox();
		this.node.appendChild(this.settings.node);
	};

	Module.prototype.appendButton = function (but, inline) {
		var box = document.createElement("div");
		box.className = "button-box";
		if (inline) {
			box.className += " inline";
		}
		box.appendChild(but);
		this.node.appendChild(box);
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
	 * The About Module
	 ***********************************************************/
	function About () {
		var text 			= document.createElement("span");
		text.id				= "about-mod-text";
		text.innerHTML		= $id("about-text").innerHTML;
		this.node.appendChild(text);
	}

	About.prototype	= new Module();

	/***********************************************************
	 * The links module
	 ***********************************************************/
	function Links () {
		var text 			= document.createElement("span");
		text.id				= "links-mod-text";
		text.innerHTML		= $id("links-text").innerHTML;
		this.node.appendChild(text);
	}
	Links.prototype	= new Module();

	// Bind to this namespace
	ns.Module 	= Module;
	ns.About	= About;
	ns.Links	= Links;
}) (JAP.namespace("JAP.hira.mods"));


