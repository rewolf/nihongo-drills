<?php
	require_once("../includes/menu_builder.php");

	header("Content-Type:	application/json");

	if (isset($_GET["hash"])) {
		$hash		= trim($_GET["hash"], " #!/");
		$path 		= "../pages/$hash";

		if ($hash=="") {
			echo json_encode(loadAJAXMenu($hash));
		}
		else if (!file_exists($path) && !file_exists("$path.php")){
			# Invalid hash reference
			trigger_error($path."   ".$hash);
			die_error();
		}
		else if (is_dir($path)) {
			echo json_encode(loadAJAXMenu($hash));
		}
		else {
			echo json_encode(loadPage("$path.php",$hash));
		}

	}

	function loadPage ($path, $hash) {
		$page_info = array(
			"type"			=> "module",
			"title"			=> "Not Sure",
			"url"			=> "#!/$hash",
			"content"		=> file_get_contents($path)
		);
		
		if ($page_info["content"] === false) {
			$page_info["error"]	= 1;
			$page_info["msg"]	= "no content";
		}

		return $page_info;
	}

	function loadAJAXMenu ($menu) {
		# Creates a menu content from the files in the directory
		# Returns the menu code as well as the content from all contained pages
		$page_info = array(
			"type"			=>	"menu",
			"title"			=>	"Not sure menu",
			"url"			=>	"#!/$menu",
			"content"		=>	loadMenu($menu)
		);
		if ($page_info["content"] == false) {
			$page_info["error"]	= 1;
		}
		
		return $page_info;
	}

	function die_error() {
		die(json_encode(array(
			"error"		=> 1,
			"msg"		=> "Invalid hash"
		)));
	}


?>
