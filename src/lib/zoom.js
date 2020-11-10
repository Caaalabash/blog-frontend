// 配置
let options = {
  transitionDuration: '.4s',
  transitionTimingFunction: 'cubic-bezier(.4,0,0,1)',
  bgColor: '#000',
  bgOpacity: 0.5,
  maxWidth: 800,
  maxHeight: 600,
  deepCopy: false
}

// 给某个节点设置指定样式，通过remember记录对应的原样式
function setStyle(el, styles, remember) {
  const original = {}
  for (let key of Object.keys(styles)) {
    if (remember) {
      original[key] = el.style[key] || ''
    }
    el.style[key] = styles[key]
  }
  return original
}

// 用于创建占位元素，避免target改变导致布局错乱
function copy(el, box) {
  const clone = document.createElement('div')
  const styles = getComputedStyle(el)
  const stylesToCopy = [
    'position', 'display', 'float',
    'top', 'left', 'right', 'bottom',
    'marginBottom', 'marginLeft', 'marginRight', 'marginTop',
    'font', 'lineHeight', 'verticalAlign'
  ]
  stylesToCopy.forEach(key => {
    clone.style[key] = styles[key]
  })
  setStyle(clone, {
    visibility: 'hidden',
    width: `${box.width}px`,
    height: `${box.height}px`,
    display: styles.display === 'inline' ? 'inline-block' : styles.display
  })
  if (options.deepCopy) {
    clone.innerHTML = el.innerHTML
  } else {
    clone.textContent = el.textContent
  }
  return clone
}

// elements
let overlay = document.createElement('div'),
  wrapper = document.createElement('div'),
  target,
  parent,
  placeholder

// state
let shown = false,
  lock  = false,
  originalStyles

setStyle(overlay, {
  position: 'fixed',
  display: 'none',
  zIndex: 99998,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0,
  cursor: 'zoom-out',
  backgroundColor: options.bgColor,
  transition: `opacity ${options.transitionDuration} ${options.transitionTimingFunction}`
})

setStyle(wrapper, {
  position: 'fixed',
  zIndex: 99999,
  top: '50%',
  left: '50%',
  width: 0,
  height: 0
})

const api = {
  config(opts = {}) {
    options = { ...options, ...opts }
    setStyle(overlay, {
      backgroundColor: options.bgColor,
      transition: `opacity ${options.transitionDuration} ${options.transitionTimingFunction}`
    })
  },
  listen(el) {
    if (typeof el === 'string') {
      document.querySelectorAll(el).forEach(node => this.listen(node))
      return
    }
    setStyle(el, { cursor: 'zoom-in' })

    el.addEventListener('click', e => {
      e.stopPropagation()
      if (shown) {
        api.close()
      } else {
        api.open(el)
      }
    })
  },
  open(el) {
    if (shown || lock) return
    shown = true
    lock = true
    target = el
    parent = target.parentNode

    let p   = target.getBoundingClientRect(),
      dx    = p.left - (window.innerWidth - p.width) / 2,
      dy    = p.top - (window.innerHeight - p.height) / 2,
      scale = Math.min(options.maxWidth / p.width, options.maxHeight / p.height)
    // 在状态没改变之前创建占位元素
    placeholder = copy(target, p)
    // 调整目标元素的居中状态
    originalStyles = setStyle(target, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: '',
      bottom: '',
      whiteSpace: 'nowrap',
      marginTop: -p.height / 2 + 'px',
      marginLeft: -p.width / 2 + 'px',
      cursor: 'zoom-out',
      transform: `translate(${dx}px, ${dy}px)`,
      transition: ''
    }, true)
    // 插入元素
    parent.appendChild(overlay)
    parent.appendChild(wrapper)
    parent.insertBefore(placeholder, target)
    wrapper.appendChild(target)
    // 打开遮罩层
    overlay.style.display = 'block'
    // 触发回流
    void target.offsetHeight
    // 触发过渡效果
    overlay.style.opacity = options.bgOpacity
    setStyle(target, {
      transition: `transform ${options.transitionDuration} ${options.transitionTimingFunction}`,
      transform: `scale(${scale})`
    })
    target.addEventListener('transitionend', function onEnd() {
      target.removeEventListener('transitionend', onEnd)
      lock = false
    })
  },
  close() {
    if (!shown || lock) return
    lock = true

    let p = placeholder.getBoundingClientRect(),
      dx = p.left - (window.innerWidth - p.width) / 2,
      dy = p.top - (window.innerHeight - p.height) / 2
    // 关闭遮罩层
    overlay.style.opacity = '0'
    // 还原
    setStyle(target, {
      transform: `translate(${dx}px, ${dy}px)`
    })
    // 清理
    target.addEventListener('transitionend', function onEnd() {
      target.removeEventListener('transitionend', onEnd)
      setStyle(target, originalStyles)
      parent.insertBefore(target, placeholder)
      parent.removeChild(placeholder)
      parent.removeChild(overlay)
      parent.removeChild(wrapper)
      overlay.style.display = 'none'
      placeholder = null
      shown = false
      lock = false
    })
  },
}

overlay.addEventListener('click', api.close)
wrapper.addEventListener('click', api.close)

export default api
