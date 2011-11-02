<?php
	$db_host        = "nihongodb.db.8176161.hostedresource.com";

	$db_host 	= "localhost";
	$db_user	= "nihongodn";
	$db_pass	= "n1h0ng0#D";
	//$db_schema= "test";
	$db_schema	= "nihongodb";
	
	$con = null;
	
	function dbConnect(){
		global $con, $db_host, $db_user, $db_pass, $db_schema;
		$con = new MySQLi($db_host, $db_user, $db_pass, $db_schema);
		if (mysqli_connect_errno())
			return null;
		return $con;
	}
	
	function dbClose(){
		global $con;
		$con->close();
	}
	
	function lastInsertID(){
		global $con;
		return $con->insert_id;
	}
	
	
	/**************************************************************************
	 * dbCount - Returns the COUNT(*) results for the given table and WHERE clause
	 *************************************************************************/
	function dbCount($table, $where, $ar_params){
		global $con;
		
		$query = "SELECT COUNT(*) FROM $table WHERE $where;";
		
		$stmt = $con->stmt_init();
		if ($stmt->prepare($query)){
			if (sizeof($ar_params))
				call_user_func_array(array($stmt, 'bind_param'), $ar_params);
			$stmt->bind_result($count);
			$stmt->execute();
			if (!$con->errno){
				$stmt->store_result();
				$stmt->fetch();
				$stmt->close();
				return $count;
			}
			else{
				trigger_error("\ncuPlaza SQL dbCount Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
				return -1;
			}
		}
		else{
			trigger_error("\ncuPlaza SQL dbCount Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
			return -1;
		}		
	}
	
	/**************************************************************************
	 * dbSelectRow - fetches details for one row
	 *************************************************************************/
	function dbSelectRow($query, $ar_params, $ar_results){
		global $con;
		
		$stmt = $con->stmt_init();
		if ($stmt->prepare($query)){
			call_user_func_array(array($stmt, 'bind_param'), $ar_params);
			call_user_func_array(array($stmt, 'bind_result'), $ar_results);
			$stmt->execute();
			if (!$con->errno){
				$stmt->store_result();
				$stmt->fetch();
				$stmt->close();
				return true;
			}
			else{
				trigger_error("\ncuPlaza SQL SelectRow Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
				return false;
			}
		}
		else{
			trigger_error("\ncuPlaza SQL SelectRow Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
			return false;
		}		
	}

	function dbSelectMany($query, $ar_params, $ar_results){
	}
	
	/**************************************************************************
	 * dbInsert - Inserts values into a table
	 * eg. dbInsert("users", array("name", "age"), array("si", &$name, &$age));
	 *************************************************************************/
	function dbInsert($table, $cols, $values, $ar_params){
		global $con;
		
		$query = "INSERT INTO $table ($cols) VALUES ($values);";
		
		$stmt = $con->stmt_init();
		if ($stmt->prepare($query)){
			call_user_func_array(array($stmt, 'bind_param'), $ar_params);
			$stmt->execute();
			if (!$con->errno){
				return true;
			}
			else{
				trigger_error("\ncuPlaza SQL Insertion Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
				return false;
			}
		}
		else{
			trigger_error("\ncuPlaza SQL Insertion Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
			return false;
		}		
	}
	
	/**************************************************************************
	 * dbInsertUpdate - Inserts values into a table, but if there is a key 
	 * conflict, it updates the row.
	 * eg. dbInsertUpdate("users", array("name", "age"),, array("si", &$name, &$age));
	 *************************************************************************/
	function dbInsertUpdate($table, $cols, $values, $updates, $ar_params){
		global $con;
		
		$query = "INSERT INTO $table ($cols) \nVALUES ($values) \nON DUPLICATE KEY UPDATE \n\t$updates;";
		
		$stmt = $con->stmt_init();
		if ($stmt->prepare($query)){
			call_user_func_array(array($stmt, 'bind_param'), $ar_params);
			$stmt->execute();
			if (!$con->errno){
				return true;
			}
			else{
				trigger_error("\ncuplaza SQL Insertion Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
				return false;
			}
		}
		else{
			trigger_error("\ncuplaza SQL Insertion Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
			return false;
		}		
	}
	
	/**************************************************************************
	 * dbUpdate - updates values of a row in the table
	 * eg. dbUpdate("UPDATE users SET p=?", array("s", &$p));
	 *************************************************************************/
	function dbUpdate($query, $ar_params){
		global $con;
		
		$stmt = $con->stmt_init();
		if ($stmt->prepare($query)){
			call_user_func_array(array($stmt, 'bind_param'), $ar_params);
			$stmt->execute();
			if (!$con->errno){
				return true;
			}
			else{
				trigger_error("\ncuplaza SQL Update Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
				return false;
			}
		}
		else{
			trigger_error("\ncuplaza SQL Update Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
			return false;
		}		
	}
	
	/**************************************************************************
	 * dbDelete - deletes rows
	 *************************************************************************/
	function dbDelete($query, $ar_params){
		global $con;
		
		$stmt = $con->stmt_init();
		if ($stmt->prepare($query)){
			call_user_func_array(array($stmt, 'bind_param'), $ar_params);
			$stmt->execute();
			if (!$con->errno){
				return true;
			}
			else{
				trigger_error("\ncuplaza SQL Delete Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
				return false;
			}
		}
		else{
			trigger_error("\ncuplaza SQL Delete Error: \n\t$con->error\n\n\tfor query: $query \n\n\tand params: " .implode(", ", $ar_params)."\n");
			return false;
		}		
	}
?>
