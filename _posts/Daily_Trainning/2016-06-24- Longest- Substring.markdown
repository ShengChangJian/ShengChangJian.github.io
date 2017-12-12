---
layout: post
title:  "Longest Substring Without Repeating Characters"
date:   2016-06-23 22:21:49
categories: 在线编程
tags: Daily_Trainning
---

> 每天一道在线编程题




    问题：Longest Substring Without Repeating Characters

> Given a string, find the length of the longest substring without repeating characters.

    Example:

> Given "abcabcbb", the answer is "abc", which the length is 3.

> Given "bbbbb", the answer is "b", with the length of 1.

> Given "pwwkew", the answer is "wke", with the length of 3. Note that the answer must be a substring, "pwke" is a subsequence and not a substring.

    解决方案：（C语言）

 {% highlight c %}
int lengthOfLongestSubstring(char* s) {

//start,end,left,length,maxLen分辨表示无重复字符的字符串的开始位置，结束位置，向左
//查找重复字符，无重复字符的字符串长度，无重复字符的字符串的最大长度

    int start = 0,end = 0,left = end-1,length = end-start,maxLen = 0;

    while(s[end] != '\0')
    {
        left = end;
        end++;
        length = end - start;
        while(left >= start)
        {
            if(s[left] == s[end])
            {
                length = end - start;
                if(length > maxLen)
                    maxLen = length;
                start = left + 1;//有重复字符则调整无重复字符的字符串起始位置
                break;
            }
            left--;
        }
    }
    if(length > maxLen)
                    maxLen = length;
    return maxLen;
}
{% endhighlight %}
    运行效率：

![](/assets/img/daily/Longest-Substring-Without-Repeating-Characters.png)

