<template>
  <div class="index-links">
    <a :href="infoList.twitter" target="_blank" rel="noopener" aria-label="twitter">
      <img src="../assets/twitter.svg" alt="">
    </a>
    <a :href="infoList.github " target="_blank" rel="noopener" aria-label="github">
      <img src="../assets/github.svg" alt="">
    </a>
    <a :href="infoList.weibo" target="_blank"  rel="noopener" aria-label="weibo">
      <img src="../assets/weibo.svg" alt="">
    </a>
    <a href="" @click.prevent="login" aria-label="login">
      <img src="../assets/user.svg" alt="">
    </a>
    <a href="" @click.prevent="prompt" aria-label="prompt" v-if="prompt_fn">
      <img src="../assets/trigger.png" alt="">
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
export default{
  name: 'BlogLinks',
  props: ['infoList'],
  data: () => ({
    prompt_fn: null,
  }),
  methods: {
    login () {
      this.$emit('openDialog')
    },
    prompt() {
      if (!this.prompt_fn) return
      this.prompt_fn.prompt()
      this.prompt_fn.userChoice.then(function(choice) {
        alert(choice.outcome)
      })
      this.prompt_fn = null
    }
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      this.prompt_fn = e
      e.preventDefault()
      return false
    })
  },
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


