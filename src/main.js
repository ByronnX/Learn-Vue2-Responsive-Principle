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
  console.log("牛逼！！我监控到了a.m.n的值是", val);
});
obj.a.m.n = 88;
