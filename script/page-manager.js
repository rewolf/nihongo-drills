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
						noicon:		data.noicon,
						url:		data.url
					};
					
					queuePage(pageMap[data.url]);
					JAP.main.hideNotification();
				}
				else {
					if (JAP.pageManager.currentPage) {
						location.hash = JAP.pageManager.currentPage.pageInfo.url;
					}
					else {
						location.href = "#!/";
					}
					JAP.pageManager.isBusy = false;
				}
			}
			else {
				onLoadFail();
			}
		}
	}

	function onLoadFail () {
		JAP.pageManager.isBusy = false;
		if (JAP.pageManager.currentPage) {
			history.back();
		}
		else {
			location.hash = "#!/";
		}
	//	location.hash = JAP.pageManager.currentPage.pageInfo.url;
	//	JAP.pageManager.currentPage.show();
		JAP.main.showNotification("Cannot load page.  Check internet connection.");
	}

	function queuePage (pageInfo) {
		var timer = setInterval( function () {
			if (new Date().getTime() > JAP.pageManager.hideEndTime && JAP.main.isLoaded) {
				clearInterval(timer);
				JAP.pageManager.showPage(pageInfo);
			}
		}, 100);
	}

	function PageManager () {
		this.currentPage = null;
		this.lastPage	 = null;
		this.hideEndTime = 0;
		this.isBusy		 = false;
	}

	PageManager.prototype.getLoadState = function () {
		return xhr.isBusy() && "waiting" || "idle";
	};

	PageManager.prototype.load = function (hashPath) {
		// Busy while page is loading.. 
		// isBusy is falsened when showPage is called or the load fails
		if (this.isBusy) {
			return false;
		}
		// If there's a current page, hide it
		// Nothing can show until the page is hidden
		if (this.currentPage) {
			this.currentPage.hide();
			this.hideEndTime= new Date().getTime() + this.currentPage.hideTime;
			this.isBusy 	= true;
		}
		if (hashPath in pageMap) {
			// queue to be shown once the last page has finished hiding
			queuePage(pageMap[hashPath]);
		}
		else {
			xhr.exec("hash="+encodeURIComponent(hashPath), "replace");
		}
		return true;
	};
	
	PageManager.prototype.showPage = function (pageInfo) {
		var container		= $id("layout-middle");
		// Remove old pages
		var oldMod	= $id("content-pane"),
			oldMenu	= $id("menu-pane");
		if (oldMod) {
			$id("layout-middle").removeChild(oldMod);
		}
		if (oldMenu) {
			$id("layout-middle").removeChild(oldMenu);
		}
		if (pageInfo.type == "module") {
			var found = false;
			// find the appropriate module handler
			for (var m in JAP.mods) {
				var mod 	= JAP.mods[m];

				// check it is a mod function that matches this url
				if (mod.pageHash == pageInfo.url) {
					var obj 		= new mod();

					// Setup new page
					obj.setup(pageInfo);
					pageInfo.handler = obj;
					this.lastPage	 = this.currentPage;
					this.currentPage = obj;
					found 			 = true;
					this.currentPage.show();

					pushAnalytics(pageInfo.url);
					break;
				}
			}

			if (!found) {
				if (this.lastPage) {
					location.hash = this.currentPage.pageInfo.url;
				}
				else {
					location.hash = "#!/";
				}
			}
		}
		// Handle menu loading
		else {
			var menu = new JAP.Menu();
			menu.setup(pageInfo);
			pageInfo.handler = menu;
			this.currentPage = menu;
			this.currentPage.show();
			pushAnalytics(pageInfo.url);
		}
		this.isBusy = false;
	};

	function pushAnalytics(page) {
		if (location.href.indexOf("nihongodrills.com") != -1) {
		//	console.log("Pushing: "+page);
			_gaq.push(['_trackPageview', page]);
		}
	}

	// singleton
	ns.pageManager 		= new PageManager();

})(JAP.namespace("JAP"));

