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
	
	Page.prototype.setContent = function (html) {
	};
	
	
	/***********************************************************
	 * The module - subclasses page to provide module-specific functionality
	 ***********************************************************/
	function Module () {
		// Used for matching pages with handling objects
		this.pageHash	= null;
	}
	Module.prototype = new Page();
	
	Module.prototype.isHandlerFor = function (hash) {
		return this.pageHash!=null && hash == this.pageHash;
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
