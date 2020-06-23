class Dep {
  constructor () {
    this.deps = []
  }
  addDep (target) {
    if (!this.deps.find(target)) {
      this.deps.push(target)
    }
    Dep.target = null
  }
  notify () {
    this.deps.forEach( _dep => {
      _dep.update()
    })
  }
}
export default Dep