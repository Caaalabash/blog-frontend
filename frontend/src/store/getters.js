export const users = state => state.users

export const userName = state => state.users.userName

export const userInfo = state => state.users.userInfo

export const likeList = state => state.users.likeList || []

export const collectList = state => state.users.collectList || []

export const avatar = state => state.users.avatar || ''

export const message = state => state.message || []
