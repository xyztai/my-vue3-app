<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)

  // 模拟数据
  const data = [
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    { name: 'C', value: 150 },
    { name: 'D', value: 300 },
    { name: 'E', value: 88 },
    { name: 'F', value: 98 },
    { name: 'G', value: 123 },
    { name: 'H', value: 219 }
  ]

  // 配置项
  const options = {
    xAxis: {
      type: 'category',
      data: data.map((item) => item.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.map((item) => item.value),
        type: 'line'
      }
    ]
  }

  // 设置图表配置项
  chartInstance.setOption(options)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.chart-container {
  width: 400px;
  height: 300px;
}
</style>
