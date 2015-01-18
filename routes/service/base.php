<?php
	// Author: Dee
	// Date: 2015/01/11
	// This php base service definition here ...
	// dependence : -
	//
			
	class BaseServ
	{
		protected $data = null;
		protected $callback = null;
		protected $errhandler = null;
		
		public function __construct($data,$errhandler,$callback)
		{
			$this->data = $data;
			$this->errhandler = $errhandler;			
			$this->callback = $callback;
			return $this;
		}
		
		protected function executecallback($retcode,$msg,$retdata)
		{
			if(is_callable($this->callback))
				call_user_func_array($this->callback,array($retcode,$msg,$retdata));
			
			return $this;
		}
		
		protected function executeerror($msg)
		{
			if(is_callable($this->errhandler))
				call_user_func_array($this->errhandler,array($msg));
			
			return $this;
		}
	}
?>