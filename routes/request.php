<?php
	// Author: Dee
	// Date: 2014/12/25
	// This php is the communication center ...
	// dependence : app, reg
	//
	//	
	
	include_once dirname(__FILE__).'/service/app.php';
	include_once dirname(__FILE__).'/service/reg.php';
	
	// echo normal result
	$echo = function gl_echo($nRet,$msg,$data)
	{
		$result = (!is_null($data)) ? array("issuccess"=>$nRet,"msg"=>$msg,"data" => $data) : array("issuccess"=>$nRet,"msg"=>$msg);		
		echo json_encode($result);
	};
	
	// die the connection
	$die = function gl_die($msg)
	{die("ERR:".$msg);}
	
	// data validation
	function gl_datavalidation($op,$sParam)
	{
		$oplist = gl_oplist();
		if(!isset($sParam) || !isset($op))
			gl_die("No params or operation is found");
		
		if(!isset($oplist[$op]))
			gl_die("Unknowing operation command!!");

		if(get_magic_quotes_gpc())
			$d = stripslashes($sParam);
		else
			$d = $sParam;
		
		$data = (array)(json_decode($d,true));
		$args = explode(",",$oplist[$op]["requestdata"]);
						
		for($i=0;$i<count($args);$i++)
			if(!isset($data[$args[$i]]))
				gl_die($args[$i]." is not set");
		
		return array("data" => $data,"response" => $oplist[$op]["response"]);
	};
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	
	// validation
	$ret = gl_datavalidation($_POST["op"],$_POST["params"]);
	
	//start service 
	$service = new AppServ($ret["data"],$die,$echo);
	call_user_func_array(array($service,$ret["response"]),array());
?>