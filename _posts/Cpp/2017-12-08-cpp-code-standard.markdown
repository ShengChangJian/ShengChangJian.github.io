---
layout: post
title: "C++ 编程规范"
date: 2017-12-08 10:49:35
categories: C++/C-心得
tags: Cpp
---

> 该编程规范参考了 Google 的 C++ 编程规范，同时加入了本人一些取舍和改变。这是本人比较喜欢的编程规范。




* 目录
{:toc}

# 概述

实际上，不论你采用何种编程规范，理论上只有在同一个项目中保持一致就可以了。不过最好在所有的项目中保持一致，同时，参与
相同项目的所有人也最好约定好编程规范，并坚持到底，至少被其他人使用的接口规范保持一致。这有助于自己找错、也有利于其他
人阅读理解你的程序，提高沟通效率，当然也有助于自己今后修改或重构之前的程序。一旦养成好的编程习惯，不仅可以提高编程
效率，也可以提高程序的易用性，同时减少错误发生的概率，减少不必要的回眸。

如上所述，后面提出的编程规范只是参考而已，只要你找到适合自己的编码规范并坚持下去就可以了，当然有时候需要适应项目和
团队的编程规范。

总体上的规范是：*命名型义简明、排版区块分明*

## 命名规范

总体上类型名使用```大驼峰```方式，即单词首字母大写；变量名使用```小驼峰```方式（为了适当加小写前缀
标识特殊作用域或类型的变量），即第一个单词首字母小写，其他单词首字母大写；其他则加以前缀或后缀标识。
尽量不使用下划线，主要是为了：

+ 区分自己定义和库定义（针对 Linux 而言）的类型、函数等；
+ 减小名称的长度；

|项目|命名规范|
|文件名|大驼峰，尽量表明文件内容，比如与类名字同名|
|typename 类型名|大驼峰，不用加前缀|
|命名空间|大驼峰，加```N```前缀，建议具有真实含义的命名空间放在项目命名空间内，表示 namespace|
|类名|大驼峰，加```C```前缀，形容词名词组合，表示 class|
|枚举类型|大驼峰，加以```E```前缀，表示 enum|
|联合体类型|大驼峰，加以```U```前缀，表示 union|
|C 结构|大驼峰，加以```S```前缀，表示 struct|
|类模板|大驼峰，加```T```前缀，表示 template|
|接口|大驼峰，加```I```前缀，表示 interface|
|typedef 类型|后面加```_t```标识（虽然有点别扭），表示 type|
|函数名|大驼峰，动宾短语|
|回调函数|（函数作为其他函数的参数）大驼峰，加以```On```前缀|
|虚函数|大驼峰，加以```Do```前缀，取之于```TODO```，表示“待实现”之意|
|protect 函数|大驼峰，加以单下划线```_```前缀|
|private 函数|大驼峰，加以双下划线```__```前缀|
|bool 函数|大驼峰，加以```Is```或```Enable```前缀|
|虚函数 bool型|大驼峰，加以```DoIs```或```DoEnable```前缀|
|普通变量名|小驼峰|
|全局变量|小驼峰，加以```g```前缀，表示 global|
|成员变量|小驼峰，加以```m```前缀，表示 member|
|结构体中的变量|小驼峰，不需要加前缀|
|静态变量|小驼峰，加以```s```前缀，表示 static|
|静态全局变量|小驼峰，加以```s```，不用再加```g```，因为作用域可区别|
|静态成员变量|小驼峰，加以```s```前缀，不用再加```m```，因为作用域就可区别|
|bool 变量|小驼峰，加以```is```前缀|
|宏定义|全大写，用下划线```_```隔开|
|常量(const)或枚举值|小驼峰，加以```k```前缀，因为 const 里面的 c 字母对应的发音是 k|

    注意：

名称中尽量不要使用单词缩写，除非是熟知的专业术语（如 URL、URI，但仍然需要注解或缩写词对照表）。但同时在正确表义的情况下减少
单词数量（如剔除不必要虚词、用 2 代替 to 等）和单词长度（如有近义词则选择长度短的，双重否定用肯定词等）。

    以上命名规范基于以下原因：

+ 源文件中使用的单词尽量简单，并且意思相同的尽量重用：
+ 尽量利用好编译器的检查功能；

有时候，类型、函数、变量等在意义上相同，但是基于名字唯一性，不得不另取名字，增加了理解的难度，同时也给编程人员带来了
选词的困难，或许你会说，可以加前缀或后缀，或者通过大小写来区分，这样不就不用同义多词了，但是也得有个规则来支持这样做。
而本命名规范就提供了这样的规则：

*  类型名和函数名都采用大驼峰（都使用大驼峰的原因在于类构造函数与类名称相同，保持整体和谐），类型名加前缀，函数名不加，
不同函数（静态成员函数（作用域为类）、全局函数（作用域为工程）、静态全局函数（作用域为文件）、普通成员函数（作用域为对象））
间不区分（因为作用域已经可以界定，并且很少有命名冲突，不过还是建议把非成员函数放在命名空间中、以进一步缩小作用域而减少冲突或被隐藏的概率），
但是，public 和 protect 及 private 成员函数间需要区分，因为需要名称复用，它们之间加前缀下划线加以区分（区别于类型、变量标识，
同时作用域帮助区分了某些带前后缀下划线的系统函数）；
* 变量名采用小驼峰，特殊变量加前缀标识，为的是单词意义重用，同时显示其作用域区别，防止相互隐藏而降低程序的可读性和可调式性；
+ 特殊类型要加以区分：
    * 结构体默认只用于公开数据；
    * 类默认只公开接口（函数）；
    * 枚举中的值类似 const 常量；
    * 宏全大写并下划线分割，为的警示少用；
+ 虚和非虚要区分：
    * 警示重写或继承；
    * 区分重写和重载；
+ 函数参数要显著区分：提高对参数修改的晶体和提示；
+ 类型标识取大写首字母加以区分，变量则用小写首字母区分；
+ typedef 要与原类型求同存异：
    * 尽量用原类型的名称加```_t```；
    * 达到简化原类型的目的，特别是名字空间或类名很长的情况；
    * 是同一数据结构在不同场景下根据意义取不同名称，同时用后缀暗示其存在原始类型名；
+ 不用标识函数输入输出参数，而是：
    * 尽量使用 const 以编译器限定不可变输入；
    * 用 const 引用类型输入大对象；
    * 作为输出参数的要用指针，不改变指针指向的用指针常量，不改变指针所指对象的内容用常量引用；

以上说这么多，也只是增加自觉遵守上述规范的可能性，同时特别强调：*尽量不要使用缩写，因为很多词或短语的缩写形式是一样的，
实在要缩写，请一定在后面添加注释或者在文档中给出缩写词对照表*。

## 配套规范：

下面的规范是为了配合命名规范有效实施的配套规范或者拓展规范。

+ 命名空间简化

*为了配合以上规范，全局性质的变量请使用```::```警示全局作用域，不要用 ```using namespace``` 指令*，如果命名空间层次太多
或名字太长，可以用```typedef```定义类型别名（如原类型名加```_t```后缀）或者使用命名空间别名```using```(如 using Project = PC.MyCompany.Project; )
来减少代码量（尽管有代码补全，但命名空间层次太多，也会增加补全次数而影响编码速度），同时增加可读性，而且可以尽量保证同行代码不换行（毕竟长的命名空间名
容易导致换行）。

+ 函数参数顺序：

*先是输出参数，再输入参数，中间是同时作为输入输出的参数*。这条规则参考自```C 语言```（如 char *strcpy( char *dest, const char *src );），同时兼顾
 C++ 的默认参数值形式（输出参数一般不会省略，输入参数则可能省略，所以输入参数放在参数列表后面），而且，输出参数间的顺序按照重要性或常识排列
（比如，客观顺序），输入参数间顺序可以按照可省略性最大的排在最后的规则排序。

    注意：

输入参数使用值传递（小对象或内置类型）或 const 引用或常指针，输出参数使用指针。返回值不能是局部 引用或指针。

+ 类中函数声明顺序：

先构造函数和析构函数，如果有继承并且继承中有虚函数或其他函数要实现或覆盖，则按照父类中函数的相对顺序声明；如果继承了多个类，声明也保持继承声明的
顺序，如此可以提示本类尽可能少的声明函数（父类中已经有类似的函数了，就不用再造了）；最后到本类独有的函数，这也是有顺序的，先重要性和复合性大的函
数放在前面，这遵守的是函数式编程（完成复杂函数时，其中小的功能模块事先用函数名称代替（先不实现这些用到的函数，之后再实现，最后考虑这些函数是否提
供给外部使用），如此使得复杂函数具有自解说性，从而提高了可读性，同时降低了注释文档的代价，同时这也符合人的思维习惯。

+ 成员变量和成员函数间的顺序：

成员变量放在最后，思考时也建议先想好应有哪些数据，然后再想如何操作这些数据实现功能，当然，在实现函数的过程中，可以增加成员变量，以达到某种设计上
要求（比如，安全性或某种规范要求）。

+ 控制符顺序：

public 在上，protect 在中间，private 在最下边；成员函数在上方区域，成员变量在下方区域。这种顺序是符合访问控制权限定义的（把这种结构看做一个“栈”，
则上面的更容易访问到，这恰好顺应访问控制层次）。

+ cpp 中函数定义顺序：

同 h 文件中的声明顺序。这便于写程序和读程序。因为我们一般喜欢至少同时打开 3 个文件：h 文件、对应的 cpp 文件、测试测序文件（main 函数），这样就可以
很快地对照定位，同时也符语文中的“前后呼应”的要求，总之，尽量重用（吾称之为“思想重用”）我们大脑或常识中已有的规则或知识，减少精力损耗，
以节省精力应对新问题。

+ 注释：

尽量将表达的意思放在类型名、变量名、函数名、函数式编程（对逻辑解读很重要）、设计模式等中，使这些就有“自我诠释性”，从而减少注释的需求和代价，
而且看注释有时候也是需要时间的，同时，经常会忘记更新注释（不恰当的注释比没有注释还糟糕）。所以，*注释要少而精*，“少”意味着漏掉更新的几率减少，
“精”意味着非常必要和重要，如此可以增加可读性，此所谓“一分钟文档低过几小时源码”、

# 源文件名

编程之前，当然首先遇到的是文件名了。

    源文件名命名规范：

+ 文件名表义简明，大驼峰，尽量表明文件内容，比如与类名字同名；
+ 类或模块定义时文件名一般一一对应（虽然类名规则与文件名规则不同，但可以去除类名的前缀即可对应）。
+ 文件后缀名用```.cpp```、```.h```、```.c```；

# 头文件

头文件命名规则见“源文件名”一节。头文件中要使用```#define```保护，防止头文件被多重包含，命名格式
为：```<PROJECT>_<PATH>_<FILE>_H_```。

为保证唯一性，头文件的命名应基亍其所在项目源代码树的全路径（这是唯一的）。例如，项目 foo 中的
头文件foo/src/bar/baz.h 挄如下方式保护：

{% highlight c %}
#ifndef FOO_BAR_BAZ_H_
#define FOO_BAR_BAZ_H_
...
#endif // FOO_BAR_BAZ_H_
{% endhighlight %}

    注意：

实际上，```#define``` 保护是不够的，它只能在编译时有保护作用，但在连接时已无能无力。通常会发生类似
重定义的错误，原因在于：编译时 cpp 是分开编译的，所以多个 cpp 都包含同一个头文件时，这些 cpp 文件中
都会嵌入同一个头文件内容（即有冗余和重复），所以在编译 main 函数并连接时，如果在该头文件中定义了
变量，则会出现重定义或二义性。为此，头文件中```不能定义变量```，只能用```extern```声明变量；而声明
变量应放在对应的 cpp 文件中（注意：*头文件声明变量时，除了加了```extern```关键字和不能赋值外，其他
都与 cpp 中定义变量的形式保持一致，否则，连接时被认为是不同的变量，此时声明就会被转为定义，从而导致
```重定义```等错误*

    建议：

像常量或配置信息或全局性变量等容易变化的量或需要经常查询的量应根据功能分块集中起来放在头文件（该头文件
最好明确指示文件中的内容），以便于修改。

## 头文件包含顺序

头文件包含顺序没有一致的观点，这里建议以下顺序：

+ OS SDK .h（操作系统相关的头文件）；
+ C 标准库；
+ C++ 标准库；
+ 其他第三方库的头文件；
+ 自己工程的头文件

总体上遵循的是*从一般到特殊的原则*，不过，为了加强可读性和避免隐含依赖，应首先包含```*.cpp```
对应的头文件```*.h```（放在上述序列的第一条）。

    例如：

如 a.cpp 文件中应该优先包含 a.h。首选的头文件是为了减少隐藏依赖，同时确保头文件和实现文件是匹配的。
具体的例子是：假如你有一个 cpp 文件是google-awesome-project/src/foo/internal/fooserver.cc，那么它
所包含的头文件的顺序如下：

{% highlight c %}
#include "foo/public/fooserver.h"  // Preferred location.

#include <sys/types.h>
#include <unistd.h>

#include <hash_map>
#include <vector>

#include "base/basictypes.h"
#include "base/commandlineflags.h"
#include "foo/public/bar.h"
{% endhighlight %}

在包含头文件时应该加上头文件所在工程的文件夹名，即假如你有这样一个工程 base，里面有一个 logging.h，
那么外部包含这个头文件应该这样写：

    #include "base/logging.h"，而不是 #include "logging.h"

之所以要将头文件所在的工程目录列出，作用应该是命名空间是一样的，就是为了区分不小心造成的文件重名。

    C++ 编程思想一书中倡导的顺序

*从最特殊到最一般*。 如果包含头文件的顺序是“从最特殊到最一般”，如果我们的头文件不被它自己解析。
我们将马上找到它，防止麻烦事情发生。换句话说，当出现莫名错误时，可能和头文件包含顺序有关。

实际上，这种种都是 C 语言作用域规则的结果。后包含的头文件会隐藏之前包含的头文件中相同名称（可见性
相同的情况下）的内容。

    小技巧：

可以使用```预编译头文件```来提高编译速度。

## 减少包含头文件的数量

使用```前置声明```（forward declarations）尽量减少 .h 文件中 #include 的数量。

当一个头文件被包含的同时也引入了一项新的依赖（dependency）（见“Makefile”），叧要该头文件被修改，
代码就要重新编译。如果你的头文件包含了其他头文件，返些头文件的任何改变也将导致那些包含了你的头文件
的代码重新编译。因此，我们应该尽量少的包含头文件。

    如何使用前置声明

使用前置声明可以显著减少需要包含的头文件数量。举例说明：头文件中用到类 foo，但不需要访问 foo
的声明，则头文件中叧需前置声明 class foo;无需 #include "base/foo.h"。在头文件如何做到使用类 foo 而
无需访问类的定义？

+ 将数据成员类型声明为 ```foo *``` 或 ```foo &```；
+ 参数、返回值类型为 foo 的函数只是声明（但不定义实现）；
+ 静态数据成员的类型可以被声明为 foo，因为静态数据成员的定义在类定义之外。

有时，使用指针成员（pointer members，如果是 scoped_ptr 更好）替代对象成员（object members）
的确更有意义。然而，返样的做法会降低代码可读性及执行效率。如果仅仅为了少包含头文件，还是不要
返样替代的好。因为执行效率的优先级大于编译效率。

当然，.cpp 文件无论如何都需要所使用类的定义部分，自然也就会包含若干头文件。不过，*能依赖声明
就不要依赖定义*。

# 命名空间

建议一个项目一个全局命名空间，然后如果需要再在该命名空间下定义一个子命名空间（需要取一个具体
意义的名字）。

在 cpp 文件中，提倡使用不具名的命名空间，可避免运行时的命名冲突；在头文件中不要使用不具名的
命名空间，也不要使用 using 指令。

命名空间结束时要做标识，防止尾部花括号与函数等的花括号等混淆导致缺少或冗余花括号，减少编译错误。

    不具名命名空间：

{% highlight cpp %}
namespace { // .cpp 文件中
// 命名空间的内容无需缩迕
enum{ kYellow, kBlue, kBlack }; // 经常使用的符号
bool AtEof(){ return pos == EOF; } // 使用本命名空间内的符号 EOF
} // namespace
{% endhighlight %}

    具名的命名空间：

{% highlight cpp %}
// .h 文件
namespace NMynamespace{
// 所有声明都置亍命名空间中, 注意丌要使用缩迕
class CMyClass{
public:
 ...
 void Foo();
};
} // namespace mynamespace


// .cpp 文件
namespace NMynamespace{
// 函数定义都置亍命名空间中
void CMyClass::Foo(){
 ...
}
} // namespace mynamespace

// 复杂的 .cpp 文件
#include "a.h"

class C; // 全尿命名空间中类 C 的前置声明
namespace a { class A; } // 命名空间 a 中的类 a::A 的前置声明

namespace b{
...code for b... // b 中的代码
} // namespace b
{% endhighlight %}

不要声明命名空间 std 下的任何内容，包括标准库类的前置声明。声明 std 下的实体会导致不明确的行为，
如，不可移植。声明标准库下的实体，需要包含对应的头文件。最好不要使用 using 指示符，
以保证命名空间下的所有名称都可以正常使用。

在 .cpp 文件、.h 文件中的函数、方法或类中，可以使用 using，还可以使用命名空间别名（当该命名空间
使用较多时，建议使用，可以减少编码，同时增加可读性），如 namespace fbz = ::foo::bar::baz;

# 类

类是 C++ 中的基本代码单元，需要知道写一个类时要做什么，不要做什么。

## 成员函数

需要注意一些特殊的成员函数。

> 构造函数

构造函数可以初始化引用和指针，尽可能少的进行其他操作；可能的话，尽量使用 Init() 方法集中初始化
为有意义的（non-trivial）数据。

    在构造函数中执行操作引起的问题有：

+ 构造函数中不易报告错误，不能使用异常；
+ 操作失败会造成对象初始化失败，引起不确定状态；
+ 构造函数内调用虚函数，调用不会派发到子类实现中，这会造成错觉；
+ 如果有人创建该类型的全局对象（虽然违背了上节提到的原则），构造函数将在 main() 之前被调用，有
可能破坏构造函数中暗含的假设条件。

结论：如果对象需要有意义的（non-trivial）的初始化，考虑使用另外的 Init() 方法并（或）增加一个
成员标记用亍指示对象是否已经初始化成功。

> 默认构造函数

如果类中定义了成员变量，没有提供其他构造函数，你需要定义一个默认构造函数（没有参数），以防止
编译器自动生成默认构造，使成员变量处于不确定的状态。因此，需要自定义默认构造函数对成员变量明确
初始化，以保证变量有确定的状态，便于调试。

如果你定义的类继承现有类，而你又没有增加新的成员发量，则不需要为新类定义默认构造函数。

> 明确的构造函数

对所有单参数构造函数使用 C++ 关键字 explicit，以避免隐式转换造成的麻烦。

    例外：

在少数情冴下，拷贝极造函数可以不声明为 explicit；特意作为其他类的透明包装器的类。类似例外
情况应在注释中明确说明。

> 拷贝构造函数

仅在代码中需要拷贝一个类对象的时候使用拷贝构造函数；不需要拷贝时应使用 DISALLOW_COPY_AND_ASSIGN
（拷贝构造函数使得拷贝对象更加容易，STL 容器要求所有内容可拷贝、可赋值）。

C++ 中对象的隐式拷贝是导致很多性能问题和 bugs 的根源。拷贝构造函数降低了代码可读性，相比按引用传递，
跟踪按值传递的对象更加困难，对象修改的地方变得难以捉摸。

大量的类并不需要可拷贝，也不需要一个拷贝构造函数或赋值操作。不幸的是，如果你不主劢声明它们，
编译器会为你自劢生成，而丏是 public 的。

可以考虑在类的 private 中添加空的（dummy）拷贝构造函数和赋值操作，只有声明，没有定义。由亍返
些空程序声明为 private，当其他代码试图使用它们的时候，编译器将报错。为了方便，可以使用宏
DISALLOW_COPY_AND_ASSIGN：

{% highlight cpp %}
// 禁止使用拷贝构造函数和赋值操作的宏
// 应在类的 private: 中使用
#define DISALLOW_COPY_AND_ASSIGN(TypeName) \
 TypeName(const TypeName&); \
 void operator=(const TypeName&)

class Foo {
public:
  Foo(int f);
  ~Foo();
private:
  DISALLOW_COPY_AND_ASSIGN(Foo);
};

{% endhighlight %}

如上所述，绝大多数情冴下都应使用 DISALLOW_COPY_AND_ASSIGN，如果类确实需要可拷贝，应在该
类的头文件中说明原由，并适当定义拷贝构造函数和赋值操作，注意在 operator= 中检测自赋值
（self-assignment）情况。在将类作为 STL 容器值得时候，你可能有使类可拷贝的冲劢。类似情冴下，
真正该做的是使用指针指向 STL 容器中的对象，可以考虑使用 std::tr1::shared_ptr。

> 非成员函数

使用命名空间中的非成员函数或静态函数，尽量不要使用全局函数。

## 结构体和类

仅当只有数据时使用 ```struct```，其他一概使用 ```class```。如果与 STL 结合，对于仿函数和特性（traits）
可以不用 class 而是使用 struct。

## 继承

所有继承必须是```public```的，如果想私有继承的话，应该采取包含基类实例作为成员的方式替代。*不要
过多的使用继承*，组合通常更合适一些，努力做到明确是```is-a```的时候才使用继承。必要的话（如果
该类具有虚函数），令其析构函数为 ```virtual```。

限定仅在子类访问的成员函数为 ```protected```，需要注意的是，*数据成员应始终未私有*（否则使用
结构体更为合适）。

## 多重继承

真正需要用到多重实现继承的时候非常少，只有当最多一个基类中含有实现，其他基类都是 ```Interface```的
纯接口类时才会使用多重继承。当然也有例外，除非你明确这样做的好处大于其带来的影响。

## 接口

当一个类满足以下要求时，称之为```接口```：

+ 只有纯虚函数和静态函数（下文提到的析构函数除外）；
+ 没有非静态数据成员；
+ 没有定义任何构造函数。如果有，也不含参数，并且为 ```protected```；
+ 如果是子类，也只能继承满足上述条件的类。

接口类不能被直接实例化，因为它声明了纯虚函数。为确保接口类的所有实现可被正确销毁，必须为之声明
虚析构函数。

## 操作符重载

除少数特定环境外，不需要重载操作符，一般可以用明确的函数来代替。虽然操作符重载令代码更加直观，
但也有一些不足：

+ 查找重载操作符的调用处更加困难，查找 Equals() 显然比同等调用 == 容易的多；
+ 有的操作符可以对指针迕行操作，容易导致 bugs，Foo + 4 做的是一件事，而```&Foo + 4 ```可能做的是
完全不同的另一件事，对亍二者，编译器都不会报错，使其很难调试；
+ 重载还有令你吃惊的副作用，比如，重载操作符```&```的类不能被前置声明。

一般不要重载操作符，尤其是赋值操作（operator=）比较阴险，应避避免重载。如果需要的话，可以定义
类似 Equals()、CopyFrom()等函数。然而，除少数情况下需要重载操作符以便与模板戒“标准”C++类衔接
（如 operator<<(ostream&, const T&)），如果被证明是正当的尚可接叐，但你要尽可能避免返样做。
尤其是不要仅仅为了在 STL 容器中作为 key 使用就重载 operator== 或 operator<，取而代之，你应该在
声明容器的时候，创建相等判断和大小比较的仿函数类型。

有些 STL 算法确实需要重载 operator== 时可以返么做，但不要忘了提供文档说明原因。

## 存取控制

将数据成员私有化，并提供相关存取函数，如定义变量 mFoo 及叏值函数 Foo()、赋值函数 SetFoo()。
存叏函数的定义一般内联在头文件中。

## 声明次序

在类中使用特定的声明次序：public: 在 private: 之前，成员函数在数据成员（发量）前。
定义次序如下：public:、protected:、private:，如果那一块没有，直接忽略即可。

每一块中，声明次序一般如下：

+ typedef 和 enums；
+ 常量；
+ 构造函数；
+ 析构函数；
+ （静态或）成员函数；
+ （静态或）数据成员；

宏 DISALLOW_COPY_AND_ASSIGN 置亍 private: 块之后，作为类的最后部分。参考拷贝极造函数。

*.cpp 文件中函数的定义应尽可能和声明次序一致。*

不要将大型函数内联到类的定义（不便于阅读，也暴露了过多细节）中，通常，只有那些没有特别意义（不便于调试）
的或者性能要求高的，并且比较短小的函数才被定义为内联函数。

## 编写短小函数

倾向亍选择短小、凝练的函数。长函数有时是恰当的，因此对亍函数长度幵没有严格限制。如果函数超过 40 行，
可以考虑在不影响程序结极的情况下将其分割一下。

即使一个长函数现在工作的非常好，一旦有人对其修改，有可能出现新的问题，甚至导致难以发现的 bugs。
使函数尽量短小、简单，便亍他人阅读和修改代码。

在处理代码时，你可能会发现复杂的长函数，丌要害怕修改现有代码：如果证实返些代码使用、调试困难，
或者你需要使用其中的一小块，考虑将其分割为更加短小、易亍管理的若干函数。

## 重载函数

仅在输入参数类型不同，功能相同时使用重载函数（含构造函数），不要使用函数重载模仿缺省函数参数。
如果只有一个参数，可以使用 explicit 防止隐式转换（除非你特意这么做），不过也可以想办法使函数
名包含参数信息（对于参数比较少的情况）。这样就可以减少重载函数带来的困惑。

## 函数参数约定

输入参数使用值传递（小对象或内置类型）或 const 引用或常指针，输出参数使用指针。返回值不能是局部
引用或指针。

禁止使用缺省函数参数（除非有意为之），虽然很少使用的缺省参数可以减少函数定义（不需要为了很少
使用的缺省参数而额外增加一个函数定义）。

函数参数只读的尽量用 ```const``` 修饰（只要遵循本节首段的规则，只有在引用对象作为输入参数时用
，其他情况不建议使用），不改变成员变量的函数要在函数头后加 ```const```；基本类型不要使用 ```&``` 
引用（输出参数可以使用指针），这样会增加理解难度，也无法体现引用的好处；函数中变量意义改变时，
可以使用引用别名增加可读性（如果确实必要才这样做）；返回值可能作为判断时（比如 bool 型函数），
也可以加 const，防止出现```==```写成```=```的形式，当然如果遵守*常量==变量或函数*的条件判断写法，
本身就可以最大程度的防止这种错误。

## 嵌套类（成员类）

当公开嵌套类作为接口的一部分时，虽然可以直接将他们保持在全局作用域中，但将嵌套类的声明属于命名
空间中是更好的选择。

不要将嵌套类定义为 public，除非它们是接口的一部分（如前所述），比如，某方法使用了返个类的一系列选项。

当嵌套（成员）类只在被嵌套类（enclosing class）中使用时很有用，将其置亍被嵌套类作用域作
为被嵌套类的成员不会污染其他作用域同名类。可在被嵌套类中前置声明嵌套类。注意：在 .cpp 文件中定义
嵌套类，避免在被嵌套类中包吨嵌套类的定义，因为嵌套类的定义通常只与实现相关。

不过，只能在被嵌套类的定义中才能前置声明嵌套类。因此，任何使用 Foo::Bar* 指针的头文件必须包含整
个 Foo 的声明。

{% highlight cpp %}
class Foo {
private:
 // Bar 是嵌套在 Foo 中的成员类
 class Bar {
 ...
 };
};
{% endhighlight %}

## 友元

允许吅理使用友元类及友元函数。

通常将友元定义在同一文件下，避免读者跑到其他文件中查找其对某个类私有成员的使用。经常用到友元
的一个地方是将 FooBuilder 声明为 Foo 的友元，FooBuilder 以便可以正确构造 Foo 的内部状态，而无
需将该状态暴露出来。某些情冴下，将一个单元测试用类声明为待测类的友元会很方便。

友元延伸了（但没有打破）类的封装界线，当你希望只允许另一个类访问某个成员时，使用友元通常比将
其声明为 public 要好得多。当然，大多数类应该叧提供公共成员与其交互。

## 运行时类型识别 RTTI

除单元测试外，不要使用 RTTI，如果你収现需要所写代码因对象类型不同而动作各异的话，考虑换一种方
式识别对象类型。虚函数可以实现随子类类型不同而执行不同代码，工作都是交给对象本身去完成。

如果工作在对象之外的代码中完成，考虑双重分发方案，如 Visitor 模式，可以方便的在对象本身之外确定
类的类型

## 类型转换

使用 C++ 风格而不要使用 C 风格类型转换：

+ static_cast：和 C 风格转换相似可做值的强制转换，或指针的父类到子类的明确的向上转换；
+ const_cast：移除 const 属性；
+ reinterpret_cast：指针类型和整型或其他指针间不安全的相互转换，仅在你对所做的一切了然亍心时使用；
+ dynamic_cast：除测试外不要使用，除单元测试外，如果你需要在运行时确定类型信息，说明设计有缺陷。

## 自增自减

对亍迭代器和其他模板对象使用前缀形式（++i）的自增、自减运算符。：对简单数值（非对象）来说，两种都无所谓，
不过建议尽量使用前自增前自减（对于 for 循环使用后自增后自减，可能更符合人的思维）。

注意，对于自减的情形，最好不要使用像 size_t 之类的不可能为负的类型，因为可能永远不会达到你的判断
条件。

## 预处理宏

使用宏时要谨慎，尽量以内联函数（除非你故意逃避类型检查）、枚举和常量代替之。宏意味着你和编译器
看到的代码是不同的，因此可能导致异常行为，尤其是当宏存在亍全尿作用域中，而且不便于调试。

## 0 和 NULL

整数用 0，实数用 0.0，指针用 NULL，字符（串）用 '\0'。

## sizeof

sizeof 尽量用变量而不是类型，如 sizeof(varName).

# 排版规范

编译器对源代码的排版没有要求，但好的排版对编写代码的人查错、修改和思维有很大的好处，同时也可增加
可读性。

+ 缩进：使用 2 个空格；
+ 括号：括号与字符（括号与括号)之间不要有空格；
+ 代码块：

开花括号始终与函数在```)```在同一行；开花括号后不能空行，闭花括号前不能空行；闭花括号与 else 同行；

+ namespace：命名空间中的顶级代码不要缩进（其他缩进参考前述）；
+ 类中访问控制符：缩进一个空格，不同的控制段间有空行；
+ 类中成员函数或变量：缩进两个空格（相对与最左端）；
+ 预处理宏：不要缩进；
+ 指针或引用：使用类似 ```char *c;```的格式；
+ 运算符：运算符（如```=```、```==```、```<```等）两边各有一个空格；自增自减除外。
+ 分号；分号后与字符之间有一个空格（如在 for 中）；
+ if/for/while 语句：原则上要带花括号，如果只有一条语句，则应共行；有 else 必须都要花括号；
+ 成员调用或指针调用符号：其左右不能有空格；
+ 函数或语句一行写不下时：折行，并且所有元素单独成行（比较短的元素可以几个工行，但一定在分割符后断行，如```,```）
并且要对齐(相对于第一行缩进 4 个字符，这是为了与代码块缩进相区分)，每行的末尾必须是符号（如```,```、```&&```等）；
除 main 函数外，所有的开花括号都不能单独成行（main 函数开闭花括号必须单独成行，以警示）。
+ 函数声明尽量要在一行，不能同行的，至少返回类型和函数名及```(```同行，所有参数单独成行（闭括号和
开花括号紧接最后一个参数）。
+ return：可以 return x; 不能写成 return (x);
+ 行长度：一般不要超过 80 列；类继承符或构造函数初始化列表符```:```同行其后空格，折行其前要空格
（目的是要显目）。
+ 不同的函数或功能模块要空一行。
+ 除 main 函数外，所有的函数、类、命名空间等模块结束之后要注释，例如```/**< std*/```，这可以显著标识
功能块结束位置。
+ 过长的名字，比如带有多个命名空间，则要在函数内部或类内部用 ```using =```（尽量不要使用```using namespace```） 
或 ```typedef``` 缩短(typedef 最好不要断行，否则不便于阅读和理解)，同时尽量明确意义。
+ 模板函数或模板类比较长时，模板单独一行，函数或类另起一行（不要缩进）。

# 注释规范

本节所用的注释规范是为了配合 ```doxygen``` 从源代码中借助注释生成帮助文档。
使用 JavaDoc 风格且 JAVADOC_AUTOBRIEF 为 YES：不使用 C++ 风格的原因是为了兼容 C 和Java，如此一套注释
规范可以用于三种语言，减少了遵循规则的难度和代价。为了更快更省时的写注释，本人用的是 vim 插件 
```DoxygenToolkit``` ，把 license 说明和作者版本说明整合了一下，并加入了公司名称的变量，
并修改作者版本说明字段对齐，同时添加了行尾注释功能，这些修改在 DoxygenToolkit.vim 文件中完成：

{% highlight vim %}
let s:licenseTag = "Unpublished copyright. All rights reserved. This material contains\<enter>"  
let s:licenseTag = s:licenseTag . "proprietary information that should be used or copied only within\<enter>"  
let s:licenseTag = s:licenseTag . "COMPANY, except with written permission of COMPANY.\<enter>" 

if !exists("g:DoxygenToolkit_briefTag_lic_pre")  
  let g:DoxygenToolkit_briefTag_lic_pre = "@brief: "  
endif  
if !exists("g:DoxygenToolkit_briefTag_pre")  
  let g:DoxygenToolkit_briefTag_pre = "@brief: "  
endif  
if !exists("g:DoxygenToolkit_fileTag")  
  let g:DoxygenToolkit_fileTag = "@file: "  
endif  
if !exists("g:DoxygenToolkit_authorTag")  
  let g:DoxygenToolkit_authorTag = "@author: "  
endif  
if !exists("g:DoxygenToolkit_dateTag")  
  let g:DoxygenToolkit_dateTag = "@date: "  
endif  
if !exists("g:DoxygenToolkit_versionTag")  
  let g:DoxygenToolkit_versionTag = "@version: "  
endif 
{% endhighlight %}

修改 DoxygenLicenseFunc 函数，整合作者版本信息，这里默认版本号为1.0，单独添加作者版本信息时要输入版本号

{% highlight vim %}
""""""""""""""""""""""""""  
" Doxygen license comment  
""""""""""""""""""""""""""  
function! <SID>DoxygenLicenseFunc()  
  call s:InitializeParameters()  
  
  " Test authorName variable  
  if !exists("g:DoxygenToolkit_companyName")  
    let g:DoxygenToolkit_companyName = input("Enter name of your company: ")  
  endif  
  if !exists("g:DoxygenToolkit_authorName")  
    let g:DoxygenToolkit_authorName = input("Enter name of the author (generally yours...) : ")  
  endif  
  mark d  
  
  " Get file name  
  let l:fileName = expand('%:t')  
  let l:year = strftime("%Y")  
  let l:copyright = "Copyright (c) "  
  let l:copyright = l:copyright.l:year." ".g:DoxygenToolkit_companyName."."  
  let l:license = substitute( g:DoxygenToolkit_licenseTag, "\<enter>", "\<enter>".s:interCommentBlock, "g" )  
  let l:license = substitute( l:license, "COMPANY", g:DoxygenToolkit_companyName, "g" )  
  exec "normal O".s:startCommentBlock  
  exec "normal o".s:interCommentTag.l:copyright."\<enter>".s:interCommentTag  
  exec "normal o".s:interCommentTag.l:license  
  exec "normal o".s:interCommentTag.g:DoxygenToolkit_fileTag.l:fileName  
  exec "normal o".s:interCommentTag.g:DoxygenToolkit_briefTag_lic_pre  
  mark d  
  exec "normal o".s:interCommentTag.g:DoxygenToolkit_authorTag.g:DoxygenToolkit_authorName  
  exec "normal o".s:interCommentTag.g:DoxygenToolkit_versionTag."1.0"  
  let l:date = strftime("%Y-%m-%d")  
  exec "normal o".s:interCommentTag.g:DoxygenToolkit_dateTag.l:date  
  if( s:endCommentBlock != "" )  
    exec "normal o".s:endCommentBlock  
  endif  
  exec "normal `d"  
  
  call s:RestoreParameters()  
  startinsert!  
endfunction  
{% endhighlight %}

修改 DoxygenAuthorFunc()，把 DoxygenToolkit_briefTag_pre 替换为 DoxygenToolkit_briefTag_lic_pre 为了对齐。

然后在.vimrc增加如下代码块：
{% highlight vim %}
"==============================================================
" DoxygenToolkit 自动注释
let g:DoxygenToolkit_companyName="YY.com"
let g:DoxygenToolkit_authorName="ShengChangJian Email: socojo@qq.com"
"let g:DoxygenToolkit_blockHeader="----------------------------------------------------------------------------" 
"let g:DoxygenToolkit_blockFooter="----------------------------------------------------------------------------"
let g:DoxygenToolkit_briefTag_funcName = "no"
let g:DoxygenToolkit_maxFunctionProtoLines = 30
nmap <C-k>a :DoxAuthor<CR>
"将光标放在 function 或者 class 的名字所在的一行
nmap <C-k>f :Dox<CR>
"将光标放在需要生成 License 的地方
nmap <C-k>l :DoxLic<CR>
nmap <C-k>b :DoxBlock<CR>
{% endhighlight %}

这就配置好了，后面可能还会加上行注释，以便更便捷的生成注释。

> 文件头

实际上也叫 license，请替换相应的内容。

{% highlight cpp %}
/* 
 * Copyright (c) 2017 COMPANY.
 * 
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that should be used or copied only within
 * YY.com, except with written permission of COMPANY.
 * 
 * @file: function.h
 * @brief: 
 * Details.
 *
 * @author: YourName Email: XXXX
 * @version: 1.0
 * @date: 2017-12-14
 */
{% endhighlight %}

> 命名空间

{% highlight vim %}
/**
 * @brief 命名空间的简单概述 \n(换行)
 * 命名空间的详细概述
 */
namespace OS{

}
{% endhighlight %}

> 类、函数、枚举、变量 

{% highlight cpp %}
/**
 * @brief 类的简单概述 \n(换行)
 * 类的详细概述
 */
class Test
{
 public:

 /** 
  * @brief 简要说明文字 
  */
 enum TEnum {
 TVal1, /**< enum value TVal1. */
 TVal2, /**< enum value TVal2. */
 TVal3 /**< enum value TVal3. */
 }
 *enumPtr, /**< enum pointer. Details. */
 enumVar; /**< enum variable. Details. */

 Test();
 ~Test();

/**
 * @brief: 
 * Details.
 *
 * @param[i] a an integer argument.
 * @param[o] s a constant character pointer.
 * @param[d]
 *
 * @return The test results
 * @retval 返回值 简要说明
 * @pre s 不能为空
 * @note 指定函数注意项事或重要的注解指令操作符
 * @see Test()
 * @see ~Test()
 * @see testMeToo()
 * @see publicVar()
 */
 int testMe(int a,const char *s);
 virtual void testMeToo(char c1,char c2) = 0;
 /**
  * @brief 成员变量m_c简要说明
  *
  * 成员变量m_variable_3的详细说明，这里可以对变量进行
  * 详细的说明和描述，具体方法和函数的标注是一样的
  */
 int publicVar;
 int publicVar1; /**< 变量简单注释. */
 int (*handler)(int a,int b);

  /**
   * @param [in] person 只能输入以下参数：
   * -# a:代表张三        // 生成 1. a:代表张三
   * -# b:代表李四        // 生成 2. b:代表李四
   * -# c:代表王二        // 生成 3. c:代表王二
   */
    void GetPerson(int person);
};
{% endhighlight %}

> 在成员之后放置文档(行注释) 

{% highlight cpp %}
int var; /**< Detailed description after the member */
{% endhighlight %}

这些块只能用于文档化成员和参数，无法用于文件，类，联合，结构，组，名字空间以及枚举，

> 单独注释

注释单独放在源文件的某块区域（不穿插在源代码中间）或者单独形成文件。有时候这个需求是适合的，
可以不影响源代码的阅读，特别是对于代码风格很好的项目，阅读源代码时很少需要注释。

{% highlight cpp %}
/*! \file structcmd.h
 \brief A Documented file.

 Details.
*/

/*! \def MAX(a,b)
 \brief A macro that returns the maximum of \a a and \a b.

 Details.
*/

/*! \var typedef unsigned int UINT32
 \brief A type definition for a .

 Details.
*/

/*! \var int errno
 \brief Contains the last error code
 \warning Not thread safe!
*/

/*! \fn int open(const char *pathname,int flags)
 \brief Opens a file descriptor.
 \param pathname The name of the descriptor.
 \param flags Opening flags.
*/

/*! \fn int close(int fd)
 \brief Closes the file descriptor \a fd.
 \param fd The descriptor to close.
*/

/*! \fn size_t write(int fd,const char *buf, size_t count)
 \brief Writes \a count bytes from \a buf to the filedescriptor \a fd.
 \param fd The descriptor to write to.
 \param buf The data buffer to write.
 \param count The number of bytes to write.
*/

/*! \fn int read(int fd,char *buf,size_t count)
 \brief Read bytes from a file descriptor.
 \param fd The descriptor to read from.
 \param buf The buffer to read into.
 \param count The number of bytes to read.
*/

#define MAX(a,b) (((a)>(b))?(a):(b))
typedef unsigned int UINT32;
int errno;
int open(const char *,int);
int close(int);
size_t write(int,const char *, size_t);
int read(int,char *,size_t);
{% endhighlight %}

> 列表

为了让文档看起来更清晰，有时候需要列表呈现内容。

{% highlight c %}
/**
* Text before the list
* - list item 1
*   - sub item 1
*     - sub sub item 1
*     - sub sub item 2
*   .
*   The dot above ends the sub sub item list.
*   More text for the first sub item
* .
* The dot above ends the first sub item.
* More text for the first list item
*   - sub item 2
*   - sub item 3
* - list item 2
* .
* More text in the same paragraph.
*
* More text in a new paragraph.
*/ 
{% endhighlight %}

如果在列表中使用 tabs 进行缩排，请确认配置文件中 TAB_SIZE 选项是否设置了正确的 tab 尺寸。
可在列表结束的缩排层级的空白处放置一个点“.”或者开始一个新的段落，即可结束一个列表。 

```doxygen``` 有太多的指令，这里就不一一列举了，有兴趣的可以参考官方文档。
