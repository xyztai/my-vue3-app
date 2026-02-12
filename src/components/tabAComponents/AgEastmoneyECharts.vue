<template>
  <div>相减 && 成功率</div>
  <div class="chart-container" ref="chartRef_0"></div>
  <br/>
  <div>=======================================</div>
  <div>逢高-危险，需要减</div>
  <div class="chart-container" ref="chartRef"></div>
  <br/>
  <div>=======================================</div>
  <div>逢高-安全，可以加</div>
  <div class="chart-container" ref="chartRef_2"></div>
  <div>
    <el-link type="primary">===== 我是底线 =====</el-link>
  </div>
  <div>
    <el-link type="primary">===== 我是底线 =====</el-link>
  </div>
  <div>
    <el-link type="primary">===== 我是底线 =====</el-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElLink } from 'element-plus'
import * as echarts from 'echarts'
import axios from 'axios'

const chartRef_0 = ref(null);
const chartRef = ref(null);
const chartRef_2 = ref(null);
let chartInstance_0 = null;
let chartInstance = null;
let chartInstance_2 = null;
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
  chartInstance_0 = echarts.init(chartRef_0.value);
  chartInstance = echarts.init(chartRef.value);
  chartInstance_2 = echarts.init(chartRef_2.value);

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
  const options_0 = {
    title: {
        // text: 'S_06 ~ S_09 走势', // 图表的标题内容
        // subtext: '逢高减', // 图表的副标题，可选
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
      formatter: '{b}<br/>统计值: {c0}<br/>减点: {c2}<br/>加点: {c3}<br/>均线胜率%: {c1}', // 显示的格式，{b}表示类目值，{c}表示数值
      textStyle:{
        align:'left'
      }
    },
    legend: {
        top: '0%',
        data: ['S_69-B_69','win-ratio(%)','S-top20%','B-top20%'],//图例
        selected: {
          'S_69-B_69': true,
          'win-ratio(%)': true,
          'S-top20%': true,
          'B-top20%': true,
        }
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
        name: 'S_69-B_69',
        data: data.map((item) => item.value10),
        type: 'line',
        emphasis: {
          itemStyle: {
            color: '#FF0000' // 高亮颜色，例如红色
          }
        },
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#000000',//颜色
        itemStyle: {
          color: '#000000', // 设置圆形的填充颜色
          borderColor: '#000000', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#000000', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: false,
      },
      {
        name: 'win-ratio(%)',
        data: data.map((item) => item.value9),
        type: 'bar',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#87CEFA',//颜色
        itemStyle: {
          color: '#87CEFA', // 设置圆形的填充颜色
          borderColor: '#87CEFA', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#87CEFA', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: false,
      },
      {
        name: 'S-top20%',
        data: data.map((item) => item.value12),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#808080',//颜色
        itemStyle: {
          color: '#808080', // 设置圆形的填充颜色
          borderColor: '#808080', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#808080', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: false,
      },
      {
        name: 'B-top20%',
        data: data.map((item) => item.value11),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#808080',//颜色
        itemStyle: {
          color: '#808080', // 设置圆形的填充颜色
          borderColor: '#808080', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#808080', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: false,
      }
    ],
    dataZoom: [{
        type: 'slider',  // 这个 dataZoom 组件是 slider 类型的
        start: 90,       // 左边在 90% 的位置
        end: 100         // 右边在 100% 的位置
    }]
  }

  const options = {
    title: {
        // text: 'S_06 ~ S_09 走势', // 图表的标题内容
        // subtext: '逢高减', // 图表的副标题，可选
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
        data: ['S_06','S_07','S_08','S_09','S_69'],//图例
        selected: {
          'S_06': false,
          'S_07': false,
          'S_08': false,
          'S_09': false,
          'S_69': true,
        }
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
        color: '#98FB98',//颜色
        itemStyle: {
          color: '#98FB98', // 设置圆形的填充颜色
          borderColor: '#98FB98', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#98FB98', // 边框颜色
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
        color: '#87CEFA',//颜色
        itemStyle: {
          color: '#87CEFA', // 设置圆形的填充颜色
          borderColor: '#87CEFA', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#87CEFA', // 边框颜色
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
        color: '#EEE8AA',//颜色
        itemStyle: {
          color: '#EEE8AA', // 设置圆形的填充颜色
          borderColor: '#EEE8AA', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#EEE8AA', // 边框颜色
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
        color: '#FA8072',//颜色
        itemStyle: {
          color: '#FA8072', // 设置圆形的填充颜色
          borderColor: '#FA8072', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#FA8072', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'S_69',
        data: data.map((item) => item.value1 + item.value2 + item.value3 + item.value4),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#A9A9A9',//颜色
        itemStyle: {
          color: '#A9A9A9', // 设置圆形的填充颜色
          borderColor: '#A9A9A9', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#A9A9A9', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      }
    ], 
  }

  // 配置项
  const options_2 = {
    title: {
        // text: 'B_06 ~ B_09 走势', // 图表的标题内容
        // subtext: '逢高加', // 图表的副标题，可选
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
        data: ['B_06','B_07','B_08','B_09','B_69'],//图例
        selected: {
          'B_06': false,
          'B_07': false,
          'B_08': false,
          'B_09': false,
          'B_69': true
        }
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
        data: data.map((item) => item.value5),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#98FB98',//颜色
        itemStyle: {
          color: '#98FB98', // 设置圆形的填充颜色
          borderColor: '#98FB98', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#98FB98', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'B_07',
        data: data.map((item) => item.value6),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#87CEFA',//颜色
        itemStyle: {
          color: '#87CEFA', // 设置圆形的填充颜色
          borderColor: '#87CEFA', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#87CEFA', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'B_08',
        data: data.map((item) => item.value7),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#EEE8AA',//颜色
        itemStyle: {
          color: '#EEE8AA', // 设置圆形的填充颜色
          borderColor: '#EEE8AA', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#EEE8AA', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'B_09',
        data: data.map((item) => item.value8),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#FA8072',//颜色
        itemStyle: {
          color: '#FA8072', // 设置圆形的填充颜色
          borderColor: '#FA8072', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#FA8072', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      },
      {
        name: 'B_69',
        data: data.map((item) => item.value5 + item.value6 + item.value7 + item.value8),
        type: 'line',
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        },
        symbol: 'circle', // 设置为圆形
        symbolSize: 6, // 设置圆形的大小
        color: '#A9A9A9',//颜色
        itemStyle: {
          color: '#A9A9A9', // 设置圆形的填充颜色
          borderColor: '#A9A9A9', // 设置圆形的边框颜色
        },
        emphasis: {
          // 设置选中状态下的样式
          itemStyle: {
            borderWidth: 6, // 边框宽度
            borderColor: '#A9A9A9', // 边框颜色
            // shadowBlur: 10, // 阴影模糊度
            // shadowColor: 'rgba(0, 0, 0, 0.3)' // 阴影颜色
          }
        },
        smooth: true,
      }
    ], 
  }

  // 设置图表配置项
  chartInstance_0.setOption(options_0)
  chartInstance.setOption(options)
  chartInstance_2.setOption(options_2)
})

onUnmounted(() => {
  if (chartInstance_0) {
    chartInstance_0.dispose()
    chartInstance_0 = null
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (chartInstance_2) {
    chartInstance_2.dispose()
    chartInstance_2 = null
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
