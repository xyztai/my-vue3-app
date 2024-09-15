<template>
  <el-table :data="tableData" :header-cell-class-name="handlemyclass" style="width: 100%" border>
    <el-table-column prop="time" label="日期" align="center" width="100" sortable />
    <el-table-column prop="cntGap" label="缺失数量" align="center" width="100" />
    <el-table-column prop="cntCalc" label="expma数量" align="center" width="100" />
    <el-table-column prop="cntCp" label="cp数量" align="center" width="100" />
    <el-table-column prop="namesMiss" label="缺失明细" align="left" />
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
    const tableData = ref([
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
    ])
    const error = ref(null)

    const fetchCnts = async() => {
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

    fetchCnts()

    return {
      error, fetchCnts, tableData
    }
  },
  methods: {
    handlemyclass(obj) {
      console.log('column.label-1=', obj)
      if (obj.column.label === '日期') {
        console.log('column.label-2=', obj.column.label)
        return 'basic'
      }
    }

  }
}
</script>

<style>
.basic th.el-table__header-cell !important {
  background-color: #409EFF; /* 北京蓝色 */
  color:brown !important;
}
</style>
