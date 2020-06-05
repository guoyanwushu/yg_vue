import {initState} from "./state";
import {render} from "../parser/html_parser";
import {observe} from "../observe/index"

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 初始化，先不考虑其他的只考虑数据的双向绑定
    const vm = this;
    vm.$options = options;
    vm._data = options.data;
    // 观察的实际上是 vm._data , 但是在vue的实际应用中, 读和写实际上都是在 vm即当前vue实例上进行的， 所以还要加一层代理，将vm.name 代理到 vm._data.name,代理其实也是用defineProperty 进行代理
    proxy(vm._data, vm);
    observe(vm._data);
    // 双向绑定这一块目前看来并不难，所占比例也不大，主要还是怎么生成依赖那一块，这个似乎更为重要一些
    render(vm) // 挂载节点

  }
}

function proxy(source, target) {
  const keys = Object.keys(source);
  keys.forEach(function (key) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      set: function (newVal) {
        source[key] = newVal
      },
      get: function () {
        return source[key]
      }
    })
  })

}

export default initMixin