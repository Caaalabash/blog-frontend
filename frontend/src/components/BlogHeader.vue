<template>
  <div class="blog-header">
    <!-- 用户名称 -->
    <a class="blog-header-name" :href="`/${user}`" :title="'总访问人数:' + viewCount">{{ user }}'s Blog</a>
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
  import { mapState } from 'vuex'

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
    computed: {
      ...mapState(['viewCount'])
    },
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
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 24px;
    background-color: rgb(50, 54, 57);
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    z-index: 9;
    &-name {
      margin-right: auto;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
    }
    .iconfont {
      margin: 0 20px;
      font-size: 24px;
      color: #fff;
    }
  }
  @media (max-width: 768px) {
    .blog-header {
      padding: 0 12px;
      .iconfont {
        margin: 0 10px;
        font-size: 16px;
      }
    }
  }
</style>

