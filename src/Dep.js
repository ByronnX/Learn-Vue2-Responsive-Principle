/**
 * Dep类做了些什么?
 * 1、创建了subs类来存放Watcher实例对象
 * 2、将watcher实例添加到dep实例的subs数组里，而每个被观测对象的属性都会被创建一个dep实例
 * 所以subs数组里的元素（即watcher实例）可以说就都是依赖这个属性的。为后续的setter触发做准备；
 *
 */

var uid = 0;
export default class Dep {
  constructor() {
    this.id = uid++;
    // 1
    this.subs = [];
  }
  addSub(sub) {
    // 2
    this.subs.push(sub);
  }
  // 2
  depend() {
    if (Dep.target) {
      this.addSub(Dep.target);
    }
  }
  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
