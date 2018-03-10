declare namespace StoreState{
  export interface blog {
    blogTitle:string,
    blogType:string,
    blogContent:string,
    blogDate:string,
    _id?:string
  }
  export interface userInfo{
    twitter:string,
    github:string,
    weibo:string
  }
  export interface users{
    userInfo:userInfo,
    userName:string,
    _id?:string,
    blogList:Array<blog>
  }
}