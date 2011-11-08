<?php
	require_once ("menu_builder.php");
	$page_text = "";


	function loadPage ($path) {
		return file_get_contents($path);
	}


	if (isset($_REQUEST["_escaped_fragment_"])) {
		$hash = trim($_REQUEST["_escaped_fragment_"], " /");
		$path = "pages/$hash";

		$exclude_js = true;

		if ($hash=="") {
			$page_text = loadMenu($hash);
		}
		else if (!file_exists($path) && !file_exists("$path.php")){
			# Tell the Bot that this page is invalid
			header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found $path.php");
			die();
		}
		else if (is_dir($path)) {
			$page_text = loadMenu($hash);
		}
		else {
			$page_text = loadPage("$path.php");
		}
	}

	function fillPageContent() {
		global $page_text;
		echo $page_text;
	}
?>
