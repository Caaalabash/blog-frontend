<template>
  <div>
    <!--移动端样式-->
    <div class="section0" v-if="showBtnGroup">
      <div @click="like">
        <el-badge class="mark" :value="likeCount" />
        <img src="../assets/like32.svg" alt="">
      </div>
      <div class="share" @click="share">
        <img src="../assets/share32.svg" alt="">
      </div>
      <div @click="collect">
        <img src="../assets/collect32.svg" alt="">
      </div>
    </div>
    <!--pc端样式-->
    <div class="btnGroup" v-else>
      <div @click="like" class="likeCount icon" :class="likeit?'red':''" >
        <el-badge class="mark" :value="likeCount" />
      </div>
      <div @click="collect" class="icon"></div>
      <div @click="share" class="share icon"></div>
    </div>
    <!--评论区域-->
    <div class="section1">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="说说你的看法"
        v-model="textarea">
      </el-input>
      <el-button plain class="send" @click="send()" :loading="showLoading">发送</el-button>
    </div>
    <!--评论-->
    <div class="section2">
      <div v-for="item in commentList" class="comment">
        <img class="avatar" :src="item.avatar ? item.avatar : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCIgdmlld0JveD0iMCAwIDM2IDM2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjMgKDEyMDgxKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5kZWZhdWx0X2dyYXZhdGFyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9ImRlZmF1bHRfZ3JhdmF0YXIiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiPgogICAgICAgICAgICA8ZyBpZD0iUmVjdGFuZ2xlLTIxMC0rLUltcG9ydGVkLUxheWVycy1Db3B5LUNvcHkiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yMTAiIGZpbGw9IiNEOEQ4RDgiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTI3Ljg2OTAzMjEsMjYuODUzNjU2OCBMOCwyNi44NTM2NTY4IEM4LDI1Ljg0OTQ1MTQgOC40NzE4MjUsMjQuMTEwOTQ2NiAxMS41MTg5MDQ1LDIyLjM4ODMxNzYgQzEyLjE1Nzg5NiwyMi4wMjcxMjEzIDE1LjM0Mzk1MTIsMjAuMDk2MTA5OCAxNS42MTU5Njc3LDE5LjYzNzE3MjEgQzE1LjkyNDU4MjgsMTkuMTE3MjA4MSAxNi4wMTA2Mzg5LDE4LjQ3NjE4MzcgMTUuNDIwMTE1OCwxNy41MzI1MDg1IEMxNS4zNzI2MzY2LDE3LjQ1NjEwMTYgMTQuNDM0OTIxNSwxNi4wMDgzMzkxIDE0LjE0NTEwMDMsMTUuMDMwNDI5NyBDMTMuOTQwMzQ2LDE0LjMzODMwMiAxMy45MTc1OTU1LDEzLjU0NTQ1NjEgMTMuOTE3NTk1NSwxMi43MTM0MTQ0IEMxMy45MTc1OTU1LDkuODM2MjQ3MDIgMTUuNzIyMzAxNCw4IDE3Ljk0ODM4NTYsOCBDMjAuMTc0NDY5OSw4IDIxLjk3OTE3NTgsOS44MzYyNDcwMiAyMS45NzkxNzU4LDEyLjcxMzQxNDQgQzIxLjk3OTE3NTgsMTMuMzk5MDkyMiAyMS45NjYzMTY4LDE0LjA1NTk5MzMgMjEuODQ3MTI0MSwxNC42NTM4NTI3IEMyMS42Mzk4OTcsMTUuNjkwMzA3NyAyMC43NzU4NzM2LDE3LjAwNTU5ODQgMjAuNTg4NDI5NSwxNy4zMzA1NzU5IEMyMC41NDM5MTc3LDE3LjQwNzQ3OSAyMC41MDc4MTM3LDE3LjQ2NzUxMyAyMC40ODUwNjMzLDE3LjUwMTI1MTEgQzIwLjA3OTAxNjgsMTguMTA3MDQ4OSAxOS45NjI3OTE2LDE4LjU1MzU4MjkgMjAuMDAwODczOSwxOC45MTUyNzU1IEMyMC4wNDQzOTY1LDE5LjMyODU2NzUgMjAuMzEzOTQwMSwxOS42MTYzMzM4IDIwLjY2NzA2NywxOS44NTQ0ODUzIEMyMS4wMzQ1MzY2LDIwLjEwMjA2MzYgMjQuMDExODgxLDIyLjE0OTY3IDI0LjM3Nzg2NjgsMjIuMzg4MzE3NiBDMjYuODcxNTE2MywyNC4wMTY2NzgzIDI3Ljg2OTAzMjEsMjUuNjA2MzM4NSAyNy44NjkwMzIxLDI2Ljg1MzY1NjggTDI3Ljg2OTAzMjEsMjYuODUzNjU2OCBaIiBpZD0iSW1wb3J0ZWQtTGF5ZXJzLUNvcHkiIGZpbGw9IiNGRkZGRkYiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+'" alt="">
        <div class="comment-body">
          <span class="user">{{item.user}}</span>
          <span class="text">{{item.text}}</span>
          <span class="time">{{item.date}}</span>
        </div>
      </div>
    </div>
    <!--收藏弹窗-->
    <Collect :visible="collectDialogVisible"
             @close="closeCollect"
    ></Collect>

  </div>
</template>

<script>
import api from '../service/apiManage'
import ClipboardJS from 'clipboard'
import {mapGetters, mapActions} from 'vuex'
import Collect from './Collect'

export default {
  name: 'comment',
  components:{
    Collect,
  },
  props: {
    commentList: {
      type: Array,
      default () {
        return []
      }
    },
    blogDate: {
      type: String
    },
    user: {
      type: String
    },
    currentUser: {
      type: String
    },
    blogTitle: {
      type: String
    },
    likeCount: {
      type: Number
    }
  },
  data () {
    return {
      textarea: '',
      showBtnGroup: window.innerWidth < 950,
      showLoading: false,
      collectDialogVisible:false,
    }
  },
  computed: {
    ...mapGetters([
      'likeList'
    ]),
    likeit () {
      return this.likeList
        ? this.likeList.some((item) => item.author === this.user && item.blogDate === this.blogDate)
        : false
    }
  },
  methods: {
    ...mapActions([
      'likethis'
    ]),
    share () {
      const baseUrl = 'https://blog.calabash.top'
      let that = this
      let clipboard = new ClipboardJS('.share', {
        text () {
          return `${that.user}的文章 ${that.blogTitle} ${baseUrl + that.$route.fullPath}`
        }
      })
      clipboard.on('success', function (e) {
        that.$message.success('已复制到粘贴板')
        e.clearSelection()
      })
    },
    collect () {
      if (!this.currentUser) {
        this.$message.error('请登录:)')
        return false
      }
      this.collectDialogVisible = true
    },
    closeCollect(){
      this.collectDialogVisible = false
    },
    like () {
      if (this.user === this.currentUser) {
        this.$message.error('不准给自己点赞:(')
        return
      }
      this.likethis({
        blogDate: this.blogDate,
        blogTitle:this.blogTitle,
        userName: this.user,
        user: this.currentUser,
        flag: this.likeit
      }).then(res => {
        if (res && res.errno === 0) {
          this.$emit('update:likeCount', res.res.count)
        }
      })
    },
    send () {
      if (!this.currentUser) {
        this.$message.error('请登录:)')
        return false
      }
      if (this.textarea.trim().length < 6) {
        this.$message.error('评论长度不足:(')
        return false
      }
      this.showLoading = true
      api.postComment({
        blogDate: this.blogDate,
        userName: this.user,
        user: this.currentUser,
        text: this.textarea,
        date: new Date().toLocaleString('zh', {hour12: false})
      }).then(res => {
        this.showLoading = false
        if (res.errno === 0) {
          this.$emit('commitSuccess')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/style/index.less';
  .red{
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PHBhdGggZmlsbD0iIzc0Q0E0NiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOS4xMzEgMTYuMzU4di4wNDJsLS4wMzEtLjAyMS0uMDMxLjAyMXYtLjA0MmMtLjg3LS41ODktMTAuNDM1LTcuMjI2LTcuNTE3LTEyLjM0OC43NjMtMS4zNCAxLjgwMy0xLjcgMi42OS0xLjkxNiAyLjQ4LS42MDYgNC41OCAxLjkwOCA0Ljg1OCAyLjI1OS4yNzktLjM1MSAyLjM3Ny0yLjg2NSA0Ljg1OS0yLjI2Ljg4Ni4yMTcgMS45MjYuNTc4IDIuNjkgMS45MTdDMTkuNTY1IDkuMTMyIDEwIDE1Ljc2OSA5LjEzIDE2LjM1OHoiLz48L3N2Zz4K)!important;
  }
  .section0,.section1,.section2{
    .fl-column;
    background-color: @grayColor;
    padding:10px;
    margin: 10px 0;
  }
  .section0,.btnGroup{
    .mark{
      position: absolute;
      top:-7px;
      right:-7px;
    }
  }
  .section0{
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    div{
      position: relative;
      cursor: pointer;
    }
  }
  .btnGroup{
    position: fixed;
    display: flex;
    flex-direction: column;
    left:calc(50% - 350px - 32px);
    top:16rem;

    .icon{
      position: relative;
      height: 36px;
      width: 36px;
      margin: 10px;
      border:1px solid @borderColor;
      background-color: @grayColor;
      cursor:pointer;
      border-radius: 50%;

      &:nth-child(1){
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PHBhdGggZmlsbD0iI0M2QzZDNiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOS4xMzEgMTYuMzU4di4wNDJsLS4wMzEtLjAyMS0uMDMxLjAyMXYtLjA0MmMtLjg3LS41ODktMTAuNDM1LTcuMjI2LTcuNTE3LTEyLjM0OC43NjMtMS4zNCAxLjgwMy0xLjcgMi42OS0xLjkxNiAyLjQ4LS42MDYgNC41OCAxLjkwOCA0Ljg1OCAyLjI1OS4yNzktLjM1MSAyLjM3Ny0yLjg2NSA0Ljg1OS0yLjI2Ljg4Ni4yMTcgMS45MjYuNTc4IDIuNjkgMS45MTdDMTkuNTY1IDkuMTMyIDEwIDE1Ljc2OSA5LjEzIDE2LjM1OHoiLz48L3N2Zz4=)
          no-repeat
          center center;
      }
      &:nth-child(2){
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOSI+PHBhdGggZmlsbD0iIzc0Q0E0NiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTMuNiAxMi45NkgxMXYxaDIuNnYyLjZoMXYtMi42aDIuNnYtMWgtMi42di0yLjZoLTF2Mi42ek0xIDIuOTZoMTYuMnYxSDF2LTF6bTAgNC45NWgxNi4ydjFIMXYtMXptMCA1LjA1aDl2MUgxdi0xeiIvPjwvc3ZnPgo=)
          no-repeat
          center center;
      }
      &:nth-child(3){
        background: url(../assets/分享.svg)
          no-repeat
          center center;
      }
    }
  }
  .section1{
    .send{
      align-self: flex-end;
      margin-top:10px;
    }
  }
  .section2{
    .comment{
      display: flex;
      background-color: white;
      margin: 10px 0;
      .avatar{
        border-radius: 50%;
        flex-shrink: 0;
        height: 36px;
        width: 36px;
        margin: 5px;
      }
    }
    .comment-body{
      .fl-column;
      align-content: space-around;
      width: 100%;
      padding: 10px;


      .user{
        font-weight: 600;
        color:#333;
      }
      .time{
        align-self: flex-end;
        padding: 5px;
        border: 1px solid @borderColor;
        border-radius: 15px;
        background-color: @grayColor;
        font-size: @timeFont;
      }
    }

  }

</style>
