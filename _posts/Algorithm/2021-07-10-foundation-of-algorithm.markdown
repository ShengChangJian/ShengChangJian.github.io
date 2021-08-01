---
layout: post
title: "算法基石"
date: "2021-07-10 10:55:40"
categories: "算法"
tags: "Algorithm"
---

> 本文旨在收集经典的算法，此处称之为算法基石。你可以通过这些算法根据具体的应用场景或算法背景进行
适当地变形，从而得到其他变种的算法或更高效的算法。





* 目录
{:toc}

# 排序和查找

排序是不断将局部`逆序`变成局部`正序`，直到全局有序的过程。这个过程中可以采取以下一种或多种策略：
+ 交换：`逆序`的元素之间经过交换变成`正序`。交换可以有相邻交换、跨距交换
+ 选择：从待排序的元素中选出符合条件的元素，并追加到有序的列表中（头部或尾部），直到待排序的元素为空。
+ 归并：把局部分段有序的列表不断合并成更大有序段，直到全局有序。这其中会涉及到选择或交换。
+ 插入：已知一个有序列表（元素个数可以为0）和待排序列表，不断从待排序列表中逐个拿出元素不断插入到
有序列表中，直到待排序列表为空。
+ 计数排序：参见 [计数排序]("/2016/09/data-struct-basic.html#计数排序")
+ 桶排序： 参见 [桶排序](/2016/09/data-struct-basic.html#桶排序)
+ 基数排序： 参见 [基数排序](/2016/09/data-struct-basic.html#基数排序)

## 经典排序

+ 交换排序： [冒泡排序](/2016/09/data-struct-basic.html#冒泡排序)、[快速排序](/2016/09/data-struct-basic.html#快速排序)
+ 选择排序： [直接选择排序](/2016/09/data-struct-basic.html#简单选择排序)、[树形选择排序](/2016/09/data-struct-basic.html#树形选择排序)、
[堆排序](/2016/09/data-struct-basic.html#堆排序)
+ 插入排序： [直接插入排序](/2016/09/data-struct-basic.html#直接插入排序)、
[折半插入排序](/2016/09/data-struct-basic.html#折半插入排序)、[2-路插入排序](/2016/09/data-struct-basic.html#2--路插入排序)、
[表插入排序](/2016/09/data-struct-basic.html#表插入排序)、[希尔排序](/2016/09/data-struct-basic.html#希尔排序)
+ 计数排序： [计数排序](/2016/09/data-struct-basic.html#计数排序)
+ 桶排序： [桶排序](/2016/09/data-struct-basic.html#桶排序)
+ 基数排序： [基数排序](/2016/09/data-struct-basic.html#基数排序)

## 查找或搜索

+ 静态查找： 可参见 [常用查找算法](https://www.jianshu.com/p/3445be2d9956)、[查找算法总结](https://www.cnblogs.com/CJT-blog/p/10475707.html)、
[七大查找算法详解](https://blog.csdn.net/ch18328071580/article/details/99288323)
+ 动态查找： 可参见 [数据结构&算法学习笔记——查找](https://blog.csdn.net/weixin_45900618/article/details/108636110?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-3.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-3.control)
