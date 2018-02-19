<template>
  <div class="header">
    <a :href="`/${users.userName}`">{{users.userName}}</a>
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

