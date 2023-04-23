/**
 * 那么defineReactive方法是干什么的？
（1）首先给每个对象比如vm._props  vm._data添加一个属性key，方便后续做代理；
（2）其次对被观察对象的key做三件事：
      1.为每个key新建一个dep
      2.遍历这个key，看它是不是一个对象，如果是一个对象，继续调用observe观察它；
      3.使用OBject.defineProperty为这个对象添加getter和setter；
 */
import observe from "./observe.js";
import Dep from "./Dep.js";

export default function defineReactive(data, key, val) {
  // (2)1
  const dep = new Dep();
  if (arguments.length == 2) {
    val = data[key];
  }
  // (2)2
  let childOb = observe(val);
  // (2)3
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
      }
      return val;
    },
    set(newValue) {
      if (val === newValue) {
        return;
      }
      val = newValue;
      childOb = observe(newValue);
      dep.notify();
    }
  });
}
