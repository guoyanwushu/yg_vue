import {updateView} from "./center";
class Wacher {
  constructor (fn) {
    this.getter = fn;
    this.value = this.getter.call(vm)
  }
  update () {
    // 推送一个更新通知到 调度中心 (暂时叫这个东西吧)
    updateView();
  }
}