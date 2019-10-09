<template>
  <div class="blog-container">
    <!-- 头部 -->
    <div class="header">
      <div class="header-meta">
        <a href="/"><img class="avatar" src="@/assets/img/avatar.jpg" alt="avatar"></a>
        <div class="info">
          <h3 class="title">blog.calabash.top</h3>
          <div class="text">How are you?</div>
        </div>
      </div>
    </div>
    <!-- 文章列表 -->
    <ul class="list">
      <template v-for="year in Object.keys(articleListGroupByYear).sort((a, b) => b - a)">
        <li class="list-item list-item-year">
          <span class="text">{{ year }}</span>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="`#icon-${getYearOf(year)}`"></use>
          </svg>
        </li>
        <li class="list-item" v-for="blog in articleListGroupByYear[year]" :key="blog.blogDate">
          <router-link class="title" :to="`articles/${blog.blogDate}`" append>{{ blog.blogTitle }}</router-link>
        </li>
      </template>
    </ul>
    <!-- 滚动加载器 -->
    <div class="observer" v-observer="handleObserver" v-if="blogList.length"></div>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  props: ['user'],
  data: () => ({
    pgN: 1,
    pgS: 8,
    canLoadMore: true,
    blogList: [],
  }),
  computed: {
    articleListGroupByYear() {
      return this.blogList.sort((a, b) => b.blogDate - a.blogDate).reduce((acc, item) => {
        const year = item.blogDate.slice(0, 4)
        if (!acc[year]) acc[year] = []
        acc[year].push(item)
        return acc
      }, {})
    },
  },
  watch: {
    user: 'loadArticle'
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle() {
      if (!this.canLoadMore) return

      const blogListResp = await this.$api.getIdeaList({ userName: this.user, type: 'public', pgN: this.pgN++, pgS: this.pgS })
      this.blogList = this.blogList.concat(blogListResp.data)
      if (blogListResp.data.length < this.pgS) this.canLoadMore = false
    },
    handleObserver(el, status) {
      status && this.loadArticle()
    },
    getYearOf(year) {
      const index = (year - 1984) % 12
      return ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'boar'][index]
    }
  },
}
</script>

<style scoped lang="less">
  .blog-container {
    width: 500px;
    margin: 40px auto 80px;
    border-left: 4px solid #f9f9f9;
    .header {
      margin-bottom: 30px;
    }
    .header-meta {
      margin-left: -30px;
      display: flex;
      a {
        display: inline-block;
        width: 60px;
        height: 60px;
      }
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        &:hover {
          transform: rotate(666turn);
          transition-delay: 1s;
          transition-property: all;
          transition-duration: 59s;
          transition-timing-function: cubic-bezier(.34,0,.84,1);
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10px;
      }
      .title {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: #000;
      }
      .text {
        color: #999;
      }
    }
    .list {
      line-height: 2.8em;
      padding: 0;
      list-style: none;
      .list-item {
        position: relative;
        padding-left: 20px;
        &::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 50%;
          width: 8px;
          height: 8px;
          transform: translateY(-50%);
          border-radius: 50%;
          background-color: #ddd;
        }
        .text {
          margin-right: 10px;
        }
        .title {
          display: inline-block;
          font-size: 18px;
          font-weight: 400;
          color: #13022c;
          max-width: 430px;
          overflow: hidden;
          border-bottom: 4px solid #f7f7f7;
          line-height: 30px;
          margin-top: 20px;
          cursor: pointer;
          transition: .3s color ease;
          font-family: Poppins,sans-serif;
          &:hover {
            color: #1abc9c;
          }
        }
      }
      .list-item-year {
        font-size: 20px;
        font-weight: 700;
        color: #222;
        &::before {
          left: -7px;
          width: 10px;
          height: 10px;
          background-color: #e74c3c;
        }
      }
    }
    .observer {
      min-height: 1px;
    }
  }
  @media (max-width: 768px) {
    .blog-container {
      margin-left: 30px;
      width: 344px;
    }
    .list-item {
      padding-right: 5px;
    }
  }
</style>