<template>
  <div class="blog-list">
    <!-- 文章列表 -->
    <ul class="list" v-for="page in pgN" :key="page">
      <li class="list-item" v-for="n in getCurrentArticleList(page)" :key="n.blogDate">
        <span class="date">{{ n.blogDate | formatDateEng }}</span>
        <span class="title">
          <router-link :to="`articles/${n.blogDate}`" append>{{ n.blogTitle }}</router-link>
        </span>
      </li>
    </ul>
    <!-- 滚动加载器 -->
    <div class="observer" v-observer="handleObserver"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDateEng } from '../lib/lib'

export default{
  name: 'BlogBody',
  props: ['user'],
  data: () => ({
    busy: false,
    pgN: 1,
    pgS: 8,
    stickyPgS: 3,
    blogList: [],
  }),
  watch: {
    user: 'initBlogList'
  },
  filters: {
    formatDateEng
  },
  methods: {
    getCurrentArticleList(page) {
      return this.blogList.slice((page - 1) * this.pgS, page * this.pgS)
    },
    async initBlogList() {
      const [stickyBlogResp, publicBlogResp] = await Promise.all([
        this.$api.getIdeaList({ userName: this.user, type: 'sticky', pgN: 1, pgS: this.stickyPgS }),
        this.$api.getIdeaList({ userName: this.user, type: 'public', pgN: 1, pgS: this.pgS })
      ])
      if (stickyBlogResp.res && publicBlogResp.res) {
        this.blogList = this.blogList.concat(stickyBlogResp.res, publicBlogResp.res)
      }
      if (!this.blogList.length) this.$router.push('/Calabash')
    },
    async loadMore () {
      if (this.busy) {
        this.$message.info('没有更多啦!')
        return false
      }
      const res = await this.$api.getIdeaList({ userName: this.user, type: 'public', pgN: ++this.pgN, pgS: this.pgS })
      this.blogList = this.blogList.concat(res.res)
      this.busy = (res.res.length < this.pgS)
    },
    handleObserver(el, status) {
      status && this.loadMore()
    }
  },
  created () {
    this.initBlogList()
  },
}
</script>

<style scoped lang="less">
  .blog-list {
    .list {
      display: flex;
      flex-direction: column;
      list-style-type: none;
      margin: 0;
      padding: 20px 24px 0;
      background-color: #fff;
      &:not(:last-of-type) {
        margin-bottom: 15px;
      }
    }
    .list-item {
      position: relative;
      display: flex;
      align-content: center;
      margin: 30px 0;
      border-bottom: 1px solid rgba(6, 8, 40, .08);
      &::before {
        position:absolute;
        content:'';
        left:0;
        bottom:0;
        width: 100%;
        height: 2px;
        background-color: #666;
        transform-origin: 100% 0;
        transform:scaleX(0);
        transition: transform .5s;
      }
      &:hover::before {
        transform-origin: 0 0;
        transform:scaleX(1);
      }
      .date,
      .title,
      .sticky {
        line-height: 56px;
      }
      .date {
        margin-right: 30px;
        font-size: 14px;
        color: #999;
        flex-shrink: 0;
      }
      .title {
        font-size: 20px;
        letter-spacing: 1px;
        color: #444;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .sticky {
        margin-left: auto;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
    .observer {
      min-height: 1px;
    }
  }
  @media (max-width: 768px) {
    .blog-list {
      .list-item {
        margin: 20px 0;
        .date {
          font-size: 12px;
        }
        .title {
          font-size: 16px;
        }
        .sticky {
          font-size: 12px;
        }
      }
    }
  }

</style>


