<template>
  <div>
    <div class="search-bolck">
      <el-text>B:</el-text>
      <el-tooltip content="buy-factor" placement="top" effect="light">
        <el-input v-model="buyFactor" placeholder="1" class="search-input" />
      </el-tooltip>
      <el-text>S:</el-text>
      <el-tooltip content="sell-factor" placement="top" effect="light">
        <el-input v-model="sellFactor" placeholder="1" class="search-input" />
      </el-tooltip>
      <el-button class="search-button" style="background: #67a3d7" type="primary" @click="fetchData">查询</el-button>
      <el-button class="modify-button" style="background: #67a3d7" type="primary" @click="fetchData">修改</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { ElTable, ElTableColumn, ElButton, ElInput, ElText } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput,
    ElText
  },
  setup() {
    const error = ref(null)
    const buyFactor = ref('1')
    const sellFactor = ref('1')

    const fetchData = async() => {
      try {
        console.log('buyFactor.value, ', buyFactor.value, sellFactor.value)
        const response = await axios.get('/ag/get-factor' + selectedValue.value + '/' + 
              (buyFactor.value === null || buyFactor.value === undefined || Object.keys(buyFactor.value).length === 0 ? '0' : buyFactor.value)+ '/' + 
              (sellFactor.value === null || sellFactor.value === undefined || Object.keys(sellFactor.value).length === 0 ? '0' : sellFactor.value)+ '/' + 
              (buyFactor3.value === null || buyFactor3.value === undefined || Object.keys(buyFactor3.value).length === 0 ? '0' : buyFactor3.value) )
        console.log('response.data.data========', response.data.data)
        tableData.value = response.data.data
        console.log('tableData.value========', tableData.value)
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

    fetchData()

    return {
      error, fetchData, tableData, buyFactor, sellFactor, buyFactor3, selectedValue, options
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
      console.log('row.row ====', row.row)
      console.log('row.row.time ====', row.row.time)
      if (row.row.time.startsWith('T+')) {
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
  width: 100px;
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

.el-table--scrollable-x .el-table__body-wrapper {
    z-index: 1;
}
</style>
