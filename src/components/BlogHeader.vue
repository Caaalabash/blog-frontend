<template>
  <div class="blog-header">
    <!-- 用户名称 -->
    <a class="blog-header-name" :href="`/${user}`">{{ user }}</a>
    <!-- 外部链接 -->
    <div class="blog-header-links">
      <a class="iconfont icon-twitter-fill" :href="infoList.twitter" target="_blank" rel="noopener" aria-label="twitter"></a>
      <a class="iconfont icon-github-fill" :href="infoList.github " target="_blank" rel="noopener" aria-label="github"></a>
      <a class="iconfont icon-weibo-fill" :href="infoList.weibo" target="_blank"  rel="noopener" aria-label="weibo"></a>
      <a class="iconfont icon-login" href="" @click.prevent="login" aria-label="login"></a>
      <a class="iconfont icon-gift" href="" @click.prevent="prompt" aria-label="prompt" v-if="prompt_fn"></a>
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
      .iconfont {
        font-size: 16px;
        width: 16px;
        margin: 0 5px;
      }
    }
  }
</style>

