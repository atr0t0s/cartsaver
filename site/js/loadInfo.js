//update.js v.1.3 23-June-2011
//component productbuilder
//author sakis Terz - sakis@breakdesigns.net
//copyright breakdesigns.net
//license GNU/GPL v2

  function loadSimpleImage(imgPath){
    if(imgPath)
        {
          img_style='';
          if(resize_img){
             img_style=' style="height:'+img_height+';width:'+img_width+';"';
             }
             $('image_part').setStyle('min-width','42px');
             $('image_part').setStyle('min-height','42px');
              $('image_part').setStyle('background','none');
             $('image_part').innerHTML='<img src="'+imgPath+'"'+img_style+'/>'

        } else {//no image
            $('image_part').setStyle('min-width','60px');
            $('image_part').setStyle('min-height','60px');
            $('image_part').setStyle('background','url('+live_site+'/components/com_productbuilder/images/no-image.gif) center center no-repeat');
            $('image_part').innerHTML='<div style="text-align:center; margin-top:45px;">'+noImage_lbl+'</div>';
        }
  }

   function setFullImgURI(imgsrc){
     //set the product details href
     fullimg=$('full_img');

     if(imgsrc){
        fullimg.setProperty('href',imgsrc);
     }else{
          nullImage=live_site+'/components/com_productbuilder/images/no-image.gif'
          fullimg.setProperty('href',nullImage);
     }
 }

  function getInfo(order, prod_id, image, descr, manuf, prd_cur){
     attr_wraper='attributes_'+order;
     hid_prod_id='prod_id'+order;
    if(prod_id>0){//if selection other than 0
        url_d='index.php?option=com_productbuilder&task=getinfo&product_id='+prod_id+'&order='+order+'&img='+image+'&descr='+descr+'&mnf='+manuf+'&prdcur='+prd_cur;
        //alert(url);
        ajax=new Json.Remote(url_d,{
        onRequest:function(){
          if(layout=="default") {
            $('img_descr').setStyle('background','url('+live_site+'/components/com_productbuilder/images/loadbar.gif) 10% 90% no-repeat');
          }
          $(attr_wraper).setStyle('background','url('+live_site+'/components/com_productbuilder/images/loadbar.gif) center center no-repeat');
          },

        onComplete:function(prod_info){ 
        if(layout=="default") $('img_descr').setStyle('background','none');
        $(attr_wraper).setStyle('background','none');

        if(layout!="minimal"){
          //image
          if(image){ loadSimpleImage(prod_info.imgthumb);
          if(disp_full_img) setFullImgURI(prod_info.imgfull);
        }
        //description
        if(descr){ if(prod_info.s_descr) $('description').innerHTML=prod_info.s_descr;
        else $('description').innerHTML=''; }
        //manufacturer
        if(manuf){ if(prod_info.mnf) $('manufacturer').innerHTML='<span class="mflbl">'+manuf_lbl+':</span> '+prod_info.mnf;
         else $('manufacturer').innerHTML='';}
         }

         //attributes
        if(prod_info.attrib){
          $(attr_wraper).innerHTML=prod_info.attrib;
          $(hid_prod_id).setProperty('value',prod_id);
          updateGroupPrice(order);
        }else if(!prod_info.attrib){
          $(attr_wraper).innerHTML='';
          updateGroupPrice(order);
        }

          }}).send();
    }//no product selected
    else{
        if(layout!="minimal"){
          //image
          if(image) loadSimpleImage('');
          if(disp_full_img) setFullImgURI('');
         if(descr) $('description').innerHTML='';
         if(manuf) $('manufacturer').innerHTML='';
        }
        $(attr_wraper).innerHTML='';
        updateGroupPrice(order);
    }

  }