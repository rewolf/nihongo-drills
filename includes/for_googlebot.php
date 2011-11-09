<?php
	require_once ("menu_builder.php");
	$page_text = "";


	function loadPage ($path) {
		return file_get_contents($path);
	}


	if (isset($_REQUEST["_escaped_fragment_"])) {
		$hash = trim($_REQUEST["_escaped_fragment_"], " /");
		$path = "pages/$hash";

		$for_gbot = true;

		if ($hash=="") {
			$page_text = loadMenu($hash,"pages/");
		}
		else if (!file_exists($path) && !file_exists("$path.php")){
			# Tell the Bot that this page is invalid
			header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found $path.php");
			die();
		}
		else if (is_dir($path)) {
			echo $page_text;
			$page_text = loadMenu($hash, "pages/$hash");
		}
		else {
			$page_text = "<div id=\"content-pane\">\n";
			$page_text .= loadPage("$path.php");
			$page_text .= "</div>\n";
		}
	}

	function fillPageContent() {
		global $page_text;
		echo $page_text;
	}
?>
