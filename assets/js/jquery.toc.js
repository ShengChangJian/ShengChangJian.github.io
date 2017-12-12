
<!--章节标题编号开始-->
//目前只支持三层目录，并且必须存在 h1，否则不工作

 var itemNumber = 1;

 $('#tocTree h1').each(function() {
     var innerSection = 0;
     var h1 = $(this);

     $(this).text(itemNumber + ' ' + $(this).text());

     h1.nextUntil('h1').filter('h2').each(function() {
         ++innerSection;
         var h2 = $(this);
         var innerSection_3 = 0;

         h2.nextUntil('h2').filter('h3').each(function() {
             ++innerSection_3;
             $(this).text(itemNumber+ '.'+ innerSection + '.' + innerSection_3 + ' '+$(this).text());  
             
         });
        
         $(this).text(itemNumber+ '.'+ innerSection+' '+$(this).text());
         
     });

     ++itemNumber;
   });


<!--标号结束-->
<!--代码窗口和代码折叠开始-->

$("figure").each(function(index)
     {
       $(this).before('<input type="button" title="最多允许同时打开4个代码窗口！" onclick="runCode();"  class="copyButton" value="代码窗口" id="copy_' + index + '" style="margin-left:4em;color:blue;"/>');
       $(this).before('<input type="button" title="最多允许同时打开4个代码窗口！" onclick="foldCode();"  class="copyButton" value="展开代码" id="fold_'+ index + '" style="margin-left:1em;color:blue;"/>');
       $(this).attr("id","code_"+index);
     });


 $(".copyButton").hover(
     function(){$(this).css('background-color', '#A1D87D');},
     function(){$(this).css('background-color', '#E5E5E5');}
 );


var i=0;
var codeValue = null;
function runCode(){
  var v_id=event.srcElement.id;
  var copy=v_id.replace("copy_","code_");
  if(!codeValue)
  {
    codeValue ='<!DOCTYPE html ><html><head>';
    codeValue +='<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">';
    codeValue +='<title>代码窗口</title>';
    codeValue +='<link rel="stylesheet" href="/assets/js/google-code-prettify/prettify.css">';
    codeValue +='<style>code{width: 100%; margin: 0; padding-top: 10px; }body{font-size: 1em;background-color: #2F4F4F;}</style>';
    codeValue +='<style>li{font-size:1.2em;border-left:2px solid green;text-indent: 1em;} li.L0, li.L1, li.L2, li.L3,li.L5, li.L6, li.L7, li.L8{ list-style-type: decimal !important }</style>'; 

    if(window.screen.width <= 770){
        codeValue+='<style> html{overflow: auto !important; -webkit-overflow-scrolling: touch !important;}li{font-size: 1em;} *{margin: 0; padding: 0;} ol.linenums{ padding-top: 1em; padding-left: 2.2em; width: 100%; height: 100%;}</style>';
        codeValue+= '</head><body style=" position: absolute;">' + $('#'+copy).html();
        
    }else{
        codeValue+= '</head><body>' + $('#'+copy).html();        
    }
  }
  var rng = window.open('','codeWin_'+i, 'height=400, width=780, top=100,left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no,status=no');
      rng.opener=null;
      codeValue+='<script src="/assets/js/google-code-prettify/prettify.js">'+'</'+'script>';
      codeValue+='</body></html>';

      rng.document.write(codeValue);
      rng.document.close();
      i++;
      i=i%4;
  codeValue='';
};
$('figure').hide();

function foldCode(){
  var v_id=event.srcElement.id;
  fold=v_id.replace("fold_","code_");
  if(!codeValue)
  {
    //codeValue = $('#'+fold).html();
  }
  if ($("#"+v_id).attr("value")== "展开代码") {
                  $("#"+fold).show();
                  $("#"+v_id).attr("value", "折叠代码");
                  var height=$(window).height()*0.75;
                  if($('#'+fold+' pre').height()>height)
                  {
                     //$('#'+fold+' pre').css("height",height);
                     $('#'+fold+' pre').css("overflow",'auto');
                     //$('#'+fold+' pre').css("width","98%");
                  }
                 
              }
              else {
                  $("#"+fold).hide();
                  $("#"+v_id).attr("value", "展开代码");

                 
              } 
};

<!--代码窗口和代码折叠结束-->>

