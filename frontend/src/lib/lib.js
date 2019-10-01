export function formatDate() {
  const padTen = num => num > 9 ? num : `0${num}`
  const date = new Date()
  const year = date.getFullYear()
  const month = padTen(date.getMonth() + 1)
  const day = padTen(date.getDate())
  const hour = padTen(date.getHours())
  const min = padTen(date.getMinutes())
  const sec = padTen(date.getSeconds())

  return `${year}${month}${day}${hour}${min}${sec}`
}

export function timestampToTime(nS) {
  return new Date(parseInt(nS)).toLocaleString('zh',{ hour12: false })
}

export function generateVM(
  {
   container = document.body,
   width = '200px',
   height = '150px',
   textAlign = 'center',
   textBaseline = 'middle',
   font = "20px microsoft yahei",
   fillStyle = 'rgba(184, 184, 184, 0.8)',
   content = '请勿外传',
   rotate = '30',
   zIndex = 1000
  } = {}) {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)
  const ctx = canvas.getContext("2d")

  ctx.textAlign = textAlign
  ctx.textBaseline = textBaseline
  ctx.font = font
  ctx.fillStyle = fillStyle
  ctx.rotate(Math.PI / 180 * rotate)
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2)

  let base64Url = canvas.toDataURL()
  const watermarkDiv = document.createElement("div")
  watermarkDiv.setAttribute('style', `
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          z-index:${zIndex};
          pointer-events:none;
          background-repeat:repeat;
          background-image:url('${base64Url}')`)

  container.style.position = 'relative'
  container.insertBefore(watermarkDiv, container.firstChild)
}

export const EMOJI = '😄 😃 😀 😊 ☺ 😉 😍 😘 😚 😗 😙 😜 😝 😛 😳 😁 😔 😌 😒 😞 😣 😢 😂 😭 😪 😥 😰 😅 😓 😩 😫 😨 😱 😠 😡 😤 😖 😆 😋 😷 😎 😴 😵 😲 😟 😦 😧 😈 👿 😮 😬 😐 😕 😯 😶 😇 😏 😑 👲 👳 👮 👷 💂 👶 👦 👧 👨 👩 👴 👵 👱 👼 👸 😺 😸 😻 😽 😼 🙀 😿 😹 😾 👹 👺 🙈 🙉 🙊 💀 👽 💩 🔥 ✨ 🌟 💫 💥 💢 💦 💧 💤 💨 👂 👀 👃 👅 👄 👍 👎 👌 👊 ✊ ✌ 👋 ✋ 👐 👆 👇 👉 👈 🙌 🙏 ☝ 👏 💪 🚶 🏃 💃 👫 👪 👬 👭 💏 💑 👯 🙆 🙅 💁 🙋 💆 💇 💅 👰 🙎 🙍 🙇 🎩 👑 👒 👟 👞 👡 👠 👢 👕 👔 👚 👗 🎽 👖 👘 👙 💼 👜 👝 👛 👓 🎀 🌂 💄 💛 💙 💜 💚 ❤ 💔 💗 💓 💕 💖 💞 💘'.split(' ')