import marked from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import go from 'highlight.js/lib/languages/go'
import cLike from 'highlight.js/lib/languages/c-like'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('go', go)
hljs.registerLanguage('golang', go)
hljs.registerLanguage('c', cLike)

marked.setOptions({
  highlight(code, lang) {
    return hljs.highlightAuto(code).value
  }
})

function update(el, binding) {
  el.innerHTML = marked(binding.value)
}

export default {
  update
}