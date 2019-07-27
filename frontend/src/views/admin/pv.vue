<template>
  <div class="container fl-column">
    <el-tabs v-model="currentTab"  type="border-card">
      <!--访问日志区域-->
      <el-tab-pane label="访问日志" name="pv">
        <el-date-picker
          v-model="date"
          type="date"
          class="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 d 日"
          @change="getPv()"
          value-format="yyyy-M-d">
        </el-date-picker>
        <el-table
          :data="originData"
          v-loading="isProcessing"
          class="table">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.list">
                <el-table-column
                  label="访问时间"
                  prop="date">
                </el-table-column>
                <el-table-column
                  label="访问路径"
                  prop="path">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            label="访问ip"
            prop="ip">
          </el-table-column>
          <el-table-column
            label="访问地址"
            prop="address">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--接口日志区域-->
      <el-tab-pane label="接口日志" name="api">
        <Chart :addressData="addressData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Chart from '@/components/Chart.vue'
  import { processPvData } from '@/lib/lib'

  export default {
    name: 'pv',
    components:{
      Chart
    },
    data: () => ({
      isProcessing: true,
      currentTab:'pv',
      originData: [],
      date: new Date().toLocaleString('zh').split(' ')[0].replace(/\//g, '-')
    }),
    computed: {
      ...mapGetters([
        'userName'
      ]),
      addressData(){
        let list = this.originData.reduce((acc, item) => {
          acc.push(item.address)
          return acc
        },[])
        let map = {}
        for(let location of list){
          map[location] ? map[location]++ : map[location] = 1
        }
        let data = []
        for(let n of Object.keys(map)){
          data.push({ value: map[n], name: n })
        }
        return data
      }
    },
    created() {
      this.getPv()
    },
    methods: {
      async getPv() {
        const res = await this.$api.getPv({ date: this.date, userName: this.userName })
        if (res.errno === 0) {
          this.originData = await processPvData(res.data)
        } else {
          this.$message.error('出现错误')
        }
        this.isProcessing = false
      }
    }
  }
</script>

<style scoped lang="less">
  .container{
    width: 100%;
    height: 100%;
    margin:20px;

    @media (max-width: 500px){
      margin: 0;
    }
    .date{
      margin: 20px;
    }
  }
</style>
