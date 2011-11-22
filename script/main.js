
JAP.image.loadBatch("essential",
	[
		"res/images/loader2.png",
		"res/images/htv.png",
		"res/images/checkstates.png"
	]
);

(function (ns) {

	var _ = JAP.util,
		contentPane;
	_.addEvent(window, "load", onLoad);
	
	ns.currentModule = null;
	ns.isLoaded		 = false;

	function isAppOnePage() {
		var THRESHOLD_W = 1024;

		return JAP.winW >= THRESHOLD_W;
	}

	var firstContentLoadTimer = setInterval(function () {
		if ($id("layout-middle")) {
			preload();
			loadHashBang();
			clearInterval(firstContentLoadTimer);
		}
	}, 100);

	function preload() {
	}

	/*
		Finished loading -> open up the screen
	*/
	function onLoad () {
		var audtest = $id("audio-cap-tester");
		if (!_.exists(audtest.play) || !_.exists(audtest.pause) || !_.exists(audtest.load) || !_.exists(audtest.readyState)) {
			var display = $id("no-js-message");
			display.className = "audio-fail-message";
			display.innerHTML = "Your browser does not support the necessary Audio features required to use the interactive Japanese/Hiragana Drills and Tests." +
								'<p>The latest versions of the following browsers are supported for PC, Mac: </p>' +
								'<a href="http://www.google.com/chrome" title="Google Chrome v4.0+"><img src="res/images/chrome.png" width="50" height="50"></a>'+
								'<a href="http://www.mozilla.com/en-US/firefox/new/" title="Mozilla Firefox v3.5+"><img src="res/images/firefox.png" width="50" height="50"></a>'+
								'<a href="http://www.opera.com/browser/download/" title="Opera v10.0+"><img src="res/images/opera.png" width="50" height="50"></a>'+
								'<a href="http://www.apple.com/safari/download/" title="Apple Safari"><img src="res/images/safari.png" width="50" height="50"></a>'+
								'<a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home" title="Internet Explorer 9.0"><img src="res/images/ie.png" width="50" height="50"></a><br/>';
			display.innerHTML +=  _.exists(audtest.play) 	&& 1 || 0;
			display.innerHTML +=  _.exists(audtest.pause) 	&& 1 || 0;
			display.innerHTML +=  _.exists(audtest.load) 	&& 1 || 0;
			display.innerHTML +=  _.exists(audtest.readyState) && 1 || 0;
		}
		else {
			//preloadAudio();
	//		buildCharTables();

			// wait for images and page content to load
			var resLoadTimer = setInterval(function() {
				var pageState = JAP.pageManager.getLoadState(),
					imageState= JAP.image.getBatchProgress("essential");
				if (imageState >= 1  &&  pageState == "idle") {
					onReady();
					clearInterval(resLoadTimer);
				}
				
			}, 100);
		}
	}

	function onReady () {
		// Open the content area
		setTimeout(setup, 600);
		_.removeClass($id("layout-middle"), "nothing");
		$id("layout-middle").style.backgroundColor = "#222";

		// remove the loading spinner
		_.addClass($id("loading-box"), "zero-opacity");

		onResize();
	}

	function setup () {
		var items 	= $cls("menu-item");
		_.removeClass($id("layout-middle"), "color-change-anim");
		_.removeClass($id("footer-links"), "start");
		_.addEvent(window, "resize", onResize);

		ns.isLoaded = true;

		onResize();
/*
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
*/

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

		// If the screen is big enough, make the header, content, footer fit on screen
		if (isAppOnePage()) {
			var midHeight = JAP.winH - header.clientHeight - footer.clientHeight - 12;
			midlayout.style.height = midHeight + "px";
		}
		else {
			midlayout.style.height = "";
		}

		if (JAP.pageManager.currentPage) {
			JAP.pageManager.currentPage.resize();
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

		if (oldHash == newHash) {
			return;
		}
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

			if (JAP.pageManager.load(newHash)) {
				_.doAJAXPost("error=0&link="+uriSafe+"&from="+from,"ajax/log_usage.php");
			}
			else {
				window.location.hash = oldHash;
				return;
			}
		}
		else {
			if (newHash!="#!/"){
				window.location.hash = "#!/";
			}
			if (JAP.pageManager.load("#!/")) {
				_.doAJAXPost("error=0&link="+uriSafe+"&from="+from,"ajax/log_usage.php");
			}
		}
		ns.oldHash	= newHash;
	}

	ns.loadHashBang		= loadHashBang;
	ns.isAppOnePage		= isAppOnePage;

	//loadHashBang();

}) (JAP.namespace("JAP.main"));
