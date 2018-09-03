const exec = require('child_process').exec
const requrest = require('superagent')
const cheerio = require('cheerio')

//获取文档树
async function getHTML(){
  return requrest
    .get('https://my.ishadowx.net/')
    .set({
      'Host' : 'my.ishadowx.net',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    })
    .then((res,err)=>{
      if(err){
        return false
      }
      return res.text
    })
}

async function getInfo(){
  let res = await getHTML()
  if(res){
    let $ = cheerio.load(res)
    let result = []
    $('.hover-text').map(function(item,index){
      let obj = {}
      $(this).find('h4').map(function(index,item){
        let text = $(this).text().trim().split(':')[1]
        switch (index){
          case 0 : obj.ip=text;break;
          case 1 : obj.port=text;break;
          case 2 : obj.pwd=text;break;
          case 3 : obj.method=text;break;
          default : break;
        }
      })
      result.push(obj)
    })
    return result
  }else{
    console.log('没有获取到')
    return false
  }
}

module.exports =  async function initProxy(localport=1080){
  let proxyList = await getInfo()
  if(proxyList){
    console.log('开始代理')
    let index = 0
    let proxy = proxyList[index]
    console.log(proxy)
    exec(`sslocal -s ${proxy.ip} -p ${proxy.port} -l ${localport} -k ${proxy.pwd} -t 600 -m ${proxy.method}`,function(err,sout,serr){
      if(err){
        console.log(err)
      }
      console.log(sout)
      console.log(serr)
    })
  }else{
    console.log('获取代理失败')
  }
}
