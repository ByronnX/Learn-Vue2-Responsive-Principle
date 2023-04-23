import Observer from "./Observer.js";
// 这个类是不确定你这个传进来的值是数组还是值而进行观察，给不确定是数组还是值的value打上一个__ob__的标签

// 这个类的工作原理是判断从defineReactive方法第三个传进来的参数val，如果是值则直接返回，如果不是值，则是对象，就判断你有没有value.__ob__
// 如果有就代表你是最终值没有下一层了，就赋值给ob然后返回回去，
// 如果没有，就代表你还是里面有嵌套，就把这个对象传进去Observer类让他去构造，构造什么呢？
// 构造多一个value.__ob__属性，这个属性是不可枚举的，代表已经是最终值，是最后一层
// value.__ob__是什么？这个属性是不可枚举的，代表已经是最终值，是最后一层

// Observe流程
// observe(obj) ==> 看obj身上有没有__obj__ ==> new Observer()将产生的实例，添加到__ob__上 ==> 遍历下一层属性，逐个defineReactive ==> 当设置某个属性值的时候，会触发set，里面有vewValue，这个newValue也得被observe()一下 ==> 重新回到开头observe(obj)
// 创建observe函数，注意函数的名字没有r，要跟Observer类区分开来
export default function(value) {
  // 如果这个value不是对象，什么都不做
  // 也就是这个函数只为对象服务
  if (typeof value != "object") return;
  // 定义ob =====》它是存放不确定是值还是数组的对象的，如果是对象则继续放进来遍历，如果不是对象在上一句语句就已经跳出
  var ob;
  // value.__ob__这个是Observer类的实例对象，名字那么奇怪是为了不容易重名
  // 这个if语句目的是前面已经判断出来如果defineReactive传进来的第三个参数如果不是值的话，就是对象，那么对象都要存储Observer的实例对象然后再返回出去
  // 那Observer实例对象里面是什么呢？=====》 是将一个正常的Object转换为每一个层级的属性都是响应式（可以被侦测的）Object
  if (typeof value.__ob__ !== "undefined") {
    // 只要你身上有__ob__，我就进去把你放进去ob，继续让你遍历因为如果你是值的话 就在if (typeof value != "object") return;这里就直接返回了，根本不可能有__ob__的可能性
    ob = value.__ob__;
    // console.log("value.__ob__;", value.__ob__);
  } else {
    ob = new Observer(value);
    // console.log(ob);
  }
  return ob;
}
