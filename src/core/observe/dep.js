class Dep {
  constructor () {
    this.deps = []
  }
  addDep (target) {
    this.deps.push(target)
    Dep.target = null
  }
  update () {
    this.deps.forEach( _dep => {
      _dep.update()
    })
  }
}
export default Dep