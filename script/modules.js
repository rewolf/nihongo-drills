(function (ns) {

	var _ 			= JAP.util;

	var MAX_LINE = 11,
		LINE_LETTERS = ["", "k", "s", "t", "n", "h", "m", "y", "r", "w","ng"];

	/***************************************************************
	 * Character - Hiragana - to voice
	 **************************************************************/
	function Char_Hira_toVoice () {
		JAP.Module.call(this);
	}
	Char_Hira_toVoice.prototype			= new JAP.Module();
	Char_Hira_toVoice.prototype.constructor = Char_Hira_toVoice;
	// Set this to identify this class for handling the following hash url
	Char_Hira_toVoice.pageHash			= "#!/character-drills/hiragana/to-voice";

	Char_Hira_toVoice.prototype.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);

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
	};

	Char_Hira_toVoice.prototype.buildSettings = function() {
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

	Char_Hira_toVoice.prototype.checkSettings = function (obj) {
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
				for (var i = 0; i < 2; i+=.25){
					if (i*1000 <= dt - 1000) {
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


	/***************************************************************
	 * Character - Hiragana - from voice
	 **************************************************************/
	function Char_Hira_fromVoice () {
		JAP.Module.call(this);
	}
	Char_Hira_fromVoice.prototype		= new JAP.Module();
	Char_Hira_toVoice.prototype.constructor = Char_Hira_fromVoice;
	Char_Hira_fromVoice.pageHash		= "#!/character-drills/hiragana/from-voice";

	Char_Hira_fromVoice.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);
	};

	/***************************************************************
	 * Character - Hiragana - write test
	 **************************************************************/
	function Char_Hira_writeTest () {
		JAP.Module.call(this);
	}
	Char_Hira_writeTest.prototype		= new JAP.Module();
	Char_Hira_toVoice.prototype.constructor = Char_Hira_writeTest;
	Char_Hira_writeTest.pageHash		= "#!/character-drills/hiragana/write-test";

	Char_Hira_writeTest.setup = function (html) {
		JAP.Module.prototype.setup.call(this, html);
	};

	// Export to outside
	ns.Char_Hira_toVoice 		= Char_Hira_toVoice;
	ns.Char_Hira_fromVoice 		= Char_Hira_fromVoice;
	ns.Char_Hira_writeTest 		= Char_Hira_writeTest;

})(JAP.namespace("JAP.mods"));

