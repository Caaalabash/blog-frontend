var getters = {
    currentBlogList: function (state) { return state.currentBlogList; },
    users: function (state) { return state.users; },
    userName: function (state) { return state.users.userName; },
    loginStatus: function (state) { return state.loginStatus; },
    openLoginDialog: function (state) { return state.openLoginDialog; },
    userInfo: function (state) { return state.users.userInfo; },
    blogList: function (state) { return state.users.blogList; },
};
export default getters;
