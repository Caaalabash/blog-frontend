<template>
  <div>
    <el-table :data="blogList">
      <el-table-column
        prop="blogDate"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="blogTitle"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="blogType"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row.blogDate)">修改</el-button>
          <el-button type="danger" @click="deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getStorage,formatDateEng} from '../../lib/lib'
  import service from '../../service/apiManage'

  export default{
    name:'ManageIdea',
    data(){
      return{
        blogList:[],
        currentUser:getStorage('currentUser')
      }
    },
    methods:{
      getIdeaList(){
        let userName = this.currentUser
        service.getIdeaList({userName}).then((res)=>{
          if(res.data.errno===0){
            this.blogList = res.data.res
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
      formatDate(value){
        return formatDateEng(value)
      },
      deleteIdea(id){
        service.deleteIdea({blogDate:id,userName:this.currentUser}).then((res)=>{
          if(res.data.errno === 0){
            this.$message.success(res.data.msg)
            this.getIdeaList()
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
      changeIdea(id){
        this.$router.push({name:'new-idea',query:{blogDate:id}})
      }
    },
    created(){
      this.getIdeaList()
    }
  }
</script>

