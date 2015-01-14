<?php
	// Author: Dee
	// Date: 2015/01/11
	// This php app service definition here ...
	// dependence : BaseServ, MysqlBase, MysqlDef
	//
	
	include_once dirname(__FILE__).'/base.php';
	include_once dirname(__FILE__).'/../mysql/def.php';
	
	class AppServ extends BaseServ
	{
		protected $mysqlop = new MysqlBase(MYSQL_DEF_HOSTADDR,MYSQL_DEF_USERNAME,MYSQL_DEF_PASSWORD,MYSQL_DEF_DBNAME);
		protected $msg = "";
		
		public function __construct($data,$callback)
		{
			return parent::__construct($data,$callback);
		}
		
		protected function executecmd()
		{
			$ret = $this->mysqlop->execute();
			if($ret === MYSQL_OP_ERROR)
				$this->executeerror($this->mysqlop->getmsg());
			else if($ret === MYSQL_OP_NOTSUCCESS)
				$this->executecallback(0,$this->msg,null);
			else
				$this->executecallback(1,$this->msg,$this->mysqlop->getdata());				
		}
		
		// define the app request here ... 
		public function login()
		{
			$msg = $this->msg = "Login success!!";
			$e = $this->data["email"];
			$pw = $this->data["password"];
			
			$table = gl_getacctab()->setallfieldsretrivable(true)->setfieldsretrivable("password",false);
			$this->mysqlop->pushstatement((
			new MysqlStat("Login_CheckEmailPw",null,
			function($data,$nextstat) use (&$msg)
			{
				if(count($data) == 0)
				{
					$msg = "Login fail!";
					return false;
				}
				
				return $data[0];
			}))->retrieverecord($table,"WHERE email='".$e."' AND password=MD5('".$pw."')"));
	
			$this->executecmd();
		}
		
		public function createaccount()
		{
			$msg = $this->msg = "Create account success!!";
			$table = gl_getacctab()->setfieldsretrivable("uuid",true);
			$this->mysqlop->pushstatement((
			new MysqlStat("CreateAccount_CheckExistence",null,
			function($data,$nextstat) use (&$msg)
			{
				$n = count($data);
				$msg = ($n > 0) ? "Account exist!!" : "";
				return ($n == 0);
			}))->retrieverecord($table,"WHERE email='".$this->data["email"]."'"));
			
			$this->data["uuid"] = mt_rand();
			$table->setfieldval($this->data);
			$this->mysqlop->pushstatement((
			new MysqlStat("CreateAccount_InsertValue",array("uuid" => $this->data["uuid"]),null))
			->insertrecord($table,null));
			
			$this->executecmd();
		}
		
		public function forgotpassword()
		{
			$msg = $this->msg = "New password is sent to your email!!";
			$email = $this->data["email"];
			$password = mt_rand();
			$table = gl_getacctab()->setfieldsretrivable("uuid",true)
								   ->setfieldval(array("password" => $password));
								   
			$this->mysqlop->pushstatement((
			new MysqlStat("ForgotPassword_CheckExistence",null,
			function($data,$nextstat) use (&$msg,$table)
			{
				$n = count($data);
				$msg = ($n == 0) ? "Account is not found!!" : "";
				
				if($n > 0)
					$nextstat->updaterecord($table,"WHERE uuid='".$data[0]["account.uuid"]."'");
				
				return ($n > 0);
			}))->retrieverecord($table," WHERE email='".$email."'"));			
			
			$this->mysqlop->pushstatement((
			new MysqlStat("ForgotPassword_UpdatePassword",null,
			function($data,$nextstat) use (&$msg,$password,$email)
			{
				if(!mail($email,"iTracker - New password","Your new password:".$password))
				{
					$msg = "Fail to email the new password!!";
					return false;
				}
				
				return true;
			})));
			
			$this->executecmd();	
		}
		
		public function resetpassword()
		{
			$msg = $this->msg = "Password is reset!!";			
			$uuid = $this->data["accountuuid"];
			$oldpw = $this->data["oldpassword"];
			$newpw = $this->data["newpassword"];
			
			$table = gl_getacctab()->setfieldsretrivable("uuid",true);
			$this->mysqlop->pushstatement((
			new MysqlStat("Resetpassword_CheckExistence",null,
			function($data,$nextstat) use (&$msg)
			{
				$n = count($data);
				$msg = ($n == 0) ? "Fail to password confirmation!!" : "";
				return ($n > 0);
			}))->retrieverecord($table,"WHERE uuid='".$uuid."' AND password=MD5('".$oldpw."')"));

			$table = gl_getacctab()->setfieldval(array("password" => $newpw));
			$this->mysqlop->pushstatement((
			new MysqlStat("ResetPassword_UpdatePassword",null,null))
			->updaterecord($table,"WHERE uuid='".$uuid."'"));
			
			$this->executecmd();
		}
		
		public function updateaccount()
		{
			$msg = "Account info is updated!!";
			$uuid = $this->data["accountuuid"];
			
			$table = gl_getacctab()->setfieldval($this->data);
			$this->mysqlop->pushstatement((
			new MysqlStat("UpdateAccount_UpdateInfo",null,null))
			->updaterecord($table,"WHERE uuid='".$uuid."'"));
						
			$this->executecmd();
		}

		public function findfriend()
		{
			$msg = "Find friend is success!!";
			$table = gl_getacctab()->setfieldsretrivable(array("uuid","name"),true);
			$this->mysqlop->pushstatement((
			new MysqlStat("FindFriend_RetrieveAccountRecord",null,
			function($data,$nextstat) use (&$msg)
			{
				$n = count($data);
				$msg = ($n == 0) ? "No account record!!" : "";
				return array("friends" => $data);
			}))->retrieverecord($table,"WHERE name LIKE '%".$this->["name"]."%'"));
			
			$this->executecmd();
		}

		public function browsefriend()
		{
			$msg = "Browse friend is success!!";
			$friendtable = gl_getaccfriendtab()->setfieldsretrivable(array("frienduuid","status"),true);
			$accounttable = gl_getacctab()->setfieldsretrivable(array("name","imgpath","info"),true)
										  ->setfieldjoin("uuid",$friendtable->get("name"),"frienduuid","INNER");
			
			$this->mysqlop->pushstatement((
			new MysqlStat("BrowseFriend_RetrieveRecordInnerJoinAccountAndFriend",null,
			function($data,$nextstat) use (&$msg)
			{
				$n = count($data);
				$msg = ($n == 0) ? "You have no friend!!" : "";
				return array("friends" => $data);
			}))->retrieverecord(array($friendtable,$accounttable),"WHERE accountuuid='".$this->data["accountuuid"]."'");
			
			$this->executecmd();
		}
		
		protected function pushsinglefriendrequest($accountid,$friendid)
		{
			$table = gl_getaccfriendtab()->setfieldval(array("accountuuid"=>$accountid,"frienduuid"=>$friendid));
			$this->mysqlop->pushstatement((
			new MysqlStat("FriendRequest_InsertValue",null,null))
			->insertrecord($table,null));			
		}
		
		public function friendrequest()
		{
			$msg = "Friend request is sent!!";
			if(is_array($this->data["frienduuid"]))
				foreach($this->data["frienduuid"]) as $friendid)
					$this->pushsinglefriendrequest($this->data["accountuuid"],$friendid);
			else		
				$this->pushsinglefriendrequest($this->data["accountuuid"],"frienduuid"=>$this->data["frienduuid"]);			
			
			$this->executecmd();
		}
		
		public function replyfriendreqest()
		{
			$msg = "Friend request is ".$this->data["status"]."!!";
			$table = gl_getaccfriendtab()->setfieldval($this->data);
			$this->mysqlop->pushstatement((
			new MysqlStat("ReplyFriendRequest_UpdateStatus",null,null))
			->updaterecord($table,"WHERE accountuuid='".$this->data["accountuuid"]."' AND frienduuid='".$this->data["frienduuid"]."'"));
			
			$this->executecmd();
		}
		
		public function unfriend()
		{
			$msg = "Unfriend success!!";
			$table = gl_getaccfriendtab();
			$this->mysqlop->pushstatement((
			new MysqlStat("Unfriend_DropRecord",null,null))
			->destroyrecord($table,"WHERE accountuuid='".$this->data["accountuuid"]."' AND frienduuid='".$this->data["frienduuid"]."'"));

			$this->executecmd();
		}
		
		public function createevent()
		{
			$msg = "Event created!!";
			$this->data["uuid"] = mt_rand();
			$table = gl_getevtlisttab()->setfieldval($this->data);
			$this->mysqlop->pushstatement((
			new MysqlStat("CreateEvent_InsertValue",array("uuid" => $this->data["uuid"]),null))
			->insertrecord($table,null));
						
			$this->executecmd();
		}
				
		public function updateevent()
		{
			$msg = "Event updated!!";
			$uuid = $this->data["eventuuid"];
			$table = gl_getevtlisttab()->setfieldval($this->data);
			$this->mysqlop->pushstatement((
			new MysqlStat("UpdateEvent_UpdateValue",null,null))
			->updaterecord($table,"WHERE uuid='".$uuid."'"));			
			
			$this->executecmd();
		}
		
		public function removeevent()
		{
			$msg = "Event removed!!";
			$uuid = $this->data["eventuuid"];
			$table = gl_getevtlisttab();
			$this->mysqlop->pushstatement((
			new MysqlStat("RemoveEvent_DestroyEventListTableRecord",null,null))
			->destroyrecord($table,"WHERE uuid='".$uuid."'"));
			
			$table = gl_getevtdetailtab();
			$this->mysqlop->pushstatement((
			new MysqlStat("RemoveEvent_DestroyEventDetailRecord",null,null))
			->destroyrecord($table,"WHERE eventuuid='".$uuid."'"));
			
			$table = gl_getevtparttab();
			$this->mysqlop->pushstatement((
			new MysqlStat("RemoveEvent_DestroyEventPartyRecord",null,null))
			->destroyrecord($table,"WHERE eventuuid='".$uuid."'"));
			
			$this->executecmd();
		}
		
		public function browseevent()
		{
			$msg = "Public and private events are retrieved!!";
			$evttable = gl_getevtlisttab()->setfieldsretrivable(array("uuid","name","desc","type","date","creatorid"),true);
			$this->mysqlop->pushstatement((
			new MysqlStat("BrowseEvent_RetrievePublicEvent",null,
			function($data,$nextstat){return array("public" => $data);}))
			->retrieverecord($evttable,"WHERE type='PUBLIC'");

			$this->mysqlop->pushstatement((
			new MysqlStat("BrowseEvent_RetrieveCreatedPrivateEvent",null,
			function($data,$nextstat){return array("created" => $data);}))
			->retrieverecord($evttable,"WHERE type='PRIVATE' AND creatoruuid='".$this->data["accountuuid"]."'");
			
			$evtpartytable = gl_getevtparttab();
			$evttable->setfieldjoin("uuid",$evtpartytable->get("name"),"eventuuid","INNER");
			$accounttable = gl_getacctab()->setfieldjoin("uuid",$evttable->get("name"),"creatoruuid","LEFT");
			$this->mysqlop->pushstatement((
			new MysqlStat("BrowseEvent_RetrieveInvitedPrivateEvent",null,
			function($data,$nextstat){return array("invited" => $data);}))
			->retrieverecord(array($evtpartytable,$evttable,$accounttable),"WHERE partyuuid='".$this->data["accountuuid"]."')");
						
			$this->executecmd();
		}		

		public function browseeventdetail()
		{
			$msg = "Event detail is retrieved!!";
			$table = gl_getevtdetailtab()->setfieldsretrivable(array("uuid","lat","lng","time","desc"),true);
			$this->mysqlop->pushstatement((
			new MysqlStat("BrowseEventDetail_RetrieveData",null,
			function($data,$nextstat){return array("details" => $data);}))
			->retrieverecord($table,"WHERE eventuuid='".$this->data["eventuuid"]."')");			
			
			$this->executecmd();
		}	
		
		protected function pushsingleinvitefriendevent($evtid,$partyid)
		{
			$table = gl_getevtparttab()->setfieldval(array("eventuuid"=>$evtid,"partyuuid"=>partyid));
			$this->mysqlop->pushstatement((
			new MysqlStat("InviteFriendEvent_InsertValue",null,null))
			->insertrecord($table,null));			
		}

		public function invitefriendevent()
		{
			$msg = $this->msg = "Friend invited!!";
			if(is_array($this->data["partyuuid"]))
				foreach($this->data["partyuuid"] as $partyid)
					$this->pushsingleinvitefriendevent($this->data["eventuuid"],$partyid);
			else
				$this->pushsingleinvitefriendevent($this->data["eventuuid"],$this->data["partyuuid"]);
			
			$this->executecmd();
		}
		
		public function createeventdetail()
		{
			$msg = $this->msg = "Create event detail success!!";			
			$this->data["uuid"] = mt_rand();
			$table = gl_getevtdetailtab()->setfieldval($this->data);
			$this->mysqlop->pushstatement((
			new MysqlStat("CreateEventDetail_InsertValue",array("uuid" => $this->data["uuid"]),null))
			->insertrecord($table,null));
			
			$this->executecmd();
		}
		
		public function updateeventdetail()
		{
			$msg = "Event detaail updated!!";
			$uuid = $this->data["eventdetailuuid"];
			$table = gl_getevtdetailtab()->setfieldval($this->data);
			$this->mysqlop->pushstatement((
			new MysqlStat("UpdateEventDetail_UpdateValue",null,null))
			->updaterecord($table,"WHERE uuid='".$uuid."'"));	
			
			$this->executecmd();
		}
		
		public function removeeventdetail()
		{
			$msg = "Event detail removed!!";
			$uuid = $this->data["eventdetailuuid"];
			
			$table = gl_getevtdetailtab();
			$this->mysqlop->pushstatement((
			new MysqlStat("RemoveEventDetail_DestroyEventDetailRecord",null,null))
			->destroyrecord($table,"WHERE uuid='".$uuid."'"));
			
			$this->executecmd();
		}
	}
?>