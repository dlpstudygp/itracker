<?php
	// Author= Dee
	// Date= 2015/01/10
	// The definition of the data type ...
		
	define(MYSQL_DT_TEXT,"text");
	define(MYSQL_DT_NUMBER,"number");
	define(MYSQL_DT_UUID,"uuid");
	define(MYSQL_DT_DATETIME,"datetime");
	define(MYSQL_DT_PASSWORD,"password");
	define(MYSQL_DT_BOOLEAN,"boolean");
	define(MYSQL_DT_JSON,"json");
	
	class MysqlDt
	{
		protected $type = MYSQL_DT_TEXT;
		protected $mysqlstr = "";
		
		public function __construct()
		{
			return $this;
		}

		public static function dtfactory($type,$arg)
		{
			$dt = new MysqlDt();
			call_user_func_array(array($dt,$type),$arg);
			return $dt;
		}
		
		protected function setting($def,$isnotnull,$option)
		{
			$s = "";
			if($isnotnull)
				$s .= " NOT NULL";
			if(is_string($def))
			{
				if(strpos($def,"FUNC:") === 0)
					$s .= (" DEFAULT ".str_replace("FUNC:","",$def));
				else
					$s .= (" DEFAULT '".$def."'");	
			}
			else if(is_numeric($def))
				$s .= (" DEFAULT ".$def);
			if(is_string($option))
				$s .= (" ".$option);			
	
			return $s;			
		}
		
		public function enum($obj,$def,$isnotnull,$option)
		{			
			$s = "";
			if(is_string($obj))
				return $this->enum(explode(",",$obj),$def,$isnotnull,$option);
			else if(is_array($obj))
				foreach($obj as $val)
					$s .= ((strlen($s) == 0) ? ("'".$val."'") : (",'".$val."'"));
			
			$this->type = MYSQL_DT_TEXT;
			$this->mysqlstr = "ENUM(".$s.")";			
			$this->mysqlstr .= $this->setting($def,$isnotnull,$option);
			return $this;
		}
		
		public function text($charnum,$def,$isnotnull,$option)
		{
			$this->type = MYSQL_DT_TEXT;
			$this->mysqlstr = (is_integer($charnum)) ? ("VARCHAR(".$charnum.")") : "TEXT";
			$this->mysqlstr .= $this->setting($def,$isnotnull,$option);	
			return $this;
		}
		
		public function integernum($size,$isunsigned,$charnum,$isautoinc,$iszerofill,$def,$isnotnull,$option)
		{
			$sizelist = array("TINYINT","SMALLINT","MEDIUMINT","INT","BIGINT");

			$this->type = MYSQL_DT_NUMBER;
			$this->mysqlstr = ($sizelist[$size]) ? $sizelist[$size] : $sizelist[3];
			if(is_integer($charnum))
				$this->mysqlstr .= ("(".$charnum.")");
			if($isunsigned)
				$this->mysqlstr .= " UNSIGNED";
			if($isautoinc)
				$this->mysqlstr .= " AUTO_INCREMENT";
			if($iszerofill)
				$this->mysqlstr .= " ZEROFILL";
				
			$this->mysqlstr .= $this->setting($def,$isnotnull,$option);		
			return $this;
		}

		public function decimalnum($size,$isunsigned,$charnum,$precision,$iszerofill,$def,$isnotnull,$option)
		{
			$sizelist = array("FLOAT","DOUBLE","DECIMAL");

			$this->type = MYSQL_DT_NUMBER;
			$this->mysqlstr = ($sizelist[$size]) ? $sizelist[$size] : $sizelist[3];

			if(is_integer($charnum))
			{
				$this->mysqlstr .= ("(".$charnum);
				$this->mysqlstr .= ((is_integer($precision)) ? (",".$precision.")") : ")");
			}
			if($isunsigned)
				$this->mysqlstr .= " UNSIGNED";
			if($iszerofill)
				$this->mysqlstr .= " ZEROFILL";
		
			$this->mysqlstr .= $this->setting($def,$isnotnull,$option);	
			return $this;
		}		
		
		public function password($charnum)
		{
			$this->text($charnum,null,true,null);
			$this->type = MYSQL_DT_PASSWORD;			
			return $this;
		}
		
		public function uuid($isautoinc)
		{
			if($isautoinc)
				$this->integernum(3,true,null,true,true,null,true,"PRIMARY KEY");
			else
				$this->text(32,null,true,"PRIMARY KEY");

			$this->type = MYSQL_DT_UUID;					
			return $this;
		}
		
		public function json($def,$isnotnull,$option)
		{
			$this->text(null,$def,$isnotnull,$option);
			$this->type = MYSQL_DT_JSON;
			return $this;
		}
		
		public function datetime($iscurtimestamp)
		{
			$this->type = MYSQL_DT_DATETIME;
			$this->mysqlstr = "TIMESTAMP";
		
			if($iscurtimestamp)
				$this->mysqlstr .= $this->setting("FUNC:CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",true,null);			
			
			return $this;
		}

		public function binary($isdeftrue,$option)
		{
			$this->enum(array("Y","N"),(($isdeftrue) ? "Y" : "N"),false,$option);
			$this->type = MYSQL_DT_BOOLEAN;			
			return $this;
		}

		public function gettype()
		{
			return $this->type;
		}
		
		public function getmysqlstr()
		{
			return $this->mysqlstr;
		}
	}	
?>