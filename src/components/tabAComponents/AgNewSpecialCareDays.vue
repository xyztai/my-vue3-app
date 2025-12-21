<template>
  <div>
    <div class="search-bolck">
      <el-tooltip content="当天涨幅" placement="top" effect="light">
        <el-input v-model="inputValue2" placeholder="-1" class="search-input" />
      </el-tooltip>
      <el-tooltip content="测算天数" placement="top" effect="light">
        <el-input v-model="inputValue3" placeholder="300" class="search-input" />
      </el-tooltip>
      <el-tooltip content="数据来源" placement="top" effect="light">
        <el-input v-model="inputValue4" placeholder="1-QQ;2-东财" class="search-input" />
      </el-tooltip>
      <el-button class="search-button" style="background: #67a3d7" type="primary" @click="fetchData">算算看</el-button>
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
      <el-table-column prop="last" label="cp" align="center" min-width="65" width="auto" :formatter="formatAmount" />
      <el-table-column prop="ratioB" label="买(止损5%)" align="center" min-width="65" width="auto" :formatter="formatAmount" />
      <!-- <el-table-column prop="ratioS" label="卖(<0.25)" align="center" sortable min-width="120" width="auto" :formatter="formatAmount" /> -->
    </el-table>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { ElTable, ElTableColumn, ElButton, ElInput } from 'element-plus'
import { elDatePicker } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  components: {
    ElTable,
    ElTableColumn,
    elDatePicker,
    ElButton,
    ElInput
  },
  setup() {
    const tableData = ref([])
    const error = ref(null)
    const date = ref(new Date())
    const inputValue2 = ref('-1')
    const inputValue3 = ref('300')
    const inputValue4 = ref(2)

    const fetchData = async() => {
      try {
        tableData.value = []
        if(inputValue4.value == 1) {
          const response = await axios.get('/ag-new/special-care-days/'
            + (inputValue2.value === null || inputValue2.value === undefined || Object.keys(inputValue2.value).length === 0 ? '-1' : inputValue2.value) 
            + '/' + (inputValue3.value === null || inputValue3.value === undefined || Object.keys(inputValue3.value).length === 0 ? '300' : inputValue3.value) 
          )
          console.log('response.data.data========', response.data.data)
          tableData.value = response.data.data
          console.log('tableData.value========', tableData.value)
        }
        if(inputValue4.value == 2) {
          const response = await axios.get('/ag-new/special-care-days-eastmoney/'
            + (inputValue2.value === null || inputValue2.value === undefined || Object.keys(inputValue2.value).length === 0 ? '-1' : inputValue2.value) 
            + '/' + (inputValue3.value === null || inputValue3.value === undefined || Object.keys(inputValue3.value).length === 0 ? '300' : inputValue3.value) 
          )
          console.log('response.data.data========', response.data.data)
          tableData.value = response.data.data
          console.log('tableData.value========', tableData.value)
        }
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

    fetchData()

    return {
      error, fetchData, tableData, inputValue2, inputValue3, inputValue4
    }
  },
  methods: {
    handleHeaderCellClassName(obj) {
      console.log('column.label-1=', obj)
      if (obj.column.label !== '日期') {
        console.log('column.label-2=', obj.column.label)
        return 'basic'
      }
    },
    handleRowClassName(row) {
      console.log('handleRowClassName, ', row, row.rowIndex)
      if (row.row.date.startsWith('T+') || row.row.date.startsWith('9999')) {
        return 'row-expect'
      }
      if (row.rowIndex % 2 === 1) {
        console.log(row.rowIndex, 'odd')
        return 'row-odd'
      } else {
        console.log(row.rowIndex, 'even')
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
</style>
