
(function (hira) {

	var _ = JAP.util;
	_.addEvent(window, "load", init);


	/*
		Finished loading -> open up the screen
	*/
	function init () {
		_.removeClass($id("screen-block"), "nothing");
		setTimeout(setup, 600);
		$id("layout-middle").style.backgroundColor = "#222";

		onResize();
	}

	function setup () {
		_.removeClass($id("layout-middle"), "open-anim");
		_.addEvent(window, "resize", onResize);

		// Put modules off screen
		var mods = $cls("module");
		for (var i =0 ; i < mods.length; i ++) {
			setTimeout( function (mod) {
				return function () {
					_.removeClass(mod, "invisible");
					_.addClass(mod, "module-slide");
				};
			}(mods[i]), (i%3) * 200 + parseInt(i/3)*100);
		}

		setTimeout(function () {
			_.addClass($id("screen-block"), "nothing");
		}, 1000);

		onResize();


		// Listen for hashchanges
		if (window.onhashchange) {
			MM.addEvent(window, "hashchange", loadHashBang);		
		}
		else {
			var curHash = window.location.hash;
			setInterval(function () {
				var hash = window.location.hash;
				if (hash != curHash) {
					curHash = hash;
					loadHashBang();
				}
			}, 100);
		}
		loadHashBang();
	}

	function onResize() {
		var midlayout		= $id("layout-middle"),
			header			= $id("layout-top"),
			footer			= $id("layout-bottom"),
			modules			= $cls("module");

		if (window.innerWidth) { 
			JAP.winW = window.innerWidth;    
			JAP.winH = window.innerHeight;    
		}else{
			JAP.winW = document.documentElement.clientWidth;    
			JAP.winH = document.documentElement.clientHeight;    
		}

		$id("screen-block").style.width = JAP.winW  + "px";
		$id("screen-block").style.height = JAP.winH  + "px";

		var midHeight = JAP.winH - header.clientHeight - footer.clientHeight - 12;
		midlayout.style.height = midHeight + "px";



		for (var i = 0; i < modules.length;  i++) {
			modules[i].style.width		= Math.floor(midlayout.clientWidth/3) + "px";
			modules[i].style.height		= Math.floor(midHeight/2) + "px";

			var cover = $cls("mod-cover", modules[i])[0];
			cover.style.width			= modules[i].clientWidth-14 + "px";
			cover.style.height			= modules[i].clientHeight-14 + "px";
		}
	}

	function loadHashBang () {
		var newHash 	= window.location.hash;

		// If there is a new hashbang link
		if (newHash.trim().length > 0){
			var full = newHash.substring(3);
			if (full.indexOf("/")!=-1) {
				var mod	 = full.substring(0, full.indexOf("/"));
			}
			else {
				var mod = full;
			}

/*
			if (MM.exists(MM.modules[mod])) {
				// First select the navlink
				var navlink = MM.getId("nav-"+mod);
				if (navlink) {
					MM.addClass(navlink, "selected");
				}
				if (MM.currentModule) {
					MM.currentModule.xhr.fetch.stop();
				}
				MM.removeClass("button-add", "nothing");
				MM.getId("main-panel").innerHTML = "Loading";
				MM.modules[mod].load(full);
			}
			else if (full=="about") {
				MM.getId("main-panel").innerHTML = MM.getId("about-text").innerHTML;
			}
			else if (full=="contact") {
				MM.getId("main-panel").innerHTML = MM.getId("contact-text").innerHTML;
			}
			*/
		}
		else {
		}
	}

}) (JAP.namespace("JAP.hira"));
