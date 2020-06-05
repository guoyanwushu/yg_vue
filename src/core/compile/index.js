// 第一步  template - 初始ast
import {parse} from "../parser/html_parser";

var template = '<div id="test"><div id="gg" name="cname">hello world, my name is {{name.toUpperCase()}}</div></div>';
var vNodes = parse(template); // 这个拿到的只是最初的vNodes， 还要根据这个来生成最终的渲染用vNode
var Node = {
  tagName: 'span',
  attrs: [{
    name: 'id',
    value: 'text'
  }, {
    name: 'v-if',
    value: 'year>5'
  }]
}
function genElement(vNode) {
  // 针对属性 要处理些什么东西 v-if v-for
  var attrs = vNode.attrs;
  attrs.forEach(function (attr, index) {
      if (attr.name == 'v-if') {
        vNode.if = true;
        vNode.ifExpress = attr.value
        attrs.splice(index, 1)
      }
  })
}

function setNewNode(vNode, vm) {
  var parentNode = vNode.parentNode;
  if (vNode.if) {
    if (new Function('param', `with(param) {return ${vNode.ifExpress}`)) {
    }
  }
}
