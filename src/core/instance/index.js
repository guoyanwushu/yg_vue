/*
* 构造函数+prototype模式来写
* */
import {initMixin} from 'init.js'
function Vue(options) {
    if (!(this instanceof Vue)) {
        console.warn('Vue is a constructor and should be called with "new" keyword');
        return
    }
    this._init(options)
}

initMixin(Vue)


function oberve(obj, key, orignalObj) {
  Object.defineProperty(obj, key, {
    get () {
      return orignalObj[key];
    },
    set: function (newVal) {
      if (newVal != orignalObj[key]) {
        orignalObj[key] = newVal
      }
    }
  })
}