<template>
  <div class="manage-right">
    <el-table :data="blogList">
      <el-table-column type="expand" v-if="isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row.blogDate)">修改</el-button>
          <el-button type="danger" @click="_deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="blogDate"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="blogTitle"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="blogType"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作"
        v-if="!isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row.blogDate)">修改</el-button>
          <el-button type="danger" @click="_deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right;margin-top: 5vh"
      layout="prev, pager, next"
      :total="50"
      @current-change="_changePage">
    </el-pagination>
  </div>
</template>

<script lang='ts'>
  import Vue from "vue";
  import Component from "vue-class-component";
  import { Prop , Watch } from 'vue-property-decorator'
  import { State, Action, Getter ,Mutation} from "vuex-class";
  import {formatDateEng} from '../../lib/lib'
  
  @Component
  export default class ManageIdea extends Vue{
    //data
    isShow=window.innerWidth<420
    currentPage=2
    //props
    @Prop()
      users:any
    //state
    @Getter blogList:any
    @Action getIdeaList:any
    @Action deleteIdea:any
    //methods
    _changePage(currentPage :any){
      this.getIdeaList({userName:this.users.userName,type:'all',currentPage})
    }
    _getIdeaList(){
      this.getIdeaList({userName:this.users.userName,type:'all'})
    }
    _deleteIdea(id:any){
      this.deleteIdea({userName:this.users.userName,blogDate:id})
    }
    changeIdea(id:any){
      this.$router.push({name:'new-idea',query:{blogDate:id}})
    }
    handleResize(){
      this.isShow = window.innerWidth<420
      console.log(window.innerWidth)
    }
    mounted(){
      window.addEventListener('resize', this.handleResize)
    }
    beforeDestroy(){
      window.removeEventListener('resize', this.handleResize)
    }
    created(){
      this._getIdeaList()
    }
  }
</script>

