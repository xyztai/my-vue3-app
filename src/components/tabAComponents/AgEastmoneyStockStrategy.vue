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
      <p>策略1：</p>
      <p>T日(2026-06-11)出现buy点，看T+1日(2026-06-12)</p>
      <p>1.若T+1的chg>-5%,则在尾盘以close价格buy</p>
      <p>2.若T+1的chg<-5%,则在T+2,以(T+1)的收盘价*(1-4%)来buy</p>
      <p>持有最多3天</p>
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
      <el-table-column prop="date" label="日期" align="center" width="100" sortable label-class-name="time" />
      <el-table-column prop="stockCode" label="code" align="left" width="80" sortable fixed />
      <!-- <el-table-column prop="stockCode" label="名称" align="left" width="115" sortable fixed /> -->
      <el-table-column prop="last" :label="'名称'" align="left" min-width="200" sortable width="auto" :formatter="formatAmount" />
      <el-table-column prop="ratioB" :label="'说明'" align="left" min-width="1000" sortable width="auto" >
        <template #default="scope">
          <span>should_win_chg=</span>
          <!-- 通过 style="background-color: yellow;" 设置黄色底 -->
          <span style="background-color: yellow; padding: 2px 4px; color: red; font-size: 15px; font-weight: bold;">
            {{ getMidString(scope.row.ratioB) }}
          </span>
          <span>{{ getEndString(scope.row.ratioB) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="ratioB" :label="'e5\ne10'" align="center" min-width="65" width="auto" :formatter="formatAmount" /> -->
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
    const selectedValue = ref(1) // 下拉框选中的值
    const options = ref([ // 下拉框选项数据
      { value: 1, label: '策略1' },
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

        if(selectedValue.value == 1) {
          const method = 'strategy_1';
          const key = 'stock-strategy-' + method;
          const myData = getCachedData(key);
          if (!myData) {
            // 从API获取数据并缓存
            const response = await axios.get('/ag-eastmoney-stock-strategy/' + method )
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
    getMidString(str) {
      return str.slice(str.indexOf("should_win_chg=") + "should_win_chg=".length, str.indexOf("; last="));
    },
    getEndString(str) {
      return str.slice(str.indexOf("; last="));
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
            row.row.date.includes('**')
          || row.row.date.includes('**2026')
          )
      ) {
          return 'row-expect-2'
      }

      if (row.row.date !== null && row.row.date !== undefined &&
          (
            row.row.date.includes('*')
          || row.row.date.includes('*2026')
          )
      ) {
          return 'row-expect-1'
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

:deep(.row-expect-1) {
  background: #FAFAD2 !important;
  color:blue;
  font-size: 12px;
  font-weight: bold;
}

:deep(.row-expect-2) {
  background: #FAFAD2 !important;
  color:rgb(253, 3, 3);
  font-size: 12px;
  font-weight: bold;
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
  color:blue;
  font-size: 15px;
  line-height: 0.5; /* 调整行间距 */
}
</style>
