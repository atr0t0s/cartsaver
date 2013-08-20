//update.js v.1.3 28-Feb-2011
//component productbuilder
//author sakis Terz
//copyright breakdesigns.net
//license GNU/GPL v2

 tempImgY=0;
 //check compatibility before start
window.addEvent('domready',function(){
     if((compat_chck==1 && disp_compat==0) || (compat_chck==1 && disp_compat==1 && $('compatib').checked)) compatOption();
});

/**
*Function that triggers after any change of the selected product of a group
*It calls other functions
*
*@author Sakis Terz
*/

  function update(product_id,order){
     //get the tax id
     //group_select_id='groupsel_'+order;
     var prd_cur='';

     if(product_id>0){
       var sel_option=$('id'+order+'_'+product_id);

       //get prd price currency used for the getAttributes function
       var prod_price_json=$(sel_option).getProperty('rel');
       var prod_priceObj=Json.evaluate(prod_price_json);
       var priceObj=getProductPrice(prod_priceObj,order);
       prd_cur=priceObj.cur;
     }

     if(layout=='default') activate(order);
     setURI(order,product_id);

     //check compatibility
      if(typeof(tagtree) !== 'undefined' && ((compat_chck==1 && disp_compat==0) || (compat_chck==1 && disp_compat==1 && $('compatib').checked)))checkcompat(product_id,order);
      //load image and description
     getInfo(order,product_id,loadImage,loadDescr,loadManuf,prd_cur);
  }

/**
*Function that triggers after the page load
*It checks for non compatible configuration in the default products
*
*@author Sakis Terz
*/
 function compatOption(){
    if(disp_compat) c_opt=$('compatib').checked;
    else c_opt=compat_chck;

    selectt_tags=$$('.groupSelect');

   if(group_type=='radio'){
     options=new Array();
     for(j=0; j<selectt_tags.length; j++) options=options.concat($ES('input',selectt_tags[j]));
   }
   else options=$ES('option',selectt_tags);

   //alert(options);
   if(!c_opt){  //unselect all
     if(group_type=='radio'){
        for(i=0; i<options.length; i++){
          if(options[i].disabled){
             options[i].removeProperty('disabled');
             g_id=options[i].id;
             gr_id='lbl_'+g_id;
             $(gr_id).setStyle('color','#000000');
          }
         }
     }else{
      options.removeProperty('disabled');
      options.setStyle('color','#000000');
      }
   }//if(!c_opt)
   else{
      for(n=0; n<options.length; n++){
        if((options[n].checked || options[n].selected) && options[n].value>0 ){
          pr_grp_id=options[n].id;
          order_id=pr_grp_id.substr(2,pr_grp_id.indexOf('_')-2);
          prd_id=pr_grp_id.substr(pr_grp_id.indexOf('_')+1,pr_grp_id.length-2);
          //alert(prd_id+' + '+order_id);
          checkcompat(prd_id,order_id);
        }
      }//for
   }//else
 }

/**
*
*It checks for non compatible products in the following groups after every selection change
*
*@author Sakis Terz
*/
 function checkcompat(product_id,order){

       select_tags=$$('.groupSelect');
      if(typeof(grtree)!="undefined"){
        if(typeof(grtree[order])!="undefined"){
           id_str='id'+order+'_'+product_id;
           classes=$(id_str).getProperty('class');

          if(classes && classes!='notag'){
            class_ar=classes.split(" ");//the tags of a prod in an array

          //get only the following groups
         for(x=0; x<grtree[order].length; x++){
          for(j=0; j<tagtree[order].length; j++){
             for(i=0; i<class_ar.length; i++){
                //disable non compatible
                 if(class_ar[i]!=tagtree[order][j]){
                  clsname='.'+tagtree[order][j];
                  grpOptions=$ES(clsname,select_tags[grtree[order][x]]);
                  grpOptions.setProperty('disabled','disabled');
                  grpOptions.setStyle('color','#cccccc');
                 }
              }
            } //for(j=0; j<tagtree[order].length;
          }
             //enable compatible
             for(x=0; x<grtree[order].length; x++){
                for(i=0; i<class_ar.length; i++){
                  className='.'+class_ar[i];
                  tagedEl=$ES(className,select_tags[grtree[order][x]]);
                  tagedEl.removeProperty('disabled');
                  tagedEl.setStyle('color','#000000');
                }
             }
             unselectDisabled();
          } //if(classes)
        //if the user selects a parent with no tag

        //enable all the products of the relative groups
        else if(classes && classes=='notag'){
       //get only the following groups
         for(x=0; x<grtree[order].length; x++){
          for(j=0; j<tagtree[order].length; j++){
               clssname='.'+tagtree[order][j];
               tagdEl=$ES(clssname,select_tags[grtree[order][x]]);
               tagdEl.removeProperty('disabled');
               tagdEl.setStyle('color','#000000');
            }
           }
        }//else if

        }// if(grtree[order]!=undefined)
      }
      return;
 }


/**
*
*change selection of a group if the product becomes disabled and is selected
*
*@author Sakis Terz
*/
function unselectDisabled(){
  if(group_type=='radio')options=$ES('input',select_tags);
  else options=$ES('option',select_tags);

  for(i=0; i<options.length; i++){
    if((options[i].selected || options[i].checked) && options[i].disabled) {
        pr_gr_id=options[i].id;
        order_id=pr_gr_id.substr(2,pr_gr_id.indexOf('_')-2);
        if(group_type=='radio'){
        options[i].removeProperty('checked');
        $('id'+order_id+'_0').setProperty('checked','checked');
        }else  {options[i].removeProperty('selected');
        $('id'+order_id+'_0').selected='selected';
        }

       //reload groups info
        //remove attributes

        attr_wrap='attributes_'+order_id;
        $(attr_wrap).innerHTML='';
        setURI(order_id,0);
        //change group price
        group_price_id='grp_price_'+order_id;
        $(group_price_id).setProperty('value',0);

        //load image and description
        //only to the overlay layout the images should be reset
        if(loadImage==1 && layout=='overlay') getInfo(order_id,0,loadImage,loadDescr,loadManuf);

       if(grtree[order_id]!=undefined){
         for(x=0; x<grtree[order_id].length; x++){
           for(j=0; j<tagtree[order_id].length; j++){
             clsname='.'+tagtree[order_id][j];
             elmsnts=$ES(clsname,select_tags[grtree[order_id][x]]);
             elmsnts.removeProperty('disabled');
             elmsnts.setStyle('color','#000000');
           }//for
         }//for
       }//if(grtree[order_id]!=
    }
  }
   updateTotalPrice();
}

/**
*
*Set the href of the details link
*
*@author Sakis Terz
*/
 function setURI(order,product_id){
   //set the product details href
   link_id='groupdet_'+order;
   prod_det=$(link_id);

   if(product_id>0){
     if(pbPlg){
        url=siteURL+'index.php?option=com_productbuilder&task=getItemID&product_id='+product_id;
	    ajax=new Ajax(url,{method: 'get',onComplete:function(){
         uri=prdDetailsURL+this.response.text;
         prod_det.setProperty('href',uri);
        prod_det.setProperty('class','modal');}
         }).request();
     }else{
        uri=prdDetailsURL+product_id;
        prod_det.setProperty('href',uri);
        prod_det.setProperty('class','modal');
      }
   }else{
        prod_det.removeProperty('href');
      }
 }

//used for plugins like k2mart to get the itemId of these type of components
function getPlgItemId(product_id){
  	url=siteURL+'index.php?option=com_productbuilder&task=getItemID&product_id='+product_id;
	ajax=new Ajax(url,{method: 'get',onComplete:function(){return this.response.text}}).request();
}

//switch on/off the lamp
function activate(order){

  //move the image /descr/manuf wrapper
      if(layout=='default'){
        //get the position of img wrapper
        if(!tempImgY) {
          el=$('img_descr');
          while(el!=null){
            tempImgY+=el.offsetTop;
            el=el.offsetParent;
          }
        }

        //get the position of the group
        groupY=0;
        grWrap_id='group_wrap_'+order;
        gr_el=$(grWrap_id);
        while(gr_el!=null){
            groupY+=gr_el.offsetTop;
            gr_el=gr_el.offsetParent;
        }

        imgWraperTop=groupY-tempImgY;
        $('img_descr').setStyle('top',imgWraperTop+'px');
        activegr=order;
      }
    if(group_type!='hidden'){
      $$('.active_group').setStyle('background-image','url('+live_site+'/components/com_productbuilder/images/lamp_off.png)');
      $('active_groupTotal').setStyle('background','none');

      act_id='act_'+order;
      $(act_id).setStyle('background-image','url('+live_site+'/components/com_productbuilder/images/lamp-icon.png)');
    }
}

/**
*
*Reload product info on Focus
*
*@author Sakis Terz
*/
function setFocus(order,editable){

    group_select_idd='groupsel_'+order;
    if(group_type=='radio'){
          grp_prods=$(group_select_idd).getElements('input');
          for(i=0; i<grp_prods.length; i++){
            if (grp_prods[i].getProperty('checked')) product_id=grp_prods[i].getProperty('value');
          }
        }else  product_id=$(group_select_idd).value;

    if(editable) $(group_select_idd).focus();
    loadAttrib=1;
    getInfo(order,product_id,loadImage,loadDescr,loadManuf,loadAttrib);
  //switch on/off the lamp
    activate(order);

  }

/**
*
*Updates the group price field. Using product price, quantity and attributes
*
*@author Sakis Terz
*/
 function updateGroupPrice(order){
        //if(!preloaded) activate(order);
        var atrprice=0;
        var price=0;

        var group_price_id='grp_price_'+order;
        var group_select_id='groupsel_'+order;

 //get the selected product
        if(group_type=='radio'){
          grp_prods=$(group_select_id).getElements('input');
          for(i=0; i<grp_prods.length; i++){
            if (grp_prods[i].getProperty('checked')) product_id=grp_prods[i].getProperty('value');
          }
        }else  product_id=$(group_select_id).value;


        if(product_id>0){
        //the price of product
        if(group_type=='hidden') sel_option=$(group_select_id); //bundle
        else sel_option=$('id'+order+'_'+product_id);//drop down

 //get the price of the selected product
        var prod_price_json=sel_option.getProperty('rel');
        var prod_priceObj=Json.evaluate(prod_price_json);
        var curPrice=getProductPrice(prod_priceObj,order);
        price=setFloatingPoint(curPrice.value);

 //get the quantity of the selected product
        quantity= getGrQuantity(order);

 //the price of attribute
        atr_class='.atr_'+order;
        atributes=$$(atr_class);

        if(atributes){
          for(i=0; i<atributes.length; i++){
            if(atributes[i].getProperty('type')=='radio'){
              if(atributes[i].getProperty('checked')){
                atr_price=atributes[i].title;
                //if the price of attrib contains '='
                //alert(atributes[i].title);
                if(atr_price && atr_price.indexOf("=")>=0){
                  atr_price=setFloatingPoint(atr_price);
                  price=parseFloat(atr_price.substr(1));
                }else if(atr_price && atr_price!=0){
                  atr_price=setFloatingPoint(atr_price);
                  atrprice=atrprice+(eval(atr_price));
                }

              } //if attribute checked
            }// if(atributes[i].getProperty('type')
            else if(atributes[i].getProperty('type')=='hidden'){
                atr_price=atributes[i].title;
                //if the price of attrib contains '='
                //alert(atributes[i].title);
                if(atr_price && atr_price.indexOf("=")>=0){
                  atr_price=setFloatingPoint(atr_price);
                  price=parseFloat(atr_price.substr(1));
                }else if(atr_price && atr_price!=0){
                  atr_price=setFloatingPoint(atr_price);
                  atrprice=atrprice+(eval(atr_price));
                }
            }
          }//for
        }//if(atributes)

       price=parseFloat(price)
       price+=parseFloat(atrprice);

       //if negative make it zero
       if(price<0)price=0;
       else {
         price=quantity*price;
         price=setDecimals(price);
         price=alterFloatingPoint(price);
         }
     }
      //set the prices to the fields
      $(group_price_id).setProperty('value',price);
      updateTotalPrice();
 }

  //get the quantity of the group
  function getGrQuantity(order){
    var quantity_el='quantity_'+order;
    var quantity= parseInt($(quantity_el).value);

    if(isNaN(quantity)){
      quantity=0;
      quantity_el.value=0;
    }
    return quantity;
  }

/**
*
*Gets the current product's price
*
* From 1.6.5 and then multiple prices are being loaded
* This function returns the correct price based on the quantity set and the cart quantity of the product if exists
*
*@author Sakis Terz
*/
  function getProductPrice(priceObj,order){

    var price;
    var tempPrice;
    var thisQuant=getGrQuantity(order);
    var cartQuantity=parseInt(priceObj[0].cart_quantity); //if the product exists in the cart also the quantity of the prod in the cart should be taken into consideration

    for(var i=0; i<priceObj.length; i++){
        if((thisQuant+cartQuantity>=priceObj[i].quant_start) && (thisQuant+cartQuantity<=priceObj[i].quant_end)) price=priceObj[i];
        else if(thisQuant+cartQuantity>priceObj[i].quant_end) tempPrice=priceObj[i];//price equal to the price with the max quantity but lower than our quantity
    }

    if(price)return price;
    else if(tempPrice)return tempPrice;
    else return priceObj[0];
  }

/**
*
*Updates the total price of teh bundle after every change
*
*@author Sakis Terz
*/
  function updateTotalPrice(){
    var totl=0;
    var total=0;

    //the groups price field
    group_price_inp=$$('.grp_price');

    for(i=0; i<group_price_inp.length; i++){
        group_price=group_price_inp[i].getProperty('value');
        if(group_price && floatSign==',') group_price=setFloatingPoint(group_price);
        if(group_price && !isNaN(group_price)){
        totl+=parseFloat(group_price);
        }
    }

    if(totl){
      //set the number of decimals
      total=setDecimals(totl);//round decimals
      //set correct floating point
      total=alterFloatingPoint(total);
    }
    total_el=$('total_price');
    total_el.setProperty('value',total);
  }

  function setDecimals(number){
   number_dec=number.toFixed(noDecimals);
   return number_dec;
  }

   function setFloatingPoint(price){
     //replace comma with dot-this way it can converted to number
     if(floatSign==',')price=(price.toString().replace(/,/g,"."));
     return price;
   }

   function alterFloatingPoint(price){
    if(floatSign==',') price=price.toString().replace(/\./g,",");
    return price;
   }

/**
*--------------addtocart v.1.3.4 --------------------------//
* @package productbuilder
@ author sakis Terz
@ copyright breakdesigns.net
@ license GNU/GPL v2
*/

var prod_length;
var temp_length;
var gr_length;
var product_ids;
var quantities;
var attributes;
var active_gr;
var base_url;
var itemid
var addedToCart;
var customer_note;

function handleToCart() {
  product_ids = new Array();
  quantities=new Array();
  attributes = new Array();
  active_gr=new Array();
  var response = '';
  var form = document.pb_builder;
  var groups = $$('.groupSelect');    customer_note = document.getElementById('customer_note').value;  
  customer_note = document.forms["pb_builder"]["customer_note"].value;  

  //get the counter and increase it for next additions from the same page
    if(!addedToCart){
      var pb_uscr_pos=pb_prod.indexOf("_");
      pbID=pb_prod.substring(0,pb_uscr_pos);
      pb_counter=pb_prod.substring(pb_uscr_pos+1);
      newPB_prod=pb_prod;
    }else{
      pb_counter++;
      newPB_prod=pbID+'_'+pb_counter;
    }
	
  //get the product_ids of the selected products
  for(i = 0; i<groups.length; i++) {
    if(group_type!='radio') val = groups[i].getProperty('value');
    else {
     radios=groups[i].getElements('input');

     for(x=0; x<radios.length; x++){
        if(radios[x].getProperty('checked')) val=radios[x].getProperty('value');
     }
    }


    if(val!=0){

      gr_id=groups[i].getProperty('id');
      gid=parseInt(gr_id.substr(gr_id.indexOf("_")+1));

      //get quantity
      qty_id='quantity_'+gid;
      qty=$(qty_id).value;
      qty=parseInt(qty);

      if(!qty)qty=0;
      quantities[gid]=qty;

      //get attributes
      class_name='.atr_'+gid;
      atrib = $$(class_name);

      //add active groups to that table
      active_gr.push(gid);
      //add selected product ids
      product_ids[gid]=val;

      if(atrib.length>0) {

          attributes_str='';
          for(j = 0; j<atrib.length; j++) {
            if(atrib[j].getProperty('type')=='radio' && atrib[j].getProperty('checked')) {
              atr_nme = atrib[j].getProperty('name');
              atr_name=atr_nme.substr(atr_nme.indexOf("_")+1);
              atr_val = atrib[j].getProperty('value');
              attributes_str += '&'+atr_name+'='+atr_val;
            }
            //in case of types such as images
            if(atrib[j].getProperty('type')=='hidden') {
              atr_nme = atrib[j].getProperty('name');
              atr_name=atr_nme.substr(atr_nme.indexOf("_")+1);
              atr_val = atrib[j].getProperty('value');
              attributes_str += '&'+atr_name+'='+atr_val;
            }
            //in case of custom attribute//text field
            else if(atrib[j].getProperty('type')=='text'){
              atr_nme = atrib[j].getProperty('name');
              atr_name=atr_nme.substr(atr_nme.indexOf("_")+1);
              atr_val = atrib[j].getProperty('value');
              if(!atr_val) {
                atrib[j].setStyle('border', '1px solid #ff0000');
                attr_id=atrib[j].id;
                warn=$('warn_'+attr_id).setStyle('display','inline');
                return; }

              if(atrib[j].getStyle('border-color')=='#ff0000'){
                attr_id=atrib[j].id;
                warn=$('warn_'+attr_id).setStyle('display','none');
                atrib[j].setStyle('border','1px solid #e3e9ef');
                atrib[j].setStyle('border-top','1px solid #abadb3');
              }

              attributes_str += '&'+atr_name+'='+atr_val;
            }
          }
      attributes[gid]=attributes_str;
        }//if(atrib)
    }// if(val!=0)
  }

  gr_length=active_gr.length;
  prod_length=product_ids.length;
  temp_length=gr_length;

  if(prod_length>0) {//if products
    var action = form.action;
    var option = form.option.value;
    var itemid = form.Itemid.value;
    var page = form.page.value;
    var func = form.func.value;
    var quantity = form.quantity.value;

    base_url = action+'?'+'option='+option+'&Itemid='+itemid+'&page='+page+'&func='+func;
    //create the cart loadbar container
    $('cartLoader').setStyle('border','1px solid #888888');
    multipleRequests();
  } //if(product_ids)
}

function addToCart(product_id,quantity,attributes,customer_note) {
  //ajax
  //create the url
  var sub_url='';
  if(attributes) at=attributes;
  else at='';
  sub_url+='&product_id='+product_id+'&prod_id[]='+product_id+at+'&quantity='+quantity+'&pb_prd='+newPB_prod+'&customer_note='+customer_note;
  var url=encodeURI(base_url+sub_url);
  //alert(url);

   //create the other options
  var opt = {
    // Use POST
  method: 'post',
    // Handle successful response
    // onComplete: function() {popup_boxB(this.response.text, itemid);},
  onComplete: function() {multipleRequests();},
  //popup_boxB(this.response.text, itemid);
  evalScripts: true
  }
  new Ajax(url, opt).request();

  //increase the counter so in the next add to cart the bundle will have another pb_id

}

//handle multiple requests
function multipleRequests(){
    if(gr_length>0){

     addToCart(product_ids[active_gr[gr_length-1]],quantities[active_gr[gr_length-1]],attributes[active_gr[gr_length-1]],customer_note);
     gr_length--;
     //cart loadbar
     width=(100/temp_length)*(temp_length-gr_length);
     width=Math.floor(width)+'%';
     $('load_bar').setStyle('width',width);
    }
    else {
        addedToCart=1; //indicates that pb products are in the cart
        eraseLoadBar();
        popup_boxB(cart_lbl, itemid);
    }
}

function eraseLoadBar(){
    $('cartLoader').setStyle('border','none');
    $('load_bar').setStyle('width','0px');
}

function popup_boxB(responseText, itemId) {
  //code from virtuemart themes\default\theme.js
  updateMiniCarts();
  if (document.boxB) {
    document.boxB.close();
    clearTimeout(timeoutID);
  }

  document.boxB = new MooPrompt(notice_lbl, responseText,
    {
    buttons: 2,
    width: 400,
    height: 150,
    overlay: false,
    button1: ok_lbl,
    button2: cart_title,
    onButton2: handleGoToCart_
    });

  setTimeout('document.boxB.close()', 5000);
}


//----------virtuemart-------------//
function handleGoToCart_() {
  var form = document.pb_builder;
  var itemid = form.Itemid.value;
  document.location = live_site + 'index.php?option=com_virtuemart&page=shop.cart&Itemid=' +itemid+'&customer_note='+customer_note;
}

var timeoutID = 0;

/**
* This function searches for all elements with the class name "vmCartModule" and
* updates them with the contents of the page "shop.basket_short" after a cart modification event
*/
function updateMiniCarts() {
  var callbackCart = function(responseText) {
    carts = $$('.vmCartModule');
    if(carts) {
      try {
        for (var i = 0; i<carts.length; i++) {
          carts[i].innerHTML = responseText;

          try {
            color = carts[i].getStyle('color');
            bgcolor = carts[i].getStyle('background-color');
            if(bgcolor == 'transparent') {
              // If the current element has no background color, it is transparent.
              // We can't make a highlight without knowing about the real background color,
              // so let's loop up to the next parent that has a BG Color
              parent = carts[i].getParent();
              while(parent && bgcolor == 'transparent') {
                bgcolor = parent.getStyle('background-color');
                parent = parent.getParent();
              }
            }
            var fxc = new Fx.Style(carts[i], 'color', {duration: 100});
            var fxbgc = new Fx.Style(carts[i], 'background-color', {duration: 100});

            fxc.start('#222', color);
            fxbgc.start('#fff68f', bgcolor);
            if(parent) {
              setTimeout("carts[" + i + "].setStyle( 'background-color', 'transparent' )", 100);
            }
          } catch(e) {}
        }
      } catch(e) {}
    }
  }
  var option = {method: 'post', onComplete: callbackCart, data: {only_page: 1, page: "shop.basket_short", option: "com_virtuemart"}}
  new Ajax(live_site + '/index2.php', option).request();
}