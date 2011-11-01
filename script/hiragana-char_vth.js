
(function (ns) {

	var _ = JAP.util;
	
	var MAX_LINE = 11,
		LINE_LETTERS = ["", "k", "s", "t", "n", "h", "m", "y", "r", "w","ng"];
	

	/***********************************************************
	 * Module for drill
	 ***********************************************************/
	function CharVTH () {
		this.build();
	}
	CharVTH.prototype = new JAP.hira.mods.Module();

	CharVTH.prototype.build = function () {
		var self = this;
		this.node.id	= "drill-char-htv";
		this.buildSettings();

		// title
		this.title			= document.createElement("h1");
		this.title.innerHTML= "Choose the character matching the sound";
		this.node.appendChild(this.title);

		// instruction
		this.instruction	= document.createElement("p");
		this.instruction.className = "drill-instruction";
		this.instruction.innerHTML = 
			"This drill plays an audio clip of a random japanese syllable/sound.  You must "+
			"choose the corresponding hiragana character from the possibilities in the table below. Once the "+
			"correct character is chosen, the next sound will play. The settings to the " +
			"right can be used to use Google's alternate audio voice or to limit the range " +
			"of characters being tested.";
		this.node.appendChild(this.instruction);

		// play button
		this.playBut		= document.createElement("button");
		this.playBut.className = "play-button";
		this.playBut.innerHTML = "Play Again";
		//this.node.appendChild(this.playBut);
		_.addEvent(this.playBut, "click", function () {
			self.playClip();
		});

		this.appendButton(this.playBut);

		// holder for table of choices
		this.choiceDiv		= document.createElement("div");
		this.choiceDiv.className= "char-choice-holder";
		this.node.appendChild(this.choiceDiv);

		// cheat button
		this.cheatBut			= document.createElement("button");
		this.cheatBut.className = "cheat-button drill-button";
		this.cheatBut.innerHTML = "Cheat";
		_.addEvent(this.cheatBut, "click", function () {
			_.addClass(self.currentCharCell, "cheat-cell");
		});
		this.appendButton(this.cheatBut, true);

		// next button
		this.nextBut		= document.createElement("button");
		this.nextBut.className = "next-button";
		this.nextBut.innerHTML = "Skip";
		_.addEvent(this.nextBut, "click", function () {
			self.showNextChar();
		});
		this.appendButton(this.nextBut, true);

		// audio
		this.audio			= document.createElement("audio");
		this.audio.className= "nothing";
		this.audio.setAttribute("preload", "preload");
		this.node.appendChild(this.audio);
	};

	CharVTH.prototype.buildSettings = function() {
		var s 	= this.settings,
			self= this;
		s.minHiraLine		= s.createElem("select", "hira-cvth-line-min", "Min hiragana line", "Lets you omit beginning lines of hiragana that you may know. For example, to omit the vowels, set this to 2.");
		s.maxHiraLine		= s.createElem("select", "hira-cvth-line", "Max hiragana line", "Setting this will allow you to limit the possible characters in the test. If you only know the first three lines of hiragana, choose 3: Characters on lines above 3 will not appear.");
		s.useGoogle			= s.createElem("input",  "hira-cvth-speech", "Use Google speech", "Check this to use Google's pronunciation rather than the default audio clips.");
		s.difficulty		= s.createElem("select", "hira-cvth-difficulty", "Choice grid", "Affects the number of possible characters shown");

		s.useGoogle.type= "checkbox";

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
	
	CharVTH.prototype.checkSettings = function (obj) {
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

	CharVTH.prototype.show = function () {
		ns.Module.prototype.show.call(this);
		this.showNextChar();
	};

	CharVTH.prototype.hide = function () {
		ns.Module.prototype.hide.call(this);
	};

	CharVTH.prototype.showNextChar = function () {
		var maxV		= this.settings.maxHiraLine.value * 5,
			minV		= this.settings.minHiraLine.value * 5 - 5,
			last		= this.currentCharIndex,
			chosen		= last,
			region		= ns.UNICODE_MAP.slice(minV, maxV),
			self		= this,
			ch;

		if (minV == maxV - 5 && maxV/5 == 11 && chosen==minV) { // only one option to choose from
			return;
		}
		var range = maxV - minV;
		while (ns.UNICODE_MAP[chosen]==0 || chosen==last) {
			chosen	= parseInt(Math.random() * range + minV);
		}
		ch = ns.UNICODE_MAP[chosen];
		this.currentCharIndex 	= chosen;
		this.currentCharCode	= ch;

		this.createChoiceTable();

		this.audio.pause();
		this.loadAudio();
	};

	CharVTH.prototype.createChoiceTable = function () {
		var table = document.createElement("table"),
			row	  = document.createElement("tr"),
			count = this.settings.difficulty.value,
			copy  = ns.UNICODE_MAP.slice(0),
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
	
	CharVTH.prototype.loadAudio = function () {
		var self = this;
		function pad(n) {
			return n<10?"0"+n:n;
		}
		
		this.audio.innerHTML ="";

		this.audio.onload =  function () {
			self.playClip ();
		};
		
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

	CharVTH.prototype.playClip = function () {
		this.audio.play();
	};

	ns.CharVTH = CharVTH;
}) (JAP.namespace("JAP.hira.mods"));

