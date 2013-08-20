<?php
 
defined('_JEXEC') or die();

class TableCartSaver extends JTable
{
	var $id = null;
	var $user_id = null;
	var $product_id = null;
	var $quantity = null;
	var $customer_note = null;
 
	function __construct(&$db)
	{
		parent::__construct( '#__cartsaver', 'id', $db );
	}
}