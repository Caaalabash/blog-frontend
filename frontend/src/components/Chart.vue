<template>
  <div>
    <el-form>
      <el-form-item  label="接口路径">
        <el-select v-model="chooseApi" placeholder="请选择" @change="getApiLog">
          <el-option
            v-for="item in apiOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="fl-row charts-container">
      <EChart :options="option" :auto-resize="true"></EChart>
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
    name: "Chart",
    components:{
      EChart
    },
    props:{
      addressData:{
        type:Array,
        default: () => [],
      }
    },
    computed:{
      option2(){
        return {
          title : {
            text: '访问地点',
              subtext:'当天'
          },
          tooltip : {
            trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          toolbox: {
            show : true,
              feature : {
              saveAsImage : {show: true}
            }
          },
          calculable : true,
            series : [
            {
              name:'访问地点',
              type:'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.addressData
            }
          ]
        }
      },
      option3(){
        return {
          title : {
            text: '文章发布时间分析'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          toolbox: {
            show : true,
            feature : {
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          series : [
            {
              name:'发布时间',
              type:'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:this.analyzeBlogDate
            }
          ]
        }
      }
    },
    data(){
      return{
        option :{
          title : {
            text: '接口响应时间',
            subtext:'/api/v1/login'
          },
          tooltip : {
            trigger: 'axis'
          },
          toolbox: {
            show : true,
            feature : {
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,42,43,44,45,46,47,48,49,50]
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                formatter: '{value} ms'
              }
            }
          ],
          series : [
            {
              name:'响应时间(ms)',
              type:'line',
              data:[0,0,0,0,0,0,0,0,0,0]
            }
          ]
        },
        option1 :{
          title : {
            text: '页面访问量',
            subtext:'最近十天(不包含当天)'
          },
          tooltip : {
            trigger: 'axis'
          },
          toolbox: {
            show : true,
            feature : {
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : [1,2,3,4,5,6,7,8,9,10]
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                formatter: '{value} '
              }
            }
          ],
          series : [
            {
              name:'访问量',
              type:'line',
              data:[0,0,0,0,0,0,0,0,0,0]
            }
          ]
        },
        chooseApi:'/api/v1/login',
        apiOptions:[
          '/api/v1/login',
          '/api/v1/checkStatus',
          '/api/v1/userinfo',
          '/api/v1/ideas',
          '/api/v1/comment',
          '/api/v1/like',
          '/api/v1/idea'
        ],
        analyzeBlogDate:[{value:0,name:'无'}]
      }
    },
    created(){
      this.getApiLog()
      this.getPvLog()
      this.getBlogDate()
    },
    methods:{
      getApiLog(){
        this.$api.getApiMonitor({url:this.chooseApi})
          .then(res=>{
            if(res.data && res.data.length){
              let data = res.data.reduce((acc,item)=>{
                acc.push(item.responseTime)
                return acc
              },[])
              this.option = {
                ...this.option,
                ...{series: [{name:'响应时间(ms)', type:'line', data:data}]},
                ...{title:{ text: '接口响应时间', subtext:this.chooseApi}}}
            }
          })
      },
      getPvLog(){
        this.$api.getPvMonitor()
          .then(res=>{
            if(res.data && res.data.length){
              this.option1 = {
                ...this.option1,
                ...{series: [{name:'访问量', type:'line', data:res.data}]},
              }}
          })
      },
      getBlogDate(){
        this.$api.getAnalayzBlogDate()
          .then(res=>{
            if(res && res.data){
              this.analyzeBlogDate = res.data
            }
          })
      }
    }
  }
</script>

<style scoped lang="less">
  .charts-container{
    flex-wrap: wrap;
  }
</style>
