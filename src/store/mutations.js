import types from './types';
import router from '../router';
var mutations = (_a = {},
    _a[types.REDIRECT_TO] = function (state, path) {
        state.redirectTo = path;
        router.push(path);
    },
    /*设置浏览的博客列表*/
    _a[types.SET_CURRENT_BLOG_LIST] = function (state, data) {
        state.currentBlogList = data;
    },
    /*设置users信息*/
    _a[types.SET_USER] = function (state, data) {
        state.users = data;
    },
    /*注销*/
    _a[types.LOG_OUT] = function (state) {
        var initState = state.initState();
        for (var key in initState) {
            state[key] = initState[key];
        }
    },
    /*是否在登录状态*/
    _a[types.LOGIN_SUCCESS] = function (state) {
        state.loginStatus = true;
    },
    /*是否打开登录窗口*/
    _a[types.OPEN_LOGIN_DIALOG] = function (state, data) {
        state.openLoginDialog = data;
    },
    /*创建新的博客*/
    _a[types.CREATE_NEW_IDEA] = function (state, data) {
        state.users.blogList.push(data);
    },
    /*修改某一篇博客*/
    _a[types.CHANGE_IDEA] = function (state, data) {
        state.users.blogList.map(function (item, index) {
            if (item.blogDate === data.blogDate) {
                for (var key in data) {
                    state.users.blogList[index][key] = data[key];
                }
            }
        });
    },
    /*返回首页 ,给currentUser重新赋值*/
    _a[types.BACK_INDEX] = function (state) {
        state.currentBlogList = state.users.blogList.filter(function (item) { return item.blogType === 'public'; });
    },
    /*删除某条博客*/
    _a[types.DELETE_IDEA] = function (state, data) {
        state.users.blogList = state.users.blogList.filter(function (item) { return item.blogDate !== data.blogDate; });
    },
    /*查询某一篇博客 */
    _a[types.GET_IDEA] = function (state, data) {
        //报废嗷
    },
    /*获取用户信息*/
    _a[types.GET_USER_INFO] = function (state, data) {
        state.users.userInfo = data;
    },
    /*修改用户信息*/
    _a[types.CHANGE_USER_INFO] = function (state, data) {
        state.users.userInfo = data;
    },
    /*获取博客列表*/
    _a[types.GET_IDEA_LIST] = function (state, data) {
        state.users.blogList = data;
    },
    _a);
export default mutations;
var _a;
