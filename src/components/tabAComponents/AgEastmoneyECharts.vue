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
    { name: 'A', value1: 100, value2: 2, value3: 3 },
    { name: 'B', value1: 100, value2: 2, value3: 200 },
    { name: 'C', value1: 100, value2: 2, value3: 150 },
    { name: 'D', value1: 100, value2: 2, value3: 300 },
    { name: 'E', value1: 100, value2: 2, value3: 88 },
    { name: 'F', value1: 100, value2: 2, value3: 98 },
    { name: 'G', value1: 100, value2: 2, value3: 123 },
    { name: 'H', value1: 100, value2: 2, value3: 219 }
  ]

  // 配置项
  const options = {
    xAxis: {
      // name: '(序号)',
      type: 'category',
      data: data.map((item) => item.name),
      axisTick: {
        show: true, // 不显示刻度
      },
      axisLabel: {
        show: false // 不显示刻度标签,一般都是要显示的
      }
      // axisLabel: {
      //   interval: 1, // 每隔一个位置显示数值
      //   formatter: '{value} (刻)',
      // },
    },
    yAxis: {
      name: '(次)',
      type: 'value',
      // axisLabel: {
      //   formatter: function (value) {
      //     return value + ' 个'
      //   }
      // }
    }, 
    tooltip: {
      trigger: 'axis', // 触发类型为item，表示在圆点上触发显示
      formatter: '{b}: {c[0]}', // 显示的格式，{b}表示类目值，{c}表示数值
    },
    legend: {
        data: ['B_06','B_07','B_08']//图例
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    series: [
      {
        name: 'B_06',
        data: data.map((item) => item.value1),
        type: 'line',
        symbol: 'circle', // 设置为圆形
        symbolSize: 8, // 设置圆形的大小
        color: '#00FF00',//颜色
        itemStyle: {
          color: '#00FF00', // 设置圆形的填充颜色
          borderColor: '#00FF00', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#00FF00', // 边框颜色
            shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'B_07',
        data: data.map((item) => item.value2),
        type: 'line',
        symbol: 'circle', // 设置为圆形
        symbolSize: 8, // 设置圆形的大小
        color: '#0000FF',//颜色
        itemStyle: {
          color: '#0000FF', // 设置圆形的填充颜色
          borderColor: '#0000FF', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#0000FF', // 边框颜色
            shadowBlur: 10, // 阴影模糊度
            shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'B_08',
        data: data.map((item) => item.value3),
        type: 'line',
        symbol: 'circle', // 设置为圆形
        symbolSize: 8, // 设置圆形的大小
        color: '#FF0000',//颜色
        itemStyle: {
          color: '#FF0000', // 设置圆形的填充颜色
          borderColor: '#FF0000', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#FF0000', // 边框颜色
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
  width: 500px;
  height: 300px;
}
</style>
