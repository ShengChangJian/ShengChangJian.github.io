function text_justify(elem, space_width){
    var allp = document.getElementsByTagName(elem);
     
     for(var i=0;i<allp.length;i++){//对于每一个p标签
        if(allp[i].parentNode.parentNode.nodeName == elem)
          continue;
        var allchar=allp[i].innerHTML.split('');//将p标签内容的所有字符打散
        var istag=false;//标识是否属于标签内部'<***>'
        var isch=true;//标识是否是中文，作用是判断下一个字符前是否需要加空格
        for(var j=0;j<allchar.length-1;j++){
            if(allchar[j]=='<'){//标识标签的起始位置
                istag=true;
            }else if(allchar[j]=='>'){//标识标签的结束
                istag=false;
            }else if(istag==false){//对于标签'<>'以外的字符
                if(/[\u4e00-\u9fa5]/.test(allchar[j]) && /[\u4e00-\u9fa5]/.test(allchar[j+1]) && /[\u4e00-\u9fa5]/.test(allchar[j-1])){//如果是中文
                    if(isch==true){//如果前一个字符也是中文（或空格，见下），它前面就已经有空格了，不再添加
                      if(allchar[j+1]!=' ' ){//如果后一个字符是空格，那么它后面也不用加空格了，因为按照规则，紧邻的空格，后面的全都无效
                            allchar[j]=allchar[j]+' ';
                      }
                    }else{//如果前一个字符不是中文（或不是空格），则它前面应该没有空格，加一个
                        if(allchar[j+1]==' '){//同上，判断后面是不是空格
                            allchar[j]=' '+allchar[j];
                        }else{
                            allchar[j]=' '+allchar[j]+' ';
                        }
                    }
                    isch=true;//更新中文标识
                }else if(allchar[j]==' ' ){
                    //allchar[j]='<span>&ensp;</span>';//对于本来就存在的空格，为避免word-spacing的负值导致空格不明显，这里单独调大空格的占位宽度
                  if(/[\u4e00-\u9fa5]/.test(allchar[j-1]) && /[\u4e00-\u9fa5]/.test(allchar[j+1])){
                    
                  }else if(allchar[j-1]!='>' && allchar[j+1]!='<'){
                         allchar[j]='<span style="letter-spacing:.4em;"> </span>';//对于本来就存在的空格，为避免word-spacing的负值导致空格不明显，这里单独调大空格的占位宽度
                  }
                  isch=true;//既然这里有了空格，那么后面就不需要再有了，所以将isch标志改为true
                }else{
                    isch=false;//更新中文标识
                }
            }
        }
        allp[i].innerHTML=allchar.join('');//将打散的字符再次拼接，作为p标签的内容
        allp[i].style.wordSpacing= space_width;
     }
//  }
}


//一下是针对本博客的地钉设置
(function() {
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) || window.screen.width <= 770){
  //if (window.innerWidth <= 770) {
    text_justify('ul','-.22em');
    text_justify('p','-.22em');

    var code = document.querySelectorAll("code.highlighter-rouge");
    for (var i = 0; i < code.length; i++) {
         code[i].style.wordSpacing = "-.6em";
    }

    var post_link = document.querySelectorAll("a.post-link");
    for (var i = 0; i < post_link.length; i++) {
         post_link[i].style.wordSpacing = "-.26em";
    }

  }
}());
