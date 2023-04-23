/**
 *  1. Observer类的作用，就是通过给对象添__ob__属性，把自己附加到每个被观察对象上。一旦附加，
 *  观察者就会将目标对象的属性键转换为getter/setter来收集依赖关系和分派更新。
 *  2.如果value是一个对象，那么走walk方法，即对被观察对象的每个属性key走defineReactive方法；
 */
import { def } from "./utils";
import defineReactive from "./defineReactive";
// arrayMethods这是一个对象 里面存了好多重写过的数组方法，push,pop,shift等
import { arrayMethods } from "./array";
import observe from "./observe";
import Dep from "./Dep";
// Observer
// 这个类的目的：是将一个正常的Object转换为每一个层级的属性都是响应式（可以被侦测的）Object
// 什么情况下会有Observer的实例？就是当你是对象（有层级的或者是数组）的时候并且身上没有__ob__的时候，就会new Observer()
export default class Observer {
  constructor(value) {
    // 每一个Observer的实例身上，都有一个dep
    this.dep = new Dep();
    // 给实例（也就是this，一定要记住，构造函数中的this不是表示类本身，而是表示实例）添加了__ob__属性，并且设置了不可枚举，那就可以代表是值了。值是这次new的实例
    def(value, "__ob__", this, false);
    // console.log("我是Observer构造器", value);

    // 检查它是数组还是对象
    if (Array.isArray(value)) {
      // 如果是数组，要非常强行的蛮干，将这个数组的原型，指向arrayMethods，这里面有七个改写过的方法，可以让数据变成响应式
      Object.setPrototypeOf(value, arrayMethods);
      // 让这个数组变得observe
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  // 遍历
  walk(value) {
    for (let k in value) {
      defineReactive(value, k);
    }
  }
  // 数组的特殊遍历
  observeArray(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
      // 逐项进行observe
      observe(arr[i]);
    }
  }
}
