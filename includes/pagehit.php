<?php
	require_once("includes/database.php");
	try {
		// Start session
		session_start();
		
		// Timeout old sessions
		define("TIMEOUT", 30*60); // half hour
		
		if (isset($_SESSION['timeout'])){
			if (time() - $_SESSION['timeout'] > TIMEOUT){
				session_regenerate_id(true);
			}
			$_SESSION['timeout'] = time();
		}
		else{
			$_SESSION['timeout'] = time();
		}
		
		$sessid = session_id();
		session_cache_limiter('nocache');
		
		// Get Data regarding new connection
		$referer 	= getParam("HTTP_REFERER");
		$lang		= getParam("HTTP_ACCEPT_LANGUAGE");
		$agent		= getParam("HTTP_USER_AGENT");
		$ip			= getParam("REMOTE_ADDR");
		
		if (strstr($agent,"wget") || strstr($agent,"Wget")){
			header("Location:http://www.google.com");
		}

		if (dbConnect()) {
			
			$res  = dbSelectRow("SELECT id FROM pagehit WHERE sessid=? AND ip=?",array("ss", &$sessid, &$ip), array(&$sess_row_id));
		
			if (!stristr($agent,"bot") && !stristr($agent, "spider")){
				if ($res && $sess_row_id) {
					$res = dbUpdate("UPDATE pagehit SET updatedtime=UNIX_TIMESTAMP() WHERE id=?", 
						array("i",&$sess_row_id));
				}
				else {
					$res = dbInsert("pagehit", "timestamp, updatedtime, sessid, referer, lang, agent, ip", "UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), ?, ?, ?, ?, ?", 
						array("sssss", &$sessid, &$referer, &$lang, &$agent, &$ip));
				}
				$_SESSION['ip'] = $ip;	
			}
			dbClose();
		}

	} catch (Exception $e ) {
		trigger_error("oops".$e);
	}
	function getParam ($k) {
		if (isset($_SERVER[$k]))
			return $_SERVER[$k];
		else
			return "";
	}

?>
