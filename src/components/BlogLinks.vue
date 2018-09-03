<template>
  <div class="index-links">
    <a  :href="infoList.twitter" target="_blank">
      <img src="../assets/twitter.svg" alt="">
    </a>
    <a  :href="infoList.github " target="_blank">
      <img src="../assets/github.svg" alt="">
    </a>
    <a  :href="infoList.weibo" target="_blank">
      <img src="../assets/weibo.svg" alt="">
    </a>
    <a href="" @click.prevent="login">
      <img src="../assets/user.svg" alt="">
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
export default{
  name: 'BlogLinks',
  props: ['infoList'],
  methods: {
    login () {
      this.$emit('openDialog')
    }
  }

}
</script>

<style lang="less" scoped>
  .index-links{
    margin-top: 20px;
    text-align: center;

    a{
      cursor: pointer;
      margin: 0 5px;

      img{
        width: 15px;
        height: 15px;
      }
    }
  }
</style>


