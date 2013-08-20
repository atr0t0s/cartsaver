
//load the image of the selected product
  function getInfo(order,prod_id,image,descr,manuf,prd_cur){
    imgWraper_id='image_'+order;
    attr_wraper='attributes_'+order;
    hid_prod_id='prod_id'+order;

    if(prod_id>0){//if selection other than 0
        url='index.php?option=com_productbuilder&task=getinfo&product_id='+prod_id+'&order='+order+'&img='+image+'&descr='+descr+'&mnf='+manuf+'&prdcur='+prd_cur;
        //alert(url);
        ajax=new Json.Remote(url,{method: 'get',
        onRequest:function(){
          $(imgWraper_id).setStyle('background','url('+live_site+'/components/com_productbuilder/images/loading.gif) center center no-repeat');
          $(attr_wraper).setStyle('background','url('+live_site+'/components/com_productbuilder/images/loadbar.gif) center center no-repeat');
          },
        onComplete:function(prdInfo){
           $(attr_wraper).setStyle('background','none');

            if(layout=='overlay' &&  prdInfo.imgfull){
              if(resize_img) {
                $(imgWraper_id).setStyle('background','none');
                img_style=' style="height:'+img_height+';width:'+img_width+';"';
                $(imgWraper_id).innerHTML='<img src="'+ prdInfo.imgfull+'"'+img_style+'/>'
              }
              else {
                $(imgWraper_id).setStyle('background','url('+prdInfo.imgfull+') center center no-repeat');
              }
              // no image found
            }else if(layout=='overlay' &&  !prdInfo.imgfull){
                $(imgWraper_id).setStyle('background','none');
                $(imgWraper_id).innerHTML='';
            }

            //other layouts
            else if((layout=='static-images' || layout=='static-images_r') && prdInfo.imgthumb){
                 if(resize_img) {
                   img_style=' style="height:'+img_height+';width:'+img_width+';"';
                   $(imgWraper_id).setStyle('background','none');
                   $(imgWraper_id).innerHTML='<img src="'+prdInfo.imgthumb+'" '+img_style+'/>';
                 }else{
                   $(imgWraper_id).setStyle('background','url('+prdInfo.imgthumb+') center center no-repeat');
                   $(imgWraper_id).innerHTML='';
                 }
                    if(disp_full_img) setFullImgURI(order,prod_id,prdInfo.imgfull);
            // no image found
            }else if((layout=='static-images' || layout=='static-images_r') && !prdInfo.imgthumb){
                $(imgWraper_id).setStyle('background','url('+live_site+'/components/com_productbuilder/images/no-image.gif) center center no-repeat');
                $(imgWraper_id).innerHTML='<div style="text-align:center;">'+noImage_lbl+'</div>';
                if(disp_full_img) setFullImgURI(order,0,'');
            }

       if(prdInfo.attrib){
        $(attr_wraper).innerHTML=prdInfo.attrib;
        $(hid_prod_id).setProperty('value',prod_id);
        updateGroupPrice(order);
       }else if(!prdInfo.attrib){
        $(attr_wraper).innerHTML='';
        updateGroupPrice(order);
       }

        }}).send();
    }//if product selected
    else { //zero poruct selected reset image area
      $(imgWraper_id).setStyle('background','none');
      if(layout=='overlay') $('image_part').setStyle('background','none');
      if(disp_full_img) setFullImgURI(order,0,'');
      $(imgWraper_id).innerHTML='';
      $(attr_wraper).innerHTML='';
      updateGroupPrice(order);
      }
  }

  function setFullImgURI(order,product_id,imgsrc){
   //set the product details href
   nullImage=live_site+'/components/com_productbuilder/images/no-image.gif';
   link_id='full_img_'+order;
   fullimg=$(link_id);

   if(imgsrc){
      fullimg.setProperty('href',imgsrc);
      fullimg.setProperty('rel','lightbox');
   }else{
      fullimg.setProperty('href',nullImage);
      }
 }