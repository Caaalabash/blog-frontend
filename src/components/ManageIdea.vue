<template>
  <div class="manage-right" v-resize="handleResize">
    <el-table :data="blogList">
      <el-table-column type="expand" v-if="isShow">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeIdea(scope.row.blogDate)">修改</el-button>
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
          <el-button type="primary" @click="changeIdea(scope.row.blogDate)">修改</el-button>
          <i class="font0"></i>
          <el-button type="danger" @click="_deleteIdea(scope.row.blogDate)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right;margin-top: 5vh"
      layout="prev, pager, next"
      @current-change="_changePage">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapActions, mapGetters} from 'vuex'
export default{
  name: 'ManageIdea',
  props: ['users'],
  data () {
    return {
      isShow: window.innerWidth < 420,
      pgN: 1,
      pgS: 10
    }
  },
  computed: {
    ...mapGetters([
      'blogList'
    ])
  },
  created () {
    this._getIdeaList()
  },
  methods: {
    ...mapActions([
      'getIdeaList',
      'deleteIdea'
    ]),
    _changePage (pgN) {
      this.getIdeaList({userName: this.users.userName, type: 'all', pgN: pgN, pgS: this.pgS})
    },
    _getIdeaList () {
      this.getIdeaList({userName: this.users.userName, type: 'all', pgN: this.pgN, pgS: this.pgS})
    },

    _deleteIdea (id) {
      this.deleteIdea({userName: this.users.userName, blogDate: id})
    },
    changeIdea (id) {
      this.$router.push({name: 'new-idea', query: {blogDate: id}})
    },
    handleResize () {
      this.isShow = window.innerWidth < 420
    }
  }
}
</script>

