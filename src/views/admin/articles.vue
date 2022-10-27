<template>
  <div class="manage-right">
    <!-- 文章管理 -->
    <el-table :data="blogList">
      <el-table-column type="expand" v-if="isShow">
        <template #default="scope">
          <el-button type="primary" @click="changeIdea(scope.row.id)">修改</el-button>
          <i class="font0"></i>
          <el-button type="danger" @click="deleteIdea(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="blogDate" label="日期"/>
      <el-table-column prop="blogTitle" label="标题"/>
      <el-table-column prop="blogType" label="状态"/>
      <el-table-column label="操作" v-if="!isShow">
        <template #default="scope">
          <el-button type="primary" @click="changeIdea(scope.row.id)">修改</el-button>
          <i class="font0"></i>
          <el-button type="danger" @click="deleteIdea(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="float: right;margin-top: 5vh"
      layout="prev, pager, next"
      @current-change="getNextPage"
      :total="total"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { service } from '@/service'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  innerWidth: Number,
})

const router = useRouter()
const userStore = useUserStore()
const pgN = ref(1)
const pgS = ref(10)
const total = ref(0)
const blogList = ref([{}])
const isShow = computed(() => props.innerWidth < 420)

const getNextPage = async (pageNumber) => {
  const resp = await service.getBlogList({
    params: { author: userStore.userName, type: 'all', pgN: pageNumber, pgS: pgS.value }
  })
  blogList.value = resp.data
  pgN.value = pageNumber
  total.value = resp.total
}
const deleteIdea = async (id) => {
  await service.deleteIdea({
    method: 'DELETE',
    params: { id },
  })
  await getNextPage(pgN.value)
}
const changeIdea = id => router.push({ path: '/admin', query: { id } })

getNextPage(1)
</script>

