import Dep from './dep.js'
function defineReactive(obj, key, val) {
  var dep = new Dep() // 声明依赖收集对象
  if (typeof val == 'object') {
    observe(val)
  }
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (Dep.target) {
        // dep 里面收集的应该是watcher
        dep.addDep(Dep.target)
      }
      return val
    },
    set: function (newVal) {
      val = newVal
      dep.notify() // 触发更新
    }
  })
}

function observe(obj) {
  const keys = Object.keys(obj)
  for (let i=0;i<keys.length;i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
}
export {observe}