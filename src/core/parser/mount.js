function render (vNode, container) {
  if (container.vNode) {
    patch(container.vNode, vNode, container)
  } else {
    mount(vNode, container)
  }
}
function mount(vNode, container) {
  if (typeof vNode.tag === 'string') {
    mountElement(vNode, container)
  }
  if (vNode.tag === null) {
    mountText(vNode, container)
  }
}
function patch(prevNode, nextNode, container) {
  if (prevNode.tag !== nextNode.tag) {
    container.removeChild(prevNode.el);
    mount(nextNode, container)
  } else {
    // 如果标签相同，那么不同的就是data和children了
    nextNode.el = prevNode.el;
    patchData(prevNode.data, nextNode.data, prevNode.el);
    patchChildren(prevNode.children, nextNode.children, prevNode.el)
  }
}
function patchData(prevData, nextData, container) {
  //TODO 属性差异处理
}

function patchChild(prevChildren, nextChildren, container) {
  //TODO 正儿八经复杂的其实是多对多的情况，才需要考虑节点复用
}

function mountElement(vNode, container) {
  const el = document.createElement(vNode.tag)
  const nodeData = vNode.data
  Object.keys(nodeData).forEach(item => {
    if (item === 'style') {
      const styles = nodeData[item]
      Object.keys(styles).forEach(item=> {
        el.style[item] = styles[item]
      })
    }
    if (item === 'class') {
      el.className = nodeData.class
    }
    if (item[0] == 'o' && item[1] == 'n') {
      el.addEventListener(item.substring(2), nodeData[item])
    }

  })
  if (vNode.children) {
    for (let i = 0 ;i < vNode.children.length ; i++) {
      mount(vNode.children[i], el)
    }
  }
  vNode.el = el;
  container.appendChild(el)
}

function mountText(vNode, container) {
  container.textContent  = vNode.children
}