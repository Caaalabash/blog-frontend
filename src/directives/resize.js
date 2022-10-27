function mounted(el, binding) {
  const cb = binding.value
  // .passive 修饰符表示事件永远不会调用 preventDefault() ，主要为解决滚动和触摸事件的卡顿而出现
  const options = binding.options || { passive: true }

  window.addEventListener('resize', cb, options)
  // 存储监听窗口resize事件的参数，方便在unmounted钩子函数中使用
  el._onResize = {
    cb,
    options,
  }
}
function unmounted(el) {
  if (!el._onResize) return

  const { cb, options } = el._onResize
  window.removeEventListener('resize', cb, options)
  delete el._onResize
}

export default {
  mounted,
  unmounted,
}
