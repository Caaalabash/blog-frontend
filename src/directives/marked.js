import marked from 'marked'
import highlight from 'highlight.js'
import 'highlight.js/styles/github.css'

marked.setOptions({
  highlight(code, lang) {
    return highlight.highlight(lang || 'javascript', code).value
  }
})

function update(el, binding) {
  el.innerHTML = marked(binding.value)
}

export default {
  update
}