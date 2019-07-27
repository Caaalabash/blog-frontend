export const users = state => state.users

export const userName = state => state.users.userName

export const userInfo = state => {
  if (state.users.userInfo) {
    return state.users.userInfo
  } else {
    return {
      twitter:'https://twitter.com/caaalabash',
      github:'https://github.com/Caaalabash',
      juejin:'https://juejin.im/user/5a9009795188257a7f1dbf70'
    }
  }
}

export const likeList = state => state.users.likeList || []

export const collectList = state => state.users.collectList || []

export const avatar = state => state.users.avatar || ''

export const message = state => state.message || []
