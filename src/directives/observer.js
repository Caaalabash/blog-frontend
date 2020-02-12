const noop = () => {}

function inserted(el, binding) {
  // 注册观察器
  const fn = binding.value || noop
  const observer = new IntersectionObserver(([entry]) => {
    if (entry) {
      // 不可见 => 可见, status为true 可见 => 不可见, status为false
      entry.isIntersecting ? fn(el, true) : fn(el, false)
    }
  })
  // 开始观察
  observer.observe(el)
  el._onObserver = {
    observer,
  }
}
function unbind(el) {
  if (!el._onObserver) return
  const { observer } = el._onObserver
  // 关闭观察器
  observer.disconnect()
  delete el._onObserver
}

export default {
  inserted,
  unbind,
}