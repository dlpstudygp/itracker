<?php
	// Author: Dee
	// Date: 2015/01/11
	// This mysql setting definition ...
	// dependence : MysqlBase
	//
	
	include_once dirname(__FILE__).'/op/mysql_op_base.php';
	
	define(MYSQL_DEF_HOSTADDR,"");
	define(MYSQL_DEF_USERNAME,"");
	define(MYSQL_DEF_PASSWORD,"");
	define(MYSQL_DEF_DBNAME,"");
	
	function gl_getacctab()
	{
		return new MysqlTable("account",array
		(
			new MysqlField("uuid",(new MysqlDt())->uuid(false)),
			new MysqlField("name",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("password",(new MysqlDt())->password(null)),
			new MysqlField("imgpath",(new MysqlDt())->text(64,null,false,null)),
			new MysqlField("email",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("info",(new MysqlDt())->json(null,false,null))		
		));
	};
	
	function gl_getaccfriendtab()
	{
		return new MysqlTable("friends",array
		(
			new MysqlField("accountuuid",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("frienduuid",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("status",(new MysqlDt())->enum(array("INVITED","ACCEPTED","DENY"),"INVITED",true,null))		
		));		
	};
	
	function gl_getevtlisttab()
	{
		return new MysqlTable("events",array
		(
			new MysqlField("uuid",(new MysqlDt())->uuid(false)),
			new MysqlField("name",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("desc",(new MysqlDt())->text(null,null,false,null)),
			new MysqlField("creatoruuid",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("date",(new MysqlDt())->datetime(true)),
			new MysqlField("type",(new MysqlDt())->enum(array("PUBLIC","PRIVATE"),"PUBLIC",true,null))		
		));
	};
	
	function gl_getevtdetailtab()
	{
		return new MysqlTable("eventdetail",array
		(
			new MysqlField("uuid",(new MysqlDt())->uuid(false)),
			new MysqlField("eventuuid",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("lat",(new MysqlDt())->decimalnum(2,true,4,6,false,0,true,null)),
			new MysqlField("lng",(new MysqlDt())->decimalnum(2,true,4,6,false,0,true,null)),
			new MysqlField("desc",(new MysqlDt())->text(null,null,false,null)),
			new MysqlField("time",(new MysqlDt())->datetime(false))		
		));		
	};
	
	function gl_getevtparttab()
	{
		return new MysqlTable("eventparty",array
		(
			new MysqlField("eventuuid",(new MysqlDt())->text(32,null,true,null)),
			new MysqlField("partyuuid",(new MysqlDt())->text(32,null,true,null))
		));			
	};
?>