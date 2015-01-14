<?php
	// Author= Dee
	// Date= 2015/01/10
	// Independence= MysqlDt
	// The definition of the Field ...
	
	include_once dirname(__FILE__).'/mysql_el_dt.php';
		
	class MysqlField
	{
		protected $setting = array
		(
			"name" => "FieldName",
			"datatype" => (new MysqlDt()).text(null,null,false,null),
			"value" => null,
			"isretrivable" => true,
			"rename" => false,
			"join" => array("table" => false, "field" => false, "type" => "INNER JOIN")
		);
		
		public function __construct($name,$datatype)
		{
			return $this->set("name",$name)
						->set("datatype",$datatype);
		}
		
		public function set($key,$val)
		{
			switch($key)
			{
				case "name":
					$this->setting[$key] = (is_string($val)) ? $val : $this->setting[$key];
					break;
				case "datatype":
					$this->setting[$key] = ($val instanceof MysqlDt) ? $val : $this->setting[$key];
					break;
				case "value":
					$this->setting[$key] = ($val != null) ? $this->convertvaltomysqlstr($val,$this->setting["datatype"]) : null;
					break;
				case "isretrivable":
					$this->setting[$key] = ($val != null) ? (($val !== false) ? true : false) : $this->setting[$key];
					break;
				case "rename":
					$this->setting[$key] = ($val != null) ? $val : $this->setting[$key];
					break;
			}
						
			return $this;
		}
		
		public function setjoin($jointable,$joinfield,$jointype)
		{
			$this->setting["join"]["table"] = (is_string($jointable)) ? $jointable : false;
			$this->setting["join"]["field"] = (is_string($joinfield)) ? $joinfield : false;
			$this->setting["join"]["type"] = (array_search($jointype,array("INNER","LEFT","RIGHT","FULL")) !== false) ? ($jointype." JOIN") : "INNER JOIN";
			
			return $this;
		}
		
		public function get($key)
		{
			return $this->setting[$key];
		}
	
		protected function convertvaltomysqlstr($value,$datatype)
		{
			$s = $value;
			if(strpos($s,"FUNC:") === false)
			{	
				switch($datatype->gettype())
				{
					case MYSQL_DT_DATETIME:
						if($value instanceof DateTime)	
							$s = "'".$value->format('Y-m-d H:i:s')."'";
						else if(is_string($value) || is_numeric($value))
							$s = $this->convertvaltomysqlstr(new DateTime($value));
						else
							$s = "NOW()";
						break;
					case MYSQL_DT_PASSWORD:
						$s = "MD5('".$value."')";
						break;
					case MYSQL_DT_TEXT:
						$s = "'".$value."'";
						break;
					case MYSQL_DT_JSON:
						if(is_string($value) || is_numeric($value))
							$s = "'".$value."'";
						else
							$s = "'".json_encode($value)."'";
						break;
					default:
						break;
				}
			}
			else
				$s = substr($s,5);
			
			return $s;
		}
	}	
?>