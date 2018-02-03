<template>
  <div class="main">
    <div class="post">
      <h1>{{idea.blogTitle}}</h1>
      <h3 class="date" v-text="formatDate"></h3>
      <div v-html="compiledMarkdown" class="content"></div>
      <a id="newer" class="blog-nav" @click.prevent="openOtherBlogs(idea.lastBlogDate)">&nbsp;&lt;上一篇</a>
      <a id="older" class="blog-nav" @click.prevent="openOtherBlogs(idea.nextBlogDate)">下一篇&nbsp;&gt;</a>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import service from '../../service/apiManage'
  import {formatDateEng,getStorage} from '../../lib/lib'
  export default{
    props:['id','user'],
    data(){
      return{
        idea:{
          blogTitle:'',
          blogContent:'',
          blogDate:'',
          nextBlogDate:'',
          lastBlogDate:''
        },
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getIdea'
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.idea.blogContent, { sanitize: true })
      },
      formatDate(){
        return formatDateEng(this.idea.blogDate)
      }
    },
    methods: {
      getIdea(){
        service.getIdea({'blogDate':this.id,'userName':this.user}).then((res)=>{
          if(res.data.errno===0){
            this.idea = res.data.res
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
      openOtherBlogs(value){
        if(value && value!=='0'){
          this.$router.push(`${value}`)
        }else{
          this.$message.info('没有啦！')
        }
      }
    },
    created(){
      this.getIdea()
    }
  }
</script>


