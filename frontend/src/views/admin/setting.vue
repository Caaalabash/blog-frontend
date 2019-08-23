<template>
  <div class="manage-right">
    <el-tabs v-model="tab" type="border-card">
      <!--我喜欢的区域-->
      <el-tab-pane label="我喜欢的" name="favorite">
        <el-table
          :data="likeList"
          style="width: 100%">
          <!--移动端表格-->
          <el-table-column type="expand" v-if="isShow">
            <template slot-scope="scope">
              <el-button type="primary" @click="$router.push(`/${scope.row.author}/articles/${scope.row.blogDate}`)">查看</el-button>
              <i class="font0"></i>
              <el-button type="danger" @click="deleteLike(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="blogDate"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="author"
            label="作者"
            width="180">
          </el-table-column>
          <el-table-column
            prop="blogTitle"
            label="标题">
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="!isShow">
            <template slot-scope="scope">
              <el-button type="primary" @click="$router.push(`/${scope.row.author}/articles/${scope.row.blogDate}`)">查看</el-button>
              <i class="font0"></i>
              <el-button type="danger" @click="deleteLike(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--我收藏的区域-->
      <el-tab-pane label="我收藏的" name="collect">
        <el-table
          :data="collectList"
          style="width: 100%">
          <!--移动端表格-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.list">
                <el-table-column
                  label="作者"
                  prop="author">
                </el-table-column>
                <el-table-column
                  label="文章编号"
                  prop="blogDate">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope1">
                    <el-button type="plain" @click="$router.push(`/${scope1.row.author}/articles/${scope1.row.blogDate}`)">查看</el-button>
                    <el-button type="danger" @click="_deleteCollectBlog(scope.row,scope1.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="collectTitle"
            label="收藏夹名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="collectDesc"
            label="收藏夹描述"
            width="180">
          </el-table-column>
          <el-table-column
            prop="collectType"
            label="类型">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="_deleteCollect(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--个人信息区域-->
      <el-tab-pane label="个人信息" name="userInfo">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="Twitter">
            <el-input v-model="editUserInfo.twitter" class="input">
              <template slot="prepend">Twitter</template>
            </el-input>
          </el-form-item>
          <el-form-item label="github">
            <el-input v-model="editUserInfo.github" class="input">
              <template slot="prepend">Github</template>
            </el-input>
          </el-form-item>
          <el-form-item label="掘金">
            <el-input v-model="editUserInfo.juejin" class="input">
              <template slot="prepend">微博</template>
            </el-input>
          </el-form-item>
          <el-form-item label="设置头像">
            <el-upload
              drag
              :show-file-list="false"
              action="/avatar"
              :httpRequest="upload"
              :before-upload="beforeAvatarUpload"
              multiple>
              <img v-if="avatar" :src="avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-button  icon="el-icon-edit" @click="_changeUserInfo">提交</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'setting',
  props: ['innerWidth'],
  data: () => ({
    file: '',
    tab: 'favorite',
    editUserInfo: {
      twitter: '',
      github: '',
      juejin: ''
    },
  }),
  computed: {
    ...mapGetters([
      'userInfo',
      'userName',
      'avatar',
      'likeList',
      'collectList',
    ]),
    isShow() {
      return this.innerWidth <= 420
    },
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val && val.github) {
          this.editUserInfo = { ...val }
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'setUserInfo',
      'setAvatar',
      'likethis',
      'deleteCollect',
      'deleteCollectBlog'
    ]),
    _changeUserInfo() {
      this.$api.changeUserInfo({ userName: this.userName, ...this.editUserInfo }).then(() => {
        this.setUserInfo(this.editUserInfo)
      })
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.includes('image')
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isImage) {
        this.$message.error('只能上传图片')
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!')
        return false
      }
      this.file = file
      return true
    },
    // 修改头像
    upload () {
      let formData = new FormData()
      formData.append('avatar', this.file)
      this.setAvatar(formData)
    },
    deleteLike(obj) {
      this.likethis({
        blogDate: obj.blogDate,
        blogTitle: obj.blogTitle,
        userName: obj.author,
        user: this.userName,
      })
    },
    _deleteCollect(obj) {
      this.deleteCollect({
        userName: this.userName,
        collectTitle: obj.collectTitle
      })
    },
    _deleteCollectBlog(obj, obj1) {
      this.deleteCollectBlog({
        blogDate: obj1.blogDate,
        collectTitle: obj.collectTitle,
        author: obj1.author,
        userName: this.userName,
      })
    },
  }
}
</script>

<style scoped lang="less">
  .margin-right{
    .el-upload--text{
      border: 1px dashed #c9c9c9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover{
        border-color: #409EFF;
      }
    }
  }
  /deep/ .avatar-uploader-icon{
    height: 178px;
    line-height: 178px;
    display: block;
  }
  /deep/ .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
