<template>
  <div class="manage-right">
    <!-- 文章管理 -->
    <el-table :data="blogList">
      <el-table-column type="expand" v-if="isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row.id)">修改</el-button>
          <i class="font0"></i>
          <el-button type="danger" @click="_deleteIdea(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="blogDate" label="日期"/>
      <el-table-column prop="blogTitle" label="标题"/>
      <el-table-column prop="blogType" label="状态"/>
      <el-table-column label="操作" v-if="!isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row.id)">修改</el-button>
          <i class="font0"></i>
          <el-button type="danger" @click="_deleteIdea(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="float: right;margin-top: 5vh"
      layout="prev, pager, next"
      @current-change="_changePage"
    />
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'articles',
  props: ['user', 'innerWidth'],
  data: () => ({
    pgN: 1,
    pgS: 10,
    blogList: [],
  }),
  computed: {
    isShow() {
      return this.innerWidth < 420
    }
  },
  created() {
    this._changePage(1)
  },
  methods: {
    async _changePage(pgN) {
      const { data } = await this.$api.getIdeaList({ author: this.user.userName, type: 'all', pgN: pgN, pgS: this.pgS })
      this.blogList = data
    },
    async _deleteIdea(id) {
      await this.$api.deleteIdea(id)
      this.blogList = this.blogList.filter(item => item.id !== id)
    },
    changeIdea(id) {
      this.$router.push({ path: '/admin/new', query: { id } })
    },
  }
}
</script>

