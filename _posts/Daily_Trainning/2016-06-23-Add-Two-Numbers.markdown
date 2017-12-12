---
layout: post
title:  "Add Two Numbers"
date:   2016-06-22 22:21:49
categories: 在线编程
tags: Daily_Trainning
---

> 每天一道在线编程题




    问题：Add Two Numbers

You are given two linked lists representing two non-negative numbers.
The digits are stored in reverse order and each of their nodes contain a single digit. 
Add the two numbers and return it as a linked list.

    Example:

Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8

    解决方案：（C语言）

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */

 {% highlight c %}
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */

struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) 
{
   //p1,p2分别用来遍历l1,l2,而p用来指定当有进位时申请的新节点，pre用来指定p1的前节点，以便链接新节点或释放多余节点
   struct ListNode *p,*p1=l1,*p2=l2,*pre;
   p=(struct ListNode*)malloc(sizeof(struct ListNode));
   p->val = 1;
   p->next = l1;
   l1 = p;//l1指向加了新节点p的链表
   pre = l1;
   p1 = l1->next;
   
   int sum = 0;//sum用于求和，为了提高效率（不重复使用指针取值运算）
   int carry = 0;//表示两0-9数字相加时的进位
   
   while(p1 !=NULL && p2 != NULL)
   {
       sum = carry + p1->val + p2->val;
       carry = sum / 10;//获取进位
       p1->val = sum % 10;//获取进位后的值
       pre = p1;
       p1 = p1->next;
       p2 = p2->next;
   }
   if(p2 != NULL)
        p1 = p2;//当两个数位数不等时继续遍历
   while(p1 != NULL)
   {
       sum = carry + p1->val;
       carry = sum / 10;
       p1->val = sum % 10;
       pre->next = p1;
       pre = p1;
       p1 = p1->next;
   }
   if(carry)//最后还有进位的话，需要把最开始申请的节点链入
   {
       pre->next = l1;
       l1 = l1->next;
       pre->next->next = NULL;
   }
   else//最后没有进位的话，需要把最开始申请的节点链入
   {
       l1 = l1->next;
       free(p);
   }
   return l1;
}
{% endhighlight %}
    运行效率：

![](/assets/img/daily/Add-Two-Numbers.png)

