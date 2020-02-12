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