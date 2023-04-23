/**
 *  1. Observer类的作用，就是通过给对象添__ob__属性（第二个参数"__ob__"），并把自己附加到每个被观察对象上（第三个参数this）。
 *  一旦附加，观察者就会将目标对象的属性键转换为getter/setter来收集依赖关系和分派更新。
 *  2.如果value是一个对象，那么走walk方法，即对被观察对象的每个属性key走defineReactive方法；
 */
import { def } from "./utils";
import defineReactive from "./defineReactive";
import { arrayMethods } from "./array";
import observe from "./observe";
import Dep from "./Dep";

export default class Observer {
  constructor(value) {
    this.dep = new Dep();
    // 1
    def(value, "__ob__", this, false);
    if (Array.isArray(value)) {
      Object.setPrototypeOf(value, arrayMethods);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(value) {
    // 2
    for (let k in value) {
      defineReactive(value, k);
    }
  }
  observeArray(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
      observe(arr[i]);
    }
  }
}
