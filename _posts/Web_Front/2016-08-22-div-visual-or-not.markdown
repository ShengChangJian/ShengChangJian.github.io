---
layout: post
title: "判断div是否在浏览器的可视区"
date: 2016-08-22 20:24:35
categories: 前端 
tags: Web_Front
---

> 本文给出了“判断 div 是否在可视区”的 html 和 JavaScript 混合代码。




    以下为判断 div 是否在可视区的 html 和 JavaScript 混合代码

{% highlight html %}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>Demo</title>
</head>

<body style="width:2000px; height:1000px; padding:0; margin:0;">
<div id="demo" style=" width:200px; height:2000px; margin-top:500px; background:#CC0000;">Demo</div>
<div id="debug" style="position:fixed; padding:10px; top:0;right:0; height:500px; overflow:scroll; "></div>
<div style="height: 1000px;"></div>
</body>
</html>
<script>
window.onload = window.onscroll = function (){
	var obj = document.getElementById('demo');
	var pos = obj.getBoundingClientRect();
	if (document.documentElement.getBoundingClientRect) { 
		var w = document.documentElement.clientWidth;
		var h = document.documentElement.clientHeight;
		document.getElementById('debug').innerText +=  (pos.top>h || pos.bottom<0 || pos.left>w || pos.right<0? "\r不可视　":"\r>>[可视]　") ;
	} 
}

</script>
{% endhighlight %}
