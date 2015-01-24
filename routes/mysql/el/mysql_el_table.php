<?php
	// Author= Dee
	// Date= 2015/1/10
	// Independence= MysqlDt, MysqlField
	// The definition of the Table ...
	
	include_once dirname(__FILE__).'/mysql_el_field.php';
	
	class MysqlTable
	{	
		protected $setting = array
		(
			"fields" => array(),
			"name" => "TableName",
			"rename" => false
		);
		
		public function __construct($name,$fields)
		{
			return $this->set("name",$name)->set("fields",$fields);
		}

		public function set($key,$val)
		{
			switch($key)
			{
				case "name":
					$this->setting[$key] = (is_string($val)) ? $val : $this->setting[$key];
					break;
				case "rename":
					$this->setting[$key] = ($val !== null) ? $val : $this->setting[$key];
					break;
				case "fields":
					$this->setfield($val);
					break;
			}
			
			return $this;
		}
		
		public function get($key)
		{
			return $this->setting[$key];
		}
		
		public function setfieldval($fieldvals)
		{
			if(is_array($fieldvals))
				foreach($fieldvals as $key=>$val)
					if($this->setting["fields"][$key])
						$this->setting["fields"][$key]->set("value",$val);
					
			return $this;		
		}

		public function setfieldjoin($key,$jointable,$joinfield,$jointype)
		{
			if($this->setting["fields"][$key])
				$this->setting["fields"][$key]->setjoin($jointable,$joinfield,$jointype);
			
			return $this;		
		}
		
		public function setallfieldsretrivable($b)
		{
			foreach($this->setting["fields"] as $field)
				$field->set("isretrivable",$b);
					
			return $this;			
		}
		
		public function setfieldsretrivable($fields,$b)
		{
			if(is_array($fields))
				foreach($fields as $field)
					return $this->setfieldsretrivable($field,$b);
			else if(is_string($fields))
				$this->setting["fields"][$fields]->set("isretrivable",$b);
					
			return $this;			
		}		
		
		public function getfield($key)
		{
			return $this->setting["fields"][$key];
		}
		
		protected function setfield($fields)
		{
			if(is_array($fields))
				foreach($fields as $field)
					$this->setfield($field);
			else if($fields instanceof MysqlField)
				$this->setting["fields"][$fields->get("name")] = $fields;
		}		
	}	
?>