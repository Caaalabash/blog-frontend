<template>
  <div class="main">
    <ul>
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
    this.getCurrentBlogList({userName:this.user})
  }
}
</script>


