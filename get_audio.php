<?php
	$cache = 60*60*24 * 7;  # 3 days
	header("Content-Type: audio/mpeg");
	header("Cache-Control: max-age=$cache");
	header("Pragma: public");
	header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$cache) . ' GMT');

	if (isset($_GET["text"])) {
		$text = urlencode($_GET["text"]);
		$lang = isset($_GET["tl"]) ? $_GET["tl"] : "ja";
//		echo file_get_contents("http://translate.google.com/translate_tts?tl=$lang&ie=UTF-8&q=$text");
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://translate.google.com/translate_tts?tl=$lang&ie=UTF-8&q=$text");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$res = curl_exec($ch);
		echo $res;
		curl_close($ch);
		
	}
	
?>
