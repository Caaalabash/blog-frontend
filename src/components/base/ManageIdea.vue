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
          <el-button type="danger" @click="_deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getStorage,formatDateEng} from '../../lib/lib'
  import {mapActions,mapGetters} from 'vuex'
  export default{
    name:'ManageIdea',
    data(){
      return{

      }
    },
    computed:{
      ...mapGetters([
        'users',
        'blogList'
      ])
    },
    methods:{
      ...mapActions([
        'getIdeaList',
        'deleteIdea'
      ]),
      _getIdeaList(){
        this.getIdeaList({userName:this.users.userName})
      },

      _deleteIdea(id){
        this.deleteIdea({userName:this.users.userName,blogDate:id})
      },
      changeIdea(id){
        this.$router.push({name:'new-idea',query:{blogDate:id}})
      }
    },
    created(){
      this._getIdeaList()
    }
  }
</script>

