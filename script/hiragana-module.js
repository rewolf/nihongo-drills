
(function (ns) {

	var _ = JAP.util;
	
	function Module () {
		this.build();
	}

	Module.prototype.show = function () {
		$id("content-holder").innerHTML = "";
		$id("content-holder").appendChild(this.node);
	};

	Module.prototype.hide = function () {
		try {
			$id("content-holder").removeChild(this.node);
		} catch (e) {}
	};

	Module.prototype.build = function () {
		this.node			= document.createElement("div");
		this.node.className	= "module";

		this.settings		= new ModuleSettingsBox();
		this.node.appendChild(this.settings.node);
	};

	function ModuleSettingsBox () {
		this.node			= document.createElement("div");
		this.node.className	= "module-settings";
	}

	function About () {
		var text 			= document.createElement("span");
		text.id				= "about-mod-text";
		text.innerHTML		= $id("about-text").innerHTML;
		this.node.appendChild(text);
	}

	About.prototype	= new Module();

	function Links () {
		var text 			= document.createElement("span");
		text.id				= "links-mod-text";
		text.innerHTML		= $id("links-text").innerHTML;
		this.node.appendChild(text);
	}

	Links.prototype	= new Module();

	ns.Module 	= Module;
	ns.About	= About;
	ns.Links	= Links;
}) (JAP.namespace("JAP.hira.mods"));


