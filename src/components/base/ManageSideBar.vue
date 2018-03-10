<template>
  <el-menu
    default-active="new-idea"
    class="el-menu-vertical-demo manage-left"
    :router="true"
    :collapse="isCollapse"
  >
    <el-menu-item index="new-idea">
      <i class="el-icon-edit-outline"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="ideas">
      <i class="el-icon-search"></i>
      <span slot="title">管理文章</span>
    </el-menu-item>
    <el-menu-item index="setting">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
    <el-menu-item :index="`/${users.userName}`" @click="back2index">
      <i class="el-icon-back"></i>
      <span  slot="title">返回首页</span>
    </el-menu-item>
    <el-menu-item index="/" @click="logout">
      <i class="el-icon-close"></i>
      <span  slot="title">退出登录</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop , Watch } from 'vue-property-decorator'
import { State, Action, Getter ,Mutation} from "vuex-class";
@Component
export default class ManageSideBar extends Vue{
  //prop
  @Prop()
    users:any
  //data
    isCollapse=window.innerWidth<420
  //mutation
  @Mutation LOG_OUT:any
  @Mutation BACK_INDEX:any
  //method
  back2index(){
     this.$router.push('/')
  }
  logout(){
    this.LOG_OUT()
     this.$router.push('/')
  }
  handleResize(){
    this.isCollapse = window.innerWidth<420
  }
  mounted(){
    window.addEventListener('resize', this.handleResize)
  }
  beforeDestroy(){
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style>
  .manage-left{
    height: 100%;
    border-right: 1px solid #c9c9c9;
  }
</style>
