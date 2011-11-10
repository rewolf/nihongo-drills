<?php

	// Load up the metadata file for all pages
	if (file_exists("../page-meta.json")) {
		$metafile = file_get_contents("../page-meta.json");
	}
	else {
		$metafile = file_get_contents("page-meta.json");
	}
	$pageData = json_decode($metafile, true);

	function getPageMeta($hash) {
		global $pageData;
		if (isset($pageData[$hash])) {
			return $pageData[$hash];
		}
		else {
			return FALSE;
		}
	}

	function getPageMetaDatum($hash, $item) {
		$meta = getPageMeta($hash);
		if (!$meta) {
			return "";
		}
		if (isset($meta[$item])) {
			return $meta[$item];
		}
		else {
			return "";
		}
	}

	function loadMenu($hash, $path) {
		$handle 	= opendir($path);
		if ($handle) {
			
			$out_text 	= "";
	
			$items 		= array();
			foreach (scandir($path) as $i=>$fname) {
				if ($fname==".." || $fname=="." || $fname[0]=="_") {
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
				$n 		= $item["name"];
				$p		= $item["path"];
				$l  	= strlen($hash)==0 ? "#!/$n" : "#!/$hash/$n";
				$meta 	= getPageMeta($l);
				$label 	= getPageMetaDatum($l, "menu-label");
				$tooltip= isset($meta["menu-tooltip"]) ? $meta["menu-tooltip"] : (isset($meta["desc"]) ? $meta["desc"] : "");
				$icon1	= getPageMetaDatum($l, "menu-icon-1");
				$icon2	= getPageMetaDatum($l, "menu-icon-2");
				$icon3	= getPageMetaDatum($l, "menu-icon-3");
				$row 	.= "
				<a href=\"$l\" class=\"item-$n menu-item panel-link \" title=\"$tooltip\">
					<div class=\"menu-item-icon icon-1 $icon1\"></div>
					<div class=\"menu-item-icon icon-2 $icon2\"></div>
					<div class=\"menu-item-icon icon-3 $icon3\"></div>
					<div class=\"menu-item-label\">$label</div>
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
