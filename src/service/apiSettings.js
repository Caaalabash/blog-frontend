/**
 * Created by 11210 on 2018/1/26.
 */
import axios from 'axios'
import qs from 'qs'
import {Message} from 'element-ui'

class BaseModule{
  constructor(){
    this.$http = axios.create({
      baseURL:'/api',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
    })
    //请求拦截器
    this.$http.interceptors.request.use(config => {
      if (config.method === "post" || config.method === "put" || config.method === "delete"){
        config.data = qs.stringify(config.data);
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
      return response
    }, error =>{
      Message({
        showClose:true,
        message:'响应出错',
        type:'error'
      })
      //这里可以设置跳转到错误页面
      return Promise.resolve(error.response)
    })

  }
  get(url,config={}){
    return this.$http.get(url,config)
  }
  post(url,data=undefined,config={}){
    return this.$http.post(url,data,{...config})
  }
  put(url,data=undefined,config={}){
    return this.$http.put(url,data,{...config})
  }
  delete(url,config={}){
    return this.$http.delete(url,config)
  }


}

export default BaseModule
