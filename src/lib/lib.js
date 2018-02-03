export function setStorage(key,value,expireSeconds){
  localStorage[key] = JSON.stringify({
    value:value,
    expired:expireSeconds===undefined?undefined:Date.now()+1000*expireSeconds
  })
}

export function getStorage(key){
  if(localStorage[key]===undefined){
    return
  }
  let o = JSON.parse(localStorage[key])
  if(o.expired===undefined || Date.now()<o.expired){
    return o.value
  }else{
    delete localStorage[key]
  }
}

export function formatDate(){
  let myDate = new Date();
  function gtTen(num){
    return num>9?num:'0'+num
  }
  return `${myDate.getFullYear()}${gtTen(myDate.getMonth()+1)}${gtTen(myDate.getDate())}${gtTen(myDate.getHours())}${gtTen(myDate.getMinutes())}`

}
export function formatDateEng(value){
  let year = value.substr(0,4),
    month = value.substr(4,2),
    day = value.substr(6,2)
  function formatMonth(month) {
    switch (month){
      case'01':return 'Jan'
      case'02':return 'Feb'
      case'03':return 'Mar'
      case'04':return 'Apr'
      case'05':return 'May'
      case'06':return 'June'
      case'07':return 'July'
      case'08':return 'Aug'
      case'09':return 'Sept'
      case'10':return 'Oct'
      case'11':return 'Nov'
      case'12':return 'Dec'
    }
  }
  return `${formatMonth(month)} ${day}, ${year}`
}
