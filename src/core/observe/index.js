function defineReactive(obj, key, val) {
  var dep = {} // 声明依赖收集对象
  if (typeof val == 'object') {
    observe(val)
  }
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      console.log('=== getting ===')
      dep.add() // 将当前依赖加进dep
      return val
    },
    set: function (newVal) {
      console.log(' === setting ===')
      val = newVal
      dep.notify() // 触发更新
    }
  })
}

function observe(obj) {
  const keys = Object.keys(obj)
  for (let i=0;i<keys.length;i++) {
    defineReactive(vm, keys[i], obj[keys[i]])
  }
}

function test (obj) {
  observe(obj)
}