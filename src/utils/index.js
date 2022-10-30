export function isEmpty(val) {
  return val === undefined || val === null || val === ''
}

export function noop() {}

export function padTen(num) {
  return num > 9 ? `${num}` : `0${num}`
}

// 以前的设计有点问题，保存文章没用时间戳
export function formatDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = padTen(date.getMonth() + 1)
  const day = padTen(date.getDate())
  const hour = padTen(date.getHours())
  const min = padTen(date.getMinutes())
  const sec = padTen(date.getSeconds())

  return `${year}${month}${day}${hour}${min}${sec}`
}

export function formatDateToChinese(time) {
  if (isEmpty(time)) return ''
  return `${time.slice(0, 4)}年${time.slice(4, 6)}月${time.slice(6, 8)}日${time.slice(8, 10)}时${time.slice(10, 12)}分${time.slice(12, 14)}秒`
}