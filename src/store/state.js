
const state = {
  currentBlogList:[],
  users:{
    userName:'Calabash',
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
  loginStatus:false,
  queryIdea:{
    blogId:'',
    blogTitle:'',
    blogDate:'',
    blogContent:'',
    blogType:''
  },
  ui:{
    openLoginDialog:false
  }
}

export default state

export const initState =  {
  currentBlogList:[],
  users:{
    userName:'Calabash',
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
  loginStatus:false,
  queryIdea:{
    blogId:'',
    blogTitle:'',
    blogDate:'',
    blogContent:'',
    blogType:''
  },
  ui:{
    openLoginDialog:false
  }
}
