<template>
  <div class="index-links">
    <a  :href="users.userInfo.twitter" target="_blank">
      <img src="../../assets/twitter.png" alt="">
    </a>
    <a  :href="users.userInfo.github" target="_blank">
      <img src="../../assets/github.png" alt="">
    </a>
    <a  :href="users.userInfo.weibo" target="_blank">
      <img src="../../assets/weibo.png" alt="">
    </a>
    <a href="" @click.prevent="login">
      <img src="../../assets/user.png" alt="">
    </a>
  </div>
</template>

<script lang='ts'>
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Prop , Watch } from 'vue-property-decorator'
  import { State, Action, Getter ,Mutation} from "vuex-class";
  @Component
  export default class BlogLinks extends Vue {
    //data
    //props
    @Prop({default:''})
      user:string
    @Prop({default:''})
      users:any
    //method
    login(){
      this.$emit('openDialog')
    }

  }
</script>


