<template>
  <div class="index-main"
       v-loading.fullscreen.lock="fullScreenLoading"
       v-touch="{
         left: () => openOtherBlogs(idea.lastBlogDate),
         right: () => openOtherBlogs(idea.nextBlogDate)
       }"
  >
    <!--文章内容区域-->
    <div class="post">
      <h1>{{idea.blogTitle}}</h1>
      <h3 class="date" >{{formatDate}}&nbsp;&nbsp;&nbsp;&nbsp;浏览次数:{{idea.count}}次</h3>
      <div v-html="compiledMarkdown" class="markdown-body" @click="scaleImg($event)"></div>
      <!--评论区域-->
      <Comment
        :commentList="commentList"
        :blogDate="idea.blogDate"
        :user="user"
        :currentUser="userName"
        :blogTitle="idea.blogTitle"
        :likeCount.sync="idea.likeCount"
        @commitSuccess="getComment"
      >
      </Comment>
    </div>
    <!--翻页按钮-->
    <div class="operator">
      <a id="newer" class="blog-nav" @click.prevent="openOtherBlogs(idea.lastBlogDate)">&nbsp;&lt;上一篇</a>
      <a id="older" class="blog-nav" @click.prevent="openOtherBlogs(idea.nextBlogDate)">下一篇&nbsp;&gt;</a>
    </div>
    <!--图片查看遮罩-->
    <el-dialog :visible.sync="dialogVisble"
               custom-class="fake">
      <img :src="dialogSrc" alt="" class="dialogSrc">
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters} from 'vuex'
import {formatDateEng} from '../lib/lib'
import Comment from './Comment.vue'
export default{
  props: ['id', 'user', 'currentBlogList'],
  components: {
    Comment
  },
  data () {
    return {
      dialogVisble: false,
      dialogSrc: '',
      commentList: [],
      fullScreenLoading:false
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.idea.blogContent, { sanitize: true })
    },
    formatDate () {
      return formatDateEng(this.idea.blogDate)
    },
    ...mapGetters({
      idea:'currentBlog',
      userName:'userName'
    })
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': '_getIdea'
  },
  created () {
    this._getIdea()
  },
  methods: {
    ...mapActions([
      'getCurrentBlogList',
      'getIdea'
    ]),
    _getIdea () {
      this.fullScreenLoading = true
      this.getIdea({userName: this.user, blogDate: this.id}).then(()=>{
        this.fullScreenLoading = false
      })
      this.getComment()
    },
    getComment(){
      this.$api.getComment({blogDate:this.id,userName:this.user}).then(res=>{
        if(res.errno===0){
          this.commentList = res.res
        }
      })
    },
    openOtherBlogs (value) {
      if (value && value !== '0') {
        this.$router.push(`${value}`)
      } else {
        this.$message.info('没有啦！')
      }
    },
    scaleImg (e) {
      if (e.target.src) {
        this.dialogSrc = e.target.src
        this.dialogVisble = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/style/index.less";

  .index-main{
    margin-top: 20px;
    @media (max-width: 700px) {
      margin: 10px;
    }
    @media (max-width:420px){
      margin: 32px 0 0 0;
    }
    .post{
      position: relative;
      padding: 15px;
      border-bottom: 1px solid #e6e6e6;

      h1{
        font-size: 32px;
        margin: 0 0 45px;
        letter-spacing: 1px;
      }
      .date{
        font-size: @timeFont;
        color: #999;
        margin: 0 0 30px;
        letter-spacing: 1px;
      }
      .markdown-body{
        max-width: 700px;
        box-sizing: border-box;
        padding: 45px;

        @media (max-width: 767px){
          padding: 15px;
        }
      }
      @media (max-width: 420px){
        h1{
          font-size: 24px;
          margin: 0 0 30px;
        }
        h3{
          font-size: 12px;
          margin: 0 0 20px;
        }
      }
    }
    .operator{
      .blog-nav{
        position: fixed;
        bottom: 20px;
        height: 20px;
        line-height: 20px;
        color: @indexDateColor;
        text-decoration: none;
        cursor: pointer;
        letter-spacing: 1px;
        border-bottom: 3px solid transparent;
        &:hover{
          color: @blackColor;
          border-bottom-color: @blackColor;
        }
      }
      #newer{
        left:40px;
      }
      #older{
        right:40px;
      }
      @media (max-width:420px){
        .blog-nav {
          font-size: 14px;
        }
      }
      @media (max-width:950px){
        position: relative;
        height: 60px;

        .blog-nav {
          position: absolute;
          bottom: 30px;
        }
        #newer {
          left: 0;
        }
        #older {
          right: 0;
        }
      }
    }
  }
</style>






