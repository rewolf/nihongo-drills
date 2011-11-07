<?php

	function loadMenu($hash) {
		$path 		= "../pages/$hash";

		$handle 	= opendir($path);
		
		if ($handle) {
			
			$out_text 	= "";
	
			$items 		= array();
			while (false !== ($fname = readdir($handle))) {
				if ($fname==".." || $fname==".") {
					continue;
				}
				$fpath 		= "$path/$fname";
	
				if (is_dir($fpath) || strpos($fname, ".php")) {
					$dot		= strrpos($fname, ".");
					if ($dot) {
						$fname 	= substr($fname, 0, $dot);
					}
					$items[] 	= array("name"=>$fname, "path"=>$fpath);
				}
			}
	
			$n				= sizeof($items);
			$per_row		= $n == 4 ? 2 : 3;
	
			$row			= "";
			$html			= "";
			foreach ($items as $i => $item) {
				if ($i == $per_row) {
					$html .= "
					<div class=\"menu-row\">
					$row
					</div>
					";
					$row = "";
				}
				$n 	= $item["name"];
				$p	= $item["path"];
				$l  = strlen($hash)==0 ? "#!/$n" : "#!/$hash/$n";
				$row .= "
				<a href=\"$l\" id=\"item-$n\" 
						class=\"menu-item panel-link \">
					<div class=\"menu-item-icon icon-1\"></div>
					<div class=\"menu-item-icon icon-2\"></div>
					<div class=\"menu-item-icon icon-3\"></div>
				</a>
				";
			}
			$html .= "
			<div class=\"menu-row\">
			$row
			</div>
			";
	
			closedir($handle);
			
			return $html;
		}
		else {
			return false;
		}
	}

?>
