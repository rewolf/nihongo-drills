<?php

	header("Content-Type:	application/json");

	if (isset($_GET["hash"])) {
		$hash		= trim($_GET["hash"], " #!/");
		$path 		= "../pages/$hash";

		if ($hash=="") {
			$page_text = loadMenu($hash);
		}
		else if (!file_exists($path) && !file_exists("$path.php")){
			# Invalid hash reference
			trigger_error($path."   ".$hash);
			die_error();
		}
		else if (is_dir($path)) {
			$page_text = loadMenu($hash);
		}
		else {
			echo json_encode(loadPage("$path.php"));
		}

	}

	function loadPage ($path) {
		$page_info = array(
			"type"			=> "module",
			"title"			=> "Not Sure",
			"url"			=> "#!/$hash",
			"content"		=> file_get_contents($path)
		);

		return $page_info;
	}

	function loadMenu ($menu) {
		# Creates a menu content from the files in the directory
		# Returns the menu code as well as the content from all contained pages

	}

	function die_error() {
		die(json_encode(array(
			"error"		=> 1,
			"msg"		=> "Invalid hash"
		)));
	}


?>
