const initState = {
  //当前登录状态
  loginStatus:false,
  //当前登录用户的信息
  users:{
    userName:'',
    __v:'',
    _id:'',
    userInfo:{
      twitter:'http://www.lanternpro.site/',
      github:'https://github.com/',
      weibo:'https://weibo.com/'
    },
    blogList:[{
      blogId:'',
      blogTitle:'',
      blogDate:'',
      blogContent:'',
      blogType:''
    }]
  },
  //用于修改的博文标识
  searchIdea:'',
  //重定向的路径,目前用于登录后控制路由跳转到管理页
  redirectTo:''
}

const state = {
  ...initState,
  //ajax请求反馈的信息
  error:{
    errno:0,
    msg:''
  },
  //当前所在的博文列表,用于实现上一篇,下一篇
  currentBlogList:[],
  //控制登录窗口的打开
  ui:{
    openLoginDialog:false
  },
  initState(){
    return initState
  }
}

export default state

