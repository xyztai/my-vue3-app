<template>
  <div>
    <div class="search-bolck">
      <el-select v-model="selectedValue" placeholder="请选择" class="search-select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="inputValue" placeholder="0" class="search-input" />
      <el-button class="search-button" type="primary" @mousedown="e => e.preventDefault()" @click="fetchCnts">算算看</el-button>
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
      <el-table-column prop="time" label="日期" align="center" width="100" sortable label-class-name="time" fixed />
      <el-table-column prop="name" label="名称" align="center" width="120" />
      <el-table-column prop="operDir" label="操作" align="center" width="60" />
      <el-table-column prop="ratioC" label="比例" align="center" width="80" />
      <el-table-column prop="sellOper" label="卖" align="center" width="165" />
      <el-table-column prop="buyOper" label="买" align="center" width="165" />
    </el-table>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { ElTable, ElTableColumn, ElButton, ElInput } from 'element-plus'
import 'element-plus/dist/index.css'

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput
  },
  setup() {
    const tableData = ref([])
    const error = ref(null)
    const inputValue = ref('0')
    const selectedValue = ref('全部') // 下拉框选中的值
    const options = ref([ // 下拉框选项数据
      { value: '全部', label: '全部' },
      { value: '上证50', label: '上证50' },
      { value: '上证指数', label: '上证指数' },
      { value: '沪深300', label: '沪深300' },
      { value: '深证成指', label: '深证成指' },
      { value: '科创50', label: '科创50' },
      { value: '中证1000', label: '中证1000' },
      { value: '中证2000', label: '中证2000' },
      { value: '北证50', label: '北证50' },
      { value: '恒生科技', label: '恒生科技' },
      { value: '纳斯达克100', label: '纳斯达克100' },
      { value: '证券', label: '证券' },
      { value: '有色金属', label: '有色金属' },
      { value: '光伏产业', label: '光伏产业' },
      { value: '空天军工', label: '空天军工' },
      { value: '软件指数', label: '软件指数' },
      { value: '天齐锂业', label: '天齐锂业' },
      { value: '宁德时代', label: '宁德时代' },
      { value: '药明康德', label: '药明康德' },
      { value: '隆基绿能', label: '隆基绿能' }
    ])

    const fetchCnts = async() => {
      try {
        tableData.value = []
        console.log('inputValue.value, ', inputValue.value)
        const response = await axios.get('/ag/expect/hard2/' + selectedValue.value + '/' + inputValue.value)
        console.log('response.data.data========', response.data.data)
        tableData.value = response.data.data
        console.log('tableData.value========', tableData.value)
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

    fetchCnts()

    return {
      error, fetchCnts, tableData, inputValue, selectedValue, options
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
  margin-left: 10px;
  display: inline-block;
  width: 120px;
}

.search-button {
  margin-left: 10px;
  display: inline-block;
  width: 120px;
}

:deep(.basic) {
  background: #40f2ffbd !important; /* 浅蓝色 */
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
  background: #409EFF !important; /* 深蓝色 */
  color:brown;
  font-size: 16px;
}

.el-table--scrollable-x .el-table__body-wrapper {
    z-index: 1;
}
</style>
