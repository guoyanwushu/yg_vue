/*
* 构造函数+prototype模式来写
* */
import initMixin from './init.js'
function Vue(options) {
    if (!(this instanceof Vue)) {
        console.warn('Vue is a constructor and should be called with "new" keyword');
        return
    }
    this._init(options)
}

initMixin(Vue);
export default Vue
