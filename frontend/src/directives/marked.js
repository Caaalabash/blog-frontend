import marked from 'marked'

function update(el, binding) {
  el.innerHTML = marked(binding.value)
}

export default {
  update
}