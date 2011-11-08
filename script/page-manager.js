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
				data		= _.evalJSON(this.responseText);

				if (!data.error) {
					pageMap[data.url] = {
						title:		data.title,
						type:		data.type,
						content:	data.content,
						url:		data.url
					};
					
					ns.pageManager.showPage(pageMap[data.url]);
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
		this.currentPage = null;
	}

	PageManager.prototype.getLoadState = function () {
		return xhr.isBusy() && "waiting" || "idle";
	};

	PageManager.prototype.isLoaded = function (hashPath) {
	};

	PageManager.prototype.load = function (hashPath) {
		if (hashPath in pageMap) {
			alert("have already");
			this.showPage(pageMap[hashPath]);
		}
		else {
			xhr.exec("hash="+hashPath, "replace");
		}
	};
	
	PageManager.prototype.showPage = function (pageInfo) {
		var container		= $id("layout-middle");
		if (pageInfo.type == "module") {
			// find the appropriate module handler
			for (var m in JAP.mods) {
				var mod 	= JAP.mods[m];

				// check it is a mod function that matches this url
				if (mod.pageHash == pageInfo.url) {
					var obj 		= new mod();
					obj.setup(pageInfo);
					pageInfo.handler = obj;
					this.currentPage = obj;
					break;
				}
			}
		}
	};

	// singleton
	ns.pageManager 		= new PageManager();

})(JAP.namespace("JAP"));

