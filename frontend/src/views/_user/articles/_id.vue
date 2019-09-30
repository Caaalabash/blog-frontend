<template>
  <div class="blog-content" v-loading="!visible">
    <!-- 文章内容区域 -->
    <article class="article">
      <h1 class="title" @click="$router.push('/')">{{ idea.blogTitle }}</h1>
      <div class="markdown-body" v-marked="idea.blogContent"></div>
    </article>
    <!-- 翻页 -->
    <div class="turn-page prev" @click="turnTo(idea.lastBlogDate)" v-show="idea.lastBlogDate">
      <i class="iconfont icon-left"></i>
    </div>
    <div class="turn-page next" @click="turnTo(idea.nextBlogDate)" v-show="idea.nextBlogDate">
      <i class="iconfont icon-right"></i>
    </div>
    <!-- 评论区域 -->
    <div id="comments"></div>
  </div>
</template>

<script>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

export default {
  props: ['id', 'user'],
  data: () => ({
    visible: false,
    idea: {},
  }),
  watch: {
    id: 'getIdea'
  },
  created() {
    this.getIdea()
  },
  methods: {
    async getIdea() {
      this.visible = false
      const articleResp = await this.$api.getIdea({ userName: this.user, blogDate: this.id })
      this.idea = articleResp.data
      this.visible = true
      this.initGitalk()
    },
    initGitalk() {
      const gitalk = new Gitalk({
        id: this.idea.blogDate,
        owner: 'Caaalabash',
        admin: ['Caaalabash'],
        repo: 'blog-comment-database',
        clientID: '6da65a95a5a6ffe0a6f5',
        clientSecret: 'd4dc4e5882e7abbe86d40e953e4fdf3f8a3c5935',
        distractionFreeMode: false
      })
      gitalk.render('comments')
    },
    turnTo(value) {
      this.$router.push(`${value}`)
    },
  },
}
</script>

<style lang="less" scoped>
  .blog-content {
    width: 760px;
    margin: 40px auto 80px;
    .title {
      font-size: 32px;
      font-weight: 500;
      margin: 0 0 30px;
      color: #13022c;
      text-align: center;
      line-height: 1.25;
    }
    .turn-page {
      position: fixed;
      top: 50%;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #f0f0f0;
      transform: translateY(-50%);
      cursor: pointer;
      transition: .3s width, height ease;
      .iconfont {
        line-height: 50px;
        font-size: 25px;
        color: #555;
      }
      &:hover {
        width: 56px;
        height: 56px;
        .iconfont {
          line-height: 56px;
        }
      }
    }
    .prev {
      left: -25px;
      .iconfont {
        padding-left: 50%;
        margin-left: -3px;
      }
      &:hover {
        left: -28px
      }
    }
    .next {
      right: -25px;
      .iconfont {
       padding-left: 5px;
      }
      &:hover {
        right: -28px;
      }
    }
  }
  @media (max-width: 768px) {
    .blog-content {
      width: 100%;
      margin: 20px auto 40px;
      padding: 0 24px;
      .title {
        font-size: 24px;
        margin: 0 0 20px;
      }
    }
  }
</style>






