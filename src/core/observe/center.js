let timer = null
let vm
function updateView() {
  if (!timer) {
    timer = setTimeout(function () {
      vm.update();
    }, 100)
  } else {
    clearTimeout(timer)
    timer = setTimeout(function () {
      vm.update();
    })
  }
}
export {updateView}