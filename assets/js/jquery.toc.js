
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
    codeValue = $('#'+copy).html();
  }
  var rng = window.open('','codeWin_'+i, 'height=400, width=700, top=100,left=100, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no,status=no');
      rng.opener=null;
      codeValue+='<style>li{font-size:1.2em;border-left:2px solid green;text-indent: 1em;}li.L0, li.L1, li.L2, li.L3,li.L5, li.L6, li.L7, li.L8{ list-style-type: decimal !important }</style>';
      codeValue+='<script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js">'+'</'+'script>';
      rng.document.write("<title>代码窗口</title>");
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
    codeValue = $('#'+fold).html();
  }
  if ($("#"+v_id).attr("value")== "展开代码") {
                  $("#"+fold).show();
                  $("#"+v_id).attr("value", "折叠代码");
                  var height=$(window).height()*0.75;
                  if($('#'+fold+' pre').height()>height)
                  {
                     $('#'+fold+' pre').css("height",height);
                     $('#'+fold+' pre').css("overflow",'auto');
                     $('#'+fold+' pre').css("width","100%");
                  }
                 
              }
              else {
                  $("#"+fold).hide();
                  $("#"+v_id).attr("value", "展开代码");

                 
              } 
};

<!--代码窗口和代码折叠结束-->>

