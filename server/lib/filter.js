const fs = require('fs')
const path = __dirname + '/CensorWords.txt'


let data = fs.readFileSync(path, { encoding:'UTF-8' })
let map = makeSensitiveMap(data.split('\n'))

function makeSensitiveMap(sensitiveWordList){
  const result = new Map()
  for(let word of sensitiveWordList){
    let map = result
    for(let i = 0; i < word.length; i++){
      let ch = word.charAt(i)
      if(map.get(ch)){
        map = map.get(ch)
      }else{
        if(map.get('end') === true){
          map.set('end', false)
        }
        const item = new Map()
        item.set('end', true)
        map.set(ch, item)
        map = map.get(ch)
      }
    }
  }
  return result
}

function checkSensitiveWord(sensitiveMap, txt, index) {
  let currentMap = sensitiveMap
  let flag = false
  let wordNum = 0//记录过滤
  let sensitiveWord = '' //记录过滤出来的敏感词

  for (let i = index; i < txt.length; i++) {
    const word = txt.charAt(i)
    currentMap = currentMap.get(word)
    if (currentMap) {
      wordNum++
      sensitiveWord += word
      if (currentMap.get('end') === true) {
        // 表示已到词的结尾
        flag = true
        break
      }
    } else {
      break
    }
  }
  // 两字成词
  if (wordNum < 2) {
    flag = false
  }
  return { flag, sensitiveWord }
}

function filterSensitiveWord(txt) {
  let matchResult = { flag: false, sensitiveWord: '', use: ''}
  // 过滤掉除了中文、英文、数字之外的
  const txtTrim = txt.replace(/[^\u4e00-\u9fa5\u0030-\u0039\u0061-\u007a\u0041-\u005a]+/g, '')
  for (let i = 0; i < txtTrim.length; i++) {
    //从第i个字开始能否构成敏感词
    matchResult = checkSensitiveWord(map, txtTrim, i)
    //找到第一个敏感词就溜啦
    if (matchResult.flag) {
      break
    }
  }
  return matchResult
}

module.exports = {
  filterSensitiveWord
}

