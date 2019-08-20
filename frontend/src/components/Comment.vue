<template>
  <div class="blog-comment">
    <!--pc端样式-->
    <div class="operate-pc">
      <div @click="like" class="iconfont" :class="[ likeIt ? 'icon-heart-fill' : 'icon-heart' ]" >
        <el-badge class="mark" :value="likeCount" />
      </div>
      <div @click="collect" class="iconfont icon-star"></div>
      <div class="iconfont icon-share share"></div>
    </div>
    <!--移动端样式-->
    <div class="operate-mob">
      <div class="iconfont" :class="[ likeIt ? 'icon-heart-fill' : 'icon-heart' ]" @click="like">
        <el-badge class="mark" :value="likeCount" />
      </div>
      <div class="iconfont icon-star" @click="collect"></div>
      <div class="iconfont icon-share share"></div>
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
        <img class="avatar" :src="item.avatar" alt="avatar" v-if="item.avatar">
        <i class="avatar iconfont icon-avatar" v-else></i>
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
    mounted() {
      const clipboard = new ClipboardJS('.share', {
        text: () => `${this.user}'s blog: ${this.blogTitle} ${location.href}`
      })
      clipboard.on('success', e => {
        const title = encodeURIComponent(this.blogTitle)
        window.open(`https://twitter.com/share?text=${title}&url=${location.href}`)
        e.clearSelection()
      })
    },
    methods: {
      ...mapActions([
        'likethis'
      ]),
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
            this.$emit('update:likeCount', res.data.count)
          }
        })
      },
      send () {
        if (!this.currentUser) {
          this.$message.error('请登录:)')
          return false
        }
        if (this.textarea.trim().length < 3) {
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
      right: 48px;
      bottom: 50px;
      display: flex;
      flex-direction: column;
      z-index: 8;
      .iconfont {
        position: relative;
        height: 36px;
        width: 36px;
        margin: 10px;
        line-height: 36px;
        font-size: 25px;
        text-align: center;
        background-color: rgb(242, 242, 242);
        color: rgb(97, 97, 97);
        cursor: pointer;
        border-radius: 50%;
        box-shadow: rgba(0,0,0,.5) 0 1px 5px 0;
        transition: background-color .5s, color .4s;
        &:hover {
          color: rgb(66, 66, 66);
          background-color: rgb(200, 200, 200);
        }
      }
      .icon-heart-fill {
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
          font-size: 36px;
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
        .icon-heart-fill {
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
