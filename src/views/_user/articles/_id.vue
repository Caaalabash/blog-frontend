<template>
  <div class="blog-content" v-loading="!visible">
    <!-- 文章内容区域 -->
    <article class="article">
      <h1 class="title" @click="$router.push('/')">{{ idea.blogTitle }}</h1>
      <div class="article-meta">
        <span v-if="idea.blogDate">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="`#${ChineseTime}`"></use>
          </svg>
        </span>
      </div>
      <div class="markdown-body" v-marked="idea.blogContent"></div>
    </article>
    <!-- 翻页 -->
    <div class="turn-page prev" @click="turnTo(lastBlogId)" v-show="lastBlogId">
      <i class="iconfont icon-left"></i>
    </div>
    <div class="turn-page next" @click="turnTo(nextBlogId)" v-show="nextBlogId">
      <i class="iconfont icon-right"></i>
    </div>
    <!-- 评论区域 -->
    <div id="comments" v-if="visible"></div>
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
    nextBlogId: '',
    lastBlogId: '',
  }),
  computed: {
    ChineseTime() {
      const map = {
        '23': 'icon-rat_zi', '00': 'icon-rat_zi',
        '01': 'icon-ox_chou', '02': 'icon-ox_chou',
        '03': 'icon-tiger_yin', '04': 'icon-tiger_yin',
        '05': 'icon-rabbit_mao', '06': 'icon-rabbit_mao',
        '07': 'icon-dragon_chen', '08': 'icon-dragon_chen',
        '09': 'icon-snake_si', '10': 'icon-snake_si',
        '11': 'icon-horse_wu', '12': 'icon-horse_wu',
        '13': 'icon-goat_wei', '14': 'icon-goat_wei',
        '15': 'icon-monkey_shen', '16': 'icon-monkey_shen',
        '17': 'icon-rooster_you', '18': 'icon-rooster_you',
        '19': 'icon-dog_xu', '20': 'icon-dog_xu',
        '21': 'icon-boar_hai', '22': 'icon-boar_hai'
      }
      return map[this.idea.blogDate.slice(8, 10)]
    },
  },
  watch: {
    id: 'getIdea'
  },
  created() {
    this.getIdea()
  },
  methods: {
    async getIdea() {
      this.visible = false
      const { data } = await this.$api.getIdea(this.id)
      this.idea = data
      this.nextBlogId = data.nextBlogId
      this.lastBlogId = data.lastBlogId
      this.visible = true
      this.$nextTick(() => {
        this.initGitalk()
      })
    },
    initGitalk() {
      const gitalk = new Gitalk({
        id: this.idea.blogTitle,
        owner: 'Caaalabash',
        admin: ['Caaalabash'],
        repo: 'vue-blog',
        clientID: '6da65a95a5a6ffe0a6f5',
        clientSecret: 'd4dc4e5882e7abbe86d40e953e4fdf3f8a3c5935',
        distractionFreeMode: false,
        title: this.idea.blogTitle,
        body: this.idea.blogContent
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
    .article-meta {
      display: flex;
      flex-direction: row-reverse;
      font-size: 25px;
      .icon {
        cursor: pointer;
      }
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






