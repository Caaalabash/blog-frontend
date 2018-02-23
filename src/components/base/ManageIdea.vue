<template>
  <div>
    <el-table :data="blogList">
      <el-table-column type="expand" v-show="isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row.blogDate)">修改</el-button>
          <el-button type="danger" @click="_deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="blogDate"
        label="日期"
       >
      </el-table-column>
      <el-table-column

        prop="blogTitle"
        label="标题"
        >
      </el-table-column>
      <el-table-column

        prop="blogType"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作" v-show="!isShow">
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
    props:['users'],
    data(){
      return{
        isShow:window.innerWidth<400
      }
    },
    computed:{
      ...mapGetters([
        'blogList'
      ])
    },
    methods:{
      ...mapActions([
        'getIdeaList',
        'deleteIdea'
      ]),
      _getIdeaList(){
        this.getIdeaList({userName:this.users.userName,type:'all'})
      },

      _deleteIdea(id){
        this.deleteIdea({userName:this.users.userName,blogDate:id})
      },
      changeIdea(id){
        this.$router.push({name:'new-idea',query:{blogDate:id}})
      },
      handleResize(){
        this.isShow = window.innerWidth<400
      }
    },
    mounted(){
      window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy(){
      window.removeEventListener('resize', this.handleResize)
    },
    created(){
      this._getIdeaList()
    }
  }
</script>

<style scoped>

</style>
