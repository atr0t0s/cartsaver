<?php
 
/*
 * Component: VM CartSaver
 * Source File: cartsaver.php
 * Type: Joomla Model
 * Author(s): George C. Violaris (violarisgeorge@gmail.com)
 * Date of Last Modification: 21/02/2012-12:39pm
 */ 
 
// No direct access
 
defined( '_JEXEC' ) or die( 'Restricted access' );

session_start();

jimport( 'joomla.application.component.model' );

JTable::addIncludePath(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_cartsaver'.DS.'tables');

require_once(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_virtuemart'.DS.'classes'.DS.'ps_cart.php');
require_once(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_virtuemart'.DS.'classes'.DS.'ps_database.php');
require_once(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_virtuemart'.DS.'classes'.DS.'phpInputFilter'.DS.'class.inputfilter.php');
require_once(JPATH_BASE.DS.'components'.DS.'com_virtuemart'.DS.'virtuemart_parser.php');

$GLOBALS['vmInputFilter'] = new vmInputFilter();

class CartSaverModelCartSaver extends JModel //class start
{
    function getVMCartContents() //function start
    {
		$db =& JFactory::getDBO();
		
		if (isset($_GET['add'])) //if "Add to cart" link is clicked
		{
		
			//Get the product details
			$pid = $_GET['pid'];
			$iquant = $_GET['iquant'];
			$icustnote = $_GET['icustnote'];
			
			$this->insertToVMCart($pid, $iquant, $icustnote); //use this function to insert back to VM cart
			
		}
		else {} //if add is not clicked simply continue business as normal
		
		if (isset($_GET['id'])) 
		{ //Get the row id from clicked "Remove" to delete a product from #__cartsaver
		
			$cid = $_GET['id'];
			
			//uses JTable:
			$row =& $this->getTable(); 
			
			if (!$row->delete( $cid )) 
			{
			
            $this->setError( $row->getErrorMsg() );
            return false;
			
			}
			
		} else {/*if row id is not set do not do anything!*/}
		
		$cart_size = $_SESSION['cart']['idx']; //number of individual items in cart
		
		$auth = $_SESSION['auth']; //joomla user details array
		
		$user_id = $auth['user_id']; //will be stored in #__cartsaver
		
		$customer_note = $_SESSION['cnote']; //get the comments the customer made on their last addition to the cart
		
	if(isset($_POST['save'])) //check if user hit the save/update button
	{
	
		if ($user_id == 0) 
		{ 
		
?>
			<script type="text/javascript">
			<!--
				alert("You need to be logged in to save products!");
			//-->
			</script>
<?php			
		
		}
		
		else
		{
			for ($i = 0; $i < $cart_size; $i++) //iterate to get products from the user's current cart
			{
		
				$quantity = $_SESSION['cart'][$i]['quantity']; 
				$product_id = $_SESSION['cart'][$i]['product_id'];
				$description = $_SESSION['cart'][$i]['description']; //use vm product description if needed
						
				$data =new stdClass(); //create array of all data needed to be added in db
				//insert variable values in array:
				$data->id = NULL;
				$data->user_id = $user_id;
				$data->product_id = $product_id;
				$data->quantity = $quantity;
				$data->description = $description;
				$data->customer_note = $customer_note;
			
				$db->insertObject('#__cartsaver', $data, id); //make the insert operation - inserts data in #__cartsaver
			
			}
		}
	} 
	
	else
	{ 
	
		
	
	} 
		//check the database to see if user has already saved products
		$query = 'SELECT * FROM #__cartsaver WHERE user_id = '.$user_id;
		$db->setQuery( $query );
		$res = $db->loadResult();
		$results = $db->loadObjectList(); //get array of objects (fields)
		$i = 0; //product counter
		
		if(count($results)) //if there are saved products from previously in db
		{

?>

		<form name="cartsaver" action="" method="post">
		<input type="hidden" name="save" value="set">
			<br />Update your saved cart<br /><br />
			<input type="submit" value="Update Cart">	
		</form>
		
<?php

			foreach($results as $r) //iterate through products and list them
			{
			
				echo "<br /><br /><b>Product ";
				echo $i+1; //add 1 so user does not see products starting from number 0 as in "Product 0:"
				echo ":</b><br />";
				//echo $r->user_id; <- testing during development
				echo "Description: ";
				$vm_product_query = 'SELECT product_desc FROM #__vm_product WHERE product_id = '.$r->product_id; //get the product description
				$db->setQuery( $vm_product_query );
				$vm_product_result = $db->loadResult();
				echo $vm_product_result;
				echo ":<br />Quantity: ";
				echo $r->quantity;
				echo ":<br />Your note: ";
				echo $r->customer_note;
				$i++; //increase the counter
				$id = $r->id;
				
				$ins_pid = $r->product_id;
				$ins_quantity = $r->quantity;
				$ins_customer_note = $r->customer_note;
?>
		<br /><a href="index.php?id=<?php echo $id; ?>">Remove</a>
		&nbsp;|&nbsp;
		<a href="index.php?add=set&pid=<?php echo $ins_pid; ?>&iquant=<?php echo $ins_quantity; ?>&icustnote=<?php echo $ins_customer_note; ?>">Add to Cart</a>
<?php
			} 
			
		} 
		
		else 
		{
			
			echo "You have no saved products<br />";
		
?>
			<form name="cartsaver" action="" method="post">
				<input type="hidden" name="save" value="set">
				<br />Save all products from your current cart:<br /><br />
				<input type="submit" value="Save Cart">	
			</form>
		
<?php

		}
	
    } //function getVMCartContents() end
	
	function insertToVMCart($pids, $iquants, $icustnotes) //function start
	{
	
		$idx = $_SESSION['cart']['idx']; //number of individual items in cart
		$next = $idx+1;
		//echo $next;
		$_SESSION['cart'][$next]['product_id'] = $pids;
		$_SESSION['cart'][$next]['quantity'] = $iquants;
		$_SESSION['cart'][$next]['customer_note'] = $icustnotes;
		//print_r($_SESSION['cart'][$next]['product_id']);
		print_r($_SESSION['cart']);
		
		$cart = vm_ps_cart::initCart();
		$d = array();
		$d['prod_id'] = $pids;
		$d['quantity'] = $iquants;
		$d['customer_note'] = $icustnotes;
		
		vm_ps_cart::add(&$d);
		
	} //function insertToVMCart(pid, quantity, customer_note) end
} //class CartSaverModelCartSaver end

//TODO: 
//1. Get the variations for each product added and add them as well.
//2. Create a link like I did for "Remove" to allow for adding in VM cart.
//3. Resolve the situation with customer notes. How should they be added for EACH product? 
//	 Maybe this needs to be implemented in VM and Product Builder as well?
//	 Basically, when the user adds a customer note, the note should be saved for each
//	 product in the cart. Or if this is not possible, the user should be allowed to create 
//	 individual comments in the CartSaver component.
//4. Add administrative functionality