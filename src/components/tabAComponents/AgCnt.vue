<template>
  <el-table
    empty-text="暂无数据"
    :data="tableData"
    :cell-style="{padding: '0', height: '20px'}"
    :header-cell-class-name="handleHeaderCellClassName"
    style="width: 100%"
    border
    :row-class-name="handleRowClassName"
  >
    <el-table-column type="index" label="No" align="center" width="60" fixed />
    <el-table-column prop="time" label="日期" align="center" width="100" sortable label-class-name="time" fixed />
    <el-table-column prop="cntGap" label="gap" align="center" width="60" />
    <el-table-column prop="cntCalc" label="calc" align="center" width="60" />
    <el-table-column prop="cntCp" label="cp" align="center" width="60" />
    <el-table-column prop="namesMiss" label="缺失明细" align="left" min-width="200" width="auto" />
  </el-table>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { ElTable, ElTableColumn } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  components: {
    ElTable,
    ElTableColumn
  },
  setup() {
    const tableData = ref([])
    const error = ref(null)

    const fetchData = async() => {
      try {
        tableData.value = []
        const response = await axios.get('/ag/data/cnt')
        tableData.value = response.data.data
        console.log(tableData.value)
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

    fetchData()

    return {
      error, fetchData, tableData
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
:deep(.basic) {
  background: #d5f1fd !important;
  color:rgb(6, 6, 6);
  font-size: 16px;
  height: auto;
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
