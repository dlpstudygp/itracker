<?php
	// Author: Dee
	// Date: 2015/01/11
	// This php is to build the database

	// create the iTracker mysql
	
	include_once dirname(__FILE__).'/../mysql/def.php';	

	// create mysql op and tables list ...
	$mysqlop = new MysqlBase(MYSQL_DEF_HOSTADDR,MYSQL_DEF_USERNAME,MYSQL_DEF_PASSWORD,MYSQL_DEF_DBNAME);
	$tablist = array(gl_getacctab(),gl_getaccfriendtab(),gl_getevtlisttab(),gl_getevtdetailtab(),gl_getevtparttab());
	
	// create tables ..
	foreach($tablist as $table)
	{
		$name = $table->get("name");
		$destroy = new MysqlStat("Destroy".$name,null,null);
		$create = new MysqlStat("Create".$name,null,null);
		$mysqlop->pushstatement($destroy->destroytable($table,null))
				->pushstatement($create->createtable($table,null));
	}

	// start mysql op
	if($mysqlop->execute() === MYSQL_OP_ERROR)
		echo "Error: ".$mysqlop->getmsg();
?>
