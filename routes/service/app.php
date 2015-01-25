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
		protected $mysqlop = null;
		protected static $msg = "";
		protected static $anonymous = null;
		
		public function __construct($data,$errhandler,$callback)
		{
			$this->mysqlop = new MysqlBase(MYSQL_DEF_HOSTADDR,MYSQL_DEF_USERNAME,MYSQL_DEF_PASSWORD,MYSQL_DEF_DBNAME);
			return parent::__construct($data,$errhandler,$callback);
		}
		
		protected function executecmd()
		{
			$ret = $this->mysqlop->execute();
			if($ret === MYSQL_OP_ERROR)
				$this->executeerror($this->mysqlop->getmsg());
			else if($ret === MYSQL_OP_NOTSUCCESS)
				$this->executecallback(0,self::$msg,null);
			else
				$this->executecallback(1,self::$msg,$this->mysqlop->getdata());				
		}
		
		// define the app request here ... 
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public static function logincallback($data,$nextstat)
		{
			if(count($data) == 0)
			{
				self::$msg = "Login fail!";
				return false;
			}
				
			return $data[0];			
		}
		
		public function login()
		{
			self::$msg = "Login success!!";
			$e = $this->data["email"];
			$pw = $this->data["password"];
			
			$table = gl_getacctab()->setallfieldsretrivable(true)->setfieldsretrivable("password",false);
			$stat = new MysqlStat("Login_CheckEmailPw",null,array("AppServ","logincallback"));
			$this->mysqlop->pushstatement($stat->retrieverecord($table,"WHERE email='".$e."' AND password=MD5('".$pw."')"));
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public static function createaccountcallback($data,$nextstat)
		{
			$n = count($data);
			self::$msg = ($n > 0) ? "Account exist!!" : "";
			return ($n == 0);			
		}
		
		public function createaccount()
		{
			self::$msg = "Create account success!!";
			$table = gl_getacctab()->setfieldsretrivable("uuid",true);
			$stat = new MysqlStat("CreateAccount_CheckExistence",null,array("AppServ","createaccountcallback"));
			$this->mysqlop->pushstatement($stat->retrieverecord($table,"WHERE email='".$this->data["email"]."'"));
			
			$this->data["uuid"] = mt_rand();
			$retdata = array();
			foreach($this->data as $key=>$val)
				$retdata["account_".$key] = $val;
				
			$table->setfieldval($this->data);
			$stat = new MysqlStat("CreateAccount_InsertValue",$retdata,null);
			$this->mysqlop->pushstatement($stat->insertrecord($table,null));
			
			$this->executecmd();
		}
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public static function forgorpasswordcallback1($data,$nextstat)
		{
			$n = count($data);
			self::$msg = ($n == 0) ? "Account is not found!!" : "";
				
			if($n > 0)
				$nextstat->updaterecord(self::$anonymous["table"],"WHERE uuid='".$data[0]["account.uuid"]."'");
				
			return ($n > 0);			
		}

		public static function forgorpasswordcallback2($data,$nextstat)
		{
			if(!mail(self::$anonymous["email"],"iTracker - New password","Your new password:".$anonymous["password"]))
			{
				self::$msg = "Fail to email the new password!!";
				return false;
			}
				
			return true;			
		}
		
		public function forgotpassword()
		{
			self::$msg = "New password is sent to your email!!";
			self::$anonymous = array();
			self::$anonymous["email"] = $email = $this->data["email"];
			self::$anonymous["password"] = $password = mt_rand();
			self::$anonymous["table"] = $table = gl_getacctab()->setfieldsretrivable("uuid",true)
															   ->setfieldval(array("password" => $password));
			
			$stat = new MysqlStat("ForgotPassword_CheckExistence",null,array("AppServ","forgorpasswordcallback1"));
			$this->mysqlop->pushstatement($stat->retrieverecord($table," WHERE email='".$email."'"));			
			
			$stat = new MysqlStat("ForgotPassword_UpdatePassword",null,array("AppServ","forgorpasswordcallback2"));
			$this->mysqlop->pushstatement($stat);
			
			$this->executecmd();	
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public static function resetpasswordcallback($data,$nextstat)
		{
			$n = count($data);
			self::$msg = ($n == 0) ? "Fail to password confirmation!!" : "";
			return ($n > 0);			
		}
		
		public function resetpassword()
		{
			self::$msg = $this->msg = "Password is reset!!";			
			$uuid = $this->data["accountuuid"];
			$oldpw = $this->data["oldpassword"];
			$newpw = $this->data["newpassword"];
			
			$table = gl_getacctab()->setfieldsretrivable("uuid",true);
			$stat = new MysqlStat("Resetpassword_CheckExistence",null,array("AppServ","resetpasswordcallback"));
			$this->mysqlop->pushstatement($stat->retrieverecord($table,"WHERE uuid='".$uuid."' AND password=MD5('".$oldpw."')"));

			$table = gl_getacctab()->setfieldval(array("password" => $newpw));
			$stat = new MysqlStat("ResetPassword_UpdatePassword",null,null);
			$this->mysqlop->pushstatement($stat->updaterecord($table,"WHERE uuid='".$uuid."'"));
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function updateaccount()
		{
			self::$msg = "Account info is updated!!";
			$uuid = $this->data["accountuuid"];

			$retdata = array();
			foreach($this->data as $key=>$val)
				if($key <> "accountuuid")
					$retdata["account_".$key] = $val;
				
			$table = gl_getacctab()->setfieldval($this->data);
			$stat = new MysqlStat("UpdateAccount_UpdateInfo",$retdata,null);
			$this->mysqlop->pushstatement($stat->updaterecord($table,"WHERE uuid='".$uuid."'"));
						
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public static function findfriendcallback($data,$nextstat)
		{
			$n = count($data);
			$msg = ($n == 0) ? "No account record!!" : "";
			return array("friends" => $data);			
		}
		
		public function findfriend()
		{
			self::$msg = "Find friend is success!!";
			$table = gl_getacctab()->setfieldsretrivable(array("uuid","name"),true);
			$stat = new MysqlStat("FindFriend_RetrieveAccountRecord",null,array("AppServ","findfriendcallback"));
			$this->mysqlop->pushstatement($stat->retrieverecord($table,"WHERE name LIKE '%".$this->data["name"]."%'"));
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public static function browsefriendcallback($data,$nextstat)
		{
			$n = count($data);
			self::$msg = ($n == 0) ? "You have no friend!!" : "";
			return array("friends" => $data);
		}
		
		public function browsefriend()
		{
			self::$msg = "Browse friend is success!!";
			$friendtable = gl_getaccfriendtab()->setfieldsretrivable(array("frienduuid","status"),true);
			$accounttable = gl_getacctab()->setfieldsretrivable(array("name","imgpath","info"),true)
										  ->setfieldjoin("uuid",$friendtable->get("name"),"frienduuid","INNER");
			
			$stat = new MysqlStat("BrowseFriend_RetrieveRecordInnerJoinAccountAndFriend",null,array("AppServ","browsefriendcallback"));
			$this->mysqlop->pushstatement($stat->retrieverecord(array($friendtable,$accounttable),"WHERE accountuuid='".$this->data["accountuuid"]."'"));
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		protected function pushsinglefriendrequest($accountid,$friendid)
		{
			$table = gl_getaccfriendtab()->setfieldval(array("accountuuid"=>$accountid,"frienduuid"=>$friendid));
			$stat = new MysqlStat("FriendRequest_InsertValue",null,null);
			$this->mysqlop->pushstatement($stat->insertrecord($table,null));			
		}
		
		public function friendrequest()
		{
			self::$msg = "Friend request is sent!!";
			if(is_array($this->data["frienduuid"]))
				foreach($this->data["frienduuid"] as $friendid)
					$this->pushsinglefriendrequest($this->data["accountuuid"],$friendid);
			else		
				$this->pushsinglefriendrequest($this->data["accountuuid"],$this->data["frienduuid"]);			
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function replyfriendreqest()
		{
			self::$msg = "Friend request is ".$this->data["status"]."!!";
			$table = gl_getaccfriendtab()->setfieldval($this->data);
			$stat = new MysqlStat("ReplyFriendRequest_UpdateStatus",
			array(
				"friends.frienduuid" => $this->data["frienduuid"],
				"friends.status" => $this->data["status"]
			),null);
			
			$this->mysqlop->pushstatement($stat->updaterecord($table,"WHERE accountuuid='".$this->data["accountuuid"]."' AND frienduuid='".$this->data["frienduuid"]."'"));
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function unfriend()
		{
			self::$msg = "Unfriend success!!";
			$table = gl_getaccfriendtab();
			$stat = new MysqlStat("Unfriend_DropRecord",array("friends.frienduuid" => $this->data["frienduuid"]),null);
			$this->mysqlop->pushstatement($stat->destroyrecord($table,"WHERE accountuuid='".$this->data["accountuuid"]."' AND frienduuid='".$this->data["frienduuid"]."'"));

			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function createevent()
		{
			self::$msg = "Event created!!";
			$this->data["uuid"] = mt_rand();
			$retdata = array();
			foreach($this->data as $key=>$val)
				$retdata["events_".$key] = $val;
				
			$table = gl_getevtlisttab()->setfieldval($this->data);
			$stat = new MysqlStat("CreateEvent_InsertValue",$retdata,null);
			$this->mysqlop->pushstatement($stat->insertrecord($table,null));
						
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++				
		public function updateevent()
		{
			self::$msg = "Event updated!!";
			$uuid = $this->data["eventuuid"];

			$retdata = array();
			foreach($this->data as $key=>$val)
				if($key <> "eventuuid")
					$retdata["events_".$key] = $val;
				
			$table = gl_getevtlisttab()->setfieldval($this->data);
			$stat = new MysqlStat("UpdateEvent_UpdateValue",$retdata,null);
			$this->mysqlop->pushstatement($stat->updaterecord($table,"WHERE uuid='".$uuid."'"));			
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function removeevent()
		{
			self::$msg = "Event removed!!";
			$uuid = $this->data["eventuuid"];
			$table = gl_getevtlisttab();
			$stat = new MysqlStat("RemoveEvent_DestroyEventListTableRecord",array("events.uuid" => $uuid),null);
			$this->mysqlop->pushstatement($stat->destroyrecord($table,"WHERE uuid='".$uuid."'"));
			
			$table = gl_getevtdetailtab();
			$stat = new MysqlStat("RemoveEvent_DestroyEventDetailRecord",null,null);
			$this->mysqlop->pushstatement($stat->destroyrecord($table,"WHERE eventuuid='".$uuid."'"));
			
			$table = gl_getevtparttab();
			$stat = new MysqlStat("RemoveEvent_DestroyEventPartyRecord",null,null);
			$this->mysqlop->pushstatement($stat->destroyrecord($table,"WHERE eventuuid='".$uuid."'"));
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public static function browseeventcallback1($data,$nextstat)
		{
			return array("public" => $data);
		}

		public static function browseeventcallback2($data,$nextstat)
		{
			return array("created" => $data);
		}

		public static function browseeventcallback3($data,$nextstat)
		{
			return array("invited" => $data);
		}
		
		public function browseevent()
		{
			self::$msg = "Public and private events are retrieved!!";
			$evttable = gl_getevtlisttab()->setfieldsretrivable(array("uuid","name","description","type","date","creatorid"),true);
			$stat = new MysqlStat("BrowseEvent_RetrievePublicEvent",null,array("AppServ","browseeventcallback1"));
			$this->mysqlop->pushstatement($stat->retrieverecord($evttable,"WHERE type='PUBLIC'"));

			$stat = new MysqlStat("BrowseEvent_RetrieveCreatedPrivateEvent",null,array("AppServ","browseeventcallback2"));
			$this->mysqlop->pushstatement($stat->retrieverecord($evttable,"WHERE type='PRIVATE' AND creatoruuid='".$this->data["accountuuid"]."'"));
			
			$evtpartytable = gl_getevtparttab();
			$evttable->setfieldjoin("uuid",$evtpartytable->get("name"),"eventuuid","INNER");
			$accounttable = gl_getacctab()->setfieldjoin("uuid",$evttable->get("name"),"creatoruuid","LEFT");
			$stat = new MysqlStat("BrowseEvent_RetrieveInvitedPrivateEvent",null,array("AppServ","browseeventcallback3"));
			$this->mysqlop->pushstatement($stat->retrieverecord(array($evtpartytable,$evttable,$accounttable),"WHERE partyuuid='".$this->data["accountuuid"]."')"));
						
			$this->executecmd();
		}		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		public static function browseeventdetailcallback($data,$nextstat)
		{
			return array("details" => $data);
		}
		
		public function browseeventdetail()
		{
			$msg = "Event detail is retrieved!!";
			$table = gl_getevtdetailtab()->setfieldsretrivable(array("uuid","lat","lng","time","description"),true);
			$stat = new MysqlStat("BrowseEventDetail_RetrieveData",null,array("AppServ","browseeventdetailcallback"));
			$this->mysqlop->pushstatement($stat->retrieverecord($table,"WHERE eventuuid='".$this->data["eventuuid"]."')"));			
			
			$this->executecmd();
		}	
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		protected function pushsingleinvitefriendevent($evtid,$partyid)
		{
			$table = gl_getevtparttab()->setfieldval(array("eventuuid"=>$evtid,"partyuuid"=>partyid));
			$stat = new MysqlStat("InviteFriendEvent_InsertValue",null,null);
			$this->mysqlop->pushstatement($stat->insertrecord($table,null));			
		}

		public function invitefriendevent()
		{
			self::$msg = "Friend invited!!";
			if(is_array($this->data["partyuuid"]))
				foreach($this->data["partyuuid"] as $partyid)
					$this->pushsingleinvitefriendevent($this->data["eventuuid"],$partyid);
			else
				$this->pushsingleinvitefriendevent($this->data["eventuuid"],$this->data["partyuuid"]);
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function createeventdetail()
		{
			self::$msg = "Create event detail success!!";			
			$this->data["uuid"] = mt_rand();
			$retdata = array();
			foreach($this->data as $key=>$val)
				$retdata["eventdetail_".$key] = $val;
				
			$table = gl_getevtdetailtab()->setfieldval($this->data);
			$stat = new MysqlStat("CreateEventDetail_InsertValue",$retdata,null);
			$this->mysqlop->pushstatement($stat->insertrecord($table,null));
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function updateeventdetail()
		{
			self::$msg = "Event detaail updated!!";
			$uuid = $this->data["eventdetailuuid"];
			
			$retdata = array();
			foreach($this->data as $key=>$val)
				if($key <> "eventdetailuuid")
					$retdata["eventdetail_".$key] = $val;
			
			$table = gl_getevtdetailtab()->setfieldval($this->data);
			$stat = new MysqlStat("UpdateEventDetail_UpdateValue",$retdata,null);
			$this->mysqlop->pushstatement($stat->updaterecord($table,"WHERE uuid='".$uuid."'"));	
			
			$this->executecmd();
		}
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
		public function removeeventdetail()
		{
			self::$msg = "Event detail removed!!";
			$uuid = $this->data["eventdetailuuid"];
			
			$table = gl_getevtdetailtab();
			$stat = new MysqlStat("RemoveEventDetail_DestroyEventDetailRecord",array("eventdetail.uuid" => $uuid),null);
			$this->mysqlop->pushstatement($stat->destroyrecord($table,"WHERE uuid='".$uuid."'"));
			
			$this->executecmd();
		}
	}
?>