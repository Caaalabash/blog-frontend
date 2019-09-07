<template>
  <div :id="uniqueId" class="chart"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

let seed = 0

export default {
  name: 'BaseLine',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    uniqueId: `blog-chart-${++seed}`
  }),
  mounted() {
    this.render()
  },
  watch: {
    option: 'render'
  },
  methods: {
    render() {
      const instance = echarts.init(document.getElementById(this.uniqueId))
      instance.setOption(this.option)
    }
  },
}
</script>

<style scoped>
  .chart {
    width: 600px;
    height: 400px;
  }
  @media (max-width: 768px) {
    .chart {
      width: 300px;
      height: 200px;
    }
  }
</style>
