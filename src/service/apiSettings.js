import axios from 'axios'
import qs from 'qs'
import {Message} from 'element-ui'
import vuex from '../store/index'

class BaseModule{
  constructor(){
    this.$http = axios.create({
      timeout: 10000,  // 请求超时时间
      baseURL:'/api',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
    })
    this.cache = []
    this.expireTime = 1500
    //请求拦截器
    this.$http.interceptors.request.use(config => {
      if(vuex.state.token){
        config.headers['Authorization'] = vuex.state.token
      }
      if(config.url==='https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json'){
        config.headers['Authorization']="APPCODE b62dc60dc06342848faf46fec2ce4293"
      }
      if((config.method === 'post' || config.method === 'put' || config.method === 'delete') && config.headers["Content-Type"]==='application/x-www-form-urlencoded;charset=utf-8'){
        config.data = qs.stringify(config.data)
      }
      if(config.method === 'post'){
        let hitCache = this.cache.filter((item)=>{
          return (item.timeStamp + this.expireTime) > new Date().getTime()
        }).filter((item)=>{
          return item.url === config.url
        })
        if(hitCache.length>0){
          return Promise.reject({
            msg:'重复请求',
            errno:1,
            isCustom:true
          })
        }
        this.cache.push({
          url:config.url,
          timeStamp:new Date().getTime()
        })
      }
      return config
    }, error => {
      Message({
        showClose:true,
        message:'请求出错',
        type:'error'
      })
      return Promise.reject(error)
    })
    //响应拦截器
    this.$http.interceptors.response.use(response => {
      //如果状态码正确且有msg字段[说明需要使用Message组件]
      if(response.status === 200){
        if(response.data.msg){
          Message({
            showClose:true,
            message:response.data.msg,
            type:response.data.errno?'error':'success'
          })
        }
        return response.data
      }else{
        Message({
          showClose:true,
          message:response.status,
          type:'error'
        })
      }
    }, error =>{
      if(error.isCustom){
        Message({
          message:error.msg,
          type:'error'
        })
      }else{
        Message({
          showClose:true,
          message:'响应出错',
          type:'error'
        })
      }
      return Promise.resolve(error)
    })
  }
  get(url,data={},config={}){
    return this.$http.get(url,{params:data,...config})
  }
  post(url,data={},config={}){
    return this.$http.post(url,data,config)
  }
  put(url,data={},config={}){
    return this.$http.put(url,data,config)
  }
  delete(url,config){
    return this.$http.delete(url,config)
  }
}

export default BaseModule
