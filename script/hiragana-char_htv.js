
(function (ns) {

	var _ = JAP.util;
	

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
		this.node.appendChild(this.audio);
	};

	CharHTV.prototype.buildSettings = function() {
		var s = this.settings;
		s.hiraLine		= s.createElem("select", "hira-whtv-line", "Max hiragana line", "Setting this will allow you to limit the possible characters in the test. If you only know the first three lines of hiragana, choose 3.");
		s.changeDelay	= s.createElem("select", "hira-whtv-change", "Auto change delay", "This will set the characters to change automatically after the given period of time.");
		s.readDelay		= s.createElem("select", "hira-whtv-read", "Auto read delay", "The correct pronunciation will automatically be played after the chosen period of time");
		s.useGoogle		= s.createElem("input",  "hira-whtv-speech", "Use Google speech", "Check this to use Google's pronunciation rather than the default audio clips.");

		s.useGoogle.type= "checkbox";
		_.addEvent(s.useGoogle, "change", function (e) {
			if (s.useGoogle.checked) {
			}
		});

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
		for (var i = 0; i < 10; i++) {
			option = document.createElement("option");
			option.value = i+1;
			option.innerHTML = i+1;
			s.hiraLine.appendChild(option);
		}
	};

	CharHTV.prototype.show = function () {
		ns.Module.prototype.show.call(this);
		this.showNextChar();
	};

	CharHTV.prototype.showNextChar = function () {
		var max			= this.settings.hiraLine.value * 5,
			chosen		= 0,
			self		= this,
			ch;

		while (chosen==0) {
			chosen	= parseInt(Math.random() * max);
		}
		ch = ns.UNICODE_MAP[chosen];
		this.charDiv.innerHTML = "&#"+ch+";";

		if (this.settings.changeDelay.value > 0) {
			this.changeTimer = setTimeout(function(){self.showNextChar();}, this.settings.changeDelay.value);
		}
		if (this.settings.readDelay.value > 0) {
			this.readTimer = setTimeout(function(){self.playClip();}, this.settings.readDelay.value);
		}

		this.audio.src = "http://translate.google.com/translate_tts?ie=UTF-8&tl=ja&q=" + encodeURIComponent(String.fromCharCode(ch));
	};

	CharHTV.prototype.playClip = function () {
		this.audio.play();
	};

	ns.CharHTV = CharHTV;
}) (JAP.namespace("JAP.hira.mods"));

