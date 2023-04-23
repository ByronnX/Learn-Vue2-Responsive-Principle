import Observer from "./Observer.js";
//
/** 响应式对象的运行步骤顺序：observe ===》Observer ===> defineReactive ===》 observe
 * 1、main.js里面observe(obj)
 * 2、看obj身上有没有__ob__
 * 3、new Observer()将产生的实例，添加到__ob__上
 * 4、遍历下一层属性，逐个defineReactive
 * 5、当设置某个属性值的时候，会触发set，里面有newValue，这个newValue也得被observe()一下
 * 6、重新回到开头observe(obj)
 */
/**
 * observe类作用：
 * 1.首先判断，observe观测的必须是一个对象，并且不能是vnode；
 * 2.将要观测的对象作为参数去实例化一个Observer；
 */
export default function(value) {
  if (typeof value != "object") return;
  var ob;
  if (typeof value.__ob__ !== "undefined") {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}
