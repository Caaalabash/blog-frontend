<template>
  <div class="blog-header">
    <!-- 用户名称 -->
    <a class="blog-header-name" :href="`/${user}`">{{ user }}</a>
    <!-- 外部链接 -->
    <div class="blog-header-links">
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
        <img src="../assets/plane.svg" alt="">
      </a>
    </div>
  </div>
</template>

<script>
export default{
  name: 'BlogHeader',
  props: {
    user: {
      type: String,
      required: true
    },
    infoList: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    prompt_fn: null,
  }),
  methods: {
    login () {
      this.$emit('open')
    },
    prompt() {
      if (!this.prompt_fn) return
      this.prompt_fn.prompt()
      this.prompt_fn.userChoice.then(function(choice) {
        this.$message.success(choice)
      })
      this.prompt_fn = null
    },
    promptListener(e) {
      this.prompt_fn = e
      e.preventDefault()
      return false
    }
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', this.promptListener)
  },
  beforeDestroy() {
    window.removeEventListener('beforeinstallprompt', this.promptListener)
  },
}
</script>

<style lang="less" scoped>
  .blog-header {
    letter-spacing: 5px;
    text-align: center;
    font-weight: 400;
    &-name {
      cursor: pointer;
    }
    &-links {
      margin-top: 20px;
      a {
        margin: 0 5px;
      }
      img {
        width: 15px;
        height: 15px;
      }
    }
  }
</style>

