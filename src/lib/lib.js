import api from '../service/apiManage'

export function formatDate(){
  const myDate = new Date();
  function gtTen(num){
    return num>9?num:'0'+num
  }
  return `${myDate.getFullYear()}${gtTen(myDate.getMonth()+1)}${gtTen(myDate.getDate())}${gtTen(myDate.getHours())}${gtTen(myDate.getMinutes())}${gtTen(myDate.getSeconds())}`
}

export function formatDateEng(value){
  if(!value) return
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
// 接收一个数组, ip-time-request
// 转换为一个对象
// {
//   ip,
//   address: 根据阿里云api查询api地址
//   list: [{ time, request }]
// }
export async function processPvData(arr) {
  // 分离出所有IP并去重
  const ipList = [...new Set(arr.reduce((acc,i) => {
    acc.push(i.split('-')[0])
    return acc
  }, []))]
  // 获取对应的地址
  let res = []
  for(let n of ipList){
    let ipaddress = await api.getIpAddress({ ip: n }),
      address=' '
    if(ipaddress.code === 0){
      address = `${ipaddress.data.country}-${ipaddress.data.region}-${ipaddress.data.city}-${ipaddress.data.isp}`
    }
    res.push({ ip:n, list:[], address:address })
  }
  // 分离出所有请求
  for(let n of arr){
    let [ip, date, path] = n.split('-')
    for(let m of res){
      if(m.ip === ip){
        m.list.push({ date, path })
      }
    }
  }
  return res
}

export function timestampToTime(nS) {
  return new Date(parseInt(nS)).toLocaleString('zh',{hour12:false})
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
  } = {}){
  let canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  let ctx = canvas.getContext("2d");

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.rotate(Math.PI / 180 * rotate);
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

  let base64Url = canvas.toDataURL();
  const watermarkDiv = document.createElement("div");
  watermarkDiv.setAttribute('style', `
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          z-index:${zIndex};
          pointer-events:none;
          background-repeat:repeat;
          background-image:url('${base64Url}')`);

  container.style.position = 'relative';
  container.insertBefore(watermarkDiv, container.firstChild);
}
