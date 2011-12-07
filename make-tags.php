<?php

	class Item {
		public $room;
		public $room_data;
		public $item_data;
		public $item;
		public $max_length;

		public function __construct ($room, $item) {
			global $nametags;
			$this->room 		= $room;
			$this->item 		= $item;
			$this->room_data 	= $nametags[$room];
			$this->item_data	= $this->room_data[$item];

			$this->max_length 	= 0;

			$C = .75;  # height proportion from secondary label to primary. 75% of size
			$primary = true;

			if (isset($this->item_data["kanji"])) {
				$l = strlen($this->item_data["kanji"]);
				$this->max_length = max($this->max_length, $l);
				$primary = false;
			}
			if (isset($this->item_data["katakana"]) && $primary) {  # if kanji were available, katakana is not shown
				$l = strlen($this->item_data["katakana"]);
				$this->max_length = max($this->max_length, $l);
				$primary = false;
			}
			if (isset($this->item_data["hiragana"])) {
				$l = strlen($this->item_data["hiragana"]) * ($primary ? 1 : $C);  # hiragana length, scaled if its a secondary label
				$this->max_length = max($this->max_length, $l);
				$primary = false;
			}
		}
	}

	$nametags 	= json_decode(file_get_contents("name-tags.json"), true);
	$item_html	= "";

	$ordered_ar	= array();

	foreach ($_POST as $k=>$v) {
		if ($k[0]=="|") {
			$parts 	= explode("|", str_replace("_"," ", $k));
			$room_n	= $parts[1];
			$item_n	= $parts[2];

			$room	= $nametags[$room_n];
			$item	= $room[$item_n];

			$it		= new Item($room_n, $item_n);

			# insert in ordered position if vertical alignment
			if (isset($_POST["vertical"]) && sizeof($ordered_ar) > 0 ) {
				$found = false;
				foreach ($ordered_ar as $i => $v) {
					if ($it->max_length < $v->max_length) {
						array_splice($ordered_ar, $i, 0, array($it));
						$found = true;
						break;
					}
				}
				if (!$found) {
					$ordered_ar[] = $it;
				}
			}
			else {
				$ordered_ar[] = $it;
			}
		}
	}

	foreach ($ordered_ar as $k=>$v) {
		print_item($v->item, $v->item_data);
	}

	function print_item ($cheat, $item) {
		global $item_html;
		# disable vertical if romaji is set
		$class = isset($_POST["vertical"]) && !isset($_POST["show-romaji"]) ? "name-tag vertical" : "name-tag";
		$names = array();
		if (isset($item["kanji"])) {
			if (isset($_POST["show-kanji"])) {
				$names[] = $item["kanji"];
			}
			$names[] = $item["hiragana"];
		}
		elseif (isset($item["katakana"])) {
			$names[] = $item["katakana"];
		}
		if (isset($_POST["show-romaji"])){
			$names[] = $item["romaji"];
		}

		# No names to display
		if (sizeof($names) == 0) {
			return;
		}

		$item_html .= "<div class=\"$class\">";
		$item_html .= "  <span class=\"primary\">".$names[0]."</span>";
		if (sizeof($names) > 1) {
			$item_html .= "  <span class=\"secondary\">".$names[1]."</span>";
		}
		if (sizeof($names) > 2) {
			$item_html .= "  <span class=\"tertiary\">".$names[2]."</span>";
		}
		if (isset($_POST["show-english"])) {
			$item_html .= "  <span class=\"english\">".$cheat."</span>";
		}
		$item_html .= "</div>";
	}

?>

<html lang="en,ja">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no" /> 
	<title>Nihongo Drills: Japanese Name-tags</title>
	<meta name="description" content="Generated list of user-customized and user-chosen hiragana / katakana / kanji name-tags or labels for household items as an aid to increase Japanese language while learning Nihongo, the Japanese language." />
    <link rel="shortcut icon" href="res/images/favicon.gif" />
    <link rel="stylesheet" href="style/name-tags.css" />
	<script type="text/javascript">

	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-27551871-1']);
	  _gaq.push(['_trackPageview']);

	  (function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();

	</script>
</head>
<body>
	<header id="message">
		<p>
			Below are all the tags, generated according to your specifications.  You can safely
			print this page now, cut the tags out and place them by household items.
		</p>
		<button onclick="window.print()">Print</button>
	</header>
	<?php echo $item_html ?>
</body>
</html>
