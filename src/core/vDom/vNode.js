class VNode {
  constructor(tag, data, children) {
    this.tag= tag
    this.data = data
    this.children = children
    this.elm = null // 真实dom引用
  }
}
export default VNode

