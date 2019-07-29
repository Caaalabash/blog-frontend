/**
 * 前端资源实现迷你"高可用"
 *
 * 目前主要处理图片资源, 图片资源有两份
 * 1. static.calabash.top/blog-media
 * 2. blog.calabash.top/
 * 当第一份资源出错时, 切换到第二份资源
 */
const backup = '//blog.calabash.top'

export default function switchWhenImgErr(e) {
  const target = e.target
  const tagName = target.tagName

  if (tagName.toLowerCase() !== 'img' || target.dataset.reload) return
  target.src = target.src.replace(/^.+\//, backup)
  target.dataset.reload = '1'
}