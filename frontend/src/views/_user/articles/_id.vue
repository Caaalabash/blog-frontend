<template>
  <div class="blog-content" v-loading="fullScreenLoading">
    <!--文章内容区域-->
    <article class="article">
      <h1 class="title">{{ idea.blogTitle }}</h1>
      <h3 class="date" >{{ idea.blogDate | formatDateEng }}&nbsp;&nbsp;&nbsp;&nbsp;浏览次数:{{ idea.count }}次</h3>
      <div class="markdown-body" v-html="compiledMarkdown"></div>
      <!--评论区域-->
      <Comment
        :commentList="commentList"
        :blogDate="idea.blogDate"
        :user="user"
        :blogTitle="idea.blogTitle"
        :likeCount.sync="idea.likeCount"
        @commitSuccess="getComment"
      />
    </article>
    <!--翻页按钮-->
    <a class="nav prev" @click.prevent="openOtherBlogs(idea.lastBlogDate)"><i class="iconfont icon-left"></i>上一篇</a>
    <a class="nav next" @click.prevent="openOtherBlogs(idea.nextBlogDate)">下一篇<i class="iconfont icon-right"></i></a>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDateEng } from '@/lib/lib'
import Comment from '@/components/Comment.vue'

export default{
  props: ['id', 'user'],
  components: {
    Comment
  },
  data: () => ({
    commentList: [],
    fullScreenLoading: false,
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
  created() {
    this.getIdea()
  },
  methods: {
    getIdea() {
      this.fullScreenLoading = true
      this.$api.getIdea({ userName: this.user, blogDate: this.id }).then(res => {
        this.idea = res.data
        this.fullScreenLoading = false
        this.getComment()
      })
    },
    getComment() {
      this.$api.getComment({ blogDate: this.id, userName: this.user }).then(res => {
        this.commentList = res.data
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
}
</script>

<style lang="less" scoped>
  .blog-content {
    box-sizing: border-box;
    position: relative;
    padding: 20px 12px;
    min-height: calc(100vh - 82px);
    background-color: #fff;
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
      bottom: 20px;
      display: inline-flex;
      align-items: center;
      height: 25px;
      line-height: 25px;
      color: #fff;
      opacity: .7;
      text-decoration: none;
      cursor: pointer;
      letter-spacing: 1px;
      border-bottom: 2px solid transparent;
      transition: opacity .2s, border-bottom-color .5s;
      &:hover{
        opacity: 1;
        border-bottom-color: #fff;
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
        color: #333;
      }
      .next {
        float: right;
      }
    }
  }
  @media (max-width: 768px) {
    .blog-content {
      min-height: calc(100vh - 68px);
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






