const initState = {
  // 登陆凭证
  token: '',
  // 当前登录状态
  loginStatus: false,
  // 当前登录用户的信息
  users: {},
  // 重定向的路径,目前用于登录后控制路由跳转到管理页
  redirectTo: '',
  // 聊天
  connect: false,
  message: [],
  // 访问次数
  viewCount: 0
}

const state = {
  ...initState,
  // 控制登录窗口的打开
  initState() {
    return initState
  }
}

export default state

