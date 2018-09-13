import * as types from './mutation-type'
import router from '../router'

const mutations = {
  /*路由跳转*/
  [types.REDIRECT_TO](state,path){
    state.redirectTo = path
    router.push(path)
  },
  //设置登陆凭证
  [types.SET_TOKEN](state,data){
    state.token = data
  },
  /*设置浏览的博客列表*/
  [types.SET_CURRENT_BLOG_LIST](state,data){
    state.currentBlogList = data
  },
  /*加载更多*/
  [types.LOAD_MORE](state,data){
    state.currentBlogList = state.currentBlogList.concat(data)
  },
  /*设置users信息*/
  [types.SET_USER](state,data){
    state.users = data
  },
  /*注销*/
  [types.LOG_OUT](state){
    const initState = state.initState()
    for (const key in initState) {
      state[key] = initState[key];
    }
  },
  /*是否在登录状态*/
  [types.SET_LOGIN_STATUS](state,data){
    state.loginStatus = data
  },
  /*是否打开登录窗口*/
  [types.OPEN_LOGIN_DIALOG](state,data){
    state.openLoginDialog = data
  },
  /*创建新的博客*/
  [types.CREATE_NEW_IDEA](state,data){
    state.users.blogList.push(data)
  },
  /*修改某一篇博客*/
  [types.CHANGE_IDEA](state,data){
    state.users.blogList.map((item,index)=>{
      if(item.blogDate===data.blogDate){
        for (const key in data) {
          state.users.blogList[index][key] = data[key];
        }
      }
    })
  },
  /*返回首页 ,给currentUser重新赋值*/
  [types.BACK_INDEX](state){
    state.currentBlogList = state.users.blogList.filter((item)=>item.blogType==='public')
  },
  /*删除某条博客*/
  [types.DELETE_IDEA](state,data){
    state.users.blogList = state.users.blogList.filter((item)=>item.blogDate!==data.blogDate)
  },
  /*查询某一篇博客 */
  [types.GET_IDEA](state,data){
    state.currentBlog = {...data}
  },
  /*获取用户信息*/
  [types.GET_USER_INFO](state,data){
    state.users.userInfo = data
  },
  /*修改用户信息*/
  [types.CHANGE_USER_INFO](state,data){
    state.users.userInfo = data
  },
  /*获取博客列表*/
  [types.GET_IDEA_LIST](state,data){
    let {blogList,...other} = state.users
    state.users = {blogList:data,...other}
  },
  /*设置喜欢列表*/
  [types.SET_LIKELIST](state,data){
    state.users.likeList = data
  },
  [types.SET_COLLECTLIST](state,data){
    state.users.collectList = data
  },
  [types.ADD_COLLECTLIST](state,data){
    state.users.collectList.push(data)
  },
  [types.ADD_BLOG_TO_COLLECT](state,data){
    let index = state.users.collectList.findIndex(item=>item.collectTitle===data.collect)
    console.log(index)
    state.users.collectList[index].list.push({
        author:data.author,
        blogDate:data.blogDate,
      })
  },
  [types.DELETE_COLLECT](state,data){
    let index = state.users.collectList.findIndex(item=>item.collectTitle===data.collectTitle)
    if(index !== -1){
      state.users.collectList.splice(index,1)
    }
  },
  [types.DELETE_COLLECT_BLOG](state,data){
    let index = state.users.collectList.findIndex(item=>item.collectTitle===data.collectTitle)
    if(index !== -1){
      let i = state.users.collectList[index].list.findIndex(item=>item.blogDate===data.blogDate)
      state.users.collectList[index].list.splice(i,1)
    }
  },
  [types.SET_AVATAR](state,data){
    state.users.avatar = data
  },
  [types.SET_COMMENT_LIST](state,data){
    state.currentBlog.comment = data
  },
  [types.SOCKET_CONNECT](state,data){
    state.connect = true
  },
  [types.SOCKET_SEND_MSG](state,data){
    state.message.push(data)
  },
  [types.SET_CHAT_DATA](state,data){
    state.message = data
  },
  //后台受到信息
  [types.SOCKET_RECVMSG](state,data){
    if(data[0].from!==state.users.userName){
      state.message.push(data[0])
    }
  },
  [types.SET_CANVAS_LINECOLOR](state,data){
    state.lineColor = data
  }
}
export default  mutations
