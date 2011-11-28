<?php

	$nametags = json_decode(file_get_contents("name-tags.json"), true);
	$item_html= "";

	foreach ($_POST as $k=>$v) {
		if ($k[0]=="|") {
			$parts 	= explode("|", str_replace("_"," ", $k));
			$room_n	= $parts[1];
			$item_n	= $parts[2];

			$room	= $nametags[$room_n];
			$item	= $room[$item_n];

			print_item($item_n, $item);
		}
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
		if (!isset($_POST["no-english"])) {
			$item_html .= "  <span class=\"english\">".$cheat."</span>";
		}
		$item_html .= "</div>";
	}

?>

<html lang="en,ja">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no" /> 
	<title>Japanese Item Nametags</title>
	<meta name="description" content="Generated list of user-customized and user-chosen hiragana / katakana / kanji name-tags or labels for household items as an aid to increase Japanese language while learning Nihongo, the Japanese language." />
    <link rel="shortcut icon" href="res/images/favicon.gif" />
    <link rel="stylesheet" href="style/name-tags.css" />
</head>
<body>
	<header id="message">
		<p>
			Below are all the tags, generated according to your specifications.  You can safely
			print this page now, cut the tags out and place them by household items.
		</p>
		<hr />
		<p>
			Note that some words may not have translations in all the character sets.
		</p>
		<button onclick="window.print()">Print Preview</button>
	</header>
	<?php echo $item_html ?>
</body>
</html>
