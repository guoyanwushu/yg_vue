function patch(vnode, oldnode) {
  if (!oldnode) {
    // 没有oldnode，初次渲染
  }
  if (sameNode(vnode, oldnode)) {
    // 开始patch
    patchVnode(vnode, oldnode)

  }
}
function sameNode(vnode, oldnode) {
  return (
    vnode.key === oldnode.key &&
    vnode.tagName === oldnode.tagName
  )
}

function patchVnode(vnode, oldnode) {
  // 更新属性
  for (var i=0;i<vnode.attrs.length;i++) {

  }
}