<?php
	// Author: Dee
	// Date: 2015/01/11
	// This mysql setting definition ...
	// dependence : MysqlBase
	//
	
	include_once dirname(__FILE__).'/op/mysql_op_base.php';
	
	define(MYSQL_DEF_HOSTADDR,"mysql1.000webhost.com");
	define(MYSQL_DEF_USERNAME,"a8558739_itr");
	define(MYSQL_DEF_PASSWORD,"A123456z");
	define(MYSQL_DEF_DBNAME,"a8558739_itr");
	
	function gl_getacctab()
	{
		return new MysqlTable("account",array
		(
			new MysqlField("uuid",MysqlDt::dtfactory("uuid",array(false))),
			new MysqlField("name",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("password",MysqlDt::dtfactory("password",array(null))),
			new MysqlField("imgpath",MysqlDt::dtfactory("text",array(64,null,false,null))),
			new MysqlField("email",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("info",MysqlDt::dtfactory("json",array(null,false,null)))		
		));
	};
	
	function gl_getaccfriendtab()
	{
		return new MysqlTable("friends",array
		(
			new MysqlField("accountuuid",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("frienduuid",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("status",MysqlDt::dtfactory("enum",array(array("INVITED","ACCEPTED","DENY"),"INVITED",true,null)))		
		));		
	};
	
	function gl_getevtlisttab()
	{
		return new MysqlTable("events",array
		(
			new MysqlField("uuid",MysqlDt::dtfactory("uuid",array(false))),
			new MysqlField("name",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("description",MysqlDt::dtfactory("text",array(null,null,false,null))),
			new MysqlField("creatoruuid",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("date",MysqlDt::dtfactory("datetime",array(true))),
			new MysqlField("type",MysqlDt::dtfactory("enum",array(array("PUBLIC","PRIVATE"),"PUBLIC",true,null)))		
		));
	};
	
	function gl_getevtdetailtab()
	{
		return new MysqlTable("eventdetail",array
		(
			new MysqlField("uuid",MysqlDt::dtfactory("uuid",array(false))),
			new MysqlField("eventuuid",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("lat",MysqlDt::dtfactory("decimalnum",array(2,true,12,6,false,0,true,null))),
			new MysqlField("lng",MysqlDt::dtfactory("decimalnum",array(2,true,12,6,false,0,true,null))),
			new MysqlField("description",MysqlDt::dtfactory("text",array(null,null,false,null))),
			new MysqlField("time",MysqlDt::dtfactory("datetime",array(false)))		
		));		
	};
	
	function gl_getevtparttab()
	{
		return new MysqlTable("eventparty",array
		(
			new MysqlField("eventuuid",MysqlDt::dtfactory("text",array(32,null,true,null))),
			new MysqlField("partyuuid",MysqlDt::dtfactory("text",array(32,null,true,null)))
		));			
	};
?>