(function (ns) {

	var _ 			= JAP.util;

	var MAX_LINE = 11,
		LINE_LETTERS = ["", "k", "s", "t", "n", "h", "m", "y", "r", "w","ng"];

	JAP.HIRAGANA_UNICODE	= [
		12354,  12356,  12358,  12360,  12362,  //
		12363,  12365,  12367,  12369,  12371,  // k
		12373,  12375,  12377,  12379,  12381,  // s
		12383,  12385,  12388,  12390,  12392,  // t
		12394,  12395,  12396,  12397,  12398,  // n
		12399,  12402,  12405,  12408,  12411,  // h
		12414,  12415,  12416,  12417,  12418,  // m
		12420,  00000,  12422,  00000,  12424,  // y
		12425,  12426,  12427,  12428,  12429,  // r
		12431,  12432,  00000,  12433,  12434, 	// w
		12435,  00000,  00000,  00000,  00000  	// ng
	];
	JAP.KATAKANA_UNICODE	= [
		12450,	12452,	12454,	12456,	12458,	//
		12459,	12461,	12463,	12465,	12467,	// k
		12469,	12471,	12473,	12475,	12477,	// s
		12479,	12481,	12484,	12486,	12488,	// t
		12490,	12491,	12492,	12493,	12494,	// n
		12495,	12498,	12501,	12504,	12507,	// h
		12510,	12511,	12512,	12513,	12514,	// m
		12516,	00000,	12518,	00000,	12520,	// y
		12521,	12522,	12523,	12524,	12525,	// r
		12527,	12528,	00000,	12529,	12530,	// w
		12531,	00000,	00000,	00000,	00000	// ng
	];


	/***************************************************************
	 * Character - Hiragana - to voice
	 **************************************************************/
	function Char_Hira_toVoice () {
		JAP.abstract.Char_toVoice.call(this, JAP.HIRAGANA_UNICODE);
	}
	Char_Hira_toVoice.prototype				= new JAP.abstract.Char_toVoice();
	Char_Hira_toVoice.prototype.constructor = Char_Hira_toVoice;
	// Set this to identify this class for handling the following hash url
	Char_Hira_toVoice.pageHash				= "#!/character-drills/hiragana/to-voice";


	/***************************************************************
	 * Character - Hiragana - from voice
	 **************************************************************/
	function Char_Hira_fromVoice () {
		JAP.abstract.Char_fromVoice.call(this, JAP.HIRAGANA_UNICODE);
	}
	Char_Hira_fromVoice.prototype			= new JAP.abstract.Char_fromVoice();
	Char_Hira_toVoice.prototype.constructor = Char_Hira_fromVoice;
	Char_Hira_fromVoice.pageHash			= "#!/character-drills/hiragana/from-voice";

	/***************************************************************
	 * Character - Hiragana - write test
	 **************************************************************/
	function Char_Hira_writeTest () {
		JAP.abstract.Char_writeTest.call(this, JAP.HIRAGANA_UNICODE);
	}
	Char_Hira_writeTest.prototype			= new JAP.abstract.Char_writeTest();
	Char_Hira_toVoice.prototype.constructor = Char_Hira_writeTest;
	Char_Hira_writeTest.pageHash			= "#!/character-drills/hiragana/write-test";

	/***************************************************************
	 * Character - Katakana - to voice
	 **************************************************************/
	function Char_Kata_toVoice () {
		JAP.abstract.Char_toVoice.call(this, JAP.KATAKANA_UNICODE);
	}
	Char_Kata_toVoice.prototype				= new JAP.abstract.Char_toVoice();
	Char_Kata_toVoice.prototype.constructor = Char_Kata_toVoice;
	// Set this to identify this class for handling the following hash url
	Char_Kata_toVoice.pageHash				= "#!/character-drills/katakana/to-voice";


	/***************************************************************
	 * Character - Katakana - from voice
	 **************************************************************/
	function Char_Kata_fromVoice () {
		JAP.abstract.Char_fromVoice.call(this, JAP.KATAKANA_UNICODE);
	}
	Char_Kata_fromVoice.prototype			= new JAP.abstract.Char_fromVoice();
	Char_Kata_toVoice.prototype.constructor = Char_Kata_fromVoice;
	Char_Kata_fromVoice.pageHash			= "#!/character-drills/katakana/from-voice";

	/***************************************************************
	 * Character - Katakana - write test
	 **************************************************************/
	function Char_Kata_writeTest () {
		JAP.abstract.Char_writeTest.call(this, JAP.KATAKANA_UNICODE);
	}
	Char_Kata_writeTest.prototype			= new JAP.abstract.Char_writeTest();
	Char_Kata_toVoice.prototype.constructor = Char_Kata_writeTest;
	Char_Kata_writeTest.pageHash			= "#!/character-drills/katakana/write-test";

	// Export to outside
	ns.Char_Hira_toVoice 		= Char_Hira_toVoice;
	ns.Char_Hira_fromVoice 		= Char_Hira_fromVoice;
	ns.Char_Hira_writeTest 		= Char_Hira_writeTest;
	ns.Char_Kata_toVoice 		= Char_Kata_toVoice;
	ns.Char_Kata_fromVoice 		= Char_Kata_fromVoice;
	ns.Char_Kata_writeTest 		= Char_Kata_writeTest;

})(JAP.namespace("JAP.mods"));

