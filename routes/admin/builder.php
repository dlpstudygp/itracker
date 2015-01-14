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
		$mysqlop->pushstatement((new MysqlStat("Destroy".$name,null,function(){echo $name." table destroy ... <br>";return true;}))->destroytable($table,null))
				->pushstatement((new MysqlStat("Create".$name,null,function(){echo $name." table create ... <br>";return true;}))->createtable($table,null));
	}

	// start mysql op
	if($mysqlop->execute() === MYSQL_OP_ERROR)
		echo "Error: ".$mysqlop->getmsg();
?>
