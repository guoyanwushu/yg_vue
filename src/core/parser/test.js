// 开闭原则 ( 对扩展开放， 对修改关闭 )
// 里氏替换原则 (能用父类的地方， 都必须可以用其子类完全替代(子类不应修改父类的属性和方法))
// 单一职责原则 (函数或类尽量只负责一件事， 如果在一个函数里做的事情越多， 后续被修改的机会就越多， 就越容易出错)
// 依赖倒置原则 高级模块不应该依赖于低级模块， 抽象不应该依赖细节， 细节应该依赖抽象
// 接口隔离原则
// 迪米特原则

import VNode from "../vDom/vNode";

"<div>123</div><div>456</div>".replace(/(<[^>]*?>)(?:([^<].+?)(<(?:(?:\/)?[a-z]+>))|([^<].+)$)/g, function (a, b, c, d, e) {
    console.log(a, b, c, d, e)
    if (e) {
      return b + '<span>' + e + '</span>'
    }
    if (d && /^<\/span>/.test(d)) {
      if (b == d.replace(/\//, '')) {
        return
      }
      return b + c + d
    }
    if (d && !/^<\/span>/.test(d)) {
      if (b == d.replace(/\//, '')) {
        return b + c + d
      }
      else {
        return b + '<span>' + c + '</span>' + d
      }
    }
  }
)

function test(str) {
  var _dom = document.createElement('div');
  _dom.innerHTML = str;
  queryDom(_dom);

  function queryDom(dom) {
    debugger
    if (dom.nodeType == 1) {
      for (var i = 0; i < dom.childNodes.length; i++) {
        if (dom.childNodes[i].nodeType == 1) {
          queryDom(dom.childNodes[i])
        } else if (dom.childNodes[i].nodeType == 3) {
          var _replaceNode = document.createElement('span')
          _replaceNode.innerText = dom.childNodes[i].nodeValue;
          dom.childNodes[i].parentNode.replaceChild(_replaceNode, dom.childNodes[i]);
        }

      }
    }
  }

  return _dom.innerHTML
}

test('<div>123</div>')

/*<div id="demo">
  <h1>Latest Vue.js Commits</h1>
<template v-for="branch in branches">
  <input type="radio"
:id="branch"
:value="branch"
name="branch"
v-model="currentBranch">
  <label :for="branch">{{ branch }}</label>
</template>
<p>vuejs/vue@{{ currentBranch }}</p>
<ul>
<li v-for="record in commits">
  <a :href="record.html_url" target="_blank" class="commit">{{ record.sha.slice(0, 7) }}</a>
- <span class="message">{{ record.commit.message | truncate }}</span><br>
by <span class="author"><a :href="record.author.html_url" target="_blank">{{ record.commit.author.name }}</a></span>
at <span class="date">{{ record.commit.author.date | formatDate }}</span>
</li>
</ul>
</div>*/
(function anonymous() {
  with (this) {
    return _c('div', {attrs: {"id": "demo"}}, [_c('h1', [_v("Latest Vue.js Commits")]), _v(" "), _l((branches), function (branch) {
      return [_c('input', {
        directives: [{name: "model", rawName: "v-model", value: (currentBranch), expression: "currentBranch"}],
        attrs: {"type": "radio", "id": branch, "name": "branch"},
        domProps: {"value": branch, "checked": _q(currentBranch, branch)},
        on: {
          "change": function ($event) {
            currentBranch = branch
          }
        }
      }), _v(" "), _c('label', {attrs: {"for": branch}}, [_v(_s(branch))])]
    }), _v(" "), _c('p', [_v("vuejs/vue@" + _s(currentBranch))]), _v(" "), _c('ul', _l((commits), function (record) {
      return _c('li', [_c('a', {
        staticClass: "commit",
        attrs: {"href": record.html_url, "target": "_blank"}
      }, [_v(_s(record.sha.slice(0, 7)))]), _v("\n          - "), _c('span', {staticClass: "message"}, [_v(_s(_f("truncate")(record.commit.message)))]), _c('br'), _v("\n          by "), _c('span', {staticClass: "author"}, [_c('a', {
        attrs: {
          "href": record.author.html_url,
          "target": "_blank"
        }
      }, [_v(_s(record.commit.author.name))])]), _v("\n          at "), _c('span', {staticClass: "date"}, [_v(_s(_f("formatDate")(record.commit.author.date)))])])
    }), 0)], 2)
  }
})()

class Vnode {
  constructor (tag) {
    this.tagName = tag
  }
}
function createVNode(tagName, attrs, children) {
  return new Vnode(tagName, attrs, children)
}

function parentNode() {}
function childNode() {
  parentNode.call(this)
  this.type = 'Hello world'
}
// 只能继承属性不能选择方法
function childNode() {
  parentNode.call(this)
}
childNode.prototype = Object.create(parentNode.prototype)
childNode.prototype.constructor = childNode

/**
 * 模板字符串 -> ast renderFunctionString -> new VnodeTree -> Compare -> render Differance -> back
 * (1). 每一个数据变化， 触发的都是整个 virtualDomTree的重新生成和对比么，
 */

// 7
// number string boolean undefined null symbol bigint
// object function Math RegExp Date Array
// null并不是对象, 是js的历史遗留bug
// == === 值相同 值和类型都必须相同
// false == 0 true flase === 0 false
// [] == ![]  obj == 1  普通类型和包装类型 a.substring(); var a = new Object('a') a.toStrign a == null
// 基本和包装的区别
// typeof 判断基本类型是ok的， 判断对象就不行， 都tm是object 这个时候就要用instanceof 来判断具体的对象类型
//

function _instanceof (a,b) {
  if (typeof b!== 'function') {
    throw Error(`${b} must be a function`)
  }
  var proto = Object.getPrototypeOf(a);
  while (true) {
    if (proto === b.prototype) {
      return true
    }
    if (proto === null) {
      return false
    }
    proto = Object.getPrototypeOf(proto)
  }
}
// this 指向
// obj.xxx  new Function () {} niming call apply =>
// 模拟new
function _new (con, ...args) {
  var obj = Object.create(con.prototype);
  var result = con.apply(obj, args);
  if (typeof result == 'object' && result !== null) {
    return result
  } else {
    return obj
  }
}

// 基础 原生js 函数\对象 es6新特性 正则 常见的兼容性 布局 过渡 样式 动画 变形
/* vue 几大核心算法（真实dom -> 虚拟dom生成函数 , diff 算法）
*      常见的api一定要非常熟悉
*      组件写法 (参考elementui) 学习高阶组件的构造技巧
* */
// typescript 着重应用级的知识，枯燥的看知识点很没意思
// webpack 使用，优化
// eslint 使用，优化
// 根据vNode 生成 函数
function renderDom() {
  return '(可以通过作用域编的字符串)'
}
function test(remplate, data) {
  return vNodes
}
function compileToFunction(vNode) {
  let funcStr = '';
  var dataStr = '';
  var dataArr = []
  var data = vNode.data;
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      dataArr.push(`${key}: ${data[key]}`);
    }
    return '{' + dataArr.join(',') + '}'

  }
  // 判断节点的类型，数据，子节点数组 先只考虑文本和元素节点

}
// 值比较 <div
function turnObjToString(data) {
  var dataArr = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      dataArr.push(`${key}: ${data[key]}`);
    }
  }
  return '{' + dataArr.join(',') + '}'
}


const getName = function () {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '',
      success: function (res) {
        resolve(res.content)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}
getName().then(function (data) {

}).catch(error => {
  console.log(error)
})






