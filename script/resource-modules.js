(function (ns) {

	var _ 			= JAP.util;

	/***************************************************************
	 * Name Tags
	 **************************************************************/
	function NameTags () {
		JAP.Module.call(this);
		this.numSelected		= 0;
	}
	NameTags.prototype			= new JAP.Module();
	NameTags.prototype.constructor = NameTags;
	// Set this to identify this class for handling the following hash url
	NameTags.pageHash				= "#!/resources/name-tags";


	NameTags.prototype.setup	= function (html) {
		JAP.Module.prototype.setup.call(this, html);
		var self = this;

		this.roomItems 	= $cls("room-item", this.node);
		this.itemItems 	= $cls("room-item-item", this.node);
		this.form		= $tag("form", this.node)[0];
		
		// Bind events to clicking rooms and their checkboxes
		for (var i = 0; i < this.roomItems.length; i++) {
			var room = this.roomItems[i],
				check= $cls("ui-check-box", room)[0];
			room.checkbox = check;
			_.addEvent(room, "click", function(e){ self.selectRoom(e);});
			_.addEvent(check, "click", function(e){self.checkRoom(e);});
		}
		// Bind events to clicking checkboxes of items
		for (var i = 0; i < this.itemItems.length; i++) {
			var item = this.itemItems[i],
				check= $cls("ui-check-box", item)[0],
				input= $cls("room-item-input", item)[0];
			item.checkbox 	= check;
			item.input 		= input;
			_.addEvent(check, "click", function (e) {	self.checkItem(e); });
		}

		// Catch the form submission to check that at least one nametag is to be drawn
		_.addEvent(this.form, "submit", function (e) {
			if (!self.form["show-kanji"].checked && !self.form["show-hiragana"].checked && !self.form["show-katakana"].checked || self.numSelected == 0) {
				alert("At least one character set must be checked for nametag generation and at least one tag must be selected.");
				_.cancelEvent(e || window.event);
			}
		});
	};

	NameTags.prototype.selectRoom = function (e) {
		function findParent(el, cls){
			if (!el){
				return null;
			}
			return el.className.indexOf(cls)!=-1 && el || findParent(el.parentElement  || el.parentNode, cls);
		}

		var evt		= e || window.event,
			target	= findParent(e.target || e.srcElement, "room-item"),
			name	= target.getAttribute("data-name");

		for (var i = 0; i < this.roomItems.length; i ++) {
			_.removeClass(this.roomItems[i], "selected");
		}
		_.addClass(target, "selected");

		for (var i = 0; i < this.itemItems.length; i ++) {
			if (this.itemItems[i].getAttribute("data-room")==name) {
				_.removeClass(this.itemItems[i], "nothing");
			}
			else {
				_.addClass(this.itemItems[i], "nothing");
			}
		}
	};

	NameTags.prototype.checkRoom = function (e) {
		var evt		= e || window.event,
			target	= e.target || e.srcElement,
			parent	= target.parentElement || target.parentNode,
			name	= parent.getAttribute("data-name"),
			state	= target.getAttribute("data-state"),
			newState= state == 0 ? 2 : 0;

		target.setAttribute("data-state", newState);

		for (var i = 0; i < this.itemItems.length; i++) {
			if (this.itemItems[i].getAttribute("data-room")==name) {
				this.itemItems[i].checkbox.setAttribute("data-state", newState);
				this.itemItems[i].input.checked = newState > 0;
			}
		}
		this.recalcTotalSelected();
	};

	NameTags.prototype.checkItem = function (e) {
		var evt		= e || window.event,
			target	= e.target || e.srcElement,
			parent	= target.parentElement || target.parentNode,
			name	= parent.getAttribute("data-room"),
			state	= target.getAttribute("data-state"),
			newState= state == 0 ? 2 : 0,
			countOn	= 0,
			countOff= 0;

		target.setAttribute("data-state", newState);
		parent.input.checked = newState > 0;
		
		for (var i = 0; i < this.itemItems.length; i++) {
			if (this.itemItems[i].getAttribute("data-room")==name) {
				if (this.itemItems[i].input.checked) {
					countOn += 1;
				}
				else {
					countOff += 1;
				}
			}
		}
		newState = countOn == 0 ? 0 : (countOff == 0 ? 2 : 1);
		for (var i = 0; i < this.roomItems.length ; i++) {
			if (this.roomItems[i].getAttribute("data-name")==name) {
				this.roomItems[i].checkbox.setAttribute("data-state", newState);
				break;
			}
		}
		this.recalcTotalSelected();
	};

	NameTags.prototype.recalcTotalSelected = function () {
		var tot = 0;
		for (var i = 0; i < this.itemItems.length; i++) {
			if (this.itemItems[i].input.checked){
				tot ++;
			}
		}
		$id("room-item-count").innerHTML = (tot==0?"No":tot) + (tot!=1? " tags are" :" tag is") + " selected";
		this.numSelected = tot;
	};

	// Export to outside
	ns.NameTags					= NameTags;

})(JAP.namespace("JAP.mods"));

