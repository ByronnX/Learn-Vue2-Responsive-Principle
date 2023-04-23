/*
    这个类的原理是：以Array.prototype为原型创建arrayMethods对象,
    然后以一种很强硬的手段，也就是
    Object,setPrototypeOf()来把这个数组的原型对象指定到arrayMethods身上
*/

import { def } from "./utils";
// 得到Array.prototype
const arrayPrototype = Array.prototype;

// 以Array.prototype为原型创建arrayMethods对象,并暴露
export const arrayMethods = Object.create(arrayPrototype);

// 改写这七种方法也是能让数组发生改变的七种方法===>来自于Array.prototype
// push、pop、shift、unshift、splice、sort、reverse
const methodsNeedChange = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse"
];

methodsNeedChange.forEach(methodName => {
  // 备份原来的方法,因为push、pop等7个函数的功能不能被剥夺，我们只需要添加上数组响应式的这个功能
  // 这original就存储的是上面的原型七个方法
  const original = arrayPrototype[methodName];

  // 定义新的方法，也就是不污染最上层arrayPrototype的情况下，在下一层的arrayMethods进行改写
  def(
    arrayMethods, // 在这个对象的基础上
    methodName, // 添加多这一个属性
    function() {
      // 恢复原来的功能
      const result = original.apply(this, arguments); // 把从数组原型里备份到的原始方法加上外面传进来的参数组成了新的值 赋值给上一个参数
      // 这里的arguments代表是push进来数组的那个值
      // 而这里的this取决的是这个function里的this是谁 一般是数组 所以这里的function不要写成箭头函数
      // 也就是 this也就是obj这个数组调用备份的这个original也就是push方法再传进去77这个参数也就是arguments
      //   console.log(arguments, "-----arguments", this, "---this");

      const args = [...arguments];

      // 把这个数组身上的__ob__取出来，__ob__已经被添加了，为什么已经被添加了？因为数组肯定不是最高层,比如obj.c属性是数组，obj不能是数组，第一次遍历obk这个对象的第一层的时候，已经给c属性（也就是这个数组）添加了__ob__属性。
      const ob = this.__ob__;
      // 有三个方法push、unshift、splice能够插入新项，现在要把插入的新项也要变为observe的
      let inserted = [];
      switch (methodName) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          // splice格式是splice(下标，数量，这里才是插入的新项)
          inserted = args.slice(2);
          break;
      }

      //判断有没有要插入的新项，如果有 让新项也变为响应的。目的是为防止传进来新的项也是数组
      if (inserted) {
        ob.observeArray(inserted);
      }

      ob.dep.notify();
      return result;
    },
    false // 是否可遍历
  );
});
