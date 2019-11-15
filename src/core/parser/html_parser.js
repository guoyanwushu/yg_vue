function parse(html, options) {
  var tagStartReg = /^<([a-z]+)\s*([^>/]*)\/?>/;
  var tagEndReg = /^<\/([a-z0-9]+)\s*>/
  var commentReg = /^<!--.*-->/
  var doctypeReg = /^<!Doctype [^>]+>/i
  var attrsReg = /\s*([^"'<>=]+)\s*=\s*(?:'([^']*)'|"([^"]*)")\s*/
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
        next = rest.indexOf('<', 1)
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
   */
  function parseStartTag(startMatch) {
    var tagName = startMatch[1] || ''
    var datas = startMatch[2] || '';
    var attrs = [], attr
    while (attr = datas.match(attrsReg)) {
      var attrReg = /^(?:v-bind|:)([a-zA-Z]+)/
      var eventReg = /^(?:v-on|@)([a-zA-Z\.]+)/
      var _attr
      var _event
      if (_attr = attrs.exec(attr[1])) {
        attrs.push({
          bindAttr: true,
          name: _attr[1],
          value: attr[2] || attr[3]
        })
      }
      else if (_event = attr.exec(attr[1])) {
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
    return {
      type: 'text',
      text: text
    }
  }
}

/**
 * 渲染函数
 */
functtion render(vNode, vm, container) {
  if (vNode.type = 'element') {
    var _el = document.createElement(vNode.tagName);
    var attrs = vNode.attrs;
    attrs.forEach(function (attr, index) {
      if (attr.bindAttr) {
        var _render = 'with(vm){return ${'+attr.value+'}}'
        _el.setAttribute(attr.name, eval(_render));
        Dep.target = {
          update: function () {
            _el.setAttribute(attr.name,  eval(_render))
          }
        }
        return
      }
      if (attr.bindEvent) {
        el.addEventListener(attr.name, function (event) {
          attr.value.call(vm, event)
        })
        return
      }
      el.setAttribute(attr.name, attr.name);
    })
    container.appendChild(_el)
    if (vNode.children) {
      vNode.children.forEach(function (_node) {
        render(_node,vm, _el)
      })
    }
  }
}