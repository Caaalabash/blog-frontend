<template>
  <div class="index-main">
    <!--文章列表-->
    <ul class="list fl-column"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
      <li v-for="n in currentBlogList">
        <span class="date">{{formatDate(n.blogDate)}}</span>
        <span class="title">
          <router-link :to="'articles/'+n.blogDate" append>{{n.blogTitle}}</router-link>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDateEng} from '../lib/lib'
import { mapActions, mapMutations } from 'vuex'
export default{
  name: 'BlogBody',
  props: ['user', 'currentBlogList'],
  data () {
    return {
      busy: false,
      pgN: 1,
      pgS: 8
    }
  },
  created () {
    this.getCurrentBlogList({userName: this.user, type: 'public', pgN: 1, pgS: this.pgS})
  },
  methods: {
    ...mapActions([
      'getCurrentBlogList',
      'getMoreBlog'
    ]),
    ...mapMutations([
      'LOAD_MORE'
    ]),
    formatDate (value) {
      return formatDateEng(value)
    },
    loadMore () {
      async function getNext () {
        this.busy = true
        this.pgN++
        let res = await this.getMoreBlog({userName: this.user, type: 'public', pgN: this.pgN, pgS: this.pgS})
        res === 'gg' ? this.busy = true : this.busy = false
      }
      getNext.bind(this)()
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/style/index.less";
  .index-main{
    min-height:900px;

    .list{
      list-style-type: none;
      li {
        position:relative;
        .fl-row;
        flex-basis: 56px;
        align-content: center;
        margin: 30px 0 30px;
        border-bottom: 1px solid @indexBorderColor;

        @media (max-width: 420px){
          margin: 20px 0 20px;
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
      }
    }
  }
</style>


