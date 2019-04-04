<template>
  <div class="blog-comment">
    <!--pc端样式-->
    <div class="operate-pc">
      <div @click="like" class="iconfont" :class="[ likeIt ? 'iconheart-fill' : 'iconheart' ]" >
        <el-badge class="mark" :value="likeCount" />
      </div>
      <div @click="collect" class="iconfont iconstar"></div>
      <div @click="share" class="iconfont iconshare"></div>
    </div>
    <!--移动端样式-->
    <div class="operate-mob">
      <div class="iconfont" :class="[ likeIt ? 'iconheart-fill' : 'iconheart' ]" @click="like">
        <el-badge class="mark" :value="likeCount" />
      </div>
      <div class="iconfont iconstar" @click="collect"></div>
      <div class="iconfont iconshare" @click="share"></div>
    </div>
    <!--评论区域-->
    <div class="comment-input">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="说说你的看法"
        v-model="textarea">
      </el-input>
      <el-button class="send" @click="send" :loading="showLoading" plain>发送</el-button>
    </div>
    <!--评论-->
    <div class="comment-list" v-show="commentList.length">
      <div v-for="item in commentList" class="comment">
        <img class="avatar" :src="item.avatar || defaultAvatarBase64" alt="">
        <div class="comment-body">
          <span class="user">{{ item.user }}</span>
          <span class="text">{{ item.text }}</span>
          <span class="time">{{ item.date }}</span>
        </div>
      </div>
    </div>
    <!--收藏弹窗-->
    <Collect :visible="collectDialogVisible" @close="closeCollect"/>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
import { mapGetters, mapActions } from 'vuex'
import Collect from './Collect'

export default {
  name: 'Comment',
  components:{
    Collect,
  },
  props: {
    commentList: {
      type: Array,
      default: () => []
    },
    blogDate: {
      type: String
    },
    user: {
      type: String
    },
    blogTitle: {
      type: String
    },
    likeCount: {
      type: Number
    }
  },
  data: () => ({
    textarea: '',
    showLoading: false,
    collectDialogVisible:false,
    defaultAvatarBase64: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCIgdmlld0JveD0iMCAwIDM2IDM2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjMgKDEyMDgxKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5kZWZhdWx0X2dyYXZhdGFyPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9ImRlZmF1bHRfZ3JhdmF0YXIiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiPgogICAgICAgICAgICA8ZyBpZD0iUmVjdGFuZ2xlLTIxMC0rLUltcG9ydGVkLUxheWVycy1Db3B5LUNvcHkiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiPgogICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yMTAiIGZpbGw9IiNEOEQ4RDgiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTI3Ljg2OTAzMjEsMjYuODUzNjU2OCBMOCwyNi44NTM2NTY4IEM4LDI1Ljg0OTQ1MTQgOC40NzE4MjUsMjQuMTEwOTQ2NiAxMS41MTg5MDQ1LDIyLjM4ODMxNzYgQzEyLjE1Nzg5NiwyMi4wMjcxMjEzIDE1LjM0Mzk1MTIsMjAuMDk2MTA5OCAxNS42MTU5Njc3LDE5LjYzNzE3MjEgQzE1LjkyNDU4MjgsMTkuMTE3MjA4MSAxNi4wMTA2Mzg5LDE4LjQ3NjE4MzcgMTUuNDIwMTE1OCwxNy41MzI1MDg1IEMxNS4zNzI2MzY2LDE3LjQ1NjEwMTYgMTQuNDM0OTIxNSwxNi4wMDgzMzkxIDE0LjE0NTEwMDMsMTUuMDMwNDI5NyBDMTMuOTQwMzQ2LDE0LjMzODMwMiAxMy45MTc1OTU1LDEzLjU0NTQ1NjEgMTMuOTE3NTk1NSwxMi43MTM0MTQ0IEMxMy45MTc1OTU1LDkuODM2MjQ3MDIgMTUuNzIyMzAxNCw4IDE3Ljk0ODM4NTYsOCBDMjAuMTc0NDY5OSw4IDIxLjk3OTE3NTgsOS44MzYyNDcwMiAyMS45NzkxNzU4LDEyLjcxMzQxNDQgQzIxLjk3OTE3NTgsMTMuMzk5MDkyMiAyMS45NjYzMTY4LDE0LjA1NTk5MzMgMjEuODQ3MTI0MSwxNC42NTM4NTI3IEMyMS42Mzk4OTcsMTUuNjkwMzA3NyAyMC43NzU4NzM2LDE3LjAwNTU5ODQgMjAuNTg4NDI5NSwxNy4zMzA1NzU5IEMyMC41NDM5MTc3LDE3LjQwNzQ3OSAyMC41MDc4MTM3LDE3LjQ2NzUxMyAyMC40ODUwNjMzLDE3LjUwMTI1MTEgQzIwLjA3OTAxNjgsMTguMTA3MDQ4OSAxOS45NjI3OTE2LDE4LjU1MzU4MjkgMjAuMDAwODczOSwxOC45MTUyNzU1IEMyMC4wNDQzOTY1LDE5LjMyODU2NzUgMjAuMzEzOTQwMSwxOS42MTYzMzM4IDIwLjY2NzA2NywxOS44NTQ0ODUzIEMyMS4wMzQ1MzY2LDIwLjEwMjA2MzYgMjQuMDExODgxLDIyLjE0OTY3IDI0LjM3Nzg2NjgsMjIuMzg4MzE3NiBDMjYuODcxNTE2MywyNC4wMTY2NzgzIDI3Ljg2OTAzMjEsMjUuNjA2MzM4NSAyNy44NjkwMzIxLDI2Ljg1MzY1NjggTDI3Ljg2OTAzMjEsMjYuODUzNjU2OCBaIiBpZD0iSW1wb3J0ZWQtTGF5ZXJzLUNvcHkiIGZpbGw9IiNGRkZGRkYiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+'
  }),
  computed: {
    ...mapGetters({
      likeList: 'likeList',
      currentUser: 'userName'
    }),
    likeIt () {
      return this.likeList
        ? this.likeList.some(item => item.author === this.user && item.blogDate === this.blogDate)
        : false
    }
  },
  methods: {
    ...mapActions([
      'likethis'
    ]),
    share () {
      const baseUrl = 'https://blog.calabash.top'
      const clipboard = new ClipboardJS('.share', {
        text () {
          return `${this.user}的文章 ${this.blogTitle} ${baseUrl + this.$route.fullPath}`
        }
      })
      clipboard.on('success', e => {
        this.$message.success('已复制到粘贴板')
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
      this.likethis({
        blogDate: this.blogDate,
        blogTitle:this.blogTitle,
        userName: this.user,
        user: this.currentUser,
        flag: this.likeIt
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
      this.$api.postComment({
        blogDate: this.blogDate,
        userName: this.user,
        user: this.currentUser,
        text: this.textarea,
        date: new Date().toLocaleString('zh', { hour12: false })
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
  .blog-comment {
    .operate-mob {
      display: none;
    }
    .operate-pc {
      position: fixed;
      display: flex;
      flex-direction: column;
      left: calc(50% - 400px);
      top: 16rem;
      .iconfont {
        position: relative;
        height: 36px;
        width: 36px;
        margin: 10px;
        line-height: 36px;
        font-size: 25px;
        text-align: center;
        border: 1px solid #c9c9c9;
        cursor: pointer;
        border-radius: 50%;
        color: rgba(0, 0, 0, .5);
        &:hover {
          color: #409EFF;
          border-color: #409EFF;
        }
      }
      .iconheart-fill {
        color: #f56c6c;
        border-color: #f56c6c;
      }
      .mark {
        position: absolute;
        top:-7px;
        right:-7px;
      }
    }
    .comment-list,
    .comment-input {
      display: flex;
      flex-direction: column;
      background-color: rgb(247,247,247);
      padding:10px;
      margin: 10px 0;
    }
    .comment-input {
      .send {
        align-self: flex-end;
        margin-top: 10px;
      }
    }
    .comment-list {
      .comment {
        display: flex;
        background-color: white;
        margin: 10px 0;
        .avatar {
          border-radius: 50%;
          flex-shrink: 0;
          height: 36px;
          width: 36px;
          margin: 5px;
        }
      }
      .comment-body {
        display: flex;
        flex-direction: column;
        align-content: space-around;
        width: 100%;
        padding: 10px;
        .user {
          font-weight: 600;
          color:#333;
        }
        .time {
          align-self: flex-end;
          padding: 5px;
          border: 1px solid #c9c9c9;
          border-radius: 15px;
          background-color: rgb(247,247,247);
          font-size: 12px;
        }
      }
    }
  }
  @media (max-width: 768px) {
    .blog-comment {
      .operate-pc {
        display: none;
      }
      .operate-mob {
        display: flex;
        justify-content: space-around;
        padding:10px;
        margin: 10px 0;
        background-color: rgb(247,247,247);
        .iconfont {
          position: relative;
          font-size: 32px;
          text-align: center;
          cursor: pointer;
        }
        .iconheart-fill {
          color: #f56c6c;
          border-color: #f56c6c;
        }
        .mark {
          position: absolute;
          top: -7px;
          right: -7px;
        }
      }
    }
  }
</style>
