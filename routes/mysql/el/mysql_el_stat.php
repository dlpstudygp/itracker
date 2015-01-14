<?php
	// Author= Dee
	// Date= 2015/01/10
	// Independence= MysqlTable
	// The definition of the common statement ...

	include_once dirname(__FILE__).'/mysql_el_table.php';
	
	class MysqlStat
	{
		public $stat = "";		
		protected $name = "";
		protected $params = null;
		protected $callback = null;
		
		public function __construct($name,$params,$callback)
		{
			$this->name = (is_string($name)) ? $name : rand();
			$this->params = $params;
			$this->callback = $callback;
			return $this;
		}
		
		protected function setalterstat($table,$op)
		{
			if($table instanceof MysqlTable)
			{
				$s = "";
				foreach($table->get("fields") as $field)
				{
					$fieldname = $field->get("name");
					$fieldmysqlstr = $field->get("datatype")->getmysqlstr();
					$ss = "";
					
					if(op === "ADD")
						$ss = "ADD COLUMN '".$fieldname+"' "+$fieldmysqlstr;
					else if(op === "DROP")
						$ss = "DROP COLUMN '".$fieldname."'";
					else
						$ss = "CHANGE '".$fieldname."' '".$field->get("rename")."'".$fieldmysqlstr;

					$s .= ((count($s) == 0) ? $ss : (",".$ss));
				}
	
				return "ALTER TABLE ".$table->get("name")." ".$s;
			}
			
			return "ALTER TABLE Table";			
		}

		public function createtable($tables,$append)
		{
			$this->stat = "CREATE TABLE IF NOT EXISTS ";
			if($tables instanceof MysqlTable)
			{
				$s = "";
				foreach($table->get("fields") as $field)
				{
					$ss = $field->get("name")." ".$field->get("datatype")->getmysqlstr();
					$s .= ((count($s) == 0) ? $ss : (",".$ss));
				}
				
				$this->stat .= $tables->get("name").((count($s) > 0) ? ("(".$s.")") : "");
			}
			else if(is_string($tables))
				$this->stat .= $tables;
				
			$this->stat .= ((is_string(append)) ? (" ".$append) : "");
			return $this;
		}
		
		public function renametable($tables,$append)
		{
			$s = "";
			if(is_array($tables))
			{
				foreach($tables as $table)
				{
					if($table instanceof MysqlTable)
					{
						$ss = $table->get("name")." TO ".$table->get("rename");
						$s .= ((count($s) == 0) ? $ss : (",".$ss));
					}	
				}		
			}
			else if($tables instanceof MysqlTable)
				$s .= ($tables->get("name")." TO ".$tables->get("rename"));

			$this->stat = "RENAME TABLE ".$s;
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;		
		}
		
		public function destroytable($tables,$append)
		{
			$s = "";
			if(is_array($tables))
			{	
				foreach($tables as $table)
				{
					if($table instanceof MysqlTable)
						$s .= ((count($s) == 0) ? $table->get("name") : (",".$table->get("name")));	
					else if(is_string($table))
						$s .= ((count($s) == 0) ? $table : (",".$table));	
				}	
			}
			else if($tables instanceof MysqlTable)
				$s = $tables->get("name");
			else if(is_string($tables))
				$s = $tables;
			
			$this->stat = "DROP TABLE IF EXISTS ".$s;
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;
		}
		
		public function createcol($tables,$append)
		{
			$this->stat = $this->setalterstat($tables,"ADD");
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;
		}
		
		public function updatecol($tables,$append)
		{
			$this->stat = $this->setalterstat($tables,"CHANGE");
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;			
		}
		
		public function destroycol($tables,$append)
		{
			$this->stat = $this->setalterstat($tables,"DROP");
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;				
		}
		
		public function insertrecord($tables,$append)
		{
			if($tables instanceof MysqlTable)
			{
				$sf = "";
				$sv = "";
				
				foreach($tables->get("fields") as $field)
				{
					if($field->get("value"))
						$sf .= ((($sf!="") ? "," : "") . $fields->get("datatype")->getmysqlstr());
					if($field->get("value"))
						$sv .= ((($sv!="") ? "," : "") + $field->get("value"));				
				}

				$this->stat = "INSERT INTO ".$tables->get("name")." (".$sf.") VALUES (".$sv.")";
			}
			
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;		
		}
		
		public function destroyrecord($tables,$append)
		{
			$this->stat = "DELETE FROM " . (($tables instanceof MysqlTable) ? $tables->get("name") : $tables);
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;			
		}
	
		public function updaterecord($tables,$append)
		{
			if($tables instanceof MysqlTable)
			{
				$sv = "";
				foreach($tables->get("fields") as $field)
					if($field->get("value"))
						$sv .= ((($sv!="") ? "," : "").($field->get("name")."=".$field->get("value")));
				
				$this->stat = "UPDATE ".$tables->get("value")." SET ".$sv;
			}
		
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;			
		}
		
		public function retrieverecord($tables,$append)
		{
			if(is_array($tables))
			{
				$col = "";
				$join = "";
				
				foreach($tables as $table)
				{
					if($table instanceof MysqlTable)
					{	
						foreach($table->get("fields") as $field)
						{	
							if($field->get("isretrivable"))
								$col .= ((($col!="") ? "," : "").($table->get("name").".".$field->get("name"));	
							
							$joinsetting = $field->get("join");
							if($joinsetting["table"] !== false)
								$join .= ((($join!="") ? " " : "").($joinsetting["type"]." ".$table->get("name")." ON ".
																	$joinsetting["table"].".".$joinsetting["field"]."=".
																	$table->get("name").".".$field->get("name")));
						}
					}	
				}
				
				$this->stat = "SELECT ".$col." FROM ".$firsttab->get("name")." ".$join;
			}
			else if($tables instanceof MysqlTable)
			{
				$sv = "";
				for($tables->get("fields") as $f)
					if($f->get("isretrivable"))
						$sv .= ((($sv!="") ? "," : "").($tables->get("name").".".$f->get("name"));	
					
				$this->stat = "SELECT ".$sv." FROM ".$tables->get("name");
			}
			else if(is_string($tables))
				$this->stat = "SELECT * FROM ".$tables;
			
			$this->stat .= ((is_string($append)) ? (" ".$append) : "");
			return $this;		
		}
		
		public function getparams()
		{
			return $this->params;
		}

		public function getname()
		{
			return $this->name;
		}
		
		public function executecallback($row,&$nextstat)
		{
			if(is_callable($this->callback))
				return call_user_func_array($this->callback,array($row,&$nextstat));

			return true;
		}
	};	
?>