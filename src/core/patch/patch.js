let oldNode = null
let vm = null
/* patch阶段是最终形态的虚拟dom树对比了, 不存在v-if v-else v-for 这种东西的 这些指令什么的, 是在render阶段结合数据生效*/
/* patch 中的vNode还是要区分一下状态吧, 有些是已经mount过了, 有些没有mount过，还有v-if切换那种，如果从false变为true，是不是又要重新mount一次 */
export function patch(vNode, _vm) {
  vm = _vm
  if (!oldNode) {
    // 没有oldnode，初次渲染
    mountInit(vNode);
    oldNode = vNode
  }
  // 至少得是同一类节点，才会进行比较， 如果不是同一类，说明之前的没有了，做替换操作
  if (sameNode(vNode, oldNode)) {
    // 开始patch
    patchVnode(vNode, oldNode)

  } else {
    // 有旧节点，但是新节点和旧节点不是同一个节点，然后说明旧的完全被新的替代，直接挂载新的就行了
    vNode.parentElm?vNode.parentElm.removeChild(oldNode.elm): vm.$el.removeChild(oldNode.elm);
    mountInit(vNode)
  }
}
function sameNode(vnode, oldnode) {
  return (
    vnode.tagName === oldnode.tagName &&
    vnode.key === oldnode.key
  )
}
// 这里是节点和节点之间的比较，单对单的关系，不关系children的对比的， children有单独的对比法子.节点和节点之间应该就属性和事件有差异了吧
export function patchVnode(vNode, oldNode) {
  // 对比属性
  const vm = vNode.context; // 暂定用一个context属性来保存上下文
  vNode.elm = oldNode.elm
  vNode.parentElm = oldNode.parentElm
  if (vNode.type == 'text') {
    oldNode.parentElm.innerHTML = vNode.text;
    return
  }
  let oldAttrs = (oldNode.data && oldNode.data.attrs) || {}
  let newAttrs = (oldNode.data && vNode.data.attrs) || {}
  const keys = [...new Set([...Object.keys(oldAttrs), ...Object.keys(newAttrs)])]
  keys.forEach(function (attrName) {
    if (!newAttrs[attrName]) {
      vNode.elm.removeAttribute(attrName)
    }
    vNode.elm.setAttribute(attrName, newAttrs[attrName])
  })
  // 对比事件
  const oldEvents = (oldNode.data && oldNode.data.on) || {};
  const newEvents = (vNode.data && oldNode.data.on) || {};
  const events = [...new Set([...Object.keys(oldEvents), ...Object.keys(newEvents)])];
  events.forEach(function (eventName) {
    if (!newEvents[eventName]) {
      vNode.elm.removeEventListener(eventName, vm[newEvents[eventName]])
    }
    if (newEvents[eventName] !== oldEvents[eventName]) {
      vNode.elm.removeEventListener(eventName, vm[newEvents[eventName]]);
      vNode.elm.addEventListener(eventName, vm[newEvents[eventName]]);
    }
  })
  // 对比children, 应该算是patch中最难的部分了
  patchChildren(vNode, oldNode);
}

/**
 * 对比子节点, 所以说要有key呢, 找到key相同的节点，patch执行的就是更新操作，如果没有key，执行的总是新增和插入操作，不是一个级别的代价的
 * 新的有旧的没有 新增插入 新的旧的都有 更新 新的没有旧的有 删除 貌似就这三个点了吧
 * 算法算法，在不考虑性能的情况下怎么都有法子完成这个更新的，作为一个框架，性能还是一个比较大的关注点
 * @param vNode
 * @param oldNode
 */
export function patchChildren(vNode, oldNode) {
  const oldChildren = oldNode.children || [];
  const newChildren = vNode.children || [];
  // TODO 子节点patch
}

// 将vNode映射至真实html中
export function mountInit(vNode) {
  // 区分vNode 的type，根据type调用不同的生产方法
  const type = vNode.type;
  if (type === 'element') {
    return mountElement(vNode, vm)
  } else if (type === 'text') {
    return mountText(vNode)
  }
}

function mountText(vNode) {
  // 需要一个真实的dom引用去进行操作， 这个引用存哪里比较好呢? 先假定存当前的一个属性里面
  var _node = document.createTextNode(vNode.text)
  vNode.parentElm.appendChild(_node)
  return _node
}

function mountElement(vNode, vm) {
  // 针对元素型节点, 其实就是创建一个元素, 然和绑上属性和事件就好了
  // 给vNode自己存一份真实dom引用, 同时存一份父级真实dom引用, 然和遍历子元素的时候, 给子元素存一份父级dom引用
  let _node = document.createElement(vNode.tagName);
  const attrObj = vNode.data.attrs || {};
  Object.keys(attrObj).forEach(function (attrName) {
    _node.setAttribute(attrName, attrObj[attrName])
  });
  const eventsObj = vNode.data.on || {};
  Object.keys(eventsObj).forEach(function (eventName) {
    _node.addEventListener(eventName, vm[eventsObj[eventName]])
  })
  vNode.elm = _node;
  if (vNode.parentElm) {
    vNode.parentElm.appendChild(_node)
  } else {
    vm.$el.appendChild(_node)
  }
  const children = vNode.children;
  children.forEach(function (child) {
    child.parentElm = _node;
    mountInit(child, vm)
  })
  return _node
}