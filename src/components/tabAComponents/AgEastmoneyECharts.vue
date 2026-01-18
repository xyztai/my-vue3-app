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
    { name: '2026-01-11', value1: 100, value2: 2, value3: 3 },
    { name: '2026-01-12', value1: 100, value2: 2, value3: 200 },
    { name: '2026-01-13', value1: 100, value2: 2, value3: 150 },
    { name: '2026-01-14', value1: 100, value2: 2, value3: 300 },
    { name: '2026-01-15', value1: 100, value2: 2, value3: 88 },
    { name: '2026-01-16', value1: 100, value2: 2, value3: 98 },
    { name: '2026-01-17', value1: 100, value2: 2, value3: 123 },
    { name: '2026-01-18', value1: 100, value2: 2, value3: 219 }
  ]

  // 配置项
  const options = {
    title: {
        text: 'B_06 ~ B_09 走势', // 图表的标题内容
        subtext: '最近一个月', // 图表的副标题，可选
        left: 'center', // 标题的位置，例如 'left', 'center', 'right' 或者具体像素值
        top: 'top', // 标题的垂直位置，例如 'top', 'middle', 'bottom' 或者具体像素值
        textStyle: { // 标题的文本样式
            color: '#333', // 字体颜色
            fontSize: 18 // 字体大小
        }
    },
    xAxis: {
      // name: '(序号)',
      type: 'category',
      data: data.map((item) => item.name),
      axisTick: {
        show: true,
      },
      axisLabel: {
        show: false // 不显示刻度标签,一般都是要显示的
      },
      boundaryGap: false
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
      formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}: {c2}', // 显示的格式，{b}表示类目值，{c}表示数值
      textStyle:{
        align:'left'
      }
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
