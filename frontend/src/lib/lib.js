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

export function formatDateEng(value) {
  if (!value) return
  let year = value.substr(0,4),
    month = value.substr(4,2),
    day = value.substr(6,2)
  function formatMonth(month) {
    switch (month) {
      case'01': return 'Jan'
      case'02': return 'Feb'
      case'03': return 'Mar'
      case'04': return 'Apr'
      case'05': return 'May'
      case'06': return 'June'
      case'07': return 'July'
      case'08': return 'Aug'
      case'09': return 'Sept'
      case'10': return 'Oct'
      case'11': return 'Nov'
      case'12': return 'Dec'
    }
  }
  return `${formatMonth(month)} ${day}, ${year}`
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