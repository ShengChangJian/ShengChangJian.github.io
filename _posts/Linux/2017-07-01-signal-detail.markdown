---
layout: post
title:  "Linux 信号机制"
date:   2017-07-01 20:08:00
categories: Linux
tags: Linux
---

> 信号机制对于 Linux 而言是一种异步通信的方式。Linux 信号机制比较复杂，这里只对该机制做简单介绍，不过力求理解。




* 目录
{:toc}

# 信号概述

信号是在软件层次上对中断机制的一种模拟，可以根据```中断机制```来理解其中的某些细节问题，比如，信号处理程序类似中断处理程序。
信号是异步的，一个进程不必通过任何操作来等待信号的到达，事实上，进程也不知道信号到底什么时候到达。

信号是进程间通信机制中唯一的```异步通信机制```，可以看作是```异步通知```，通知接收信号的进程有哪些事情发生了。信号机制经过 POSIX 实时扩展后，
功能更加强大，除了基本通知功能外，还可以传递附加信息。

## 信号来源

信号事件的发生有两个来源：

+ 硬件来源：比如我们按下了键盘或者其它硬件故障
+ 软件来源：

最常用发送信号的系统函数是 kill, raise, alarm 和 setitimer 以及 sigqueue 函数，软件来源还包括一些非法运算等操作。

## 信号种类

可以从两个不同的分类角度对信号进行分类：

+ 可靠性方面： 可靠信号与不可靠信号；
+ 与时间的关系上： 实时信号与非实时信号；

### 可靠信号与不可靠信号

信号值小于 SIGRTMIN( Red hat 7.2中，SIGRTMIN=32，SIGRTMAX=63)的信号都是不可靠信号。

> 不可靠信号

    主要问题：

+ 信号处理程序：

信号处理程序不是永久安装的，进程每次处理信号后，就将对信号的响应设置为默认动作（而不是用户定制的处理程序），
因此，用户如果不希望这样的操作，那么就要在信号处理函数结尾再一次调用诸如 signal()，重新安装该信号。

+ 信号可能丢失

早期 unix 下的不可靠信号主要指的是进程可能对信号做出错误的反应以及信号可能丢失。

Linux 支持不可靠信号，但是对不可靠信号机制做了改进：在调用完信号处理函数后，*不必重新调用该信号的安装函数*（信号安装函数是在可靠机制上的实现）。
因此，Linux 下的不可靠信号问题主要指的是信号可能丢失。

   不可靠的主要原因：

不可靠信号*不支持排队*，后面的信号可能覆盖前面还没有来得及处理的信号。 

> 可靠信号

信号值位于 SIGRTMIN 和 SIGRTMAX 之间的信号都是可靠信号，可靠信号克服了信号可能丢失的问题。随着需求的发展，linux 出现了可靠信号，这些信号
支持排队，不会丢失。同时，信号的发送和安装也出现了新版本。

+ 信号安装函数：

Linux 在支持新版本的信号安装函数 sigation() ，同时，仍然支持早期的 signal（）信号安装函数。

+ 信号发送函数：

Linux 在支持新版本的信号发送函数 sigqueue()的同时，仍然支持早期的信号发送函数kill()。

    注意：

*不要有这样的误解：由 sigqueue() 发送、sigaction 安装的信号就是可靠的*。

事实上，可靠信号是指后来添加的新信号（信号值 位于 SIGRTMIN 及 SIGRTMAX 之间）；不可靠信号是信号值小于 SIGRTMIN 的信号。
信号的可靠与不可靠只与信号值有关，与信号的发送及安装函数无关。

目前 linux 中的 signal() 是通过 sigation() 函数实现的，因此，即使通过 signal() 安装的信号，
在信号处理函数的结尾也不必再调用一次信号安装函数。同时，由signal() 安装的实时信号支持排队，同样不会丢失。

    新旧信号安装函数的相同点：

对于目前 linux 的两个信号安装函数: signal() 及 sigaction() 来说，它们都不能把S IGRTMIN 以前的信号变成可靠信号
（都不支持排队，仍有可能丢失，仍然是不可靠信号），而且对 SIGRTMIN 以后的信号都支持排队。

    新旧信号安装函数的不同点：

经过 sigaction 安装的信号都能传递信息给信号处理函数（对所有信号这一点都成立），而经过 signal 安装的信号却不能向信号处理函数传递信息。
对于信号发送函数来说也是一样的。


### 实时信号和非实时信号

非实时信号都不支持排队，都是不可靠信号；实时信号都支持排队，都是可靠信号。

# 信号流程

信号从产生到被处理并撤销的过程中，进程对信号的反应，以及使用的函数有所差别。
后面将详细叙述。

![信号状态](/assets/img/linux/signal/signal-02.png)

## 进程对信号的响应

进程可以通过三种方式来响应一个信号：

+ 忽略信号：

忽略信号，即对信号不做任何处理，其中，有两个信号不能忽略：
SIGKILL 及 SIGSTOP；

+ 自定义信号处理函数：

捕捉信号。定义信号处理函数，当信号发生时，执行相应的处理函数；

+ 执行缺省操作：

Linux 对每种信号都规定了默认操作，如果没有绑定自定义信号处理函数，则执行
缺省操作。*注意，进程对实时信号的缺省反应是进程终止*。

## 信号发送

发送信号的主要函数有：kill()、raise()、 sigqueue()、alarm()、setitimer() 
以及 abort()。

    int kill(pid_t pid,int signo)

|pid 的值|信号的接收进程|
|pid > 0|进程 ID 为 pid 的进程|
|pid = 0|同一个进程组的进程|
|pid < -1|进程组 ID 为 -pid 的所有进程|
|pid = -1|除发送进程自身外，所有进程大于 1 的进程|

Sinno 是信号值，当为 0 时（即空信号），实际不发送任何信号，但照常进行错误检查，
因此，可用于检查目标进程是否存在，以及当前进程是否具有 向目标发送信号的权限
（root 权限的进程可以向任何进程发送信号，非 root 权限的进程只能向属于
同一个 session 或者同一个用户的进程发送信号）。 

    int raise(int signo) 

向进程本身发送信号，参数为即将发送的信号值。调用成功返回 0；否则，返回 -1。

    int sigqueue(pid_t pid, int sig, const union sigval val) 

调用成功返回 0；否则，返回 -1。 

sigqueue 的第一个参数是指定接收信号的进程ID，第二个参数确定即将发送的信号，
第三个参数是一个联合数据结构 typedef union sigval { int sival_int; void *sival_ptr; }sigval_t; 
指定了信号传递的参数，即通常所说的 4 字节值。

sigqueue() 比 kill() 传递了更多的附加信息，但 sigqueue() 只能向一个进程发送信号，
而不能发送信号给一个进程组。如果 signo=0，将会执行错误检查，但实际上不发送任何信号，
0 值信号可用于检查 pid 的有效性以及当前进程是否有权限向目标进程发送信号。

在调用 sigqueue时，sigval_t 指定的信息会拷贝到3参数信号处理函数
（3 参数信号处理函数指的是信号处理函数由 sigaction 安装，并设定了 sa_sigaction 指针，稍后将阐述）
的 siginfo_t 结构中，这样信号处理函数就可以处理这些信息了。由于 sigqueue 系统调用支持发送带参数信号，
所以比 kill() 系统调用的功能要灵活和强大得多。

    注意：

+ sigqueue() 发送非实时信号时，第三个参数包含的信息仍然能够传递给信号处理函数； 
+ sigqueue() 发送非实时信号时，仍然不支持排队。

不支持信号排队，即在信号处理函数执行过程中到来的所有相同信号，都被合并为一个信号。 

    unsigned int alarm(unsigned int seconds)

专门为 SIGALRM 信号而设，在指定的时间 seconds 秒后，将向进程本身发送 SIGALRM 信号，又称为闹钟时间。
进程调用 alarm 后，任何以前的 alarm() 调用都将无效。如果参数 seconds 为零，
那么进程内将不再包含任何闹钟时间。

返回值，如果调用 alarm（）前，进程中已经设置了闹钟时间，则返回上一个闹钟时间的剩余时间，否则返回 0。

    int setitimer(int which, const struct itimerval *value, struct itimerval *ovalue)); 

setitimer() 比 alarm 功能强大，支持 3 种类型的定时器： 

+ ITIMER_REAL：

设定绝对时间；经过指定的时间后，内核将发送 SIGALRM 信号给本进程；

+ ITIMER_VIRTUAL：

设定程序执行时间；经过指定的时间后，内核将发送 SIGVTALRM 信号给本进程；

+ ITIMER_PROF：

设定进程执行以及内核因本进程而消耗的时间和，经过指定的时间后，内核将发送 ITIMER_VIRTUAL 信号给本进程；

Setitimer() 第一个参数 which 指定定时器类型（上面三种之一）；第二个参数是结构 itimerval 的一个实例，
第三个参数（可以不做处理）的结构如下：

{% highlight c %}
struct itimerval 
{  
    struct timeval it_interval; /* next value */  
    struct timeval it_value;    /* current value */  
};

struct timeval 
{  
    long tv_sec;                /* seconds */  
    long tv_usec;               /* microseconds */  
};
{% endhighlight %} 

Setitimer() 调用成功返回0，否则返回 -1。

    void abort(void); 

向进程发送 SIGABORT 信号，默认情况下进程会异常退出，当然可定义自己的信号处理函数。
即使 SIGABORT 被进程设置为阻塞信号，调用 abort() 后，SIGABORT 仍然能被进程接收。该函数无返回值。

## 信号的安装

信号安装，即设置信号关联动作和绑定信号处理函数。

如果进程要处理某一信号，那么就要在进程中安装该信号。安装信号主要用来确定信号值及进程针对该信号值
的动作之间的映射关系，即进程将要处理哪个信号；该信号被传递给进程时，将执行何种操作。 

linux 主要有两个函数实现信号的安装：

+ signal()

signal() 在可靠信号系统调用的基础上实现, 是库函数。它只有两个参数，不支持信号传递信息，
主要是用于前 32 种非实时信号的安装；

+ sigaction()

igaction() 是较新的函数（由两个系统调用实现： sys_signal 以及 sys_rt_sigaction），有三个参数，
支持信号传递信息，主要用来与 sigqueue() 系统调用配合使用，当然，sigaction() 同样支持非实时信号的安装。
sigaction() 优于 signal() 主要体现在支持信号带有参数。

    void (*signal(int signum, void (*handler))(int)))(int); 

如果该函数原型不容易理解的话，可以参考下面的分解方式来理解： 

    typedef void (*sighandler_t)(int)；
    sighandler_t signal(int signum, sighandler_t handler)); 

第一个参数指定信号的值，第二个参数指定针对前面信号值的处理，可以忽略该信号（参数设为 SIG_IGN）；
可以采用系统默认方式处理信号(参数设为 SIG_DFL)；也可以自己实现处理方式(参数指定一个函数地址)。

如果 signal() 调用成功，返回最后一次为安装信号 signum 而调用 signal() 时的 handler 值；
失败则返回 SIG_ERR。

    int sigaction(int signum,const struct sigaction *act,struct sigaction *oldact)); 

sigaction 函数用于改变进程接收到特定信号后的行为（相对于默认行为或已经绑定的行为而言）。

该函数的第一个参数为信号的值，可以为除 SIGKILL 及 SIGSTOP 
外的任何一个特定有效的信号（为这两个信号定义自己的处理函数，将导致信号安装错误）。

第二个参数是指向结构 sigaction 的一个实例的指针，在结构 sigaction 的实例中，指定了对特定信号的处理，
可以为空，进程会以缺省方式对信号处理；

第三个参数 oldact 指向的对象用来保存原来对相应信号 的处理，可指定 oldact 为 NULL。
如果把第二、第三个参数都设为 NULL，那么该函数可用于检查信号的有效性。

    注意：

第二个参数最为重要，其中包含了对指定信号的处理、信号所传递的信息、信号处理函数执行过程中应屏蔽掉哪些
函数等等。

{% highlight c %}
struct sigaction 
{
    void (*sa_handler)(int signo);
    void (*sa_sigaction)(int signo, siginfo_t *, void *);
    sigset_t sa_mask;
    int sa_flags;
    void (*sa_restorer)(void);
    // sa_restorer，已过时，POSIX 不支持它，不应再被使用。
}

typedef struct 
{   
    //结构中包含信号携带的数据值
	int si_signo;
	int si_code;
	union sigval si_value;
	int si_errno;
	pid_t si_pid;
	uid_t si_uid;
	void *si_addr;
	int si_status;
	int si_band;
} siginfo_t;

typedef struct 
{
    unsigned long sig[_NSIG_WORDS]；
} sigset_t;

union sigval 
{
	int sival_int;
	void *sival_ptr;
};

{% endhighlight %}

联合数据结构中的两个元素 sa_handler 以及 sa_sigaction 指定信号关联函数，即用户指定的信号处理函数。
除了可以是用户自定义的处理函数外，还可以为 SIG_DFL (采用缺省的处理方式)，也可以为 SIG_IGN（忽略信号）。

采用联合数据结构，说明 siginfo_t 结构中的 si_value 要么持有一个 4 字节的整数值，要么持有一个指针，
这就构成了与信号相关的数 据。在信号的处理函数中，包含这样的信号相关数据指针，
但没有规定具体如何对这些数据进行操作，操作方法应该由程序开发人员根据具体任务事先约定。

前面在讨论系统调用 sigqueue 发送信号时，sigqueue 的第三个参数就是sigval联合数据结构，
当调用 sigqueue 时，该数据结构中的数据就将拷贝到信号处理函数的第二个参数中。这样，在发送信号同时，
就可以让信号传递一些附加信息。信号可以传递信息对程序开发是非常有意义的。

+ sa_mask

sa_mask 指定在信号处理程序执行过程中，哪些信号应当被阻塞。缺省情况下当前信号本身被阻塞，
防止信号的嵌套发送，除非指定 SA_NODEFER 或者 SA_NOMASK 标志位。 

注：请注意 sa_mask 指定的信号阻塞的前提条件，是在由 sigaction() 安装信号的处理函数执行过程中
由 sa_mask 指定的信号才被阻塞。 

+ sa_flags

sa_flags 中包含了许多标志位，包括刚刚提到的 SA_NODEFER 及 SA_NOMASK 标志位。另一个比较重要的标志位是 
SA_SIGINFO，当设定了该标志位时，表示信号附带的参数可以被传递到信号处理函数中，因此，
应该为 sigaction 结构中的 sa_sigaction 指定处理函数，而不应该为 sa_handler 指定信号处理函数，否则，
设置该标志变得毫无意义。即使为 sa_sigaction 指定了信号处理函数，如果不设置 SA_SIGINFO，
信号处理函数同样不能得到信号传递过来的数据，在信号处理函数中对这些信 息的访问都将导致段错误
（Segmentation fault）。 

## 信号集及信号集设定

+ 信号集: 

所有的信号阻塞函数都使用一个称之为信号集的结构表明其所受到的影响。

+ 信号掩码: 当前正在被阻塞的信号集。
+ 未决集: 

进程在收到信号时到信号在未被处理之前信号所处的集合称为未决集。

可以看出，这三个概念没有必然的联系，信号集指的是一个泛泛的概念，
而未决集与信号掩码指的是具体的信号状态。

    信号集被定义为一种数据类型：

{% highlight c %}
typedef struct 
{ 
    unsigned long sig[_NSIG_WORDS]； 
} sigset_t 
{% endhighlight %}

信号集用来描述信号的集合，linux 所支持的所有信号可以全部或部分的出现在信号集中，
主要与信号阻塞相关函数配合使用。下面是为信号集操作定义的相关函数：

    int sigemptyset(sigset_t *set)；

初始化由 set 指定的信号集，信号集里面的所有信号被清空；

    int sigfillset(sigset_t *set)；

调用该函数后，set 指向的信号集中将包含 linux 支持的 64 种信号；

    int sigaddset(sigset_t *set, int signum) 

在 set 指向的信号集中加入 signum 信号；

    int sigdelset(sigset_t *set, int signum)；

在 set 指向的信号集中删除 signum 信号；

    int sigismember(const sigset_t *set, int signum)；

判定信号 signum 是否在 set 指向的信号集中。 

*sigset_t 类型的本质是位图。但不应该直接使用位操作，
而应该使用上述函数，保证跨系统操作有效。*

## 信号阻塞与信号未决

信号阻塞又称为信号屏蔽。每个进程都有一个用来描述哪些信号递送到进程时将被阻塞的信号集，
该信号集中的所有信号在递送到进程后都将被阻塞。

    相关概念：

+ 信号递达：实际执行信号的处理动作称为信号递达(Delivery)。
+ 信号未决：信号从产生到递达之间的状态,称为信号未决(Pending)。

下面是与信号阻塞相关的几个函数： 

    int sigprocmask(int how, const sigset_t *set, sigset_t *oldset))；

用来屏蔽信号、解除屏蔽也使用该函数。其本质，*读取或修改进程的信号屏蔽字(PCB 中)*。
sigprocmask() 函数能够根据参数 how 来实现对信号集的操作，操作主要有三种：

+ SIG_BLOCK:

SIG_BLOCK 在进程当前阻塞信号集中添加 set 指向信号集中的信号。

+ SIG_UNBLOCK:

如果进程阻塞信号集中包含 set 指向信号集中的信号，则解除对该信号的阻塞。

+ SIG_SETMASK:

SIG_SETMASK 更新进程阻塞信号集为 set 指向的信号集。

    int sigpending(sigset_t *set)); 

sigpending(sigset_t *set)) 获得当前已递送到进程，却被阻塞的所有信号，
在 set 指向的信号集中返回结果。

    int sigsuspend(const sigset_t *mask))； 

sigsuspend(const sigset_t *mask)) 用于在接收到某个信号之前, 
临时用 mask 替换进程的信号掩码, 并暂停进程执行，直到收到信号为止。
sigsuspend 返回后将恢复调用之前的信号掩码。信号处理函数完成后，进程将继续执行。
该系统调用始终返回-1，并将 errno 设置为 EINTR。 

    注意：

*阻塞和忽略是不同的,只要信号被阻塞就不会递达,而忽略是在递达之后可选的一种处理动作。*

每个信号都有两个标志位分别表示阻塞(block)和未决(pending),还有一个函数指针表示处理动作。
信号产生时,内核在进程控制块中设置该信号的未决标志,直到信号递达才清除该标志。

![信号状态](/assets/img/linux/signal/signal-01.jpg)

对于上图解读如下：

+ SIGHUP 信号未阻塞也未产生过，当它递达时执行默认处理动作；
+ SIGINT 信号产生过，但正在被阻塞，所以暂时不能递达。虽然它的处理动作是忽略，
但在没有解除阻塞之前不能忽略这个信号，因为进程仍有机会改变处理动作之后再解除阻塞。
+ SIGQUIT 信号未产生过，一旦产生 SIGQUIT 信号将被阻塞，它的处理动作是用户自定义函数 sighandler。

*如果在进程解除对某信号的阻塞之前这种信号产生过多次，将如何处理？*

POSIX.1 允许系统递送该信号一次或多次。Linux 是这样实现的：
常规信号在递达之前产生多次只计一次，而实时信号在递达之前产生多次可以依次放在一个队列里。

从上图来看，每个信号只有一个 bit 的未决标志，非 0 即 1，不记录该信号产生了多少次，
阻塞标志也是这样表示的。因此，未决和阻塞标志可以用相同的数据类型 sigset_t 来存储，
sigset_t 称为```信号集```，这个类型可以表示每个信号的“有效”或“无效”状态：

+ 在阻塞信号集中“有效”和“无效”的含义是该信号是否被阻塞；
+ 在未决信号集中“有效”和“无效”的含义是该信号是否处于未决状态。

## 信号生命周期

从信号发送到信号处理函数的执行完毕，对于一个完整的信号生命周期(从信号发送到相应的处理函数
执行完毕)来说，可以分为三个重要的阶段，这三个阶段由四个重要事件来刻画：
*信号诞生；信号在进程中注册完毕；信号在进程中的注销完毕；信号处理函数执行完毕。*

> 信号"诞生"：

信号的诞生指的是触发信号的事件发生（如检测到硬件异常、定时器超时以及调用信号发送函数
 kill() 或 sigqueue() 等）。

> 信号在目标进程中"注册"；

进程的 task_struct 结构中有关于本进程中未决信号的数据成员：

{% highlight c %} 
struct sigpending pending： 

struct sigpending
{ 
    struct sigqueue *head, **tail; 
    sigset_t signal; 
}; 
{% endhighlight %}

第三个成员是进程中所有未决信号集，第一、第二个成员分别指向一个 sigqueue 
类型的结构链（称之为"未决信号信息链"）的首尾，信息链中的每个 sigqueue 
结构刻画一个特定信号所携带的信息，并指向下一个 sigqueue 结构:

{% highlight c %}
struct sigqueue
{ 
    struct sigqueue *next; 
    siginfo_t info; 
}
{% endhighlight %}

*信号在进程中注册指的就是信号值加入到进程的未决信号集中
（sigpending结构的第二个成员sigset_t signal），并且信号所携带的信息被保留到未决信号
信息链的某个sigqueue结构中。*只要信号在进程的未决信号集中，表明进程已经知道这些信号的 
存在，但还没来得及处理，或者该信号被进程阻塞。  
 
    注意：

当一个实时信号发送给一个进程时，不管该信号是否已经在进程中注册，都会被再注册一次，
因此，信号不会丢失，因此，实时信号又叫做"可靠信号"。这意味着同一个实时信号可以在同一个、
进程的未决信号信息链中占有多个 sigqueue 结构（进程每收到一个实时信号，
都会为它分配一个结构来登记该信号信息，并把该结构添加在未决信号链尾，
即所有诞生的实时信号都会在目标进程中注册）； 

当一个非实时信号发送给一个进程时，如果该信号已经在进程中注册，则该信号将被丢弃，
造成信号丢失。因此，非实时信号又叫做"不可靠信号"。这意味着同一个非实时信号在进程的未决
信号信息链中，至多占有一个 sigqueue 结构。

一个非实时信号诞生后：

+ 如果发现相同的信号已经在目标结构中注册，则不再注册，对于进程来说，
相当于不知道本次信号发生，信号丢失；
+ 如果进程的未决信号中没有相同信号，则在进程中注册自己。

> 信号在进程中的注销

在目标进程执行过程中，会检测是否有信号等待处理（每次从系统空间返回到用户空间时都做
这样的检查）。如果存在未决信号等待处理且该 信号没有被进程阻塞，则在运行相应的信号
处理函数前，进程会把信号在未决信号链中占有的结构卸掉。

是否将信号从进程未决信号集中删除对于实时与非实时信号是不同的：

+ 对于非实时信号：

对于非实时信号来说，由于在未决信号信息链中最多只占用一个 sigqueue 结构，
因此该结构被释放后，应该把信号在进程未决信号集中删除（信号注销完毕）；

+ 对于实时信号：

对于实时信号来说，可能在未决信号信息链中占用多个 sigqueue 结构，
因此应该针对占用 sigqueue 结构的数目区别对待：如果只占用一个 sigqueue 结构
（进程只收到该信号一次），则应该把信号在进程的未决信号集中删除（信号注销完毕）。否则，
不应该在进程的未决信号集中删除 该信号（信号注销完毕）。

*进程在执行信号相应处理函数之前，首先要把信号在进程中注销。*

> 信号生命终止

进程注销信号后，立即执行相应的信号处理函数，执行完毕后，信号的本次发送对进程的影响彻
底结束。 

    注意：

+ 信号注册与否的判断：

信号注册与否，与发送信号的函数（如kill() 或 sigqueue() 等）以及信号安装函数
（signal() 及 sigaction()）无关，只与信号值有关（信号值小于 SIGRTMIN 的信号最多
只注册一次，信号值在 SIGRTMIN 及 SIGRTMAX 之间的信号，只要被进程接收到就被注册）。

+ 信号丢失情况：

在信号被注销到相应的信号处理函数执行完毕这段时间内，如果进程又收到同一信号多次，
则对实时信号来说，每一次都会在进程中注册；而对于非实时信号来说，无论收到多少次信号，
都会视为只收到一个信号，只在进程中注册一次。

## 信号编程注意事项

> 防止不该丢失的信号丢失；

> 程序的可移植性：

考虑到程序的可移植性，应该尽量采用 POSIX 信号函数。

    POSIX信号函数主要分为两类： 

+ POSIX 1003.1 信号函数： 

Kill()、sigaction()、sigaddset()、sigdelset()、sigemptyset()、sigfillset()、 
sigismember()、sigpending()、sigprocmask()、sigsuspend()。 

+ POSIX 1003.1b 信号函数：

POSIX 1003.1b 在信号的实时性方面对 POSIX 1003.1 做了扩展，包括以下三个函数： 
sigqueue()、sigtimedwait()、sigwaitinfo()。其中，sigqueue 主要针对信号发送，
而 sigtimedwait 及 sigwaitinfo() 主要用于取 代sigsuspend() 函数。

> 程序的稳定性

为了增强程序的稳定性，在信号处理函数中应使用可重入函数。

因为进程在 收到信号后，就将跳转到信号处理函数去接着执行。如果信号处理函数中使用了不可
重入函数，那么信号处理函数可能会修改原来进程中不应该被修改的数据，这样进程从信号处理函
数中返回接着执行时，可能会出现不可预料的后果。不可再入函数在信号处理函数中被视为不安全
函数。 满足下列条件的函数多数是不可再入的：

+ 使用静态的数据结构;
+ 函数实现时，调用了 malloc() 或者 free() 函数；
+ 实现 时使用了标准 I/O 函数的.

即使信号处理函数使用的都是"安全函数"，同样要注意进入处理函数时，首先要保存 errno 的值，
结束时，再恢复原值。因为，信号处理过程中，errno 值随时可能被改变。另外，longjmp() 
以及 siglongjmp() 没有被列为可再入函数，因为不能保证紧接着两个函数的其它调用是安全的。

    信号编程步骤：

linux下的信号应用并没有想象的那么恐怖，程序员所要做的最多只有三件事情： 

+ 安装信号（推荐使用sigaction()）； 
+ 实现三参数信号处理函数，handler(int signal,struct siginfo *info, void *)； 
+ 发送信号，推荐使用sigqueue()。 

实际上，对有些信号来说，只要安装信号就足够了（信号处理方式采用缺省或忽略）。其他可能要做的无非是与信号集相关的
几种操作。不过，*对于多线程编程而言，信号的默认动作可能会引起其他线程是致命的，所以
必须自定义信号处理函数，以替换掉缺省动作。*

## 信号编程实例

> 信号发送及处理：

实现一个信号接收程序 sigreceive（其中信号安装由 sigaction()）。

{% highlight c %}
#include<stdio.h>
#include<signal.h>
#include<unistd.h>

void new_op(int,siginfo_t*,void*); 

int main(int argc,char**argv) 
{ 
    struct sigaction act; 
    int sig; 

    sig=atoi(argv[1]); 
    sigemptyset(&act.sa_mask); 
    act.sa_flags=SA_SIGINFO; 
    act.sa_sigaction=new_op; 

    if(sigaction(sig,&act,NULL) < 0) 
    { 
        printf("install sigal error＼n"); 
    } 

    while(1) 
    { 
        sleep(2); 
        printf("wait for the signal＼n"); 
    } 
}
 
void new_op(int signum,siginfo_t *info,void *myact) 
{ 
    printf("receive signal %d", signum); 
    sleep(5); 
} 

{% endhighlight %}
 
说明，命令行参数为信号值，后台运行 sigreceive signo &，可获得该进程的ID，假设为 pid，
然后再另一终端上运行 kill -s signo pid 验证信号的发送接收及处理。同时，
可验证信号的排队问题。

用 sigqueue 实现的命令行信号发送程序 sigqueuesend，命令行第二个参数是发送的信号值，
第三个参数是接收该信号的进程 ID，可以配合以上使用：

{% highlight c %}
#include<stdio.h>
#include<signal.h>
#include<unistd.h>

int main(int argc,char**argv) 
{ 
    pid_t pid; 
    int sig; 
    sig=atoi(argv[1]); 
    pid=atoi(argv[2]); 
    sigqueue(pid,sig,NULL); 
    sleep(2); 
} 

{% endhighlight %}

> 信号传递附加信息

主要包括两个实例：

+ 向进程本身发送信号，并传递指针参数；

{% highlight c %}
#include<stdio.h>
#include<signal.h>
#include<unistd.h>

void new_op(int,siginfo_t*,void*); 

int main(int argc,char**argv) 
{ 
    struct sigaction act; 
    union sigval mysigval; 
    int i; 
    int sig; 
    pid_t pid; 
    char data[10];
 
    memset(data,0,sizeof(data)); 
    for(i=0;i < 5;i++) 
        data[i]=’2’; 
    
    mysigval.sival_ptr=data; 

    sig=atoi(argv[1]); 
    pid=getpid(); 

    sigemptyset(&act.sa_mask); 
    act.sa_sigaction=new_op;  //三参数信号处理函数 
    act.sa_flags=SA_SIGINFO;  //信息传递开关 
    if(sigaction(sig,&act,NULL) < 0) 
    { 
        printf("install sigal error＼n"); 
    } 
    
    while(1) 
    { 
        sleep(2); 
        printf("wait for the signal＼n"); 
        sigqueue(pid,sig,mysigval);
        //向本进程发送信号，并传递附加信息 
    } 
} 

void new_op(int signum,siginfo_t *info,void *myact)
//三参数信号处理函数的实现 
{ 
    int i; 
    for(i=0;i<10;i++) 
    { 
        printf("%c＼n ",(*( (char*)((*info).si_ptr)+i))); 
    }
 
    printf("handle signal %d over;",signum); 
} 

{% endhighlight %}

这个例子中，信号实现了附加信息的传递，信号究竟如何对这些信息进行处理则取决于具体的应用。

+ 不同进程间传递整型参数：

把上例中的信号发送和接收放在两个程序中，并且在发送过程中传递整型参数。

    信号接收程序：

{% highlight c %}

#include<stdio.h>
#include<signal.h>
#include<unistd.h>

void new_op(int,siginfo_t*,void*); 

int main(int argc,char**argv) 
{ 
    struct sigaction act; 
    int sig; 
    pid_t pid; 

    pid=getpid(); 
    sig=atoi(argv[1]); 

    sigemptyset(&act.sa_mask); 
    act.sa_sigaction=new_op; 
    act.sa_flags=SA_SIGINFO; 
    
    if(sigaction(sig,&act,NULL)<0) 
    { 
        printf("install sigal error＼n"); 
    } 

    while(1) 
    { 
        sleep(2); 
        printf("wait for the signal＼n"); 
    } 
} 

void new_op(int signum,siginfo_t *info,void *myact) 
{ 
    printf("the int value is %d ＼n",info->si_int); 
} 

{% endhighlight %} 

    信号发送程序：

{% highlight c %}

#include<stdio.h>
#include<signal.h>
#include<unistd.h>

main(int argc,char**argv) 
{ 
    pid_t pid; 
    int signum; 
    union sigval mysigval; 

    signum=atoi(argv[1]); 
    pid=(pid_t)atoi(argv[2]); 
    mysigval.sival_int=8;
    //不代表具体含义，只用于说明问题 

    if(sigqueue(pid,signum,mysigval)==-1) 
        printf("send error＼n"); 
    
    sleep(2); 
} 

{% endhighlight %}

> 信号阻塞及信号集操作:

{% highlight c %}
#include<stdio.h>
#include<signal.h>
#include<unistd.h>

static void my_op(int);
 
int main() 
{ 
    sigset_t new_mask,old_mask,pending_mask; 
    struct sigaction act; 

    sigemptyset(&act.sa_mask); 
    act.sa_flags=SA_SIGINFO; 
    act.sa_sigaction=(void*)my_op;
 
    if(sigaction(SIGRTMIN+10,&act,NULL)) 
        printf("install signal SIGRTMIN+10 error＼n"); 

    sigemptyset(&new_mask); 
    sigaddset(&new_mask,SIGRTMIN+10);
 
    if(sigprocmask(SIG_BLOCK, &new_mask,&old_mask)) 
        printf("block signal SIGRTMIN+10 error＼n"); 

    sleep(10); 
    printf("now begin to get pending mask and unblock SIGRTMIN+10＼n"); 
    if(sigpending(&pending_mask)<0) 
        printf("get pending mask error＼n"); 

    if(sigismember(&pending_mask,SIGRTMIN+10)) 
        printf("signal SIGRTMIN+10 is pending＼n"); 

    if(sigprocmask(SIG_SETMASK,&old_mask,NULL)<0) 
        printf("unblock signal error＼n"); 

    printf("signal unblocked＼n"); 
    sleep(10); 
} 

static void my_op(int signum) 
{ 
    printf("receive signal %d ＼n",signum); 
} 

{% endhighlight %}

编译该程序，并以后台方式运行。在另一终端向该进程发送信号
(运行 kill -s 42 pid，SIGRTMIN+10 为 42)，查看结果可以看出几个关键函数的运行机制，
信号集相关操作比较简单。 

    注意：

在上面几个实例中，使用了 printf() 函数，只是作为诊断工具，pringf() 函数是不可重入的，
不应在信号处理函数中使用。

# 信号列表

Linux 支持的信号列表如下。很多信号是与机器的体系结构相关的：

|信号值|默认处理动作|发出信号的原因
|SIGHUP 1|A|终端挂起或者控制进程终止
|SIGINT 2|A|键盘中断（如break键被按下）
|SIGQUIT 3|C|键盘的退出键被按下
|SIGILL 4|C|非法指令
|SIGABRT 6|C|由abort(3)发出的退出指令
|SIGFPE 8|C|浮点异常
|SIGKILL 9|AEF|Kill信号
|SIGSEGV 11|C|无效的内存引用
|SIGPIPE 13|A|管道破裂: 写一个没有读端口的管道
|SIGALRM 14|A|由alarm(2)发出的信号
|SIGTERM 15|A|终止信号
|SIGUSR1 30,10,16|A|用户自定义信号1
|SIGUSR2 31,12,17|A|用户自定义信号2
|SIGCHLD 20,17,18|B|子进程结束信号
|SIGCONT 19,18,25| | 进程继续（曾被停止的进程）
|SIGSTOP 17,19,23|DEF|终止进程
|SIGTSTP 18,20,24|D|控制终端（tty）上按下停止键
|SIGTTIN 21,21,26|D|后台进程企图从控制终端读
|SIGTTOU 22,22,27|D|后台进程企图从控制终端写

处理动作一项中的字母含义如下:

+ A 缺省的动作是终止进程
+ B 缺省的动作是忽略此信号，将该信号丢弃，不做处理
+ C 缺省的动作是终止进程并进行内核映像转储（dump core），内核映像转储是指将进程数据在
内存的映像和进程在内核结构中的部分内容以一定格式转储到文件系统，并且进程退出执行，
这样做的好处是为程序员提供了方便，使得他们可以得到进程当时执行时的数据值，
允许他们确定转储的原因，并且可以调试他们的程序。
+ D 缺省的动作是停止进程，进入停止状况以后还能重新进行下去，一般是在调试的过程中
（例如ptrace系统调用）
+ E 信号不能被捕获
+ F 信号不能被忽略
