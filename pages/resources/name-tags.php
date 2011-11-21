<?php
	global $nametags;
	$nametags = json_decode(file_get_contents("../name-tags.json"), true);
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
				$tooltip = join("   |   ", array_values($translations));
				echo "
					<div class=\"ui-check-item room-item-item $visible\" data-room=\"$room\" title=\"$tooltip\">
						<input type=\"hidden\" class=\"room-item-input\" name=\"$room_$name\"/>
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
		Name tags can be printed and stuck to household items as labels to remember their names and how to pronounce them. First, you can customize or choose how you the want the name-tags to appear and which items you want.  Some household items will have come from the west and are written with katakana usually.  You can choose whether you still want pronunciation in hiragana though if you are not comfortable with katakana yet. Actual names, containing kanji, are also provided.
	</p>
	<form method="POST" action="make-tags.php" target="_blank">
		<div id="room-list" class="ui-check-list">
			 <?php insertRooms(); ?>
		</div>
		<div id="room-item-list" class="ui-check-list">
			<?php insertItems(); ?>
		</div>
		<div id="room-item-count">No tags are selected</div>
		<div class="button-box">
			<input type="submit" value="Generate" />
		</div>
	</form>
</div>
