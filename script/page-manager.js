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

					console.log(this.responseText);
				if (!data.error) {
					pageMap[data.url] = {
						title:		data.title,
						type:		data.type,
						content:	data.content
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
		
	}

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
		}
		container.innerHTML = pageInfo.content;
	};


	// singleton
	ns.pageManager 		= new PageManager();
})(JAP.namespace("JAP"));
