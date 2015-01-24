<?php
	// Author: Dee
	// Date: 2014/12/25
	// Retrieve the servicereg ... 
	
	include_once dirname(__FILE__).'/../service/reg.php';	
	
	$oplist = gl_oplist();
	echo json_encode($oplist);	
?>
