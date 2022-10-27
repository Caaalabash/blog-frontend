import marked from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import go from 'highlight.js/lib/languages/go'
import cLike from 'highlight.js/lib/languages/c-like'
import 'highlight.js/styles/github.css'
import Zoom from '../lib/zoom'

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

function updated(el, binding) {
  if (binding.value) {
    el.innerHTML = marked(binding.value)
    Zoom.listen('img')
  }
}

export default {
  updated
}
