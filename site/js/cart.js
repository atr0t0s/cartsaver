//update.js v.1.3 13-March-2011
//component productbuilder
//author sakis Terz - sakis@breakdesigns.net
//copyright breakdesigns.net
//license GNU/GPL v2

function disp_bund(bund_id){
  divID='bundhead_'+bund_id;

  $(divID).addEvent('click',function(){
    clsName='.bund_'+bund_id;
    bundChilds=$$(clsName);
    disp=bundChilds[0].getStyle('display');

    if(disp=='none') {
      $$(clsName).setStyle('display','table-row');
      this.setStyle('background-position','bottom')
      }

    else  {$$(clsName).setStyle('display','none');
    this.setStyle('background-position','top')
    }
  })
}