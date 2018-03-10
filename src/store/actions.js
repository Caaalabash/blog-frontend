import types from './types';
import apiManage from '../service/apiManage.js';
var actions = {
    getCurrentBlogList: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.getIdeaList(data).then(function (res) {
            commit(types.SET_CURRENT_BLOG_LIST, res.res);
        }, function (e) { console.log(e); }, function (e) { console.log(e); });
    },
    login: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.checkUser(data).then(function (res) {
            if (res.errno === 0) {
                //设置users,loginStatus,关闭窗口,重定向
                commit(types.SET_USER, res.res);
                commit(types.LOGIN_SUCCESS, true);
                commit(types.OPEN_LOGIN_DIALOG, false);
                commit(types.REDIRECT_TO, "/" + res.res.userName + "/manage");
            }
        }, function (e) { console.log(e); });
    },
    /*注册*/
    register: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.createUser(data).then(function (res) {
            //反馈请求结果,不操作state
        }, function (e) { console.log(e); });
    },
    /*发布新博文*/
    createNewIdea: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.createNewIdea(data).then(function (res) {
            if (res.errno === 0) {
                commit(types.CREATE_NEW_IDEA, data);
            }
        }, function (e) { console.log(e); });
    },
    /*更新博文*/
    updateIdea: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.changeIdea(data).then(function (res) {
            if (res.errno === 0) {
                commit(types.CHANGE_IDEA, data);
            }
        }, function (e) { console.log(e); });
    },
    /*获取某条博文 暂未用到*/
    getIdea: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.getIdea(data).then(function (res) {
            if (res.errno === 0) {
                commit(types.GET_IDEA, res.res);
            }
        }, function (e) { console.log(e); });
    },
    /*获取用户信息*/
    getUserInfo: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.getUserInfo(data).then(function (res) {
            if (res.errno === 0) {
            }
        }, function (e) { console.log(e); });
    },
    /*更新用户信息*/
    updateUserInfo: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.changeUserInfo(data).then(function (res) {
            if (res.errno === 0) {
                commit(types.CHANGE_USER_INFO, data);
            }
        }, function (e) { console.log(e); });
    },
    /*获取博文列表:可以和获取当前博文列表合并*/
    getIdeaList: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.getIdeaList(data).then(function (res) {
            if (res.errno === 0) {
                commit(types.GET_IDEA_LIST, res.res);
            }
        }, function (e) { console.log(e); });
    },
    /*删除博文*/
    deleteIdea: function (_a, data) {
        var commit = _a.commit, state = _a.state;
        apiManage.deleteIdea(data).then(function (res) {
            if (res.errno === 0) {
                commit(types.DELETE_IDEA, data);
            }
        }, function (e) { console.log(e); });
    }
};
export default actions;
