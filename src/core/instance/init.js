import {initState} from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // 初始化，先不考虑其他的只考虑数据的双向绑定
        const vm = this;
        vm._data = options.data;
        // 观察的实际上是 vm._data , 但是在vue的实际应用中, 读和写实际上都是在 vm即当前vue实例上进行的， 所以还要加一层代理，将vm.name 代理到 vm._data.name
        observe(vm._data)
        // 双向绑定这一块目前看来并不难，所占比例也不大，主要还是怎么生成依赖那一块，这个似乎更为重要一些
        render(options.el)

    }
}