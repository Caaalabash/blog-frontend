<template>
  <div class="index-main">
    <div class="post">
      <h1>{{idea.blogTitle}}</h1>
      <h3 class="date" v-text="formatDate"></h3>
      <div v-html="compiledMarkdown" class="content"></div>
    </div>
    <div class="operator">
      <a id="newer" class="blog-nav" @click.prevent="openOtherBlogs(idea.lastBlogDate)">&nbsp;&lt;上一篇</a>
      <a id="older" class="blog-nav" @click.prevent="openOtherBlogs(idea.nextBlogDate)">下一篇&nbsp;&gt;</a>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop , Watch } from 'vue-property-decorator'
import { State, Action, Getter } from "vuex-class"
import {formatDateEng} from '../../lib/lib.js'
import marked from 'marked'

@Component
export default class BlogArticle extends Vue{
  //data
  idea = {
      blogTitle:'',
      blogContent:'',
      blogDate:'',
      nextBlogDate:'',
      lastBlogDate:''
  }
  //prop
  @Prop({default:''})
    id:string
  @Prop({default:''})
    user:string
  @Prop({default:''})
    users:any
  //store
  @Getter currentBlogList:any
  //computed
  get compiledMarkdown():string{
    return marked(this.idea.blogContent, { sanitize: true })
  }
  get formatDate():string{
  return formatDateEng(this.idea.blogDate)
  }
  //methods

  hasSiblings(arr:any):any{
    return (index:any)=>(property:any)=>arr[index]?arr[index][property]:'0'
  }
  openOtherBlogs(value:string){
    if(value && value !=='0'){
      this.$router.push(`${value}`)
    }else{
      this.$message.info('没有啦宝贝')
    }
  }
  getIdea():void{
    this.currentBlogList.forEach((item:any,index:any,arr:any)=>{
        if(this.id === item.blogDate){
        this.idea = Object.assign({},item,{nextBlogDate:this.hasSiblings(arr)(index+1)('blogDate'),lastBlogDate:this.hasSiblings(arr)(index-1)('blogDate')})
        }
    })
  }
  //watch
  @Watch('$route')
    _getArticle(){
      this.getIdea()
    }
  //hooks
  created(){
    this.getIdea()
  }

}
</script>

<style>
  .blog-nav {
    position: fixed;
    bottom: 20px;
    height: 20px;
    line-height: 20px;
    font-family: "Montserrat", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro", Arial, sans-serif;
    font-size: 15px;
    color: #999;
    text-decoration: none;
    cursor: pointer;
    letter-spacing: 1px;
    border-bottom: 3px solid transparent;
  }
  .blog-nav:hover {
    color: #333;
    border-bottom-color: #333;
  }
  #newer {
    left: 40px;
  }
  #older {
    right: 40px;
  }
  @media screen and (max-width: 950px) {
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
    .operator{
      position: relative;
      height: 60px;
    }
  }
</style>






