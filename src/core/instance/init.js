import {initState} from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // 初始化，先不考虑其他的只考虑数据的双向绑定
        const  vm = this;
        initState(vm);
    }
}