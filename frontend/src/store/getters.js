export const users = state => state.users

export const userName = state => state.users.userName

export const userInfo = state => {
  if(state.users.userInfo){
    return state.users.userInfo
  }else{
    return {
      twitter:'http://www.lanternpro.site/',
      github:'https://github.com/',
      weibo:'https://weibo.com/'
    }
  }
}

export const likeList = state => state.users.likeList || []

export const collectList = state => state.users.collectList || []

export const avatar = state => state.users.avatar || ''

export const message = state => state.message || []
