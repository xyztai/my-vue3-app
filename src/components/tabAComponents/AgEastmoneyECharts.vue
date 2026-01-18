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
      name: '(序号)',
      type: 'category',
      data: data.map((item) => item.name),
      axisTick: {
        show: false, // 不显示刻度
      },
      // axisLabel: {
      //   show: false // 不显示刻度标签,一般都是要显示的
      // }
      axisLabel: {
        interval: 1, // 每隔一个位置显示数值
        // formatter: '{value} (刻)',
      },
    },
    yAxis: {
      name: '(次)',
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return value + ' 个'
        }
      }
    }, 
    tooltip: {
      trigger: 'item', // 触发类型为item，表示在圆点上触发显示
      formatter: '{b}: {c}', // 显示的格式，{b}表示类目值，{c}表示数值
    },
    series: [
      {
        data: data.map((item) => item.value),
        type: 'line',
        symbol: 'circle', // 设置为圆形
        symbolSize: 8, // 设置圆形的大小
        color: '#ff0000',//颜色
        itemStyle: {
          color: '#ff0000', // 设置圆形的填充颜色
          borderColor: '#ff0000', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#ff0000', // 边框颜色
            shadowBlur: 10, // 阴影模糊度
            shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      }
    ], 
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
