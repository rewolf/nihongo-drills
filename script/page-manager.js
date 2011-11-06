(function (ns) {

	var _ 			= JAP.util,
		pageMap		= {},
		xhr			= new _.AJAXHandler({
			timeout:		6000,
			requestType:	"GET",
			url:			"ajax/load_page.php",
			onTimeout:		onLoadFail,
			onStateChange:	onLoad,
		});

	function onLoad() {
		var data;
		if (this.readyState==4) {
			if (this.status==200) {
				data		= _.responseText;

				if (!data.error) {
					pageMap[data.url] = {
						title:		data.title,
						content:	data.content
					};
				}
				else {
					// error
				}
			}
		}
	}

	function onLoadFail () {
	}

	function PageManager () {
		
	}

	PageManager.prototype.isLoaded = function (hashPath) {
	};

	PageManager.prototype.load = function (hashPath) {
		xhr.exec("hash="+hashPath, "replace");
	};


	// singleton
	ns.pageManager 		= new PageManager();
})(JAP.namespace("JAP"));
