#### questions
* Object.defineProperty 拦截A对象值的get和set，事实上也是需要有一个依赖的对象或数据去读写的，不然set的时候，值又set给谁呢? 那么依赖的那个对象又怎么处理?

    vue是直接以A的属性值为介质，通过闭包的形式，将值一直保存在闭包中，然后对其进行读或者写
    ``` javascript
        function defineReactive(obj, key, val) {
          if (typeof val == 'object') {
            observe(val)
          }
          Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get: function () {
              console.log('=== getting ===')
              return val
            },
            set: function (newVal) {
              console.log(' === setting ===')
              val = newVal
            }
          })
        }
        function observe(obj) {
          const keys = Object.keys(obj)
          for (let i=0;i<keys.length;i++) {
            defineReactive(obj, keys[i], obj[keys[i]])
          }
        }
    ```
* 每一次触发get，都是一个手机依赖的过程，同一个key可能有多个依赖，在set的时候，当前key所有的依赖都将要更新，如何去管理这些依赖呢?

    同上，还是利用了闭包，在React内部定义一个dep对象保存依赖，然后set的时候遍历dep的依赖执行update