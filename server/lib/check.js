//后端验证数据
module.exports.validateLength = function (value='',min=6,max=16){
  return value.length>=min && value.length<=max
}

