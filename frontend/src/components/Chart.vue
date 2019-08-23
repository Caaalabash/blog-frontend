<template>
  <div>
    <el-form>
      <el-form-item label="接口路径">
        <el-select v-model="chooseApi" placeholder="请选择" @change="getApiLog">
          <el-option v-for="item in apiOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="fl-row charts-container">
      <EChart :options="option0" :auto-resize="true"></EChart>
      <EChart :options="option1" :auto-resize="true"></EChart>
      <EChart :options="option2" :auto-resize="true"></EChart>
      <EChart :options="option3" :auto-resize="true"></EChart>
    </div>
  </div>
</template>

<script>
import EChart from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  name: 'Chart',
  components: {
    EChart
  },
  props: {
    addressData: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      chooseApi: '/api/v1/login',
      apiOptions: [
        '/api/v1/login',
        '/api/v1/checkStatus',
        '/api/v1/userinfo',
        '/api/v1/ideas',
        '/api/v1/comment',
        '/api/v1/like',
        '/api/v1/idea'
      ],
      requestData: [],
      pvData: [],
      analyzeBlogDate: [],
      baseChartOption: {
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        calculable: true,
      },
      basePieOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        calculable: true,
      }
    }
  },
  computed: {
    option0() {
      return {
        ...this.baseChartOption,
        ...{
          title: {
            text: '接口响应时间',
            subtext: this.chooseApi,
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: 50 }, (_, i) => i)
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value} ms'
            }
          }],
          series: [{
            name: '响应时间(ms)',
            type: 'line',
            data: this.requestData
          }]
        }
      }
    },
    option1() {
      return {
        ...this.baseChartOption,
        ...{
          title: {
            text: '页面访问量',
            subtext: '最近十天(不包含当天)'
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: 10 }, (_, i) => i)
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          }],
          series: [{
            name: '访问量',
            type: 'line',
            data: this.pvData
          }]
        }
      }
    },
    option2() {
      return {
        ...this.basePieOption,
        ...{
          title: {
            text: '访问地点',
            subtext: '当天'
          },
          series: [{
            name: '访问地点',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.addressData
          }]
        }
      }
    },
    option3() {
      return {
        ...this.basePieOption,
        ...{
          title: {
            text: '文章发布时间分析'
          },
          series: [{
            name: '发布时间',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.analyzeBlogDate
          }]
        }
      }
    }
  },
  created() {
    this.getApiLog()
    this.getPvLog()
    this.getBlogDate()
  },
  methods: {
    async getApiLog(){
      const res = await this.$api.getApiMonitor({url:this.chooseApi})
      if (res.data && res.data.length) {
        this.requestData = res.data.reduce((acc,item) => {
          acc.push(item.responseTime)
          return acc
        }, [])
      }
    },
    async getPvLog() {
      const res = await this.$api.getPvMonitor()
      if (res.data && res.data.length) {
        this.pvData = res.data
      }
    },
    async getBlogDate() {
      const res = await this.$api.getAnalyzeBlogDate()
      if (res && res.data) {
        this.analyzeBlogDate = res.data
      }
    }
  }
}
</script>

<style scoped lang="less">
  .charts-container {
    flex-wrap: wrap;
  }
</style>
