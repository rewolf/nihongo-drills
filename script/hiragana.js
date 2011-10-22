
(function (hira) {

	var _ = JAP.util;
	_.addEvent(window, "load", init);


	function init () {
		_.addEvent(window, "resize", onResize);
		onResize();

		$id("layout-middle").style.backgroundColor = "#222";
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

		midlayout.style.height = JAP.winH - header.clientHeight - footer.clientHeight - 12 + "px";

		var midHeight = midlayout.clientHeight - 12;


		for (var i = 0; i < modules.length;  i++) {
			modules[i].style.width		= Math.floor(midlayout.clientWidth/3) + "px";
			modules[i].style.height		= Math.floor(midHeight/2) + "px";

			var cover = $cls("mod-cover", modules[i])[0];
			cover.style.width			= modules[i].clientWidth-14 + "px";
			cover.style.height			= modules[i].clientHeight-14 + "px";
		}
	}

}) (JAP.namespace("JAP.hira"));
