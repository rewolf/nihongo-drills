
JAP.image.loadBatch("essential",
	[
		"res/images/htv.png"
	]
);

(function (hira) {

	var _ = JAP.util,
		contentPane;
	_.addEvent(window, "load", onLoad);
	
	ns.MOD_TABLE = {
		"char-htv":		{
			title:	"Hiragana Character-to-Voice Drill"
		},
		"char-vth":		{
			title:	"Hiragana Voice-to-Character Drill"
		},
		"word-htv":		{
			title:	"Hiragana Word-to-Voice Drill"
		},
		"word-vth":		{
			title:	"Hiragana Voice-to-Word Drill"
		},
		"lang-htl":		{
			title:	"Hiragana Word-to-English Drill"
		},
		"lang-lth":		{
			title:	"Hiragana English-to-Word Drill"
		}
	};

	/*
		Finished loading -> open up the screen
	*/
	function onLoad () {
		JAP.image.watchBatch("essential", {
			onImagesReady:	onReady
		});
	}

	function onReady () {
		_.removeClass($id("screen-block"), "nothing");
		setTimeout(setup, 600);
		$id("layout-middle").style.backgroundColor = "#222";

		onResize();
	}

	function setup () {
		var items 	= $cls("menu-item");
		_.removeClass($id("layout-middle"), "open-anim");
		_.addEvent(window, "resize", onResize);

		contentPane	= new ContentPane();

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

	function showMenu () {
		_.removeClass($id("screen-block"), "nothing");
		
		if (contentPane.visible) {
			setTimeout(showMenu, 500);
			contentPane.hide();
			return;
		}

		// Put items off screen
		var items = $cls("menu-item");
		for (var i =0 ; i < items.length; i ++) {
			setTimeout( function (mod) {
				return function () {
					_.removeClass(mod, "invisible");
					_.removeClass(mod, "offscreen-item");
				};
			}(items[i]), (i%3) * 200 + parseInt(i/3)*100);
		}

		setTimeout(function () {
			_.addClass($id("screen-block"), "nothing");
		}, 1000);
	}

	function hideMenu () {
		_.removeClass($id("screen-block"), "nothing");

		// Put items off screen
		var items = $cls("menu-item");
		for (var i =0 ; i < items.length; i ++) {
			setTimeout( function (mod) {
				return function () {
					_.addClass(mod, "offscreen-item");
				};
			}(items[items.length - 1 - i]), (i%3) * 200 + parseInt(i/3)*100);
		}

		setTimeout(function () {
			_.addClass($id("screen-block"), "nothing");
			for (var i =0 ; i < items.length; i ++) {
				_.addClass(items[i], "invisible");
			}

			// Show content pane
			contentPane.show();
		}, 1000);
	}


	function ContentPane () {
		this.visible	= false;
		this.node		= $id("content-pane");
		this.container	= $id("layout-middle");
		this.fullWidth	= 0; // adjusted on resize
		var self = this;

		this.show = function () {
			this.visible 	= true;
			_.removeClass(this.node, "nothing");

			// First centre the zero-width pane and make it visible
			var contW	= this.container.clientWidth,
				contH	= this.container.clientHeight;

			this.node.style.left = contW/2 + "px";
			this.node.style.top	 = "0px";
			this.node.clientWidth = this.node.clientWidth; // reflow before we start the expansion 
			
			// Start the expansion
			_.addClass(this.node, "expandable");
			this.node.style.left = contW/2 - this.fullWidth/2 + "px";
			this.node.style.width = this.fullWidth + "px";
			_.removeClass(this.node, "zero-width");

			setTimeout(function () {
				_.removeClass(self.node, "expandable");
			}, 500);

		};

		this.hide = function () {
			this.visible 	= false;

			_.addClass(this.node, "expandable");
			_.addClass(this.node, "zero-width");
			this.node.style.left = this.container.clientWidth/2 + "px";
			setTimeout(function () {
				_.addClass(self.node, "nothing");
				_.removeClass(self.node, "expandable");
			}, 500);
		};

		this.onResize = function () {
			this.fullWidth	= parseInt(this.container.clientWidth * .666);
			this.node.style.height = this.container.clientHeight + "px";
			if (this.visible) {
				// move to the new centre
			}
		};
	}

	function onResize() {
		var midlayout		= $id("layout-middle"),
			header			= $id("layout-top"),
			footer			= $id("layout-bottom"),
			items			= $cls("menu-item");

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



		for (var i = 0; i < items.length;  i++) {
			items[i].style.width		= Math.floor(midlayout.clientWidth/3) -14 + "px";
			items[i].style.height		= Math.floor(midHeight/2) -14 + "px";
		}

		if (contentPane) {
			contentPane.onResize();
		}
	}

	function loadHashBang () {
		var newHash 	= window.location.hash;

		// If there is a new hashbang link
		if (newHash.trim().length > 3 ){
			var full = newHash.substring(3);
			if (full.indexOf("/")!=-1) {
				var mod	 = full.substring(0, full.indexOf("/"));
			}
			else {
				var mod = full;
			}

			hideMenu();

/*
			if (MM.exists(MM.items[mod])) {
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
				MM.items[mod].load(full);
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
			if (contentPane.visible) {
				contentPane.hide();
				setTimeout(showMenu, 500);
			}
			else {
				showMenu();
			}
		}
	}

}) (JAP.namespace("JAP.hira"));
