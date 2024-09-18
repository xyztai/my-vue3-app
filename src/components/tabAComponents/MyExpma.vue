<template>
  <div>
    <div class="search-bolck">
      <el-date-picker
        v-model="date"
        class="search-select"
        type="date"
        placeholder="选择日期"
        :default-value="new Date()"
        @change="fetchData"
      />
      <!-- <el-button class="search-button" style="background: #67a3d7" type="primary" @click="fetchData">搜索</el-button> -->
    </div>
    <el-table
      empty-text="暂无数据"
      :data="tableData"
      :cell-style="{padding: '0', height: '20px'}"
      :header-cell-class-name="handleHeaderCellClassName"
      style="width: 560"
      border
      :row-class-name="handleRowClassName"
    >
      <el-table-column prop="time" label="日期" align="center" width="100" sortable label-class-name="time" fixed />
      <el-table-column prop="name" label="名称" align="center" width="100" fixed />
      <el-table-column prop="closePrice" label="cp" align="center" width="120" :formatter="formatAmount" />
      <el-table-column prop="expma5" label="expma5" align="center" width="120" :formatter="formatAmount" />
      <el-table-column prop="expma37" label="expma37" align="center" width="120" :formatter="formatAmount" />
    </el-table>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { ElTable } from 'element-plus'
import { ElTableColumn } from 'element-plus'
// import { ElButton } from 'element-plus'
import { elDatePicker } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  components: {
    ElTable,
    ElTableColumn,
    // ElButton,
    elDatePicker
  },
  setup() {
    const tableData = ref([])
    const error = ref(null)
    const date = ref(new Date())

    const fetchData = async() => {
      try {
        tableData.value = []
        console.log('date.value, ', date.value)
        var tmpDate = date.value
        var year = tmpDate.getFullYear()
        var month = (tmpDate.getMonth() + 1).toString().padStart(2, '0')
        var day = tmpDate.getDate().toString().padStart(2, '0')
        var formatDate = year.toString() + '-' + month + '-' + day
        console.log('formatDate, ', formatDate)
        const response = await axios.get('/ag/data/expma/' + formatDate)
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
      error, fetchData, tableData, date
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
      if (row.row.time === '预期操作') {
        return 'row-expect'
      }
      if (row.rowIndex % 2 === 1) {
        console.log(row.rowIndex, 'odd')
        return 'row-odd'
      } else {
        console.log(row.rowIndex, 'even')
        return 'row-even'
      }
    },
    formatAmount(row, column, cellValue, index) {
      return cellValue.toFixed(4)
    }
  }
}
</script>

<style scoped>
.last-2-cols {
  display: block; /* 让列并排显示 */
  width: 50%; /* 列宽度均分 */
}

.search-bolck {
  display: flex;
  justify-content: space-between; /* 水平间隔 */
  margin-bottom: 10px; /* 留出50px的底部距离 */
}

.search-select {
  display: inline-block;
  width: 120px;
}

.search-button {
  margin-left: 10px;
  display: inline-block;
  width: 120px;
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
