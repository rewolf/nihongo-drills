
(function (hira) {
	
	var _ = JAP.util;
	_.addEvent(window, "load", init);
	
	var current;
	
	unicode_map	= [
		12354,  12356,  12358,  12360,  12362,  //
		12363,  12365,  12367,  12369,  12371,  // k
		12373,  12375,  12377,  12379,  12381,  // s
		12383,  12385,  12388,  12390,  12392,  // t
		12394,  12395,  12396,  12497,  12498,  // n
		12399,  12402,  12405,  12408,  12411,  // h
		12414,  12415,  12416,  12417,  12418,  // m
		12420,  00000,  12422,  00000,  12424,  // y
		12425,  12426,  12427,  12428,  12429,  // r
		12431,  12432,  00000,  12433,  12434  	// w
	];
		
	
	function init () {
		createAudio();
		showNextTest();
		
		_.addEvent(_.getId("next-but"), "click", showNextTest);
		_.addEvent(_.getId("hira-char"), "click", playSound);
	}
	
	function showNextTest() {
		var maxLine	= parseInt(_.getId("line-select").value);
		var query = "";
		for (var i = 1; i <= maxLine; i++){
			if (i!=1) {
				query += ", ";
			}
			query += 'audio[data-line="'+i+'"]';
		}
		var candidates = document.querySelectorAll(query);
		
		var oldChar = current ? current : candidates[0];
		current = oldChar;
		while (current.getAttribute("data-unichar")==oldChar.getAttribute("data-unichar")) {
			current = candidates[parseInt(Math.random() * candidates.length)];
		}
		
		_.getId("hira-char").innerHTML = "&#"+current.getAttribute("data-unichar");
		
		if (_.getId("auto-read").checked) {
			_.callAfter(playSound, _.getId("auto-read-delay").value);
		}
	}
	
	function playSound () {
		current.play();
	}
	
	
	function createAudio () {
		var frag = document.createDocumentFragment();
		for (var l = 1; l <= 3; l ++) {
			for (var i = 1; i <= 5; i++) {
				var uni		= unicode_map[ (l-1) * 5 + i - 1];
				if (uni == 0) {
					continue;
				}
				var lnum 	= l < 10 ? "0"+l : l;
				var inum 	= i < 10 ? "0"+i : i;
				var id 		= "hiragana_" + lnum +"_"+inum;
				var src 	= "audio/" + id + ".wav";
				var elem	= document.createElement("audio");
				elem.setAttribute("data-line", l);
				elem.setAttribute("data-unichar", uni);
				elem.id		= id;
				elem.className = "jap-audio";
				elem.src	= src;
				frag.appendChild(elem);
			}
		}
		
		_.getId("audio-holder").appendChild(frag);
	}
	
	
}) (JAP.namespace("JAP.hira"));