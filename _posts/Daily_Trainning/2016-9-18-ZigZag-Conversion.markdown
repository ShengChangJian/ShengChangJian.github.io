---
layout: post
title: "ZigZag Conversion"
date: 2016-9-18 16:43:09
categories: 在线编程
tags: Daily_Trainning
---

> 每天一道在线编程题




    问题: ZigZag Conversion

> The string ```"PAYPALISHIRING"``` is written in a zigzag pattern on a given number of rows like this: (you may want to display t
> his pattern in a fixed font for better legibility) 

![ZigZag](/assets/img/daily/ZigZag-Conversion-01.PNG)
![ZigZag-Exp](/assets/img/daily/ZigZag-Conversion-02.PNG)

    总体分析

本问题实际上就是看规律的题目，从输入是如何映射到输出的。不过其涉及到字符串操作的一些细节。

> 具体实现（C 语言）

    计算字符串长度的函数：int length(char *s)

{% highlight c%}
int length(char *s)
{
  int i = 0;
  for(i=0;*s!='\0';i++)
    s++;
  return i;
}
{% endhighlight %}

    实现目的的 convert 函数：

{% highlight c %}
char* convert(char* s, int numRows)
{
  
  const int GAP = numRows - 1;
  int d = 2*GAP;
  const int LAST = numRows - 1;
  int len = length(s);
  char *tmp = (char*)malloc((len+1)*sizeof(char));
  // len+1 的原因是没有把 '\0' 计算在内
  // 而新建字符串时需要单元存储该结尾字符

  if(*s == '\0' || numRows <= len || 0 == LAST)
    return s; // 对于特殊情况快速处理

  strcpy(tmp,s);
  // 使用了 string.h 中的字符串复制函数，当然可以自己实现

  int index = 0;
  int i = 0;

  // 以下是规律描述，应遵循编程规范
  for(i=0; i <= LAST; i++)
  {
    int cur = i;
    if( 0 == i || LAST == i )
      while(cur < len)
      {
        s[index] = tmp[cur];
        cur += d;
        index++;
      }
    else
    { 
      int tmpCur = i;
      while(cur < len)
      {
        //int tmpCur = cur;
        s[index] = tmp[cur];
        tmpCur = cur + d;
        cur = tmpCur - 2*i;
        index++;
        if(cur >= len)
          break;
        
        s[index] = tmp[cur];
        cur = tmpCur; 
        index++;      
      }
    }
  }
  free(tmp); // 记得释放
  return s;
}
{% endhighlight %}





