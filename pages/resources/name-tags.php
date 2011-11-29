<?php
	global $nametags;
	$inc_path = file_exists("name-tags.json") ? "name-tags.json" : "../name-tags.json";
	$nametags = json_decode(file_get_contents($inc_path), true);
	ksort($nametags);

	function insertRooms () {
		global $nametags;
		$rooms 		= array_keys($nametags);
		$selected	= "selected";
		foreach ($rooms as $r) {
			echo "
				<div class=\"ui-check-item room-item $selected\" data-name=\"$r\">
					<div class=\"ui-check-box room-checkbox \" data-state=\"0\"></div>
					<span>$r</span>
				</div>
			";
			$selected = "";
		}
	}

	function insertItems () {
		global $nametags;
		$visible = "";
		foreach ($nametags as $room=>$items) {
			ksort($items);
			foreach ($items as $name=>$translations) {
				ksort($translations);
				$tooltip = $translations["romaji"];
				if (isset($translations["kanji"])) {
					$tooltip = $translations["kanji"]."   |   ".$translations["hiragana"]."   |   ".$tooltip;
				}
				elseif (isset($translations["katakana"])) {
					$tooltip = $translations["katakana"]."   |   ".$tooltip;
				}
				echo "
					<div class=\"ui-check-item room-item-item $visible\" data-room=\"$room\" title=\"$tooltip\">
						<input type=\"checkbox\" class=\"nothing room-item-input\" name=\"|$room|$name\"/>
						<div class=\"ui-check-box\" data-state=\"0\"></div>
						<span>$name</span>
					</div>
				";
			}
			$visible = "nothing";
		}
	}
?>
<div id="mod-name-tags" class="module" data-title="">
	<h1>Design and Print Name Tags</h1>
	<p class="mod-instruction">
		Name tags can be printed and stuck to household items as labels to remember their names and how to pronounce them. First, you can customize or choose how you the want the name-tags to appear and which items you want.  Some household items will have come from the west and are written with katakana usually.  You can choose whether you still want pronunciation in hiragana though if you are not comfortable with katakana yet. Actual names, containing kanji, are also provided.  When you are done, press the "Generate" button to preview the tags.
	</p>
	<p>
		To see some examples of using the name-tags or labels, <a href="name-tag-example.php" target="_blank">click this link</a>
	<form method="POST" action="make-tags.php" target="_blank">
		<div class="list-container">
			<div id="room-list" class="ui-check-list">
				 <?php insertRooms(); ?>
			</div>
		</div>
		<div class="list-container">
			<div id="room-item-list" class="ui-check-list">
				<?php insertItems(); ?>
			</div>
		</div>
		<div id="room-item-count">No tags are selected</div>
		<div id="tag-options">
			<label title="Show the Kanji if available, rather than just the hiragana">
				<input type="checkbox" name="show-kanji" checked/>
				Show Kanji
			</label>
		<!--<label title="Show the Hiragana if available">
				<input type="checkbox" name="show-hiragana" checked/>
				Show Hiragana
			</label>
			<label title="Show the Katakana if available">
				<input type="checkbox" name="show-katakana" checked/>
				Show Katakana
			</label> -->
			<label title="Show the romaji (for cheaters!)">
				<input type="checkbox" name="show-romaji" />
				Show Romaji (for cheaters!)
			</label>
			<label title="Show the english translation in the bottom corner">
				<input type="checkbox" name="show-english" />
				Show English
			</label>
			<label title="Create vertical labels instead. Doesn't work with romaji">
				<input type="checkbox" name="vertical" />
				Vertical Labels
			</label>
		</div>
		<div class="button-box">
			<input type="submit" value="Generate" title="Press to see how the tags will look" />
		</div>
		<div class="mod-instruction">
			If you have any requests, complaints or suggestions, pleast let us know on our <a href="http://twitter.com/nihongo_drills" target="_blank">Twitter page</a>.
		</div>
	</form>
</div>
