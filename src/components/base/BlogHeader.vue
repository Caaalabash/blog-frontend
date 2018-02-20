<template>
  <div class="header">
    <a :href="`/${user}`">{{user}}</a>
  </div>
</template>

<script>
  export default{
    name:'BlogHeader',
    props:['user','users'],
    data(){
      return{

      }
    }
  }
</script>

