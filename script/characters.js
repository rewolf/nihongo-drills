
(function () {


	var _ = JAP.util;
	/**
	 *
	 * characters
	 * each line has a number bitmask. 1=>yoon-seion,  2=>yoon-dakuon, 4=>yoon-handakuon
	 * each line consists of three places per character: seion, dakuon, handakuon.
	 * a full-stop/period indicates there is no character 
	 */

	var B_YOON_SEION		= 0x1;
	var B_YOON_DAKUON		= 0x2;
	var B_YOON_HANDAKUON	= 0x4;

	var YOON_KATA = "ャュョ";
	var YOON_HIRA = "ゃゅょ";

	var hiragana = [
		"0あ..い..う..え..お..",
		"3かが.きぎ.くぐ.けげ.こご.",
		"3さざ.しじ.すず.せぜ.そぞ.",
		"1ただ.ちぢ.つづ.てで.とど.",
		"1な..に..ぬ..ね..の..",
		"7はばぱひびぴふぶぷへべぺほぼぽ",
		"1ま..み..む..め..も..",
		"0や.._..ゆ.._..よ..",
		"1ら..り..る..れ..ろ..",
		"0わ.._.._.._..を..",
		"0ん.._.._.._.._.."
	];

	var katakana = [
		"0ア..イ..ウ..エ..オ..",
		"3カガ.キギ.クグ.ケゲ.コゴ.",
		"3サザ.シジ.スズ.セゼ.ソゾ.",
		"1タダ.チヂ.ツヅ.テデ.トド.",
		"1ナ..ニ..ヌ..ネ..ノ..",
		"7ハバパヒビピフブプヘベペホボポ",
		"1マ..ミ..ム..メ..モ..",
		"0ヤ.._..ユ.._..ヨ..",
		"1ラ..リ..ル..レ..ロ..",
		"0ワ.._.._.._..ヲ..",
		"0ン.._.._.._.._.."
	];

	function Char (row, col, yoonAble, chars) {
		this.seion		= chars.seion;
		this.dakuon		= chars.dakuon;
		this.handakuon	= chars.handakuon;
		if (yoonAble) console.log(this.seion);
		this.code		= this.seion.charCodeAt(0);
		this.code_d		= this.dakuon ? this.dakuon.charCodeAt(0) : 0;
		this.code_h		= this.handakuon ? this.handakuon.charCodeAt(0) : 0;
		this.yoonAble	= yoonAble;
		this.row		= row;
		this.col		= col;
		this.filename	= "seion_"+_.pad(row)+"_"+_.pad(col);
		this.filename_d	= "dakuon_"+_.pad(row)+"_"+_.pad(col) ;
		this.filename_h	= "handakuon_"+_.pad(row)+"_"+_.pad(col) ;
	}

	function CharSet (lines) {
		this.lines 		= [];

		for (var i = 0; i < lines.length; i++ ) {
			var lineList= [];
			var line 	= lines[i];
			var yoonAble	= parseInt(line[0]); // The い column can be used in Yoon form

			for (var j = 1; j < line.length; j+=3) {
				var s	= line[j],
					d	= line[j+1],
					h	= line[j+2],
					// remember yoonAble is a bitmask
					ch	= new Char(i+1, (j-1)/3 + 1, (j/3 | 0)==1 ? yoonAble : 0, {
						"seion":		s, 
						"dakuon":		d == "." ? null : d, 
						"handakuon":	h == "." ? null : h
					});
				if (s!="_") {
					lineList.push(ch);
				}
			}
			this.lines.push(lineList);
		}
	}

	hiraganaCS = new CharSet(hiragana);
	katakanaCS = new CharSet(katakana);


	function DrillChar (ch, code, corresponding, audio) {
		this.character		= ch;
		this.charCode		= code;
		this.corresponding	= corresponding;
		this.audio			= audio;
	}

	function _c (code) {
		return "&#"+code+";";
	}

	function _smaller (html) {
		return "<span style='font-size:smaller'>"+html+"</span>";
	}

	JAP.buildCharList = function (s, isVoiced, includeYoon, minRow, maxRow) {
		var cs		= s=="hiragana" ? hiraganaCS : (s=="katakana" ? katakanaCS : null),
			other	= cs == hiraganaCS ? katakanaCS : hiraganaCS,
			yoon_ar	= [];
			out		= [];

		if (cs == null) {
			return null;
		}
		else {
			if (s=="hiragana") {
				yoon_ar = YOON_HIRA;
			}
			else {
				yoon_ar = YOON_KATA;
			}
		}
		
		for (var i = minRow-1; i < maxRow && i <= cs.lines.length; i++) {
			var row	= cs.lines[i];
			for (var j = 0; j < row.length; j++) {
				var c = row[j];			
				out.push(new DrillChar(c.seion, _c(c.code), _c(other.lines[i][j].code), c.filename));
				if (isVoiced && c.dakuon) {
					out.push(new DrillChar(c.dakuon, _c(c.code_d), _c(other.lines[i][j].code_d), c.filename_d));
				}
				if (isVoiced && c.handakuon) {
					out.push(new DrillChar(c.handakuon, _c(c.code_h), _c(other.lines[i][j].code_h), c.filename_h));
				}
				
				if (c.yoonAble > 0 && includeYoon) {
					console.log("yoon");
					if ((c.yoonAble & B_YOON_SEION) == B_YOON_SEION) {
						for (var z = 0; z < 3; z++) {
							var fnN 	= c.filename.length,
								fname	= "yoon-"+c.filename.substr(0,fnN-1) + (z+1);
							out.push(new DrillChar(
								c.seion + yoon_ar[z],
								_c(c.code) + _smaller(_c(yoon_ar[z].charCodeAt(0))), 
								_c(other.lines[i][j].code) + _c(yoon_ar[z].charCodeAt(0)), 
								fname
							));
						}
					}
					if (isVoiced && (c.yoonAble & B_YOON_DAKUON) == B_YOON_DAKUON) {
						console.log(c.yoonAble + "  " + (c.yoonAble & B_YOON_DAKUON) +"  " + B_YOON_DAKUON);
						for (var z = 0; z < 3; z++) {
							var fnN 	= c.filename_d.length,
								fname	= "yoon-"+c.filename_d.substr(0,fnN-1) + (z+1);
							out.push(new DrillChar(
								c.dakuon + yoon_ar[z],
								_c(c.code_d) + _smaller(_c(yoon_ar[z].charCodeAt(0))), 
								_c(other.lines[i][j].code_d) + _c(yoon_ar[z].charCodeAt(0)), 
								fname
							));
						}
					}
					if (isVoiced && (c.yoonAble & B_YOON_HANDAKUON) == B_YOON_HANDAKUON) {
						console.log(c.yoonAble + "  " + (c.yoonAble & B_YOON_HANDAKUON) +"  " + B_YOON_HANDAKUON);
						console.log(typeof c.yoonAble + "  " + typeof B_YOON_HANDAKUON);
						for (var z = 0; z < 3; z++) {
							var fnN 	= c.filename_h.length,
								fname	= "yoon-"+c.filename_h.substr(0,fnN-1) + (z+1);
							out.push(new DrillChar(
								c.handakuon + yoon_ar[z],
								_c(c.code_h) + _smaller(_c(yoon_ar[z].charCodeAt(0))), 
								_c(other.lines[i][j].code_h) + _c(yoon_ar[z].charCodeAt(0)), 
								fname
							));
						}
					}
					
				}
			}
		}
		return out;
	};

})();
