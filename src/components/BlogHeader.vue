<template>
  <div class="index-header">
    <a :href="`/${user}`">{{user}}</a>
  </div>
</template>

<script>
export default{
  name: 'BlogHeader',
  props: ['user']
}
</script>

<style scoped lang="less">
  .index-header{
    margin-top: 50px;
    letter-spacing: 5px;
    cursor: pointer;
    text-align: center;
    font-weight: 400;
  }
</style>

