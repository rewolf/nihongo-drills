
(function (ns) {

	var _ = JAP.util;
	
	var MAX_LINE = 10,
		LINE_LETTERS = ["vowels", "k", "s", "t", "n", "h", "m", "y", "r", "w","ng"];
	

	/***********************************************************
	 * Module for drill
	 ***********************************************************/
	function CharHTV () {
		this.build();

		this.changeTimer = null;
		this.readTimer	 = null;
	}
	CharHTV.prototype = new JAP.hira.mods.Module();

	CharHTV.prototype.build = function () {
		var self = this;
		this.node.id	= "module-char-htv";
		this.buildSettings();

		// title
		this.title			= document.createElement("h1");
		this.title.innerHTML= "Pronounce this character";
		this.node.appendChild(this.title);

		// instruction
		this.instruction	= document.createElement("p");
		this.instruction.className = "module-instruction";
		this.instruction.innerHTML = 
			"This drill displays random characters which you must pronounce.  You can check "+
			"if you were correct by clicking the <i>play</i> button.  The settings to the "+
			"right can be used to automate the <i>playing</i>/<i>reading</i> and the " +
			"changing to the next character.";
		this.node.appendChild(this.instruction);

		// plaque/sign
		this.charDiv		= document.createElement("div");
		this.charDiv.className= "random-char-holder";
		this.node.appendChild(this.charDiv);

		// play button
		this.playBut		= document.createElement("button");
		this.playBut.className = "play-button";
		this.playBut.innerHTML = "Play";
		this.node.appendChild(this.playBut);
		_.addEvent(this.playBut, "click", function () {
			self.playClip();
		});

		// next button
		this.nextBut		= document.createElement("button");
		this.nextBut.className = "next-button";
		this.nextBut.innerHTML = "Next";
		this.node.appendChild(this.nextBut);
		_.addEvent(this.nextBut, "click", function () {
			self.showNextChar();
		});

		// audio
		this.audio			= document.createElement("audio");
		this.audio.className= "nothing";
		this.audio.setAttribute("preload", "preload");
		this.node.appendChild(this.audio);
	};

	CharHTV.prototype.buildSettings = function() {
		var s 	= this.settings,
			self= this;
		s.minHiraLine		= s.createElem("select", "hira-whtv-line-min", "Min hiragana line", "Lets you omit beginning lines of hiragana that you may know. For example, to omit the vowels, set this to 2.");
		s.maxHiraLine		= s.createElem("select", "hira-whtv-line", "Max hiragana line", "Setting this will allow you to limit the possible characters in the test. If you only know the first three lines of hiragana, choose 3: Characters on lines above 3 will not appear.");
		s.changeDelay	= s.createElem("select", "hira-whtv-change", "Auto change delay", "This will set the characters to change automatically after the given period of time.");
		s.readDelay		= s.createElem("select", "hira-whtv-read", "Auto read delay", "The correct pronunciation will automatically be played after the chosen period of time");
		s.useGoogle		= s.createElem("input",  "hira-whtv-speech", "Use Google speech", "Check this to use Google's pronunciation rather than the default audio clips.");

		s.useGoogle.type= "checkbox";

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
			option.innerHTML = i+1 + " ("+LINE_LETTERS[i]+")";
			s.minHiraLine.appendChild(option);
		}
		for (var i = 0; i < MAX_LINE; i++) {
			option = document.createElement("option");
			option.value = i+1;
			option.innerHTML = i+1 + " ("+LINE_LETTERS[i]+")";
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
	
	CharHTV.prototype.checkSettings = function (obj) {
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
					if (i*1000 <= dt - 500) {
						var option = document.createElement("option");
						option.value	= i*1000;
						option.innerHTML = i==0 ? "Never" : i + "s";
						this.settings.readDelay.appendChild(option);
					}
				}
				// check that the read value is less
				if (readT > dt - 500) {
					readT = dt - 500;
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
		}
		// Use Google
		if (obj == this.settings.useGoogle) {
			// Change the loaded audio
			this.loadAudio();
		}
	};

	CharHTV.prototype.show = function () {
		ns.Module.prototype.show.call(this);
		this.showNextChar();
	};

	CharHTV.prototype.showNextChar = function () {
		var maxV		= this.settings.maxHiraLine.value * 5,
			minV		= this.settings.minHiraLine.value * 5 - 5,
			chosen		= 0,
			last		= this.currentCharIndex,
			self		= this,
			ch;

		var range = maxV - minV;
		while (ns.UNICODE_MAP[chosen]==0 || chosen==last) {
			chosen	= parseInt(Math.random() * range + minV);
		}
		ch = ns.UNICODE_MAP[chosen];
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
	
	CharHTV.prototype.loadAudio = function () {
		function pad(n) {
			return n<10?"0"+n:n;
		}
		
		this.audio.innerHTML ="";
		
		if (this.settings.useGoogle.checked) {
			var src1	= document.createElement("source");
			src1.src = "get_audio.php?tl=ja&text=" + encodeURIComponent(String.fromCharCode(this.currentCharCode));
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
	};

	CharHTV.prototype.playClip = function () {
		this.audio.play();
	};

	ns.CharHTV = CharHTV;
}) (JAP.namespace("JAP.hira.mods"));

