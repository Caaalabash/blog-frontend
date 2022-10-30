<template>
  <div class="blog-content">
    <!-- 文章内容区域 -->
    <article class="article">
      <el-page-header @back="$router.push('/')" class="article-header">
        <template #content>
          <div class="article-header-item">
            <div class="title">{{ idea.blogTitle }}</div>
            <span v-if="idea.blogDate" :title="formatDateToChinese(idea.blogDate)">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="`#${ChineseTime}`"></use>
              </svg>
            </span>
          </div>
        </template>
      </el-page-header>
      <div class="markdown-body" v-marked="idea.blogContent"></div>
    </article>
    <!-- 翻页 -->
    <div class="turn-page prev" @click="router.push(lastBlogId)" v-show="lastBlogId">
      <i class="iconfont icon-left"></i>
    </div>
    <div class="turn-page next" @click="router.push(nextBlogId)" v-show="nextBlogId">
      <i class="iconfont icon-right"></i>
    </div>
    <!-- 评论区域 -->
    <div id="comments"></div>
  </div>
</template>

<script setup>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import { defineProps, ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { service } from '@/service'
import { formatDateToChinese } from '@/utils'

const router = useRouter()

const props = defineProps({
  id: String,
  user: String,
})

const idea = ref({})
const nextBlogId = computed(() => idea.value.nextBlogId)
const lastBlogId = computed(() => idea.value.lastBlogId)
const ChineseTime = computed(() => {
  const map = {
    '23': 'icon-rat_zi', '00': 'icon-rat_zi',
    '01': 'icon-ox_chou', '02': 'icon-ox_chou',
    '03': 'icon-tiger_yin', '04': 'icon-tiger_yin',
    '05': 'icon-rabbit_mao', '06': 'icon-rabbit_mao',
    '07': 'icon-dragon_chen', '08': 'icon-dragon_chen',
    '09': 'icon-snake_si', '10': 'icon-snake_si',
    '11': 'icon-horse_wu', '12': 'icon-horse_wu',
    '13': 'icon-goat_wei', '14': 'icon-goat_wei',
    '15': 'icon-monkey_shen', '16': 'icon-monkey_shen',
    '17': 'icon-rooster_you', '18': 'icon-rooster_you',
    '19': 'icon-dog_xu', '20': 'icon-dog_xu',
    '21': 'icon-boar_hai', '22': 'icon-boar_hai'
  }
  return map[idea.value.blogDate.slice(8, 10)]
})

const initGitalk = () => {
  const gitalk = new Gitalk({
    id: idea.value.blogTitle,
    owner: 'Caaalabash',
    admin: ['Caaalabash'],
    repo: 'vue-blog',
    clientID: '6da65a95a5a6ffe0a6f5',
    clientSecret: 'd4dc4e5882e7abbe86d40e953e4fdf3f8a3c5935',
    distractionFreeMode: false,
    title: idea.value.blogTitle,
    body: idea.value.blogContent
  })
  gitalk.render('comments')
}

const getBlogDetail = async () => {
  try {
    const { data } = await service.getBlogDetail({
      params: { id: props.id },
      loading: true,
    })
    idea.value = data
    nextTick(initGitalk)
  } catch (e) {
    router.push('/error?code=404')
  }
}

watch(() => props.id, getBlogDetail, { immediate: true })
</script>

<style lang="less" scoped>
.blog-content {
  width: 760px;
  margin: 40px auto 80px;
  .article-header {
    position: sticky;
    top: 0;
    backdrop-filter: saturate(50%) blur(8px);
    background: rgba(255, 255, 255, .7);
    /deep/ .el-page-header__left,
    /deep/ .el-page-header__content {
      width: 100%;
    }
    &-item {
      display: flex;
      align-items: center;
      .title {
        font-size: 32px;
        font-weight: 500;
        color: #13022c;
        text-align: center;
        line-height: 60px;
        margin-right: auto;
      }
      .icon {
        font-size: 32px;
        cursor: pointer;
      }
    }
  }
  /deep/ img {
    display: block;
    max-width: 600px;
    max-height: 400px;
    margin: 0 auto;
  }
  .turn-page {
    position: fixed;
    top: 50%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f0f0f0;
    transform: translateY(-50%);
    cursor: pointer;
    transition: .3s width, height ease;
    .iconfont {
      line-height: 50px;
      font-size: 25px;
      color: #555;
    }
    &:hover {
      width: 56px;
      height: 56px;
      .iconfont {
        line-height: 56px;
      }
    }
  }
  .prev {
    left: -25px;
    .iconfont {
      padding-left: 50%;
      margin-left: -3px;
    }
    &:hover {
      left: -28px
    }
  }
  .next {
    right: -25px;
    .iconfont {
      padding-left: 5px;
    }
    &:hover {
      right: -28px;
    }
  }
}
@media (max-width: 768px) {
  .blog-content {
    width: 100%;
    margin: 20px auto 40px;
    padding: 0 24px;
    .article-header {
      &-item {
        .title {
          font-size: 24px;
          line-height: 36px;
        }
        .icon {
          font-size: 24px;
        }
      }
    }
    /deep/ img {
      max-width: 300px;
    }
  }
}
</style>