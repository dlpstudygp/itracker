<?php
	// Author: Dee
	// Date: 2015/01/12
	// This php is the list of the validation of the op code and the params request ...
	// dependence : -
	//
			
	function gl_oplist()
	{
		return array
		(
			"login" => array("requestdata" => "email,password", "option" => "", "response" => "login"),
			"createaccount" => array("requestdata" => "email,name,password", "option" => "imgpath,info", "response" => "createaccount"),
			"resetpassword" => array("requestdata" => "accountuuid,oldpassword,newpassword", "option" => "", "response"=> "resetpassword"),
			"forgotpassword" => array("requestdata" => "email", "option" => "", "response" => "forgotpassword"),
			"updateaccount" => array("requestdata" => "accountuuid", "option" => "name,imgpath,info", "response" => "updateaccount"),
			"findfriend" => array("requestdata" => "name", "option" => "", "response" => "findfriend"),
			"browsefriend" => array("requestdata" => "accountuuid", "option" => "", "response" => "browsefriend"),
			"friendrequest" => array("requestdata" => "accountuuid,frienduuid", "option" => "", "response" => "friendrequest"),
			"replyfriendreqest" => array("requestdata" => "accountuuid,frienduuid,status", "option" => "", "response" => "replyfriendreqest"),
			"unfriend" => array("requestdata" => "accountuuid,frienduuid", "option" => "", "response" => "unfriend"),
			"createevent" => array("requestdata" => "name,creatoruuid,type,date", "option" => "description", "response" => "createevent"),
			"updateevent" => array("requestdata" => "eventuuid", "option" => "description,name", "response" => "updateevent"),
			"removeevent" => array("requestdata" => "eventuuid", "option" => "", "response" => "removeevent"),
			"browseevent" => array("requestdata" => "accountuuid", "option" => "", "response" => "browseevent"),
			"browseeventdetail" => array("requestdata" => "eventuuid", "option" => "", "response" => "browseeventdetail"),				
			"invitefriendevent" => array("requestdata" => "eventuuid,partyuuid", "option" => "", "response" => "invitefriendevent"),
			"createeventdetail" => array("requestdata" => "eventuuid,lat,lng,time", "option" => "description", "response" => "createeventdetail"),
			"updateeventdetail" => array("requestdata" => "eventdetailuuid", "option" => "lat,lng,time,description", "response" => "updateeventdetail"),
			"removeeventdetail" => array("requestdata" => "eventdetailuuid", "option" => "", "response" => "removeeventdetail")
		);
	}	
?>