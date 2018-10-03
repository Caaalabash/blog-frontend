<template>
  <el-dialog
    :visible="visible"
    @close="closeDialog"
  >
    <!--添加到收藏夹-->
    <div class="collectContainer fl-column" v-show="!isCreate">
      <!--标题-->
      <div class="title fl-column">
        <h2>添加收藏</h2>
        <span>请选择你想添加的收藏夹</span>
      </div>
      <!--收藏列表-->
      <div class="list fl-column">
        <!--如果有收藏夹-->
        <div v-if="collectList.length">
          <div class="list-item fl-row" v-for="item in collectList">
            <div class="text fl-column">
              <span class="text-title">{{item.collectTitle}}<img v-if="item.collectType==='private'" src="../assets/lock.svg"></span>
              <span class="text-len">{{`${item.list.length}条内容`}}</span>
            </div>
            <div>
              <el-button type="info" v-show="item.list.some(i=>i.blogDate===$route.params.id)">已收藏</el-button>
              <el-button type="plain" @click="collect(item.collectTitle)"  v-show="!item.list.some(i=>i.blogDate===$route.params.id)">收藏</el-button>
            </div>
          </div>
        </div>
        <!--如果没有收藏夹-->
        <div class="no-list fl-row" v-else>
          <span>没有收藏夹TAT</span>
        </div>
      </div>
      <!--按钮-->
      <div class="button fl-row">
        <el-button type="primary" @click="createCollect">创建收藏夹</el-button>
      </div>
    </div>
    <!--创建收藏夹-->
    <div class="collectContainer fl-column" v-show="isCreate">
      <!--标题-->
      <div class="title fl-column">
        <h2>创建收藏夹</h2>
      </div>
      <!--收藏列表-->
      <el-form ref="form" :model="form" :rules="rule">
        <el-form-item prop="title">
          <el-input placeholder="收藏夹标题" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop="desc">
          <el-input type="textarea" placeholder="收藏夹描述(可选)" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-radio v-model="form.type" label="public">公开</el-radio>
          <el-radio v-model="form.type" label="private">私密</el-radio>
        </el-form-item>
      </el-form>
      <!--按钮-->
      <div class="button fl-row">
        <el-button type="plain" @click="back">返回</el-button>
        <el-button type="primary" @click="submit">创建收藏夹</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex'
  export default {
    name: "Collect",
    props:{
      visible:{
        type:Boolean,
        default:false
      }
    },
    computed:{
      ...mapGetters([
        'userName',
        'collectList'
      ])
    },
    data(){
      return{
        isCreate:false,
        form:{
          type:'public',
          title:'',
          desc:''
        },
        rule:{
          title:[
            { required: true, message: '请输收藏夹名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      ...mapActions([
        'createCollectList',
        'addToCollectList'
      ]),
      closeDialog(){
        this.$emit('close')
      },
      collect(title){
        const {user,id} = this.$route.params
        this.addToCollectList({
          userName:this.userName,
          author:user,
          blogDate:id,
          collect:title
        })
      },
      submit(){
        this.createCollectList({...this.form,userName:this.userName}).then(()=>{
          this.isCreate = false
        })
      },
      createCollect(){
        this.isCreate = true
      },
      back(){
        this.isCreate = false
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../assets/style/index.less';
  /deep/ .el-dialog__body{
    padding-top: 0;
  }
  @media (max-width: 500px){
    /deep/ .el-dialog{
      width: 75%;
    }
  }
  .collectContainer{
    .title{
      align-items: center;
    }
    .list{
      max-height: 335px;
      min-height: 140px;
      margin-bottom: 40px;
      overflow-x: hidden;
      overflow-y: auto;

      .list-item{
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid @borderColor;
        .text{
          justify-content: space-between;
          .text-title{
            font-weight: 700;
          }
        }
      }
      .no-list{
        height: 100px;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
      }
    }

    .button{
      justify-content: center;
    }
  }
</style>
