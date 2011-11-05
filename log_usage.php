<?php

	require_once("includes/database.php");
	
	header("Content-Type: application/json");
	
	session_start();

	$_SESSION['timeout'] = time();
	
	if (!dbConnect())
		die(json_encode(array("error"=>"Failed to connect to database.")));
		
	if ($_SERVER['REQUEST_METHOD']=='POST'){
		try {
			log_usage();
		}
		catch (Exception $e) {
			trigger_error("Log Problem: $e");
			fail_error("Exception occurred");
		}
	}
	
	// Update the session
	$sessid = session_id();
	$ip		= $_SESSION['ip'];
	$res = dbUpdate("UPDATE pagehit SET updatedtime=UNIX_TIMESTAMP() WHERE sessid=? AND ip=?", 
		array("ss",&$sessid, &$ip));
	
	
	dbClose();	
	
	function fail_error($msg) {
		die(json_encode(array("fail"=>"error","failmsg"=>$msg)));
	}

	function fail_reject($msg) {
		die(json_encode(array("fail"=>"reject","failmsg"=>$msg)));
	}

	function log_usage(){
		$user_ip= $_SERVER["REMOTE_ADDR"];
		$link	= trim($_POST["link"]);
		$from	= trim($_POST["from"]);
		$error	= isset($_POST["error"]) ? $_POST["error"] : 0;

		
		$res = dbInsert("navigation", "invalid, time, ip, from_link, link", "?, UNIX_TIMESTAMP(), ?, ?, ?", 
			array("isss", &$error, &$user_ip, &$from, &$link));

		if (!res) {
			fail_error("Could not log");
		}
	}


?>
