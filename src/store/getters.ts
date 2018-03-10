import { GetterTree ,Getter } from 'vuex'

const getters: GetterTree<any, any>={
  currentBlogList:(state)=>state.currentBlogList,
  
  users:(state)=>state.users,

  userName:(state)=>state.users.userName,

  loginStatus:(state)=>state.loginStatus,

  openLoginDialog:(state)=>state.openLoginDialog,

  userInfo:(state)=>state.users.userInfo,

  blogList:(state)=>state.users.blogList,
}

export default getters
