<template>
  <div class="blog-content"
       v-loading.fullscreen.lock="fullScreenLoading"
       v-touch="{
         left: () => openOtherBlogs(idea.lastBlogDate),
         right: () => openOtherBlogs(idea.nextBlogDate)
       }"
  >
    <!--文章内容区域-->
    <article class="article">
      <h1 class="title">{{ idea.blogTitle }}</h1>
      <h3 class="date" >{{ idea.blogDate | formatDateEng }}&nbsp;&nbsp;&nbsp;&nbsp;浏览次数:{{ idea.count }}次</h3>
      <div class="markdown-body" v-html="compiledMarkdown" @click="scaleImg($event)"></div>
      <!--评论区域-->
      <Comment
        :commentList="commentList"
        :blogDate="idea.blogDate"
        :user="user"
        :blogTitle="idea.blogTitle"
        :likeCount.sync="idea.likeCount"
        @commitSuccess="getComment"
      >
      </Comment>
    </article>
    <!--翻页按钮-->
    <a class="nav prev" @click.prevent="openOtherBlogs(idea.lastBlogDate)"><i class="iconfont iconleft"></i>上一篇</a>
    <a class="nav next" @click.prevent="openOtherBlogs(idea.nextBlogDate)">下一篇<i class="iconfont iconright"></i></a>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDateEng } from '../lib/lib'
import Comment from './Comment.vue'

export default{
  props: ['id', 'user'],
  components: {
    Comment
  },
  data: () => ({
    commentList: [],
    fullScreenLoading:false,
    idea: {},
  }),
  computed: {
    compiledMarkdown() {
      if (!marked || !this.idea.blogContent) return ''
      return marked(this.idea.blogContent, { sanitize: true })
    },
  },
  filters: {
    formatDateEng,
  },
  watch: {
    '$route': 'getIdea'
  },
  methods: {
    getIdea() {
      this.fullScreenLoading = true
      this.$api.getIdea({ userName: this.user, blogDate: this.id }).then(res=>{
        this.idea = res.res
        this.fullScreenLoading = false
        this.getComment()
      })
    },
    getComment(){
      this.$api.getComment({ blogDate: this.id, userName: this.user }).then(res => {
        this.commentList = res.res
      })
    },
    openOtherBlogs(value) {
      if (value && value !== '0') {
        this.$router.push(`${value}`)
      } else {
        this.$message.info('没有啦！')
      }
    },
  },
  created () {
    this.getIdea()
  },
}
</script>

<style lang="less" scoped>
  .blog-content {
    position: relative;
    padding-top: 20px;
    .article {
      position: relative;
      border-bottom: 1px solid #e6e6e6;
      .title {
        margin-bottom: 45px;
        font-size: 32px;
        letter-spacing: 1px;
      }
      .date {
        margin: 0 0 30px;
        font-size: 14px;
        color: #999;
        letter-spacing: 1px;
      }
      .markdown-body {
        box-sizing: border-box;
        padding: 45px 15px;
      }
    }
    .nav {
      position: fixed;
      display: inline-flex;
      align-items: center;
      bottom: 20px;
      height: 20px;
      line-height: 20px;
      color: #666;
      text-decoration: none;
      cursor: pointer;
      letter-spacing: 1px;
      border-bottom: 3px solid transparent;
      &:hover{
        color: #333;
        border-bottom-color: #333;
      }
    }
    .prev {
      left: 40px;
    }
    .next {
      right: 40px;
    }
  }
  @media (max-width: 950px) {
    .blog-content {
      .nav {
        position: static;
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 30px;
      }
      .next {
        float: right;
      }
    }
  }
  @media (max-width: 768px) {
    .blog-content {
      padding-top: 20px;
      .article {
        .title {
          margin-bottom: 25px;
          font-size: 25px;
        }
        .date {
          margin-bottom: 15px;
          font-size: 12px;
        }
        .markdown-body {
          padding: 15px;
        }
      }
    }
  }
</style>






