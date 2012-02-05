(function (ns) {

	var _ 			= JAP.util;

	var MAX_LINE = 11,
		LINE_LETTERS = ["", "k", "s", "t", "n", "h", "m", "y", "r", "w","ng"];

	
	/***************************************************************
	 * Common functions
	 **************************************************************/
	function commonLoadAudio (autoplay) {
		var self = this;
		function pad(n) {
			return n<10?"0"+n:n;
		}
		
		var newAudio = document.createElement("audio");
		newAudio.className = "nothing";
		(this.audio.parentNode || this.audio.parentElement).replaceChild(newAudio,this.audio);
		this.audio = newAudio;

		this.playBut.innerHTML = "loading..";
		_.addEvent(this.audio, "loadeddata", function () {
			if (autoplay) {
				self.playClip ();
				self.playBut.innerHTML = "Play Again";
			}
			else {
				self.playBut.innerHTML = "Play Sound";
			}
		});
		
		if (this.settings.useGoogle.checked) {
			var src1	= document.createElement("source");

			src1.src = "ajax/get_audio.php?tl=ja&text=" + encodeURIComponent(this.currentChar.character);
			this.audio.appendChild(src1);
		}
		else {
			var filename = this.currentChar.audio;
			var src1	= document.createElement("source");
			var src2	= document.createElement("source");

			src1.src	= "res/audio/ogg/"+filename+".ogg";
			src2.src	= "res/audio/mp3/"+filename+".mp3";
			this.audio.appendChild(src1);
			this.audio.appendChild(src2);
		}
	}

	// Called when min line select box is change
	function commonUpdateMaxBox (mod) {
		var minV = parseInt(mod.settings.minCharLine.value),
			maxV = parseInt(mod.settings.maxCharLine.value);
		
		// repopulate max vals with valids
		mod.settings.maxCharLine.innerHTML = "";
		for (var i = minV-1; i < MAX_LINE; i++) {
			commonAddOption(mod.settings.maxCharLine, i+1, i+1 + " ("+LINE_LETTERS[i]+")");
		}

		if (maxV >= minV) {
			mod.settings.maxCharLine.value = maxV;
		}
	}

	// Called when the sample character set must be change due to min/max line select boxes
	function commonChangeCharMap (mod) {
		var minV 	= mod.settings.minCharLine.value,
			maxV 	= mod.settings.maxCharLine.value,
			dakuon	= mod.settings.dakuon.checked,
			yoon	= mod.settings.yoon.checked;

		mod.characterMap		= JAP.buildCharList(mod.charMapSet, dakuon, yoon, minV, maxV);
	}

	// Util func to help building UI
	function commonAddOption (sel, val, label) {
		var opt  = document.createElement("option");
		opt.value = val;
		opt.innerHTML = label;
		sel.appendChild(opt);
	}

	// Builds the common settings for all tools
	function commonBuildSettings (mod, conf) {
		var s 	= mod.settings;

		// Bind the listener
		function onChange (e) {
			var evt = e || window.event;
			mod.checkSettings(evt.target || evt.srcElement);
		}

		if ("line-range" 	in conf) {
			s.minCharLine		= s.createElem("select", "hira-chtv-line-min", "Min hiragana line", "Lets you omit beginning lines of hiragana that you may know. For example, to omit the vowels, set this to 2.");
			s.maxCharLine		= s.createElem("select", "hira-chtv-line", "Max hiragana line", "Setting this will allow you to limit the possible characters in the test. If you only know the first three lines of hiragana, choose 3: Characters on lines above 3 will not appear.");

			// Hira Line
			for (var i = 0; i < MAX_LINE; i++) {
				commonAddOption(s.minCharLine, i+1, LINE_LETTERS[i].length>0 ? i+1 + " ("+LINE_LETTERS[i]+")" : i+1 +"");
			}
			for (var i = 0; i < MAX_LINE; i++) {
				commonAddOption(s.maxCharLine, i+1, LINE_LETTERS[i].length>0 ? i+1 + " ("+LINE_LETTERS[i]+")" : i+1 +"");
			}
			s.maxCharLine.value = MAX_LINE;

			_.addEvent(s.minCharLine, "change", onChange);
			_.addEvent(s.maxCharLine, "change", onChange);
		}

		if ("dakuon-check" 	in conf) {
			s.dakuon			= s.createElem("input",  "setting-dakuon", "Dakuon/Handakuon", "Enable voiced (dakuon and handakuon) characters. ie. those with ten-ten (dakuten) or maru (handakuten).",true);
			s.dakuon.setAttribute("checked");
			_.addEvent(s.dakuon, "change", onChange);
		}

		if ("yoon-check" 	in conf) {
			s.yoon			= s.createElem("input",  "setting-yoon", "Yoon", "Enable the combined characters. eg. きょ or ちゅ.", true);
			_.addEvent(s.yoon, "change", onChange);
		}

		if ("auto-timers" 	in conf) {
			s.changeDelay	= s.createElem("select", "hira-chtv-change", "Auto change delay", "This will set the characters to change automatically after the given period of time.");
			s.readDelay		= s.createElem("select", "hira-chtv-read", "Auto read delay", "The correct pronunciation will automatically be played after the chosen period of time");

			// Add delays
			commonAddOption(s.changeDelay, 0, "Never");
			for (var i = 1; i < 5; i+=.5){
				commonAddOption(s.changeDelay, i * 1000, i + "s");
			}

			commonAddOption(s.readDelay, 0, "Never");
			for (var i = .25; i < 2; i+=.25){
				commonAddOption(s.readDelay, i*1000, i + "s");
			}
			_.addEvent(s.changeDelay, "change", onChange);
			_.addEvent(s.readDelay, "change", onChange);
		}

		if ("google-speech" in conf) {
			s.useGoogle		= s.createElem("input",  "hira-chtv-speech", "Use Google speech", "Check this to use Google's pronunciation rather than the default audio clips.", true);

			_.addEvent(s.useGoogle, "change", onChange);
		}

		if ("choice-grid" 	in conf) {
			s.choiceGrid		= s.createElem("select", "hira-cvth-difficulty", "Grid size", "Affects the number of possible characters shown");
			for (var i = 1 ; i <= 6; i++){
				commonAddOption(s.choiceGrid, i, "3 x " + i);
			}
			s.choiceGrid.value = 4;
			_.addEvent(s.choiceGrid, "change", onChange);
		}
	}

	// Common callback for processing settings changes on drills
	function commonCheckSettings (mod, obj, forceAudio, forceNext) {
		// HIRA LINE
		if (mod.settings.minCharLine && obj == mod.settings.minCharLine) {
			commonUpdateMaxBox (mod);
			commonChangeCharMap (mod);
			mod.showNextChar(forceNext);
		}
		if (mod.settings.maxCharLine && obj == mod.settings.maxCharLine) {
			commonChangeCharMap (mod);
		}
		// Toggle (han)dakuon
		if (mod.settings.dakuon && obj == mod.settings.dakuon) {
			commonChangeCharMap (mod);
			mod.showNextChar(forceNext);
		}
		// Toggle yoon on
		if (mod.settings.yoon && obj == mod.settings.yoon) {
			commonChangeCharMap (mod);
			mod.showNextChar(forceNext);
		}
		// Use Google
		if (mod.settings.useGoogle && obj == mod.settings.useGoogle) {
			// Change the loaded audio
			mod.loadAudio(forceAudio);
		}
	}


	/***************************************************************
	 * Handles modules that drill character-to-voice recognition
	 **************************************************************/
	function Char_toVoice (charMap) {
		JAP.Module.call(this);
		this.charMapSet			= charMap;
		this.changeTimer		= null;
		this.readTimer			= null;
		this.currentCharIndex 	= null;
		this.characterMap		= JAP.buildCharList(charMap, true, false, 1,11);
	}
	Char_toVoice.prototype			= new JAP.Module();
	Char_toVoice.prototype.constructor = Char_toVoice;

	Char_toVoice.prototype.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);
		var self			= this;

		// Now we gain handles on vital components
		this.charDiv		= $cls("random-char-holder", this.node)[0];
		this.playBut		= $cls("play-button", this.node)[0];
		this.nextBut		= $cls("next-button", this.node)[0];

		// Create an audio element
		this.audio			= document.createElement("audio");
		this.audio.className= "nothing";
		this.audio.setAttribute("preload", "preload");
		this.node.appendChild(this.audio);

		this.addSettingsHideToggle();
		// build up the settings
		this.buildSettings();
		this.node.appendChild(this.settings.node);

		// Add event handlers to buttons
		_.addEvent(this.playBut, "click", function () {
			self.playClip();
		});
		_.addEvent(this.nextBut, "click", function () {
			self.showNextChar();
		});
	};

	Char_toVoice.prototype.buildSettings = function() {
		commonBuildSettings(this, {
			"line-range"	: 1,
			"dakuon-check"	: 1,
			"yoon-check"	: 1,
			"auto-timers"	: 1,
			"google-speech"	: 1
		});
	};

	Char_toVoice.prototype.checkSettings = function (obj) {
		var self = this;

		commonCheckSettings (this, obj, false, false);

		// CHANGE DELAY
		if (obj == this.settings.changeDelay) {
			if (this.changeTimer) {
				clearTimeout(this.changeTimer);
			}
			var dt	= this.settings.changeDelay.value;
			
			// If there is a delay
			if (dt != 0) {
				this.changeTimer = setTimeout(function(){self.showNextChar();}, dt);
				var readT		= this.settings.readDelay.value;
				// Repopulate read delay list with valid delays
				this.settings.readDelay.innerHTML="";
				for (var i = 0; i < dt/1000; i+=.25){
					if (i*1000 >= 1000 || i==0) {
						var option = document.createElement("option");
						option.value	= i*1000;
						option.innerHTML = i==0 ? "Never" : i + "s";
						this.settings.readDelay.appendChild(option);
					}
				}
				// check that the read value is less
				if (readT > dt - 1000) {
					readT = dt - 1000;
				}
				this.settings.readDelay.value = readT;
				this.nextBut.setAttribute("disabled","disabled");
			}
			else {
				this.nextBut.removeAttribute("disabled");
			}
		}
		// READ DELAY
		if (obj == this.settings.readDelay) {
			if (this.readTimer) {
				clearTimeout(this.readTimer);
				this.readTimer = null;
			}
		}
	};

	Char_toVoice.prototype.show = function () {
		JAP.Module.prototype.show.call(this);
		this.showNextChar();
	};

	Char_toVoice.prototype.hide = function () {
		JAP.Module.prototype.hide.call(this);
		clearTimeout(this.changeTimer);
		clearTimeout(this.readTimer);
		this.changeTimer = null;
		this.readTimer = null;
		this.audio.pause();
	};
	

	Char_toVoice.prototype.showNextChar = function () {
		var maxV		= this.settings.maxCharLine.value * 5,
			minV		= this.settings.minCharLine.value * 5 - 5,
			last		= this.currentCharIndex,
			chosen		= last,
			self		= this,
			ch;

		pushDrillEvent(this.pageInfo.url);

		if (this.characterMap.length<=1) { // only one option to choose from
			return;
		}
		while (chosen==last) {
			chosen	= parseInt(Math.random() * this.characterMap.length);
		}
		this.currentChar	 	= this.characterMap[chosen];
		this.currentCharIndex 	= chosen;
		this.charDiv.innerHTML 	= this.currentChar.charCode;

		if (this.settings.changeDelay.value > 0) {
			this.changeTimer = setTimeout(function(){self.showNextChar();}, this.settings.changeDelay.value);
		}
		if (this.settings.readDelay.value > 0) {
			this.readTimer = setTimeout(function(){self.playClip();}, this.settings.readDelay.value);
		}
		this.audio.pause();
		this.loadAudio();
	};
	
	Char_toVoice.prototype.loadAudio = commonLoadAudio;

	Char_toVoice.prototype.playClip = function () {
		this.audio.play();
	};


	/***************************************************************
	 * Handles modules that drill voice-to-character recognition
	 **************************************************************/
	function Char_fromVoice (charMap) {
		JAP.Module.call(this);
		this.charMapSet			= charMap;
		this.currentCharCell 	= null;
		this.currentCharIndex 	= null;
		this.characterMap		= JAP.buildCharList(charMap, true, false, 1, 11);
		this.choiceCharacterMap	= JAP.buildCharList(charMap, true, false, 1, 11);
	}
	Char_fromVoice.prototype		= new JAP.Module();
	Char_fromVoice.prototype.constructor = Char_fromVoice;

	Char_fromVoice.prototype.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);
		var self			= this;

		// Now we gain handles on vital components
		this.choiceDiv		= $cls("char-choice-holder", this.node)[0];
		this.playBut		= $cls("play-button", this.node)[0];
		this.nextBut		= $cls("next-button", this.node)[0];
		this.cheatBut		= $cls("cheat-button", this.node)[0];

		// Create an audio element
		this.audio			= document.createElement("audio");
		this.audio.className= "nothing";
		this.audio.setAttribute("preload", "preload");
		this.audio.setAttribute("autoplay", "autoplay");
		this.node.appendChild(this.audio);

		this.addSettingsHideToggle();
		// build up the settings
		this.buildSettings();
		this.node.appendChild(this.settings.node);


		// Add event handlers to buttons
		_.addEvent(this.playBut, "click", function () {
			self.playClip();
		});
		_.addEvent(this.nextBut, "click", function () {
			self.showNextChar();
		});
		_.addEvent(this.cheatBut, "click", function () {
			_.addClass(self.currentCharCell, "cheat-cell");
		});
	};

	Char_fromVoice.prototype.buildSettings = function() {
		commonBuildSettings(this, {
			"line-range"	: 1,
			"dakuon-check"	: 1,
			"yoon-check"	: 1,
			"google-speech"	: 1,
			"choice-grid"	: 1
		});
	};
	
	Char_fromVoice.prototype.checkSettings = function (obj) {
		commonCheckSettings (this, obj, true, false);

		// Char table changed
		if (obj == this.settings.choiceGrid) {
			this.createChoiceTable();
		}
		if (obj == this.settings.dakuon) {
			this.choiceCharacterMap	= JAP.buildCharList(
				this.charMapSet,
				this.settings.dakuon.checked, this.settings.yoon.checked, 1,11);
		}
		if (obj == this.settings.yoon) {
			this.choiceCharacterMap	= JAP.buildCharList(
				this.charMapSet,
				this.settings.dakuon.checked, this.settings.yoon.checked, 1,11);
		}
	};

	Char_fromVoice.prototype.show = function () {
		var self = this;
		JAP.Module.prototype.show.call(this);
		setTimeout(function () {
			self.showNextChar();
		}, 200);
	};

	Char_fromVoice.prototype.hide = function () {
		JAP.Module.prototype.hide.call(this);
		this.audio.pause();
	};

	Char_fromVoice.prototype.showNextChar = function () {
		var maxV		= this.settings.maxCharLine.value * 5,
			minV		= this.settings.minCharLine.value * 5 - 5,
			last		= this.currentCharIndex,
			chosen		= last,
			self		= this,
			ch;
	
		pushDrillEvent(this.pageInfo.url);

		if (this.characterMap.length<=1) { // only one option to choose from
			return;
		}
		while (chosen==last) {
			chosen	= parseInt(Math.random() * this.characterMap.length);
		}
		this.currentChar	 	= this.characterMap[chosen];
		this.currentCharIndex 	= chosen;

		this.createChoiceTable();

		this.audio.pause();
		this.loadAudio(true);
	};

	Char_fromVoice.prototype.createChoiceTable = function () {
		var table = document.createElement("table"),
			row	  = document.createElement("tr"),
			count = this.settings.choiceGrid.value,
			copy  = this.choiceCharacterMap.slice(0),
			self  = this,
			place = parseInt(Math.random() * count * 3);

		// shuffle
		for (var i = copy.length - 1 ; i >= 0; i--) {
			var idx = parseInt(Math.random() * (i+1)),
				tmp = copy[idx];
			copy[idx] = copy[i];
			copy[i]	  = tmp;
		}
		// create the table element of count x 3 elements where count
		// is the chosen "size"/difficulty
		for (var i = 0, j = 0; i < count * 3; i++, j++) {

			if (i % (count)==0) {
				table.appendChild(row);
				row = document.createElement("tr");
			}
			var cell = document.createElement("td");
			if (i==place) {
				// This is where to insert the correct answer
				cell.innerHTML = this.currentChar.charCode;
				this.currentCharCell = cell;
				_.addEvent(cell, "click", function(e) {
					self.showNextChar();
				});
			}
			else {
				// Fill it with a random char
				if (this.currentChar.charCode==copy[j].charCode) j++;
				cell.innerHTML = copy[j].charCode;
				_.addEvent(cell, "click", function(e) {
					var evt = e || window.event, target = evt.target || evt.srcElement;
					_.addClass(target, "wrong-cell");
				});
			}
			row.appendChild(cell);
		}
		table.appendChild(row);
		this.choiceDiv.innerHTML = "";
		this.choiceDiv.appendChild(table);
	};
	
	Char_fromVoice.prototype.loadAudio = commonLoadAudio;

	Char_fromVoice.prototype.playClip = function () {
		this.audio.play();
	};

	/***************************************************************
	 * Handles modules that drill voice-to-writing recognition
	 **************************************************************/
	function Char_writeTest (charMap) {
		JAP.Module.call(this);
		this.charMapSet			= charMap;
		this.charIsShown 		= false;
		this.currentCharIndex 	= null;
		this.characterMap		= JAP.buildCharList(charMap, true, false, 1,11);
		this.currentChar		= null;
	}
	Char_writeTest.prototype		= new JAP.Module();
	Char_writeTest.prototype.constructor = Char_writeTest;

	Char_writeTest.prototype.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);
		var self			= this;

		// Now we gain handles on vital components
		this.charDiv		= $cls("random-char-holder", this.node)[0];
		this.playBut		= $cls("play-button", this.node)[0];
		this.nextBut		= $cls("next-button", this.node)[0];
		this.eraseBut		= $cls("erase-button", this.node)[0];
		this.canvas			= $tag("canvas", this.node)[0];
		this.bindCanvasEvents();

		if (!this.canvas.getContext) {
			this.node.removeChild(this.eraseBut);
		}

		// Create an audio element
		this.audio			= document.createElement("audio");
		this.audio.className= "nothing";
		this.audio.setAttribute("preload", "preload");
		this.node.appendChild(this.audio);

		// Link for video
		this.vidLink			= document.createElement("a");
		this.vidLink.target		= "_blank";
		this.node.appendChild(this.vidLink);

		this.addSettingsHideToggle();
		// build up the settings
		this.buildSettings();
		this.node.appendChild(this.settings.node);


		// Add event handlers to buttons
		_.addEvent(this.playBut, "click", function () {
			self.playClip();
		});
		_.addEvent(this.nextBut, "click", function () {
			self.showNextChar();
		});
		_.addEvent(this.eraseBut, "click", function () {
			self.eraseCanvas();
		});
	};

	Char_writeTest.prototype.resize = function () {
		JAP.Module.prototype.resize.call(this);
	};

	Char_writeTest.prototype.buildSettings = function() {
		commonBuildSettings(this, {
			"line-range"	: 1,
			"dakuon-check"	: 1,
			"yoon-check"	: 1,
			"google-speech"	: 1
		});
	};
	
	Char_writeTest.prototype.checkSettings = function (obj) {
		commonCheckSettings (this, obj, true, true);
	};

	Char_writeTest.prototype.show = function () {
		JAP.Module.prototype.show.call(this);
		this.showNextChar(true);
	};

	Char_writeTest.prototype.hide = function () {
		JAP.Module.prototype.hide.call(this);
		this.audio.pause();
	};

	Char_writeTest.prototype.showNextChar = function (force) {
		var maxV		= this.settings.maxCharLine.value * 5,
			minV		= this.settings.minCharLine.value * 5 - 5,
			last		= this.currentCharIndex,
			chosen		= last,
			self		= this,
			ch;

		pushDrillEvent(this.pageInfo.url);

		if (this.isCharShown || force) {
			this.isCharShown = false;
			_.addClass(this.charDiv, "covered");
			this.nextBut.innerHTML = "Show";		
			this.eraseCanvas();

			if (this.characterMap.length<=1) { // only one option to choose from
				return;
			}
			while (chosen==last) {
				chosen	= parseInt(Math.random() * this.characterMap.length);
			}
			this.currentChar	 	= this.characterMap[chosen];
			this.currentCharIndex 	= chosen;
			this.charDiv.innerHTML 	= this.currentChar.charCode;

			this.vidLink.href		= "http://www.youtube.com/results?search_query=%22How+to+write+Hiragana+%E3%80%8C+"+encodeURIComponent(this.currentChar.character)+"+%E3%80%8D+%22+STROKE+ORDER";
			this.vidLink.innerHTML	= "Videos on Writing this character";

			this.audio.pause();
			this.loadAudio(true);
		}
		else {
			this.isCharShown = true;
			_.removeClass(this.charDiv , "covered");
			this.nextBut.innerHTML = "Next";		
		}
	};

	
	Char_writeTest.prototype.loadAudio = commonLoadAudio;

	Char_writeTest.prototype.playClip = function () {
		this.audio.play();
	};

	Char_writeTest.prototype.bindCanvasEvents = function () {
		if (this.canvas.getContext) {
			var ctx = this.canvas.getContext('2d'),
				self= this,
				cur, last,
				hasTouch = null,
				last= null;

			ctx.strokeStyle = "#000";
			ctx.lineWidth	= 1;
			ctx.lineJoin	= "round";

			var segments = [];

			function onMouseDown (e) {
				var evt 	= e || window.event,
					scroll	= _.getScrollXY(),
					topleft	= _.getAbsolutePosition(self.canvas);
				if (evt.type=="touchstart") {
					if (evt.targetTouches.length == 1 && !hasTouch) {
						hasTouch = evt.targetTouches[0].identifier;
						_.addEvent(document, "touchend", onMouseUp);
						_.addEvent(document, "touchmove", onMouseMove);
						last = {
							x:	evt.targetTouches[0].clientX + scroll[0] - topleft[0],
							y:	evt.targetTouches[0].clientY + scroll[1] - topleft[1]
						};
					}
				}
				else {
					_.addEvent(document, "mouseup", onMouseUp);
					_.addEvent(document, "mousemove", onMouseMove);
					last = {
						x:	evt.clientX - topleft[0],
						y:	evt.clientY - topleft[1]
					};
				}
				segments = [];
				ctx.beginPath();
				ctx.moveTo(last.x, last.y);
				segments.push(last);
				return _.cancelEvent(evt);
			}
			function onMouseUp (e) {
				var evt = e || window.event,
					scroll	= _.getScrollXY(),
					topleft	= _.getAbsolutePosition(self.canvas);
				if (evt.type == "touchend") {
					console.log("end");
					for (var i = 0; i < evt.changedTouches.length; i++) {
						if (evt.changedTouches[i].identifier==hasTouch) {
							cur = {
								x:	evt.changedTouches[i].clientX + scroll[0] - topleft[0],
								y:	evt.changedTouches[i].clientY + scroll[1] - topleft[1]
							};
							_.removeEvent(document, "touchend", onMouseUp);
							_.removeEvent(document, "touchmove", onMouseMove);
							hasTouch = null;
							console.log("cancelled");
						}
					}
				}
				else {
					cur = {
						x:	evt.clientX - topleft[0],
						y:	evt.clientY - topleft[1]
					};
				}
				ctx.lineTo(cur.x, cur.y);
				segments.push(cur);
				_.removeEvent(document, "mouseup", onMouseUp);
				_.removeEvent(document, "mousemove", onMouseMove);

				ctx.lineWidth=4;
				ctx.beginPath();
				ctx.moveTo(segments[0].x, segments[0].y);
				segments.shift();
				while(segments.length>0) {
					var s = segments.shift();
					ctx.lineTo(s.x, s.y);
				}
				ctx.stroke();
				ctx.lineWidth=1;
				return _.cancelEvent(evt);
			}
			function onMouseMove (e) {
				var evt = e || window.event,
					scroll	= _.getScrollXY(),
					topleft	= _.getAbsolutePosition(self.canvas);
				if (evt.type == "touchmove") {
					for (var i = 0; i < evt.changedTouches.length; i++) {
						if (evt.changedTouches[i].identifier==hasTouch) {
							cur = {
								x:	evt.targetTouches[0].clientX + scroll[0] - topleft[0],
								y:	evt.targetTouches[0].clientY + scroll[1] - topleft[1]
							};
						}
					}
				}
				else {
					cur = {
						x:	evt.clientX - topleft[0],
						y:	evt.clientY - topleft[1]
					};
				}
				ctx.lineTo(cur.x, cur.y);
				ctx.stroke();
				last = cur;
				segments.push(cur);
				return _.cancelEvent(evt);
			}
			_.addEvent(this.canvas, "mousedown", onMouseDown);
			_.addEvent(this.canvas, "touchstart", onMouseDown);
		}
	};

	Char_writeTest.prototype.eraseCanvas = function () {
		if (this.canvas.getContext) {
			var ctx = this.canvas.getContext('2d');
			ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		}
	};

	/***************************************************************
	 * Handles modules that drill character-to-character recognition
	 **************************************************************/
	function Char_fromChar (charMap) {
		JAP.Module.call(this);
		this.charMapSet			= charMap;
		this.currentCharCell 	= null;
		this.characterMap		= JAP.buildCharList(charMap, true, false, 1,11);
		this.characterMapTo		= JAP.buildCharList(charMap=="hiragana"?"katakana":"hiragana", true, false, 1, 11);
		this.currentCharIndex 	= null;
		this.currentChar		= null;
	}
	Char_fromChar.prototype		= new JAP.Module();
	Char_fromChar.prototype.constructor = Char_fromChar;

	Char_fromChar.prototype.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);
		var self			= this;

		// Now we gain handles on vital components
		this.charDiv		= $cls("random-char-holder", this.node)[0];
		this.choiceDiv		= $cls("char-choice-holder", this.node)[0];
		this.playBut		= $cls("play-button", this.node)[0];
		this.nextBut		= $cls("next-button", this.node)[0];
		this.cheatBut		= $cls("cheat-button", this.node)[0];

		// Create an audio element
		this.audio			= document.createElement("audio");
		this.audio.className= "nothing";
		this.audio.setAttribute("preload", "preload");
		this.audio.setAttribute("autoplay", "autoplay");
		this.node.appendChild(this.audio);

		this.addSettingsHideToggle();
		// build up the settings
		this.buildSettings();
		this.node.appendChild(this.settings.node);


		// Add event handlers to buttons
		_.addEvent(this.playBut, "click", function () {
			self.playClip();
		});
		_.addEvent(this.nextBut, "click", function () {
			self.showNextChar();
		});
		_.addEvent(this.cheatBut, "click", function () {
			_.addClass(self.currentCharCell, "cheat-cell");
		});
	};

	Char_fromChar.prototype.buildSettings = function() {
		commonBuildSettings(this, {
			"line-range"	: 1,
			"dakuon-check"	: 1,
			"yoon-check"	: 1,
			"google-speech"	: 1,
			"choice-grid"	: 1
		});
	};
	
	Char_fromChar.prototype.checkSettings = function (obj) {
		commonCheckSettings (this, obj, false, false);

		// Toggle (han)dakuon
		if (obj == this.settings.dakuon || obj == this.settings.yoon) {
			// refresh option table too
			this.characterMapTo		= JAP.buildCharList(
				this.charMapSet=="hiragana"?"katakana":"hiragana", 
				this.settings.dakuon.checked, this.settings.yoon.checked, 1,11);

			this.showNextChar();
		}
		// Char table changed
		if (obj == this.settings.choiceGrid) {
			this.createChoiceTable();
		}
	};

	Char_fromChar.prototype.show = function () {
		var self = this;
		JAP.Module.prototype.show.call(this);
		setTimeout(function () {
			self.showNextChar();
		}, 200);
	};

	Char_fromChar.prototype.hide = function () {
		JAP.Module.prototype.hide.call(this);
		this.audio.pause();
	};

	Char_fromChar.prototype.showNextChar = function () {
		var maxV		= this.settings.maxCharLine.value * 5,
			minV		= this.settings.minCharLine.value * 5 - 5,
			last		= this.currentCharIndex,
			chosen		= last,
			self		= this;

		pushDrillEvent(this.pageInfo.url);

		if (this.characterMap.length<=1) { // only one option to choose from
			return;
		}
		while (chosen==last) {
			chosen	= parseInt(Math.random() * this.characterMap.length);
		}
		this.currentChar	 	= this.characterMap[chosen];
		this.currentCharIndex 	= chosen;
		this.charDiv.innerHTML	= this.currentChar.charCode;

		this.createChoiceTable();

		this.audio.pause();
		this.loadAudio();
	};

	Char_fromChar.prototype.createChoiceTable = function () {
		var table = document.createElement("table"),
			row	  = document.createElement("tr"),
			count = this.settings.choiceGrid.value,
			copy  = this.characterMapTo.slice(0),
			self  = this,
			place = parseInt(Math.random() * count * 3);

		// shuffle
		for (var i = copy.length - 1 ; i >= 0; i--) {
			var idx = parseInt(Math.random() * (i+1)),
				tmp = copy[idx];
			copy[idx] = copy[i];
			copy[i]	  = tmp;
		}
		// fill the table
		for (var i = 0, j = 0; i < count * 3; i++, j++) {

			if (i % (count)==0) {
				table.appendChild(row);
				row = document.createElement("tr");
			}
			var cell = document.createElement("td");
			if (i==place) {
				// place to insert the correct answer
				cell.innerHTML = this.currentChar.corresponding;
				this.currentCharCell = cell;
				_.addEvent(cell, "click", function(e) {
					self.showNextChar();
				});
			}
			else {
				if (this.currentChar.corresponding==copy[j].charCode) j++;
				cell.innerHTML =  copy[j].charCode;
				_.addEvent(cell, "click", function(e) {
					var evt = e || window.event, target = evt.target || evt.srcElement;
					_.addClass(target, "wrong-cell");
				});
			}
			row.appendChild(cell);
		}
		table.appendChild(row);
		this.choiceDiv.innerHTML = "";
		this.choiceDiv.appendChild(table);
	};
	
	Char_fromChar.prototype.loadAudio = commonLoadAudio;

	Char_fromChar.prototype.playClip = function () {
		this.audio.play();
	};

	// PUSH AN EVENT TO ANALYTICS 
	function pushDrillEvent (label) {
		label = label.substr(label.lastIndexOf("/",label.lastIndexOf("/")-1)+1);
		if (location.href.indexOf("nihongodrills.com") != -1) {
		//	console.log("Pushing drill event for: "+label);
			_gaq.push(["_trackEvent", "Drill", "Next", label]);
		}
	}

	// Export to outside
	ns.Char_toVoice 		= Char_toVoice;
	ns.Char_fromVoice 		= Char_fromVoice;
	ns.Char_writeTest 		= Char_writeTest;
	ns.Char_fromChar 		= Char_fromChar;

})(JAP.namespace("JAP.abs"));

