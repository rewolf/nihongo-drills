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

	function fillPageDesc () {
		global $hash;
		$pageMeta = getPageMeta("#!/$hash");
		$desc	  = $pageMeta["desc"];
		if ($pageMeta) {
			echo "<meta name=\"description\" content=\"$desc\" />";
		}
	}
	function fillPageTitle () {
		global $hash;
		$pageMeta = getPageMeta("#!/$hash");
		$title	  = $pageMeta["title"];
		if ($pageMeta) {
			echo "<title>$title</title>";
		}
	}
	function fillPageNav () {
		global $hash;
		$parts		= split("/", $hash);

		if (strlen($hash)>0){
			$url		= "#!";
			$out 		= "";

			$out .= "<a href=\"#!/\" class=\"nav-part\">Japanese</a>";
			$out .= "<span class=\"nav-sep\">&gt;</span>";
			foreach ($parts as $k=>$p) {
				$name = ucwords(join(" ",split("-", $p)));
				$url .= "/$p";
				$out .= "<a href=\"$url\" class=\"nav-part\">$name</a>";
				if ($k != sizeof($parts)-1) {
					$out .= "<span class=\"nav-sep\">&gt;</span>";
				}
			}
			echo $out;
		}
	}
?>
