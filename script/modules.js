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

	// Export to outside
	ns.Char_Hira_toVoice 		= Char_Hira_toVoice;
	ns.Char_Hira_fromVoice 		= Char_Hira_fromVoice;
	ns.Char_Hira_writeTest 		= Char_Hira_writeTest;

})(JAP.namespace("JAP.mods"));

