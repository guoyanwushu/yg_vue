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

/**
 * 对比子节点, 所以说要有key呢, 找到key相同的节点，patch执行的就是更新操作，如果没有key，执行的总是新增和插入操作，不是一个级别的代价的
 * 新的有旧的没有 新增插入 新的旧的都有 更新 新的没有旧的有 删除 貌似就这三个点了吧
 * 算法算法，在不考虑性能的情况下怎么都有法子完成这个更新的，作为一个框架，性能还是一个比较大的关注点
 * @param vNode
 * @param oldNode
 */
function patchChildren(vNode, oldNode) {
  const oldChildren = oldNode.children;
  const newChildren = vNode.children;
  newChildren.forEach(function (child, index) {
    // 最优结果，新旧不仅是同一个节点，位置还一样，那说啥， 直接更新撒
    if (oldChildren[index] && child.key === oldChildren[index].key) {
      patch(child, oldChildren[index])
    }
    // 只有新的有， 旧的没有， 说明是新加的
    if (!oldChildren[index]) {
      var _node = mountInit(child);
      child.elm = _node
      child.parentElm = vNode.elm
      vNode.elm.appendChild(mountInit(child))
    }
    // 最优结果，新旧不仅是同一个节点，位置还一样，那说啥， 直接更新撒
    if (oldChildren[index] && child.key === oldChildren[index].key) {
      patch(child, oldChildren[index])
    } else {
      // 两边都tm有， 但是key不一样, 然后去旧的里面扒拉一下看旧的里面有没得
      var oldNodeObj = searchNodeByKey(oldChildren, child.key);
      if (oldNodeObj) {
        // 旧的里面有，复用一下下
        if (index == 0) {
          vNode.elm.insertBefore(oldNodeObj.elm, newChildren[0].elm);
        } else {
          vNode.elm.insertAfter(oldNodeObj.elm, newChildren[index-1].elm)
        }
        patch(child, oldNodeObj)
      } else {
        // 旧的里面没有, 那自己新增撒
        const _node = mountInit(child);
        child.elm = _node
        child.parentElm = vNode.elm
        vNode.insertAfter(_node, newChildren[index - 1].elm)
      }
    }
  })
  function searchNodeByKey(nodes, key) {
    return nodes.find(item => item.key === key)
  }
}

// 将vNode映射至真实html中
function mountInit(vNode) {
  // 区分vNode 的type，根据type调用不同的生产方法
  const type = vNode.type;
  if (type === 'element') {
    return mountElement(vNode)
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
  return _node
}