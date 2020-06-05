import Dep from '../observe/dep.js'
function parse(html, options) {
  var tagStartReg = /^<([a-z]+)\s*([^>/]*)\/?>/;
  var tagEndReg = /^<\/([a-z0-9]+)\s*>/
  var commentReg = /^<!--.*-->/
  var doctypeReg = /^<!Doctype [^>]+>/i
  var attrsReg = /\s*([^"'<>=]+)\s*=\s*(?:'([^']*)'|"([^"]*)")\s*/
  var textReg = /\{\{([^{}]+?)\}\}/
  var root, currentParent;
  var stack = [];
  /**
   * 有两种异常：
   * 1.传入的html片段不是dom片段, 这种直接忽略掉就好了
   * 2.传入了不只一个根级别的dom片段
   * 想一想怎么处理这2种异常
   */
  while (html) {
    // 刚好匹配上起始标签
    var textEnd = html.indexOf('<');
    if (textEnd == 0) {
      // 要考虑异常， 比如<!-- 条件注释  <!Doctype 文档说明
      if (commentReg.test(html)) {
        var commentEndIndex = html.indexOf('-->')
        html = html.substring(commentEndIndex + 3);
        continue
      }
      // 剔除掉文档节点
      var doctypeMatch = html.match(doctypeReg)
      if (doctypeMatch) {
        html = html.substring(doctypeMatch[0].length);
        continue
      }
      var startMatch = html.match(tagStartReg);
      if (startMatch) {
        // 解析开始标签
        parseStartTag(startMatch);
        continue
      }
      var endMatch = html.match(tagEndReg);
      if (endMatch) {
        // 解析结束标签
        parseEndTag(endMatch)
        continue
      }
    }
    else if (textEnd >= 0) {
      // 没有匹配上<标签, 说明接下来的内容既不是开始标签又不是结束标签
      var rest, text, next;
      rest = html.substring(textEnd);
      while (!tagStartReg.test(rest) &&
      !tagEndReg.test(rest) &&
      !commentReg.test(rest) &&
      !doctypeReg.test(rest)) {
        next = rest.indexOf('<', 1)  // 找下一个<
        if (next < -1) {
          // 说明< 后面的都是text了
          textEnd = html.length;
          break
        }
        textEnd = textEnd + next;
        rest = rest.substring(next)
      }
      text = html.substring(0, textEnd);
      currentParent?currentParent.children.push(createTextNode(text)):''
      html = html.substring(textEnd);
      continue
    }
    else if (textEnd < 0) {
      // <都没找到， 那百分百不是标签了， 后面的都是纯文本
      text = html;
      currentParent?currentParent.children.push(createTextNode(text)):'';
      html = ''
    }

  }
  return root

  /**
   * 处理开始标签， 然后就要找到用到了data及props属性的地方，同时也要考虑到怎么将dom还原成html片段
   * 属性, 事件
   * v-bind: v-model @ v-on
   * @param startMatch
   * {
   *  0: '<div id="hello" :name="cname"',
   *  1: 'div',
   *  2: ' :cname="name"'
   * }
   */
  function parseStartTag(startMatch) {
    // 确定是元素节点， 把标签 和 标签后面到>的中间那一截截取出来
    var tagName = startMatch[1] || ''
    var datas = startMatch[2] || '';
    var attrs = [], attr;
    var attrReg = /^(?:v-bind:|:)([a-zA-Z]+)/
    var eventReg = /^(?:v-on:|@)([a-zA-Z\.]+)/
    while (attr = datas.match(attrsReg)) {
      var _attr
      var _event
      if (_attr = attrReg.exec(attr[1])) {
        attrs.push({
          bindAttr: true,
          name: _attr[1],
          value: attr[2] || attr[3]
        })
      }
      else if (_event = eventReg.exec(attr[1])) {
        var eventName = _event[1].split('.')[0]
        var desc = _event[1].split('.').slice(1)
        attrs.push({
          bindEvent: true,
          name: eventName,
          value: attr[2] || attr[3],
          eventDesc: desc
        })
      } else {
        attrs.push({
          name: attr[1],
          value: attr[2] || attr[3]
        })
      }

      datas = datas.substring(attr[0].length)
    }
    var startNode = {
      type: 'element',
      elm: null,
      tagName: tagName,
      attrs: attrs,
      children: []
    }
    if (!root && !stack.length) {
      root = startNode
    }
    stack.push(startNode);
    currentParent?currentParent.children.push(startNode):"";
    currentParent = startNode;
    html = html.substring(startMatch[0].length)
  }
  function parseEndTag(endMatch) {
    var tagName = endMatch[1];
    if (stack[stack.length-1].tagName === tagName) {
      stack.splice(stack.length-1, 1)
    }
    html = html.substring(endMatch[0].length)
  }
  function createTextNode(text) {
    // 再判断一下是否有{{}}这种东西， 如果没有就算传字符串， 就不要去解析了， 如果有的话， 就要把 {{}}里面的内容提取出来， 然后用 ${} 包裹起来进行解析
    var _, bindFlag = false;
    while (_ = textReg.exec(text)) {
      text = text.replace(_[0], '${'+_[1]+'}');
      bindFlag = true
    }
    return {
      bindFlag: bindFlag,
      type: 'text',
      text: text
    }
  }
}

/**
 * 渲染函数
 */
function render (vm) {
  if (vm.$options.template) {
    const container = document.getElementById(vm.$options.el);
    const nodes = parse(vm.$options.template);
    renderFunc(nodes, vm, container)
  }
}
function renderFunc(vNode, vm, container) {
  container.innerHTML = ''
  if (vNode.type == 'element') {
    var _el = document.createElement(vNode.tagName);
    var attrs = vNode.attrs;
    vNode.el = _el ; // 在vNode里面保留对真实dom的引用
    /** vue attrs\props\events\class\style更新粒度放在了vNode 这个维度上， 通过前后两个vNode的attrs对比，决定待修改对象的增删改查 **
      * 新\旧的vNode 是怎么来的?
      * 更新的触发机制就要修改了
      */
    attrs.forEach(function (attr, index) {
      // 属性也分普通的属性 还有v-if v-show v-else v-else-if
      // 大量的if else 要进行重构, 用策略模式重构
      handleAttr(attr);
      if (attr.bindAttr) {
        var _render = 'with(this){return '+attr.value+'}'
        /* 真正的vue Dep.target 实际上是一个watcher */
        Dep.target = {
          update: function () {
            _el.setAttribute(attr.name, new Function(_render).call(vm))
          }
        }
        var _val = new Function(_render).call(vm)
        _el.setAttribute(attr.name, _val);

      }
      else if (attr.bindEvent) {
        _el.addEventListener(attr.name, function (event) {
          attr.value.call(vm, event)
        })
      }
      else {
        _el.setAttribute(attr.name, attr.value);
      }
    })
    container.appendChild(_el)
    if (vNode.children) {
      vNode.children.forEach(function (_node) {
        renderFunc(_node,vm, _el)
      })
    }
  }
  if (vNode.type == 'text') {
    var _text;
    const _textNode = document.createTextNode('');
    if (vNode.bindFlag) {
      var _render = 'with(this){return `'+vNode.text+'`}';
      Dep.target = {
        update: function () {
          _textNode.replaceData(0, -1,  new Function(_render).call(vm))
        }
      }
      _text = new Function(_render).call(vm)

    } else {
      _text = vNode.text
    }
    _textNode.appendData(_text);
    container.appendChild(_textNode);
  }
}

export {parse, renderFunc, render}

function handAttr(attr) {
  var handelObj = {
    'v-if': function () {

    },
    'v-else': function () {

    },
    'v-else-if': function () {

    }
  }
}