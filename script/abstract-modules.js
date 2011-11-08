
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
			}
			self.playBut.innerHTML = "Play Again";
		});
		
		if (this.settings.useGoogle.checked) {
			var src1	= document.createElement("source");

			src1.src = "ajax/get_audio.php?tl=ja&text=" + encodeURIComponent(String.fromCharCode(this.currentCharCode));
			this.audio.appendChild(src1);
		}
		else {
			var filename = "hiragana_"+pad(parseInt(this.currentCharIndex/5)+1)+"_"+pad(this.currentCharIndex%5+1);
			var src1	= document.createElement("source");
			var src2	= document.createElement("source");

			src1.src	= "res/audio/ogg/"+filename+".ogg";
			src2.src	= "res/audio/mp3/"+filename+".mp3";
			this.audio.appendChild(src1);
			this.audio.appendChild(src2);
		}
	}


	/***************************************************************
	 * Handles modules that drill character-to-voice recognition
	 **************************************************************/
	function Char_toVoice (charMap) {
		JAP.Module.call(this);
		this.changeTimer		= null;
		this.readTimer			= null;
		this.currentCharCode	= null;
		this.currentCharIndex 	= null;
		this.characterMap		= charMap;
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
		var s 	= this.settings,
			self= this;
		s.minHiraLine		= s.createElem("select", "hira-chtv-line-min", "Min hiragana line", "Lets you omit beginning lines of hiragana that you may know. For example, to omit the vowels, set this to 2.");
		s.maxHiraLine		= s.createElem("select", "hira-chtv-line", "Max hiragana line", "Setting this will allow you to limit the possible characters in the test. If you only know the first three lines of hiragana, choose 3: Characters on lines above 3 will not appear.");
		s.changeDelay	= s.createElem("select", "hira-chtv-change", "Auto change delay", "This will set the characters to change automatically after the given period of time.");
		s.readDelay		= s.createElem("select", "hira-chtv-read", "Auto read delay", "The correct pronunciation will automatically be played after the chosen period of time");
		s.useGoogle		= s.createElem("input",  "hira-chtv-speech", "Use Google speech", "Check this to use Google's pronunciation rather than the default audio clips.", true);

		// Add delays
		var option 		= document.createElement("option");
		option.value	= 0;
		option.innerHTML= "Never";
		s.changeDelay.appendChild(option);
		for (var i = 1; i < 5; i+=.5){
			option = document.createElement("option");
			option.innerHTML = i + "s";
			option.value	= i*1000;
			s.changeDelay.appendChild(option);
		}
		option 			= document.createElement("option");
		option.value	= 0;
		option.innerHTML= "Never";
		s.readDelay.appendChild(option);
		for (var i = .25; i < 2; i+=.25){
			option = document.createElement("option");
			option.value	= i*1000;
			option.innerHTML = i + "s";
			s.readDelay.appendChild(option);
		}
		// Hira Line
		for (var i = 0; i < MAX_LINE; i++) {
			option = document.createElement("option");
			option.value = i+1;
			option.innerHTML = LINE_LETTERS[i].length>0 ? i+1 + " ("+LINE_LETTERS[i]+")" : i+1 +"";
			s.minHiraLine.appendChild(option);
		}
		for (var i = 0; i < MAX_LINE; i++) {
			option = document.createElement("option");
			option.value = i+1;
			option.innerHTML = LINE_LETTERS[i].length>0 ? i+1 + " ("+LINE_LETTERS[i]+")" : i+1 +"";
			s.maxHiraLine.appendChild(option);
		}
		
		// Bind the listener
		function onChange (e) {
			var evt = e || window.event;
			self.checkSettings(evt.target || evt.srcElement);
		}

		_.addEvent(s.changeDelay, "change", onChange);
		_.addEvent(s.readDelay, "change", onChange);
		_.addEvent(s.minHiraLine, "change", onChange);
		_.addEvent(s.maxHiraLine, "change", onChange);
		_.addEvent(s.useGoogle, "change", onChange);
	};

	Char_toVoice.prototype.checkSettings = function (obj) {
		var self = this;
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
			}
		}
		// READ DELAY
		if (obj == this.settings.readDelay) {
			if (this.readTimer) {
				clearTimeout(this.readTimer);
				this.readTimer = null;
			}
		}
		// HIRA LINE
		if (obj == this.settings.minHiraLine) {
			var minV = this.settings.minHiraLine.value,
				maxV = this.settings.maxHiraLine.value;
			
			// repopulate max vals with valids
			this.settings.maxHiraLine.innerHTML = "";
			for (var i = minV-1; i < MAX_LINE; i++) {
				option = document.createElement("option");
				option.value = i+1;
				option.innerHTML = i+1 + " ("+LINE_LETTERS[i]+")";
				this.settings.maxHiraLine.appendChild(option);
			}

			if (maxV >= minV) {
				this.settings.maxHiraLine.value = maxV;
			}
		}
		// Use Google
		if (obj == this.settings.useGoogle) {
			// Change the loaded audio
			this.loadAudio();
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
	};
	

	Char_toVoice.prototype.showNextChar = function () {
		var maxV		= this.settings.maxHiraLine.value * 5,
			minV		= this.settings.minHiraLine.value * 5 - 5,
			last		= this.currentCharIndex,
			chosen		= last,
			self		= this,
			ch;

		if (minV == maxV - 5 && maxV/5 == 11 && chosen==minV) { // only one option to choose from
			return;
		}
		var range = maxV - minV;
		while (this.characterMap[chosen]==0 || chosen==last) {
			chosen	= parseInt(Math.random() * range + minV);
		}
		ch = this.characterMap[chosen];
		this.charDiv.innerHTML = "&#"+ch+";";
		this.currentCharIndex 	= chosen;
		this.currentCharCode	= ch;

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
		this.currentCharCell 	= null;
		this.characterMap		= charMap;
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
		var s 	= this.settings,
			self= this;
		s.minHiraLine		= s.createElem("select", "hira-cvth-line-min", "Min hiragana line", "Lets you omit beginning lines of hiragana that you may know. For example, to omit the vowels, set this to 2.");
		s.maxHiraLine		= s.createElem("select", "hira-cvth-line", "Max hiragana line", "Setting this will allow you to limit the possible characters in the test. If you only know the first three lines of hiragana, choose 3: Characters on lines above 3 will not appear.");
		s.useGoogle			= s.createElem("input",  "hira-cvth-speech", "Use Google speech", "Check this to use Google's pronunciation rather than the default audio clips.", true);
		s.difficulty		= s.createElem("select", "hira-cvth-difficulty", "Choice grid", "Affects the number of possible characters shown");

		function addOption (sel, val, label) {
			var opt  = document.createElement("option");
			opt.value = val;
			opt.innerHTML = label;
			sel.appendChild(opt);
		}

		addOption(s.difficulty, 1, "3 x 1");
		addOption(s.difficulty, 2, "3 x 2");
		addOption(s.difficulty, 3, "3 x 3");
		addOption(s.difficulty, 4, "3 x 4");
		addOption(s.difficulty, 5, "3 x 5");
		addOption(s.difficulty, 6, "3 x 6");
		s.difficulty.value = 4;

		// Hira Line
		for (var i = 0; i < MAX_LINE; i++) {
			addOption(s.minHiraLine, i+1, LINE_LETTERS[i].length>0 ? i+1 + " ("+LINE_LETTERS[i]+")" : i+1 +"");
		}
		for (var i = 0; i < MAX_LINE; i++) {
			addOption(s.maxHiraLine, i+1, LINE_LETTERS[i].length>0 ? i+1 + " ("+LINE_LETTERS[i]+")" : i+1 +"");
		}
		
		// Bind the listener
		function onChange (e) {
			var evt = e || window.event;
			self.checkSettings(evt.target || evt.srcElement);
		}
		_.addEvent(s.minHiraLine, "change", onChange);
		_.addEvent(s.maxHiraLine, "change", onChange);
		_.addEvent(s.useGoogle, "change", onChange);
		_.addEvent(s.difficulty, "change", onChange);
	};
	
	Char_fromVoice.prototype.checkSettings = function (obj) {
		var self = this;
		// HIRA LINE
		if (obj == this.settings.minHiraLine) {
			var minV = this.settings.minHiraLine.value,
				maxV = this.settings.maxHiraLine.value;
			
			// repopulate max vals with valids
			this.settings.maxHiraLine.innerHTML = "";
			for (var i = minV-1; i < MAX_LINE; i++) {
				option = document.createElement("option");
				option.value = i+1;
				option.innerHTML = i+1 + " ("+LINE_LETTERS[i]+")";
				this.settings.maxHiraLine.appendChild(option);
			}

			if (maxV >= minV) {
				this.settings.maxHiraLine.value = maxV;
			}
			this.showNextChar();
		}
		// Char table changed
		if (obj == this.settings.difficulty) {
			this.createChoiceTable();
		}
		// Use Google
		if (obj == this.settings.useGoogle) {
			// Change the loaded audio
			this.loadAudio();
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
	};

	Char_fromVoice.prototype.showNextChar = function () {
		var maxV		= this.settings.maxHiraLine.value * 5,
			minV		= this.settings.minHiraLine.value * 5 - 5,
			last		= this.currentCharIndex,
			chosen		= last,
			region		= this.characterMap.slice(minV, maxV),
			self		= this,
			ch;

		if (minV == maxV - 5 && maxV/5 == 11 && chosen==minV) { // only one option to choose from
			return;
		}
		var range = maxV - minV;
		while (this.characterMap[chosen]==0 || chosen==last) {
			chosen	= parseInt(Math.random() * range + minV);
		}
		ch = this.characterMap[chosen];
		this.currentCharIndex 	= chosen;
		this.currentCharCode	= ch;

		this.createChoiceTable();

		this.audio.pause();
		this.loadAudio();
	};

	Char_fromVoice.prototype.createChoiceTable = function () {
		var table = document.createElement("table"),
			row	  = document.createElement("tr"),
			count = this.settings.difficulty.value,
			copy  = this.characterMap.slice(0),
			self  = this,
			place = parseInt(Math.random() * count * 3);

		for (var i = copy.length - 1 ; i >= 0; i--) {
			var idx = parseInt(Math.random() * (i+1)),
				tmp = copy[idx];
			copy[idx] = copy[i];
			copy[i]	  = tmp;
		}
		for (var i = 0, j = 0; i < count * 3; i++, j++) {

			if (i % (count)==0) {
				table.appendChild(row);
				row = document.createElement("tr");
			}
			var cell = document.createElement("td");
			if (i==place) {
				cell.innerHTML = "&#" + this.currentCharCode + ";";
				this.currentCharCell = cell;
				_.addEvent(cell, "click", function(e) {
					self.showNextChar();
				});
			}
			else {
				while (this.currentCharCode==copy[j] || copy[j]==0) j++;
				cell.innerHTML = "&#" + copy[j] + ";";
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
	function Char_writeTest () {
		JAP.Module.call(this);
	}
	Char_writeTest.prototype		= new JAP.Module();
	Char_writeTest.prototype.constructor = Char_writeTest;

	Char_writeTest.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);
	};

	// Export to outside
	ns.Char_toVoice 		= Char_toVoice;
	ns.Char_fromVoice 		= Char_fromVoice;
	ns.Char_writeTest 		= Char_writeTest;

})(JAP.namespace("JAP.abstract"));

