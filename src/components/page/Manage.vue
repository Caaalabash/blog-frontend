<template>
  <div class="container">
    <div class="manage-container">
      <manage-side-bar :users="users" ></manage-side-bar>
      <router-view :users="users"></router-view>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop , Watch } from 'vue-property-decorator'
import { State, Action, Mutation,Getter } from "vuex-class"
import ManageSideBar from '../base/ManageSideBar.vue'

@Component({
  components:{
    "manage-side-bar":ManageSideBar
  }
})
export default class Manage extends Vue{
  @Getter users:any
}
</script>

<style>
.container{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
}
.manage-container{
  display: flex;
  width: 100%;
}
.manage-left{
  flex-basis: 200px;
  height: 100%;
  border-right: 1px solid #c9c9c9;
}
.manage-right{
  margin: 20px 0 0 50px;
  flex-basis: 700px;
}
@media screen and (max-width: 420px) {
  .manage-right{
    margin: 10px 0 0 10px;
    flex-basis: 100%;
  }
  .manage-left{
    flex-basis: 64px;
  }
}
</style>

