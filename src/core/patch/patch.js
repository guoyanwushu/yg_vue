let oldNode = null
/* patch阶段是最终形态的虚拟dom树对比了, 不存在v-if v-else v-for 这种东西的 这些指令什么的, 是在render阶段结合数据生效*/
export function patch(vNode) {
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

  }
}
function sameNode(vnode, oldnode) {
  return (
    vnode.tagName === oldnode.tagName
  )
}
// 这里是节点和节点之间的比较，单对单的关系，不关系children的对比的， children有单独的对比法子.节点和节点之间应该就属性和事件有差异了吧
function patchVnode(vNode, oldNode) {
  // 对比属性
  const vm = vNode.context;
  let oldAttrs = oldNode.data.attrs
  let newAttrs = vNode.data.attrs
  const keys = [...new Set([...Object.keys(oldAttrs), ...Object.keys(newAttrs)])]
  keys.forEach(function (attrName) {
    if (!newAttrs[attrName]) {
      vNode.elm.removeAttribute(attrName)
    }
    vNode.elm.setAttribute(attrName, newAttrs[attrName])
  })
  // 对比事件
  const oldEvents = oldNode.data.on;
  const newEvents = vNode.data.on;
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

function patchChildren(vNode, oldNode) {

}

// 将vNode映射至真实html中
function mountInit(vNode) {
  // 区分vNode 的type，根据type调用不同的生产方法
  const type = vNode.type;
  if (type === 'element') {
    mountElement(vNode)
  } else if (type === 'text') {
    mountText(vNode)
  }
}

function mountText(vNode) {
  // 需要一个真实的dom引用去进行操作， 这个引用存哪里比较好呢? 先假定存当前的一个属性里面
  vNode.parentElm.innerText = vNode.text
}

function mountElement(vNode, vm) {
  // 针对元素型节点, 其实就是创建一个元素, 然和绑上属性和事件就好了
  // 给vNode自己存一份真实dom引用, 同时存一份父级真实dom引用, 然和遍历子元素的时候, 给子元素存一份父级dom引用
  let _node = document.createElement(vNode.tagName);
  const attrObj = vNode.data.attrs;
  Object.keys(attrObj).forEach(function (attrName) {
    _node.setAttribute(attrName, attrObj[attrName])
  });
  const eventsObj = vNode.data.on;
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
    mountInit(child)
  })
}