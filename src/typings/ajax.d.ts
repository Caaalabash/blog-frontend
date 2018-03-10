declare namespace Ajax{
  //axios返回数据
  export interface AxiosResponse{
    data:AjaxResponse
  }
  //请求接口数据
  export interface AjaxResponse{
    //状态码
    errno:number
    //数据
    res:any
    //提示信息(可选)
    msg?:string
  }
}
