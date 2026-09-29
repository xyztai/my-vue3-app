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
    </div>
    <div class="text-container" v-if="selectedValue==11">
      <p>*chg-top3: </p>
      <p>1)当天前三;</p>
      <p>2)当天chg>2%;</p>
      <p>3)相较于前一天,放量25%~100%;</p>
      <p>4)前一天的chg < 2%;</p>
      <p>5)前一天不在前三；</p>
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
      <el-table-column prop="last" :label="'cp\nchg'" align="left" min-width="65" width="auto" :formatter="formatAmount" />
      <el-table-column prop="ratioB" :label="'e5\ne10'" align="left" min-width="65" width="auto" :formatter="formatAmount" />
      <el-table-column prop="ratioB" :label="'测试-变色'" align="left" min-width="65" width="auto" :formatter="formatAmount">
        <template #default="scope">
          <!-- 使用 v-html 渲染高亮后的文本 -->
          <span v-html="highlightHyphen(scope.row.ratioB)"></span>
        </template>
      </el-table-column>
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
    const selectedValue = ref(101) // 下拉框选中的值
    const options = ref([ // 下拉框选项数据
      { value: 101, label: '*chg-top3' },
      { value: 201, label: 'chg-top3-history' },
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
          const responseFirstApi = await axios.get('/ag-today/invalidateAll');
        }

        if(selectedValue.value == 101) {
          const method = 'etf-chg-top3';
          const key = 'etf-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-etf/' + method )
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

        if(selectedValue.value == 201) {
          const method = 'etf-chg-top3-history';
          const key = 'etf-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-etf/' + method )
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
    // 核心处理函数：将 "-" 替换为带有绿色样式的 span 标签
    highlightHyphen(text) {
      if (!text) return ''
      // 使用全局替换，把所有的 "-" 变成绿色的 "-"
      return text.replace(/-/g, '<span style="color: #55fa03; font-weight: bold; font-size: 16px;">-</span>')
    },
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
          || row.row.ratioB == 'B9' || row.row.ratioB.startsWith('慎重')
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
