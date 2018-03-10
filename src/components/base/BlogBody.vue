<template>
  <div class="index-main">
    <ul class="list">
      <li v-for="(n,i) in currentBlogList" :key=i>
        <span class="date">{{formatDate(n.blogDate)}}</span>
        <span class="title">
          <router-link :to="'articles/'+n.blogDate" append>{{n.blogTitle}}</router-link>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop , Watch } from 'vue-property-decorator'
import { State, Action, Getter ,Mutation} from "vuex-class";
import {getStorage,formatDateEng} from '../../lib/lib'
import mutations from '../../store/mutations';

@Component
export default class BlogBody extends Vue{
  //data
  //props
  @Prop({default:''})
    user:string
  @Prop({default:''})
    users:any
  //state
  @Getter currentBlogList:any

  @Action getCurrentBlogList:any
  //methods
  formatDate(value:string){
      return formatDateEng(value)
  }
  //watch
  //hooks
  created(){
    this.getCurrentBlogList({userName:this.user,type:'public',currentPage:1})
  }
}
</script>

<style scoped>
  .list{
    display: flex;
    flex-direction: column;
    list-style-type: none;
  }
  .list>li {
    display: flex;
    flex-basis: 56px;
    flex-direction: row;
    align-content: center;
    margin: 30px 0 30px;
    border-bottom: 1px solid #e6e6e6;
  }
  .date{
    line-height: 56px;
    font-size: 13px;
    color: #999;
  }
  .title{
    line-height: 56px;
    margin-left: 30px;
    font-size: 20px;
    letter-spacing: 1px;
    color: #444;
  }
  .title:hover{
    color: #f33;
  }
  /*@media screen and (max-width: 420px) {
    .list>li{
      margin: 20px 0 20px;
    }
  }*/
</style>


