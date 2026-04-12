<template>
  <div>
    <div class="search-bolck">
      <el-select v-model="selectedValue" placeholder="请选择" class="search-select" @change="fetchData">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-tooltip v-if="false" content="测算天数" placement="top" effect="light">
        <el-input v-model="inputValue3" placeholder="200" class="search-input" />
      </el-tooltip>
      <el-tooltip v-if="false" content="当天涨幅" placement="top" effect="light">
        <el-input v-model="inputValue2" placeholder="-1" class="search-input" />
      </el-tooltip>
      <el-switch
        v-model="value5"
        inline-prompt
        active-text="前-缓存30m"
        inactive-text="前-清除缓存"
      />
      <el-switch
        v-model="value6"
        inline-prompt
        active-text="后-缓存1d"
        inactive-text="后-清除缓存"
      />
      <!-- <el-tooltip content="数据来源" placement="top" effect="light">
        <el-input v-model="inputValue4" placeholder="1-QQ;2-东财" class="search-input" />
      </el-tooltip> -->
      <el-button class="search-button" style="background: #67a3d7" type="primary" @click="fetchData">算算看</el-button>
    </div>
    <div class="text-container">
      <p>WARN:</p>
      <p>这几个月不开仓:</p>
      <p>B_09_ETF: 4、6、8</p>
      <p>S_07_ETF: 4、6、8、10、11</p>
      <p>20、60均线: 得是爆量后第一次</p>
    </div>
    <el-table
      empty-text="暂无数据"
      :data="tableData"
      :cell-style="{padding: '0', height: '20px'}"
      :header-cell-class-name="handleHeaderCellClassName"
      style="width: 100%"
      border
      :row-class-name="handleRowClassName"
    >
      <el-table-column type="index" label="No" align="center" width="50" fixed />
      <el-table-column prop="date" label="日期" align="center" width="100" sortable label-class-name="time" fixed />
      <el-table-column prop="stockCode" label="名称" align="left" width="115" sortable fixed />
      <el-table-column prop="last" :label="'cp\nchg'" align="center" min-width="65" width="auto" :formatter="formatAmount" />
      <el-table-column prop="ratioB" :label="'e5\ne10'" align="center" min-width="65" width="auto" :formatter="formatAmount" />
      <!-- <el-table-column prop="ratioS" label="卖(<0.25)" align="center" sortable min-width="120" width="auto" :formatter="formatAmount" /> -->
    </el-table>
    <div>
      <el-link type="primary">===== 我是底线 =====</el-link>
    </div>
    <div>
      <el-link type="primary">===== 我是底线 =====</el-link>
    </div>
    <div>
      <el-link type="primary">===== 我是底线 =====</el-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { ElTable, ElTableColumn, ElButton, ElInput, ElLink } from 'element-plus'
import { elDatePicker } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  components: {
    ElTable,
    ElTableColumn,
    elDatePicker,
    ElButton,
    ElInput,
    ElLink
  },
  setup() {
    const tableData = ref([])
    const error = ref(null)
    const date = ref(new Date())
    const inputValue2 = ref('-1')
    const inputValue3 = ref('300')
    // const inputValue4 = ref(2)
    const selectedValue = ref(18) // 下拉框选中的值
    const options = ref([ // 下拉框选项数据
      { value: 18, label: '*截图-2025-3倍以上' },
      { value: 17, label: '*截图-5连UP' },
      { value: 16, label: '*截图-仅MA多头排列' },
      { value: 15, label: '*截图-多头排列' },
      { value: 14, label: '*截图-big-swing-&-lowest-vol' },
      { value: 13, label: '*截图-big-swing' },
      { value: 12, label: '*截图-最近有冲顶' },
      { value: 0, label: '*截图-avg' },
      { value: 1, label: 'top3-next' },
      { value: 2, label: 'top3-30' },
      { value: 3, label: 'volume*3' },
      { value: 5, label: '9_zhuan_S' },
      { value: 6, label: '9_zhuan_B' },
      { value: 10, label: '90天内9倍' },
      { value: 11, label: 'avg20_avg60' },
      // { value: 7, label: 'risk-ratio' },
      { value: 99, label: '今日数据' },
      // { value: 4, label: '1.5%-2020' },
      // { value: 5, label: 'QQ-1.5%-2024919' }
    ])
    const value5 = ref(true)
    const value6 = ref(true)

    const fetchData = async() => {
      try {
        tableData.value = []
        console.log('value5', value5.value)
        if(value5.value == false) {
          // 清空 localStorage 中的所有数据
          localStorage.clear();
        }

        console.log('value6', value6.value)
        if(value6.value == false) {
          console.log('call invalidateAll...')
          const responseFirstApi = await axios.get('/ag-new/invalidateAll');
        }

        if(selectedValue.value == 0) {
          const method = 'easy-snapshot';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 1) {
          const method = 'special-care-days-eastmoney-365-top3';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }          
        }

        if(selectedValue.value == 2) {
          const method = 'special-care-days-eastmoney-30-top3';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 3) {
          const method = 'volumn-suddenly-rised-tiple';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 5) {
          const method = 'query9ZhuanS';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 6) {
          const method = 'query9ZhuanB';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        // if(selectedValue.value == 7) {
        //   const method = 'queryWinRatios';
        //   const key = 'stock-' + method;
        //   const myData = getCachedData(key);
        //   if (!myData) {
        //     // 从API获取数据并缓存
        //     const response = await axios.get('/ag-eastmoney-stock/' + method )
        //     // console.log('response.data.data========', response.data.data)
        //     tableData.value = response.data.data
        //     // console.log('tableData.value========', tableData.value)          
        //     cacheData(key, response.data.data)
        //   } else {
        //     // 使用缓存的数据
        //     tableData.value = myData
        //     // console.log('Using cached data:', myData);
        //   }
        // }

        if(selectedValue.value == 10) {
          const method = 'eastmoney-9-vol-in-90-days';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 11) {
          const method = 'eastmoney-avg-60';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 12) {
          const method = 'eastmoney-latest-rise-limit';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 13) {
          const method = 'eastmoney-queryBigSwing';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 14) {
          const method = 'eastmoney-queryBigSwingAndLowestVol';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 15) {
          const method = 'eastmoney-queryDuoTou';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 16) {
          const method = 'eastmoney-queryDuoTouMA';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 17) {
          const method = 'eastmoney-queryUp5Lian';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 18) {
          const method = 'eastmoney-queryOnlyThem';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        if(selectedValue.value == 99) {
          const method = 'eastmoney-latest-info';
          const key = 'stock-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock/' + method )
            // console.log('response.data.data========', response.data.data)
            tableData.value = response.data.data
            // console.log('tableData.value========', tableData.value)          
            cacheData(key, response.data.data)
          } else {
            // 使用缓存的数据
            tableData.value = myData
            // console.log('Using cached data:', myData);
          }
        }

        // if(selectedValue.value == 4) {
        //   const response = await axios.get('/ag-new/special-care-days-eastmoney'
        //   )
        //   console.log('response.data.data========', response.data.data)
        //   tableData.value = response.data.data
        //   console.log('tableData.value========', tableData.value)
        // }
        // if(selectedValue.value == 5) {
        //   const response = await axios.get('/ag-new/special-care-days/'
        //     + (inputValue2.value === null || inputValue2.value === undefined || Object.keys(inputValue2.value).length === 0 ? '-1' : inputValue2.value) 
        //     + '/' + (inputValue3.value === null || inputValue3.value === undefined || Object.keys(inputValue3.value).length === 0 ? '300' : inputValue3.value) 
        //   )
        //   console.log('response.data.data========', response.data.data)
        //   tableData.value = response.data.data
        //   console.log('tableData.value========', tableData.value)
        // }
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

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

    fetchData()

    return {
      error, fetchData, tableData, inputValue2, inputValue3, selectedValue, options, value5, value6
    }
  },
  methods: {
    handleHeaderCellClassName(obj) {
      // console.log('column.label-1=', obj)
      if (obj.column.label !== '日期') {
        // console.log('column.label-2=', obj.column.label)
        return 'basic'
      }
    },
    handleRowClassName(row) {
      // console.log('handleRowClassName, ', row, row.rowIndex)
      if (row.row.date !== null && row.row.date !== undefined &&
          (
            row.row.date.startsWith('T+') || row.row.date.startsWith('9999') 
          )
      ) {
          return 'row-expect'
      }

      if (row.row.ratioB !== null && row.row.ratioB !== undefined &&
          (
            row.row.ratioB.startsWith('B_09U') || row.row.ratioB.startsWith('S_09U')
          || row.row.ratioB.startsWith('B_06U') || row.row.ratioB.startsWith('S_06U')
          || row.row.ratioB == 'B9' || row.row.ratioB.startsWith('慎重') || row.row.ratioB.startsWith('*')
          )
      ) {
          return 'row-expect'
      }

      if (row.rowIndex % 2 === 1) {
        // console.log(row.rowIndex, 'odd')
        return 'row-odd'
      } else {
        // console.log(row.rowIndex, 'even')
        return 'row-even'
      }
    }

  }
}
</script>

<style scoped>
.search-bolck {
  display: flex;
  justify-content: space-between; /* 水平间隔 */
  margin-bottom: 10px; /* 留出50px的底部距离 */
}

.search-select {
  display: inline-block;
  width: 120px;
}

.el-select-dropdown__wrap {
  overflow: hidden !important; /* 禁用滚动 */
}

.search-input {
  margin-left: 5px;
  display: inline-block;
  width: 60px;
}

.search-button {
  margin-left: 5px;
  display: inline-block;
  width: 80px;
}

:deep(.basic) {
  background: #d5f1fd !important;
  color:rgb(6, 6, 6);
  font-size: 16px;
  height: auto;
}

:deep(.row-expect) {
  background: #FAFAD2 !important;
  color:rgb(253, 3, 3);
  font-size: 12px;
  font-weight: bold;
}

:deep(.row-odd) {
  background: #DFEAF5 !important;
  color:rgb(6, 6, 6);
  font-size: 12px;
}

:deep(.row-even) {
  color:rgb(6, 6, 6);
  font-size: 12px;
}

:deep(.time) {
  background: #d5f1fd !important;
  color:brown;
  font-size: 16px;
}

.text-container p {
  text-align: left; /* 或者使用 text-align: start; 根据需要 */
  color:brown;
  font-size: 10px;
  line-height: 0.5; /* 调整行间距 */
}
</style>
