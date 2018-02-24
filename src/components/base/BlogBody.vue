<template>
  <div class="main">
    <ul id="content_list">
      <li v-for="n in currentBlogList">
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
import { mapActions ,mapGetters} from 'vuex'
export default{
  name:'BlogBody',
  props:['user','users'],
  data(){
    return{

    }
  },
  computed:{
    ...mapGetters([
      'currentBlogList'
    ])
  },
  methods:{
    ...mapActions([
      'getCurrentBlogList'
    ]),

    formatDate(value){
      return formatDateEng(value)
    }
  },
  created(){
    this.getCurrentBlogList({userName:this.user,type:'public',currentPage:1})
  }
}
</script>

<style scoped>
  .main ul {
    list-style-type: none;
    padding-top: 4px;
  }
  .main ul li {
    position: relative;
    padding: 30px 0 30px;
    border-bottom: 1px solid #e6e6e6;
  }
  .main ul li:first-child {
    margin-top: -30px;
  }
  .main h2,
  .main h3 {
    letter-spacing: 1px;
    margin: 0;
    text-transform: uppercase;
  }
  .main h2 {
    font-size: 20px;
    letter-spacing: 1px;
    margin-left: 120px;
  }
  .main h2 a {
    color: #444;
  }
  .main h2 a:hover {
    color: #f33;
  }
  .main h3 {
    font-size: 13px;
    color: #999;
    position: absolute;
    left: 0;
    top: 34px;
  }
  @media screen and (max-width: 420px) {
    .main h2 {
      font-size: 16px;
      margin-left: 0;
    }
    .main h2 a:hover {
      color: #f66;
    }
    .main h3 {
      font-size: 11px;
      position: static;
      margin-bottom: 10px;
    }
    .main ul li {
      padding: 18px 0 20px;
    }
    .main ul li:first-child {
      margin-top: -35px;
    }
  }
</style>


