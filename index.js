/*
import {parse, renderFunc} from "./src/core/parser/html_parser";
const _htmlTemp = '<div id="test" v-bind:name="cname">hello world, my name is {{name.toUpperCase()}}</div>'
const vNodes = parse(_htmlTemp)

console.log(renderFunc(vNodes, {cname: 'Kiddy', name: 'jimmy'}, document.getElementById('test')))*/
import Vue from './src/core/instance/index'
import React from 'react'
import * as mountObj from './src/core/patch/patch'
import './one.css'
import './test.css'
var vdom1 = {
  type: 'element',
  tagName: 'div',
  key: 1,
  data: {
    attrs: {
      id: 'wangdachui',
      title: 'hello every one'
    },
    on: {
      click: 'handleClick'
    }
  },
  children: [{
    type: 'text',
    text: '你瞅啥',
    key: 4399
  }]
}
var vdom2 = {
  type: 'element',
  tagName: 'div',
  key: 2,
  data: {
    attrs: {
      id: 'wangdachui',
      title: '我是王大锤啊, hsk'
    },
    on: {
      click: 'handleClick'
    }
  },
  children: [{
    type: 'text',
    text: '瞅你咋地',
    key: 4399
  }]
}
var vm = {
  $el: document.getElementById('app'),
  handleClick: function () {
    alert('124');
  }
}

new Vue({
  data: {
    name: 'wangdachui1'
  },
  el: '#app'
})

mountObj.patch(vdom1, vm);
setTimeout(function () {
  console.log('patch is starting......')
  mountObj.patch(vdom2, vm)
}, 3000)