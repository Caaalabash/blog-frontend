<template>
  <div class="main">
    <ul>
      <li v-for="n in blogList">
        <h3>{{formatDate(n.blogDate)}}</h3>
        <h2>
          <router-link :to="'articles/'+n.blogDate" append>{{n.blogTitle}}</router-link>
        </h2>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {getStorage,formatDateEng} from '../../lib/lib'
import service from '../../service/apiManage'

export default{
  name:'BlogBody',
  props:{
    user:{
      default:'Calabash'
    }
  },
  data(){
    return{
      blogList:[]
    }
  },
  methods:{
    getIdeaList(){
      let userName = this.user
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
    }
  },
  created(){
    this.getIdeaList()
  }
}
</script>


