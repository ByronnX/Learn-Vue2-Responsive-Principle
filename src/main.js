import observe from "./observe.js";
import Watcher from "./Watcher.js";
var obj = {
  a: {
    m: {
      n: 6
    }
  },
  b: 10,
  c: [11, 22, 33, 44, 55]
};

observe(obj);
new Watcher(obj, "a.m.n", val => {
  // 这里实例化watcher的时候，也把自己设置到了Dep.target上
  console.log("牛逼！！我监控到了a.m.n的值是", val);
});
obj.a.m.n = 88; // 1、这里触发了defineReactive的get()
// console.log(obj);

/*
    作用详解:
    getter 方法完成的工作就是依赖收集 —— dep.depend()
    setter 方法完成的工作就是发布更新 —— dep.notify()
    Watcher（订阅者）：有get和update方法
    调度中心作用的 Dep：
    1.收集订阅者 Watcher 并添加到观察者列表 subs
    2.接收发布者的事件
    3.通知订阅者目标更新，让订阅者执行自己的 update 方法
    vue组件1->watcher1->dep
    vue组件2->watcher2->dep
    watcher是连接vue组件和dep的桥梁
    每个组件对应一个watcher，每个属性对应一个dep
    data1->name:‘wyh’->dep
    data2->name:‘aaa’->dep
    dep中getter和setter有两个方法
    getter->dep.depend()收集依赖
    setter_>dep.notify()通知更新
*/
