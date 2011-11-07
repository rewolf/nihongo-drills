
JAP.image.loadBatch("essential",
	[
		"res/images/htv.png"
	]
);

(function (ns) {

	var _ = JAP.util,
		contentPane;
	_.addEvent(window, "load", onLoad);
	
	ns.currentModule = null;

	function isAppOnePage() {
		var THRESHOLD_W = 1024;

		return JAP.winW >= THRESHOLD_W;
	}

	/*
		Finished loading -> open up the screen
	*/
	function onLoad () {
/*
		ns.MOD_TABLE = {
			"char-htv":		{
				title:	"Hiragana Character-to-Voice Drill",
				module:	new JAP.mods.CharHTV()
			},
			"char-vth":		{
				title:	"Hiragana Voice-to-Character Drill",
				module:	new JAP.mods.CharVTH()
			},
			"char-vtw":		{
				title:	"Hiragana Voice-to-Writing Drill",
				module:	new JAP.mods.CharVTW()
			},
			"word-vth":		{
				title:	"Hiragana Voice-to-Word Drill"
			},
			"lang-htl":		{
				title:	"Hiragana Word-to-English Drill"
			},
			"lang-lth":		{
				title:	"Hiragana English-to-Word Drill"
			},
			"links": 		{
				title:	"Japanese Learning Links",
				module:	new JAP.mods.Links()
			},
			"about": 		{
				title:	"About Hiragana Drills",
				module:	new JAP.mods.About()
			}
		};
*/
		var audtest = $id("audio-cap-tester");
		if (!_.exists(audtest.play) || !_.exists(audtest.pause) || !_.exists(audtest.load) || !_.exists(audtest.readyState)) {
			var display = $id("no-js-message");
			display.className = "audio-fail-message";
			display.innerHTML = "Your browser does not support the necessary Audio features required to use the interactive Japanese/Hiragana Drills and Tests." +
								'<p>The latest versions of the following browsers are supported for PC, Mac: </p>' +
								'<a href="http://www.google.com/chrome" title="Google Chrome v4.0+"><img src="res/images/chrome.png" width="60" height="60"></a>'+
								'<a href="http://www.mozilla.com/en-US/firefox/new/" title="Mozilla Firefox v3.5+"><img src="res/images/firefox.png" width="60" height="60"></a>'+
								'<a href="http://www.opera.com/browser/download/" title="Opera v10.0+"><img src="res/images/opera.png" width="60" height="60"></a>'+
								'<a href="http://www.apple.com/safari/download/" title="Apple Safari"><img src="res/images/safari.png" width="60" height="60"></a>'+
								'<a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home" title="Internet Explorer 9.0"><img src="res/images/ie.png"></a><br/>';
			display.innerHTML +=  _.exists(audtest.play) 	&& 1 || 0;
			display.innerHTML +=  _.exists(audtest.pause) 	&& 1 || 0;
			display.innerHTML +=  _.exists(audtest.load) 	&& 1 || 0;
			display.innerHTML +=  _.exists(audtest.readyState) && 1 || 0;
		}
		else {
			//preloadAudio();
	//		buildCharTables();
			JAP.image.watchBatch("essential", {
				onImagesReady:	onReady
			});
		}
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
		_.removeClass($id("footer-links"), "zero-opacity");
		_.addEvent(window, "resize", onResize);

		contentPane	= new ContentPane();

		onResize();

		// Show table
		_.addEvent($id("show-table-button"), "click", function (e) {
			var evt = e || window.event;

			JAP.main.tableDown.show();
			onResize();
			return _.cancelEvent(evt);
		});

		_.addEvent($id("char-table"), "click", function () {
			_.addClass($id("char-table"), "nothing");
		});

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
	}

	function preloadAudio () {
		// create audio component for preloading
		var audio2 	= document.createElement("audio"),
			codes 	= JAP.mods.UNICODE_MAP,
			gooId 	= -1,
			clipId	= -1,
			audio1	= null;

		audio2.className = "nothing";
		document.body.appendChild(audio2);

		function pad (n) {
			return n < 10 ? "0"+n : n;
		}
		function load1() {
			while (true) {
				clipId++;
				if (clipId >= codes.length) {
					return;	
				}
				if (codes[clipId] != 0) {
					break;
				}
			}
			if (audio1) {
				document.body.removeChild(audio1);
			}
			var src1 = document.createElement("source"),
				src2 = document.createElement("source"),
				filename = "hiragana_"+pad(parseInt(clipId/5)+1)+"_"+pad(clipId%5+1);
			audio1	= document.createElement("audio");
			audio1.className = "nothing";
			_.addEvent(audio1, "loadeddata", load1);
			src1.src = "res/audio/ogg/"+filename+".ogg";
			src2.src = "res/audio/mp3/"+filename+".mp3";
			audio1.appendChild(src1);
			audio1.appendChild(src2);
			document.body.appendChild(audio1);
		}
		function load2() {
			while (true) {
				gooId++;
				if (gooId >= codes.length) {
					return;	
				}
				if (codes[gooId] != 0) {
					break;
				}
			}
			var code = codes[gooId];
			//audio2.src = "ajax/get_audio.php?tl=ja&text=" + encodeURIComponent(String.fromCharCode(code));
		}

		_.addEvent(audio2, "loadeddata", load2);

		load1();
		load2();
	}

	function buildCharTables () {
		function buildTable (array, rowN, topH, leftH, flip) {
			var table 	= document.createElement("table"),
				row		= document.createElement("tr"),
				cell;

			table.setAttribute("cellspacing", "0");
			table.setAttribute("border", "1");

			if (!flip) {
				var h = document.createElement("th");
				h.innerHTML = "&nbsp;";
				row.appendChild(h);
			}
			for (var i = 0; i < rowN; i++) { 
				// col header
				var h = document.createElement("th");
				if (flip) {
					h.innerHTML = topH[topH.length-1-i];
				}
				else {
					h.innerHTML = topH[i];
				}
				row.appendChild(h);
			}
			row.style.borderBottom = "1px solid #fff";
			table.appendChild(row);
			row = document.createElement("tr");
			for (var i = 0; i < array.length; i++) { 
				if (i%rowN==0) {
					if (flip && i!=0) {
						// row title
						var h = document.createElement("th");
						h.innerHTML = leftH[i/rowN-1];
						row.appendChild(h);
					}
					table.appendChild(row);
					row = document.createElement("tr");

					if (!flip) {
						// row title
						var h = document.createElement("th");
						h.innerHTML = leftH[i/rowN];
						h.innerHTML = i/rowN + 1;
						row.appendChild(h);
					}
				}
				cell = document.createElement("td");
				if (array[i] != 0) {
					cell.innerHTML = "&#" + array[i]+";";
				}
				else {
					cell.innerHTML = "&nbsp;";
				}
				row.appendChild(cell);
			}
			if (flip && i!=0) {
				// row title
				var h = document.createElement("th");
				h.innerHTML = leftH[i/rowN-1];
				row.appendChild(h);
			}
			table.appendChild(row);
			table.show = function () {
				var holder = $id("char-table");
				_.removeClass(holder, "nothing");
				holder.innerHTML = "";
				holder.appendChild(table);
				_.removeClass(table, "nothing");
			};
			table.hide = function () {
				var holder = $id("char-table");
				_.addClass(holder, "nothing");
			};
			return table;
		}

		var leftArray = [];
		for (var x = 0; x < 5; x++) {
			for (var y = JAP.mods.UNICODE_MAP.length/5-1; y>= 0; y--) {
				leftArray.push(JAP.mods.UNICODE_MAP[y * 5 + x]);
			}
		}
		var topH = ["A", "I", "U", "E", "O"];
		var leftH= [" ","K", "S", "T", "N", "H", "M", "Y", "R", "W"];
		JAP.main.tableDown = buildTable(JAP.mods.UNICODE_MAP, 5, topH, leftH);
		JAP.main.tableLeft = buildTable(leftArray, parseInt(JAP.mods.UNICODE_MAP.length/5),leftH, topH, true);
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
			var dummy = this.node.clientWidth; // reflow before we start the expansion 
			
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
			var curMod = JAP.main.currentModule;

			_.addClass(this.node, "expandable");
			_.addClass(this.node, "zero-width");
			this.node.style.left = this.container.clientWidth/2 + "px";
			setTimeout(function () {
				_.addClass(self.node, "nothing");
				_.removeClass(self.node, "expandable");
				if (curMod) {
					curMod.hide();
				}
			}, 500);

		};

		this.onResize = function () {
			this.fullWidth	= parseInt(this.container.clientWidth * .666);
			this.node.style.height = this.container.clientHeight + "px";
			if (this.visible) {
				// move to the new centre
				this.node.style.left = this.container.clientWidth/2 - this.fullWidth/2 + "px";
				this.node.style.width = this.fullWidth + "px";
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

		// If the screen is big enough, make the header, content, footer fit on screen
		if (isAppOnePage()) {
			var midHeight = JAP.winH - header.clientHeight - footer.clientHeight - 12;
			midlayout.style.height = midHeight + "px";
		}
		else {
			midlayout.style.height = "";
		}

		if (isAppOnePage()) {
			var numCols = $cls("menu-item", $cls("menu-row")[0]).length;
			var numRows	= $cls("menu-row").length;

			for (var i = 0; i < items.length;  i++) {
				items[i].style.width		= Math.floor(midlayout.clientWidth/numCols) -14 + "px";
				items[i].style.height		= Math.floor(midHeight/numRows) -14 + "px";
			}

			var menuItems = $cls("menu-item-icon");
			for (var i = 0; i < menuItems.length; i++) {
				menuItems[i].style.marginTop = (parseInt(midHeight/numRows)-14)/2 - 40 + "px";
			}
		}
		else {
			for (var i = 0; i < items.length;  i++) {
				items[i].style.width		= "";
				items[i].style.height		= "";
			}
			var menuItems = $cls("menu-item-icon");
			for (var i = 0; i < menuItems.length; i++) {
				menuItems[i].style.marginTop = "";
			}
		}
		if (contentPane) {
			contentPane.onResize();
		}
		

		var centredX= $cls("centred-X"),
			centredY= $cls("centred-Y");
		for (var i = 0; i < centredX.length; i++) {
			var node = centredX[i];
			node.style.left	= Math.max(10, JAP.winW/2 - node.clientWidth/2) + "px";
		}		
		for (var i = 0; i < centredY.length; i++) {
			var node = centredY[i];
			node.style.top	= Math.max(10, JAP.winH/2 - node.clientHeight/2) + "px";
		}	
	}

	function loadHashBang () {
		var newHash 	= window.location.hash,
			oldHash		= ns.oldHash || "/",
			from		= encodeURIComponent(oldHash);
		ns.oldHash	= newHash;

		var uriSafe	= encodeURIComponent(newHash);
		// If there is a new hashbang link
		if (newHash.trim().length > 3 ){
			var full = newHash.substring(3);
			if (full.indexOf("/")!=-1) {
				var mod	 = full.substring(0, full.indexOf("/"));
			}
			else {
				var mod = full;
			}

			/*var modinfo = ns.MOD_TABLE[full];

			if (modinfo && modinfo.module) {
				if (!contentPane.visible) {
					hideMenu();
					setTimeout(function(){modinfo.module.show();}, 600);
				}else {
					modinfo.module.show();
				}
				
				document.title = modinfo.title;
				JAP.main.currentModule = modinfo.module;
				_.doAJAXPost("error=0&link="+uriSafe+"&from="+from, "ajax/log_usage.php");
			}
			else {
				_.doAJAXPost("error=1&link="+uriSafe+"&from="+from, "ajax/log_usage.php");
			}*/
			JAP.pageManager.load(uriSafe);
		}
		else {/*
			if (contentPane.visible) {
				contentPane.hide();
				setTimeout(showMenu, 500);
			}
			else {
				showMenu();
			}
			JAP.main.currentModule = null;
			*/
			_.doAJAXPost("error=0&link="+uriSafe+"&from="+from,"ajax/log_usage.php");
			if (newHash!="#!/"){
				window.location.hash = "#!/";
			}
			JAP.pageManager.load(encodeURIComponent("#!/"));
		}
	}

	ns.loadHashBang		= loadHashBang;

	loadHashBang();

}) (JAP.namespace("JAP.main"));
