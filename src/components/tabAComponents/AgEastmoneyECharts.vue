<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const chartRef = ref(null);
let chartInstance = null;
let data = null;

function cacheData(key, data, ttl = 1800000) { // ttl为缓存时间，单位毫秒，这里设置为30分钟
  const item = {
    value: data,
    expiry: Date.now() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getCachedData(key) {
  const data = localStorage.getItem(key);
  if (data) {
    const item = JSON.parse(data);
    if (Date.now() < item.expiry) {
      return item.value;
    } else {
      // 过期，移除缓存
      localStorage.removeItem(key);
      return null;
    }
  }
  return null;
}

onMounted(async () => {
  // 初始化图表实例
  chartInstance = echarts.init(chartRef.value);

  const method = 's69';
  const key = 'echarts-' + method;
  const myData = getCachedData(key);
  if (!myData) {
    // 从API获取数据并缓存
    const response = await axios.get('/ag-eastmoney-echarts/' + method);
    data = response.data.data; // 假设后端返回的数据格式是合适的，例如 { xAxis: [], series: [] }
    console.log('获取后端的数据:', data);     
    cacheData(key, response.data.data)
  } else {
    // 使用缓存的数据
    data = myData
    console.log('Using cached data:', myData);
  }   



  // 从API获取数据并缓存
  // const method = 'special-care-days-eastmoney-1-top3';
  // const response = await axios.get('/ag-eastmoney-stock/' + method);
  // data = response.data.data; // 假设后端返回的数据格式是合适的，例如 { xAxis: [], series: [] }
  // console.log('获取后端的数据:', data);

  // 模拟数据
  // const data = [
  //   { name: '2026-01-11', value1: 100, value2: 2, value3: 3 },
  //   { name: '2026-01-12', value1: 100, value2: 2, value3: 200 },
  //   { name: '2026-01-13', value1: 100, value2: 2, value3: 150 },
  //   { name: '2026-01-14', value1: 100, value2: 2, value3: 300 },
  //   { name: '2026-01-15', value1: 100, value2: 2, value3: 88 },
  //   { name: '2026-01-16', value1: 100, value2: 2, value3: 98 },
  //   { name: '2026-01-17', value1: 100, value2: 2, value3: 123 },
  //   { name: '2026-01-18', value1: 100, value2: 2, value3: 219 }
  // ]

  // data = [
  //   { name: '2026-01-11', value1: 100, value2: 2, value3: 3 },
  //   { name: '2026-01-12', value1: 100, value2: 2, value3: 200 },
  //   { name: '2026-01-13', value1: 100, value2: 2, value3: 150 },
  //   { name: '2026-01-14', value1: 100, value2: 2, value3: 300 },
  //   { name: '2026-01-15', value1: 100, value2: 2, value3: 88 },
  //   { name: '2026-01-16', value1: 100, value2: 2, value3: 98 },
  //   { name: '2026-01-17', value1: 100, value2: 2, value3: 123 },
  //   { name: '2026-01-18', value1: 100, value2: 2, value3: 219 }
  // ]
  // console.log('mock 后端数据:', data);

  // 配置项
  const options = {
    title: {
        // text: 'S_06 ~ S_09 走势', // 图表的标题内容
        // subtext: 'S_06 ~ S_09 走势', // 图表的副标题，可选
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
      boundaryGap: true
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
      formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}: {c2}<br/>{a3}: {c3}', // 显示的格式，{b}表示类目值，{c}表示数值
      textStyle:{
        align:'left'
      }
    },
    legend: {
        top: '0%',
        data: ['S_06','S_07','S_08','S_09']//图例
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
        name: 'S_06',
        data: data.map((item) => item.value1),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
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
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'S_07',
        data: data.map((item) => item.value2),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
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
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'S_08',
        data: data.map((item) => item.value3),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#FFFF00',//颜色
        itemStyle: {
          color: '#FFFF00', // 设置圆形的填充颜色
          borderColor: '#FFFF00', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#FFFF00', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'S_09',
        data: data.map((item) => item.value4),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
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
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
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

// export default {
//   setup() {
//     let data = null;  
//     const error = ref(null)
    
//     const fetchData = async() => {
//       try {
//         const method = 'special-care-days-eastmoney-1-top3';
//         const key = 'stock-' + method;
//         const myData = getCachedData(key);
//         if (!myData) {
//           // 从API获取数据并缓存
//           axios.get('/ag-eastmoney-stock/' + method )
//           .then(response => {
//             console.log('同步获取的数据:', response.data);
//             console.log('response.data.data========', response)
//             // data = response.data.data
//             data = [
//                     { name: '2026-01-11', value1: 100, value2: 2, value3: 3 },
//                     { name: '2026-01-12', value1: 100, value2: 2, value3: 200 },
//                     { name: '2026-01-13', value1: 100, value2: 2, value3: 150 },
//                     { name: '2026-01-14', value1: 100, value2: 2, value3: 300 },
//                     { name: '2026-01-15', value1: 100, value2: 2, value3: 88 },
//                     { name: '2026-01-16', value1: 100, value2: 2, value3: 98 },
//                     { name: '2026-01-17', value1: 100, value2: 2, value3: 123 },
//                     { name: '2026-01-18', value1: 100, value2: 2, value3: 219 }
//                   ]
//             // console.log('tableData.value========', tableData.value)          
//             cacheData(key, response.data.data)
//           })
//           .catch(error => {
//               console.error('请求失败:', error);
//               throw error;
//           });
//         } else {
//           // 使用缓存的数据
//           data = myData
//           console.log('Using cached data:', myData);
//         }   
//       } catch (err) {
//         error.value = 'Error Fetching cnts: ' + err.message
//         console.error('Axios error:', err)
//       }
//     }

//     function cacheData(key, data, ttl = 1800000) { // ttl为缓存时间，单位毫秒，这里设置为30分钟
//       const item = {
//         value: data,
//         expiry: Date.now() + ttl,
//       };
//       localStorage.setItem(key, JSON.stringify(item));
//     }

//     function getCachedData(key) {
//       const data = localStorage.getItem(key);
//       if (data) {
//         const item = JSON.parse(data);
//         if (Date.now() < item.expiry) {
//           return item.value;
//         } else {
//           // 过期，移除缓存
//           localStorage.removeItem(key);
//           return null;
//         }
//       }
//       return null;
//     }
//     fetchData()

//   },
// }
</script>

<style scoped>
.chart-container {
  width: 400px;
  height: 300px;
}
</style>
