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
* 每一次触发get，都是一个收集依赖的过程，同一个key可能有多个依赖，在set的时候，当前key所有的依赖都将要更新，如何去管理这些依赖呢?

    同上，还是利用了闭包，在React内部定义一个dep对象保存依赖，然后set的时候遍历dep的依赖执行update
* 看了一遍vue的更新， 包括attrs\events\class\styles的更新都是在vNode维度上更新的，通过对比新旧vNode，来实现响应的更新逻辑，那么问题来了,第一次编译template的时候是会生成一个vNode树，但是data数据变化时， 那个新的vNode
  又是从哪里来的呢， 旧的vNode又是如何保持在内存中的呢，从而可以进行比较?
   第一次直接把真实dom和生成的vNode比较， 然后发现前者是真实dom，就替换成一个空的vNode， 然后和生成的vNode比较， 触发update，实现dom的编译. 然后把当前的vNode 存到 vm._vNode 上，下一次
   就拿vm._vNode(旧的vNode) 和 最新的 vNode 比较，从而进行更新。从这里基本就可以看到 数据变化之后， 是先体现到 vNode, 然后通过新旧vNode 对比, 再把更新的地方同步到真实dom上。
   新的VNode 是通过 render函数， render.call(vm, vm) 来生成新的vNode， 再把这个vNode去和旧的对比
* 第一次编译的时机，他是第一次直接就将template编译成真实dom，然后收集依赖， 还是咋个回事，从无-到有的这个过程关注一下
* 将template编译成vNode是个耗时间的事， 编译完了存缓存 模板 -> vNode 这样子的对应关系, 如果后面还要编译，并且有一样的，就直接从缓存里面取
* Watcher 和 Dep的关系

    一个dep (对应于data中的一个变量，一个值) 对应多个watcher, 因为一个变量可能很多地方都在用! 其实 Watcher 和 Dep也是多对多的关系， 比如这样一个表达式 {{a+b+c}}, 这个watcher就对应于三个deper
* 真实dom和虚拟dom的对应关系
  元素节点: tag (attrs events --->datas ) children