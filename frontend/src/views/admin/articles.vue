<template>
  <div class="manage-right">
    <!-- 文章管理 -->
    <el-table :data="blogList">
      <el-table-column type="expand" v-if="isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row)">修改</el-button>
          <i class="font0"></i>
          <el-button type="danger" @click="_deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="blogDate"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="blogTitle"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="blogType"
        label="状态">
      </el-table-column>
      <el-table-column
        label="操作"
        v-if="!isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row)">修改</el-button>
          <i class="font0"></i>
          <el-button type="danger" @click="_deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="float: right;margin-top: 5vh"
      layout="prev, pager, next"
      @current-change="_changePage">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default{
    name: 'articles',
    props: ['users', 'innerWidth'],
    data: () => ({
      pgN: 1,
      pgS: 10,
      blogList: [],
    }),
    computed: {
      ...mapGetters(['userName']),
      isShow() {
        return this.innerWidth < 420
      }
    },
    watch: {
      userName: {
        handler(val) {
          val && this._changePage(1)
        },
        immediate: true
      }
    },
    methods: {
      _changePage(pgN) {
        this.$api.getIdeaList({ userName: this.userName, type: 'all', pgN: pgN, pgS: this.pgS }).then(res => {
          this.blogList = res.data
        })
      },
      _deleteIdea(id) {
        this.$api.deleteIdea({ userName: this.userName, blogDate: id }).then(() => {
          this.blogList = this.blogList.filter(item => item.blogDate !== id)
        })
      },
      changeIdea(idea) {
        this.$router.push({ path: '/admin/new', query: { blogDate: idea.blogDate } })
      },
    }
  }
</script>

