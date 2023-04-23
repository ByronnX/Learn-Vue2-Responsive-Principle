/**
 * Watcher类做了些什么？
 * 1、实例化的时候，调用了自己写的get方法，意义在于可以进行下面几步的操作
 * 2、实例化watcher时，会先把watcehr实例赋值给Dep.target。
 * 3、然后会调用getter即调用updateComponent()即vm._update(vm._render），这里会跳到defineReactive里的get(), 然后调用watcher的addDep方法； *
 */
/**
 * Watcher和Dep实现订阅的步骤：
 * 1、首先在main.js里面对某个对象的某个属性进行new Watcher实例化的注册
 * 2、在实例化的时候，就调用了自己写的get方法
 * 3、get()方法把自己挂载到了一个全局唯一的位置，并且结合parsePath对最深层次的值进行了get，因此调用到了defineReactive的get()方法
 * 4、由于第三步已经把自己挂载到了一个全局唯一的位置,在defineReactive的get()方法里就调用Dep.depend()方法
 * 5、而Dep.depend方法就是把存放在Dep.target的Watcher实例给放进subs数组里
 */
/**
 * Watcher和Dep实现发布的步骤：
 * 1、当数据发生变化的时候，触发了defineReactive的set()方法，这里调用了Dep.notify()方法
 * 2、Dep.notify()方法里面就是把在依赖过程中订阅到的所有观察者，也就是一个个Watcher实例，都触发他们本身的的Watcher.update()方法，
 * update()=========>run(),
 * run()=========>getAndInvoke(),
 * getAndInvoke()=========>cb.call(this.target, value, oldValue);
 * 3、update()方法在源码中利用了队列做了进一步优化，在nextTick后执行所有watcher的run(),
 * 最后执行它们的回调函数（也就是把旧值，新值都传给实例化Watcher时要怎么处理这些数据的回调函数（第三个参数）里）
 */
import Dep from "./Dep";
var uid = 0;
export default class Watcher {
  constructor(target, expression, callback) {
    this.id = uid++;
    this.target = target;
    this.getter = parsePath(expression);
    this.callback = callback;
    // 做了1
    this.value = this.get();
  }
  update() {
    this.run();
  }
  get() {
    // 做了2
    Dep.target = this;
    const obj = this.target;
    var value;
    try {
      // 做了3
      value = this.getter(obj);
    } finally {
      Dep.target = null;
    }
    return value;
  }
  run() {
    this.getAndInvoke(this.callback);
  }
  getAndInvoke(cb) {
    const value = this.get();
    if (value !== this.value || typeof value == "object") {
      const oldValue = this.value;
      this.value = value;
      cb.call(this.target, value, oldValue);
    }
    console.log("cb====", cb);
  }
}
function parsePath(str) {
  var segments = str.split(".");
  return obj => {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
}
