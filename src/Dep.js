var uid = 0;
export default class Dep {
  // Depends 存储依赖的地方
  constructor() {
    // console.log("我是Dep的构造器");
    this.id = uid++;
    // 用数组存储自己的订阅者,这里面放的是watcher的实例
    this.subs = [];
  }
  // 添加订阅
  addSub(sub) {
    this.subs.push(sub);
  }
  // 添加依赖
  depend() {
    // Dep.target就是一个我们自己指定的全局的位置，你用window.target也行，只要是全局唯一，没有歧义就行
    if (Dep.target) {
      // 如果这个全局唯一的位置不为空，也就是存在的话。就把这个东西推入到数组里面
      this.addSub(Dep.target); // 3、这里就把它（）推入到了subs数组里，现在去看数据更新的时候，defineReactive的set方法
    }
  }
  // 通知更新
  notify() {
    // console.log("我是notify");
    // 浅克隆一份
    const subs = this.subs.slice();
    // 遍历=====》当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍。
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update(); // 5、被通知了之后，从subs把Watcher的实例对象一个个拿出来进行更新方法()，现在去到Watcher类的update方法
    }
  }
}

// 简单来说就是每个完成响应式数据的身上都有一个dep
// 说白了就是对象用于收集依赖的dep可以放在__ob__属性上，但是普通数据没有这个属性，所以在闭包环境内也要声明一个
// ob中的是针对对象和数组的，defineReactive里的是针对普通属性的

/**
 * 如何收集依赖？===》先收集依赖，即把用到数据name的地方收集起来，然后等属性发生变化时，把之前收集好的依赖循环触发一遍就好了
 * 我们之所以要观察数据，其目的是当数据的属性发生变化时，可以通知那些曾经使用了该数据的地方
 * 总结起来就一句话：在getter中收集依赖，在setter中触发依赖
 */
/**
 * 依赖收集在哪里？
 * 现在我们已经有了很明确的目标，就是要在getter收集依赖，那么要把依赖收集到哪里去呢？
 * 依赖收集在Dep类里
 */
/**
 * 依赖是谁？
 * 我们收集的依赖是window.target，那么它到底是什么？我们究竟要收集谁呢？
 * 收集谁，换句话说，就是当属性发生变化后，通知谁。
 * 我们要通知用到数据的地方，而是用这个数据的地方有很多，而且类型还不一样，
 * 既有可能是模板，也有可能是用户写的一个watch，这时需要抽象出一个能集中处理这些情况的类。
 * 然后我们在依赖收集阶段只收集这个封装好的类的实例进来，通知也只通知它一个。
 * 接着，它在负责通知其他地方。所以，我们要抽象的这个东西需要先起一个好听的名字。
 * 就叫Watcher！
 */
/**
 * 收集依赖需要为依赖找一个存储依赖的地方，为此我们创建了Dep，它用来收集依赖、删除以来和向依赖发送消息等。
 * 所谓依赖，其实也就是Watcher。只有Watcher出发的getter才会收集依赖，哪个Watcher出发了getter，就把哪个Watcher收集到Dep中
 * 当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍。
 * Watcher的原理是把自己设置到全局唯一的指定位置（例如window.target），然后读取数据。
 * 因为读取了数据，所以会触发这个数据的getter。
 * 接着在getter中就会从全局唯一的哪个位置读取当前正在读取数据的Watcher，并把这个Watcher收集到Dep中去。
 * 通过这样的方式，Watcher可以主动去订阅任意一个数据的变化。
 * 此外我们创建了Observer类，它的作用是把一个object中的所有数据（包括子数据）都转换成响应式的
 * 也就是他会侦测object中所有数据（包括子数据）的变化。
 * 由于在ES6之前JS并没有提供元编程的能力，所以在对象上新增属性和删除属性都无法被追踪到、。
 */
