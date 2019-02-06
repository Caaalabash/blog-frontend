<template>
  <div class="blog-list">
    <!-- 文章列表 -->
    <ul class="list fl-column">
      <!-- 置顶文章 -->
      <li v-for="n in stickyBlog" :key="n.blogDate">
        <span class="date">{{ n.blogDate | formatDateEng }}</span>
        <span class="title">
          <router-link :to="`articles/${n.blogDate}`" append>{{ n.blogTitle }}</router-link>
        </span>
        <span class="sticky">[置顶]</span>
      </li>
      <!-- 普通文章 -->
      <li v-for="n in normalBlog" :key="n.blogDate">
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
    stickyBlog: [],
    normalBlog: [],
  }),
  watch: {
    user: 'initBlogList'
  },
  filters: {
    formatDateEng
  },
  methods: {
    initBlogList() {
      this.$api.getIdeaList({ userName: this.user, type: 'sticky', pgN: 1, pgS: this.stickyPgS }).then(res => {
        this.stickyBlog = res.res
      })
      this.$api.getIdeaList({ userName: this.user, type: 'public', pgN: 1, pgS: this.pgS }).then(res => {
        if(res.res.length){
          this.normalBlog = res.res
        }
        else{
          this.$router.push('/Calabash')
        }
      })
    },
    async loadMore () {
      if (this.busy) {
        this.$message.info('没有更多啦!')
        return false
      }
      const res = await this.$api.getIdeaList({ userName: this.user, type: 'public', pgN: this.pgN++, pgS: this.pgS })
      this.normalBlog = [...this.normalBlog, ...res.res]
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
  @import "../assets/style/index.less";
  .blog-list{
    min-height:900px;
    .list{
      list-style-type: none;
      padding-left: 0;
      li {
        position:relative;
        .fl-row;
        flex-basis: 56px;
        align-content: center;
        margin: 30px 0 30px;
        border-bottom: 1px solid @indexBorderColor;

        @media (max-width: 420px){
          margin: 20px 10px 20px 10px;
        }
        &::before{
          position:absolute;
          content:'';
          left:0;
          bottom:0;
          width: 100%;
          height: 2px;
          background-color: @indexFontColor;
          transform-origin: 100% 0;
          transform:scaleX(0);
          transition: transform .5s;
        }
        &:hover::before{
          transform-origin: 0 0;
          transform:scaleX(1);
        }
      }
    }
    .date{
      white-space: nowrap;
      line-height: 56px;
      font-size: @timeFont;
      color: #999;
    }
    .title{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 56px;
      margin-left: 30px;
      font-size: 20px;
      letter-spacing: 1px;
      color: @indexDateColor;
      @media (max-width: 420px){
        font-size: 14px;
      }
    }
    .sticky {
      line-height: 56px;
      margin-left: auto;
      @media (max-width: 420px){
        font-size: 14px;
      }
    }
    .observer {
      min-height: 1px;
    }
  }
</style>


