/**这个defineReactive的作用是定义一个响应式数据。
 * 也就是在这个函数中进行变化追踪，封装后只需要传递data、key、val就行了。
 * 封装好之后，每当从data的key中读取数据时，get函数被触发；
 * 每当往data的key中设置数据时，set函数被触发。
 */

/**
 * 那么defineReactive方法是干什么的？

（1）首先给每个对象比如vm._props  vm._data添加一个属性key，方便后续做代理；也就是ChildObj
（2）其次对被观察对象的key做三件事：
      1.为每个key新建一个dep
      2.遍历这个key，看它是不是一个对象，如果时一个对象，继续调用observe观察它；
      3.使用OBject.defineProperty为这个对象添加getter和setter；
 */
import observe from "./observe.js";
import Dep from "./Dep.js";

export default function defineReactive(data, key, val) {
  const dep = new Dep(); //dep数组用来存储被收集的依赖
  // console.log("我是defineReactive", data, key);
  // 这个if语句是想说明，如果这个函数defineReactive(data, key, val)没有包括第三个参数的话，就直接把键值对组合起来赋值给第三个参数val，这第三个参数有可能是值或者对象
  // 而第三个参数val是什么？===========》 第三个参数Val就是为了用闭包让消除多的外部变量temp
  // 而有两个参数和有三个参数分别意味着什么？====》
  //      如果有三个参数的话，就代表我有最终的值或者对象。可以是在重新赋值或者被调用get、set传入子元素继续是嵌套数组得情况
  //      在observe类中：如果是值的话就直接return结束。这次情况是重新赋值！如果不是值的话就给你送进ob继续遍历。
  //      如果不是值而是对象的话，就判断你有没有value.__ob__。
  //        ob =====》它是存放不确定是值还是数组的对象的，如果是对象则继续放进来遍历，如果不是对象在上一句语句就已经跳出
  //        如果有就代表你是还不确定是值还是数组需要继续存到ob里面遍历，ob是来存贮还不确定是数组还是属性的东西。
  //        如果没有，就代表你不是值，而是数组，里面有嵌套东西，就把这个对象传进去Observer类让他去构造，并且深入继续遍历每个属性，都让他们defineReactive，
  //        既然又defineReactive的话，那么又重新循环起来了。
  //        那么构造什么呢？构造多一个value.__ob__属性，也就是给这个数组打上“我不确定你这个对象是数组还是值”的标签
  //      那么这个Observer对象是什么呢？====> 就是他里面有一个构造函数，给从这个方法的第三个参数传去observe传进来得
  //      有两个参数意味着什么？==========》意味着你就是单纯的定义为这个键值对定义实现响应式 ======》初始化的时候！
  if (arguments.length == 2) {
    val = data[key];
  }
  // 子元素要进行observe，至此形成了递柜。这个递柜不是函数自己调用自己，而是多个函数，类循环调用
  // 我一进来，如果我没有val就代表我是初始化，就不需要用到这个传进去得val也是空，不作效
  // 如果我有val就分两种情况：
  //    1、val传进来得是值 那么在observe里面就会直接返回
  //    2、val传进来得是数组 那么在observe里面就会被添加多一个__ob__属性，也就是打上“我不确定你这个数组得里面是值还是继续嵌套得数组”得标签
  let childOb = observe(val);
  // Obj.defineProperty()方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
  Object.defineProperty(data, key, {
    // value: 3,
    // //是否可写
    // writable: false,
    // //是否可以被枚举(遍历)
    enumerable: true,
    //可以被配置，比如可以被删除
    configurable: true,
    //只要你试图访问了obj的属性就会触发这个函数
    get() {
      // 如果现在处于依赖收集阶段
      if (Dep.target) {
        dep.depend(); // 2、这里调用本身类的depend()方法，现在跳去对应类的方法
        if (childOb) {
          // 此处的childOb检查应该是当整个对象被替换成一个新对象的时候需要重新自行调用一次依赖收集
          // 比如，{a:{b}},a变了那用到b的地方也要被通知吧，反过来b变了，用到a的地方也要被通知到
          childOb.dep.depend();
        }
      }
      return val;
    },
    //只要你试图改变了obj的a属性就会触发这个函数
    set(newValue) {
      // console.log("你正在设置obj的a属性,想要改变为", newValue);
      if (val === newValue) {
        return;
      }
      val = newValue;
      // 就是假如你有一个四层的数组，你把最后一层的值本来是一个单层的属性，结果你又设置了新的数组，这是就正好把这个新设置的数组传进来Observe看一下
      childOb = observe(newValue);
      // 发布订阅模式，通知Dep
      dep.notify(); // 4、如果数据发生更新这里就会通知,现在去掉Dep类的notify方法
      // =====》当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍。
    }
  });
}
