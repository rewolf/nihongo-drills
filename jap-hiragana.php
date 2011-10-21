<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
	<title>Hiragana</title>
    <link rel="stylesheet" href="style/jap-hiragana.css" />
    <script type="text/javascript" src="script/common.js"></script>
    <script type="text/javascript" src="script/jap-hiragana.js"></script>
</head>
<body>
	<label for="line-select">Maximum hiragana line: </label>
    <script type="text/javascript">
		document.write('	<select id="line-select">');
		for (var i = 1; i <= 10; i++) {
			document.write('		<option value="'+i+'">'+i+'</option>');
		}
		document.write('	</select>');
	</script>
    
    <label for="auto-read">Auto Read</label><input type="checkbox" id="auto-read" />
    <label for="auto-read-delay">Read Delay</label>
    <select id="auto-read-delay">
    	<option value="250">0.25s</option>
    	<option value="500">0.50s</option>
    	<option value="750">0.75s</option>
    	<option value="1000">1.00s</option>
    	<option value="1250">1.25s</option>
    	<option value="1500">1.50s</option>
    	<option value="2000">2.00s</option>
    </select>
    
    <div id = "hira-char">
    </div>
    
    <button id="next-but">Next</button>
    
	<div id="audio-holder">
    </div>
</body>
</html>