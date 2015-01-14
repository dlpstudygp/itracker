<?php
	// Author= Dee
	// Date= 2015/01/10
	// The definition of the class of mysql operation ...
	// dependence : MysqlDt, MysqlField, MysqlTable, MysqlStat
	
	include_once dirname(__FILE__).'/../el/mysql_el_stat.php';
	
	define(MYSQL_OP_ERROR,"error");
	define(MYSQL_OP_SUCCESS,"success");
	define(MYSQL_OP_NOTSUCCESS,"notsuccess");
	
	class MysqlBase
	{
		protected $conn = null;
		protected $msg = "";
		protected $statstack = array();
		protected $returndata = array();
		protected $dbinfo = array
		(
			"hostaddr" => "",
			"username" => "",
			"password" => "",
			"name" => ""
		)
		
		function __construct($hostaddr,$username,$pw,$name)
		{
			$this->dbinfo["hostaddr"] = $hostaddr;
			$this->dbinfo["username"] = $username;
			$this->dbinfo["password"] = $pw;
			$this->dbinfo["name"] = $name;
			return $this;
		}
		
		protected function connect()
		{
			$this->conn = mysqli_connect($this->dbinfo["hostaddr"],$this->dbinfo["username"],$this->dbinfo["password"]);

			if(!$this->conn)
			{
				$this->conn = null;
				$this->msg = "Cannot connect to Mysql";
				return false;
			}
			else
			{
				$this->conn->set_charset('utf8');
				if(!mysqli_select_db($this->conn,$this->dbinfo["name"]))
				{
					$this->conn = null;
					$this->msg = "Cannot connect to database";						
					return false;
				}
				else
					$this->msg = "Connected";
			}

			return true;
		}
		
		public function pushstatement($stat)
		{
			if($stat instanceof MysqlStat)
				array_push($this->statstack,$stat);
			
			return $this;
		}
		
		public function getmsg()
		{
			return $this->msg;
		}
		
		public function getdata()
		{
			return $this->returndata;
		}
		
		protected function closeconn()
		{
			$this->msg = "Connection close";
			if($this->conn <> null)
				mysqli_close($this->conn);
		}
		
		protected function executesingle($index)
		{
			if($this->conn == null)
				return null;
			
			$currentstat = $this->statstack[$index];
			$ret = mysqli_query($this->conn,$currentstat->stat);
			if(!$ret)
			{
				$this->msg = 'Execute failed: '.mysqli_error($this->conn).': '.$currentstat->getname.": ".$currentstat->stat;	
				return MYSQL_OP_ERROR;
			}

			$data = array();
			$i = 0;
		
			if(!is_bool($ret))
			{
				while($i<mysqli_num_fields($ret))
				{
					$meta = mysqli_fetch_field($ret);
					$ColumnName[] = $meta->name;
					$i++;	
				}
		
				// any special character
				$specialchar = array("&",">","<");
				$specialcharreplace = array("&amp;","&gt;","&lt;");
		
				// store in the array
				$w=0;
				$numoffields=0;
				while($line = mysqli_fetch_array($ret,MYSQLI_ASSOC))
				{
					$row = array();
			
					foreach($line as $col_val)
					{
						$row[$ColumnName[$w]] = $col_val_strip = str_replace($specialchar,$specialcharreplace,$col_val);
				
						if($w == ($i-1))
						{$w = 0;}
						else
						{$w++;}
					}
			
					$data[$numoffields] = $row;
					$numoffields++;
				}
		
				// clear the sql connection
				mysqli_free_result($ret);
			}

			return $currentstat->executecallback($data,$this->statstack[$index+1]);									
		}
		
		public function execute()
		{
			$this->returndata = array();
			if(!$this->connect())
				return MYSQL_OP_ERROR;
			
			$count = count($this->statstack);
			for($i=0;$i<$count;$i++)
			{
				$currentstat = $this->statstack[$i];
				$this->msg = "Execute: ".$currentstat->getname();
	
				$ret = $this->executesingle($i);
				if($ret === MYSQL_OP_ERROR)
				{
					$this->closeconn();
					$this->statstack = array();
					return MYSQL_OP_ERROR;
				}
				else if($ret === false)
				{
					$this->closeconn();
					$this->statstack = array();
					return MYSQL_OP_NOTSUCCESS;					
				}
				else if(is_array($ret))
					$this->returndata = array_merge($this->returndata,$ret);
				
				$params = $currentstat->getparams();
				if(is_array($params))
					$this->returndata = array_merge($this->returndata,$params);
			}
			
			$this->closeconn();
			$this->statstack = array();
			return MYSQL_OP_SUCCESS;		
		}		
	};
?>