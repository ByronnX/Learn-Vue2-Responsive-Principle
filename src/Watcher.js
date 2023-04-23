import Dep from "./Dep";
var uid = 0;
export default class Watcher {
  // 观察者 也就是依赖，观察的是哪些地方用到了这个数据 哪些数据依赖着哪些地方
  // target：监听哪个对象
  // expression：obj.a.b.c 谁点谁点谁
  constructor(target, expression, callback) {
    // console.log("我是Watcher的构造器");
    this.id = uid++;
    this.target = target;
    // 执行this.getter（），就可以读取data.a.b.c的内容
    this.getter = parsePath(expression);
    /**
     * 这里的这个parsePath方法可以按点来拆分层级===》obj.a.b.c。
     * 传入expreesion是可以提前根据你输入的参数，构造一个对应层级的解拆分函数给你，
     * 比如你传入a.b.c他就知道你返回一个三层的函数给你，你传入一个三层的对象进来就刚刚好，传入两层的就会报错
     */
    this.callback = callback;
    this.value = this.get(); // 这里构造的时候，“刺激”调用了一下,目的是把自己设置到Dep.target上
    // console.log("*******", this.get());
  }
  update() {
    this.run(); //6、当你数据更新的时候调用run()，现在去到该类的run方法
  }
  get() {
    // 进入依赖收集阶段.让全局的Dep.target设置为Watcher实例本身，也就是把自己这个实例对象放到全局唯一的地方，那么就是进入依赖收集的阶段
    Dep.target = this; // this === Watcher实例本身。哪个Watcher在读get，哪个Watcher就是这个Dep.target，就会被抓到逮到拿到这个想读的对象
    const obj = this.target; //
    // console.log("obj==================", obj);==============>new Watcher()的第一个参数
    // console.log("this==================", this);==============>Watcher实例本身
    // console.log("Dep.target==================", Dep.target);==============>Watcher实例本身
    // console.log("this.target==================", this.target);==============>new Watcher()的第一个参数
    /**
     * this 就是watcher实例对象本身
     * this.target就是初始化watcher时，传给构造函数的第一个参数,也就是需要被收集依赖的对象
     * Dep.target就是this
     * obj就是this.target
     */
    var value;
    // 只要能找，就一直找
    try {
      //重点代码：obj: 监视对象，调用obj的getter，就是调用defineReactive触发收集依赖
      value = this.getter(obj);
      console.log("getter", value); //======>parsePath带上参数所返回的值int=====>6、88
      /**
      这里的getter就是parsePath返回的fn对象，然后把这个obj往里面调用
      ƒ (obj) {
          for (var i = 0; i < segments.length; i++) {
            if (!obj) return;
            obj = obj[segments[i]]; 
          }
          return obj;
      }
      这里的value也就是this.getter(obj) 就是value================== 6获取到最终需要的值，也就是a.m.n的值
      */
      // console.log("this.getter==================", this.getter);======>parsePath的返回值
      // console.log("value==================", value);
    } finally {
      Dep.target = null;
    }
    return value;
  }
  run() {
    this.getAndInvoke(this.callback); //7、这个run方法把new Watcher的第三个参数传了进来调用了一个getAndInvoke方法，现在去到本类的getAndInvoke方法
    // console.log("this.callback", this.callback);=========》就是new Watcher的第三个参数
  }
  getAndInvoke(cb) {
    // 发布依赖的地方并且把新旧值给传递call对象也就是开始设置，这里是妙笔
    const value = this.get();
    // console.log("value", value); //==========》88

    if (value !== this.value || typeof value == "object") {
      // 如果这里的值改变了，或者是对象形式
      const oldValue = this.value;
      // console.log("oldValue", oldValue); =========》6

      this.value = value;
      // console.log("value", value);===========》8

      cb.call(this.target, value, oldValue); // 8、设置并完成更新
    }
  }
}

function parsePath(str) {
  var segments = str.split(".");

  return obj => {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]]; // 就是说abcd都是对象的属性，然后一层一层去取，obj[a][b][c][d]
    }
    return obj;
  };
}

/**
 * 什么是Watcher？
 * Watcher是一个中介角色，数据发生变化时通知它，然后它在通知其他地方。
 */
