/*
import {parse, renderFunc} from "./src/core/parser/html_parser";
const _htmlTemp = '<div id="test" v-bind:name="cname">hello world, my name is {{name.toUpperCase()}}</div>'
const vNodes = parse(_htmlTemp)

console.log(renderFunc(vNodes, {cname: 'Kiddy', name: 'jimmy'}, document.getElementById('test')))*/
import Vue from './src/core/instance/index'
window.vueInst = new Vue({
  el: 'test',
  template: '<div id="container" v-bind:name="cname">hello world, my name is {{name.toUpperCase()}}</div>',
  data: {
    name: 'Jimmy',
    cname: 'Andy'
  }
})
