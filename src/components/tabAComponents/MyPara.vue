<template>
  <div>
    <div class="search-block">
      <el-button class="search-button" style="background: #67a3d7" type="primary" @click="fetchData">查询</el-button>
      <el-button class="modify-button" style="background: #67a3d7" type="primary" @click="updateData">修改</el-button>
    </div>    
    <br/>
    <div class="para-block">
      <el-text class="search-text">buy-factor:</el-text>
      <el-tooltip content="默认值1" placement="top" effect="light">
        <el-input v-model="buyFactor" placeholder="1" class="search-input" />
      </el-tooltip>
    </div>
    <div class="para-block">
      <el-text class="search-text">sell-factor:</el-text>
      <el-tooltip content="默认值1" placement="top" effect="light">
        <el-input v-model="sellFactor" placeholder="1" class="search-input" />
      </el-tooltip>
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
        console.log('buyFactor.value, ', buyFactor.value)
        console.log('sellFactor.value, ', sellFactor.value)
        const response = await axios.get('/ag/get-factor')
        console.log('response.data.data========', response.data.data)
        buyFactor.value = response.data.data.get(0)
        sellFactor.value = response.data.data.get(1)
        console.log('buyFactor.value========', buyFactor)
        console.log('sellFactor.value========', sellFactor)
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

    const updateData = async() => {
      try {
        console.log('buyFactor.value, ', buyFactor.value)
        console.log('sellFactor.value, ', sellFactor.value)
        const response = await axios.get('/ag/update-factor/' + 
              (buyFactor.value === null || buyFactor.value === undefined || Object.keys(buyFactor.value).length === 0 ? '1' : buyFactor.value.trim)+ '/' +
              (sellFactor.value === null || sellFactor.value === undefined || Object.keys(sellFactor.value).length === 0 ? '1' : sellFactor.value.trim) )
        console.log('response.data.data========', response.data.data)
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

    fetchData()

    return {
      error, fetchData, updateData, buyFactor, sellFactor
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.search-block {
  display: flex;
  /* justify-content: space-between; /* 水平间隔 */
  margin-bottom: 10px; /* 留出50px的底部距离 */
}

.para-block {
  display: flex;
}

.search-text {
  margin-left: 5px;
  display: inline-block;
  width: 80px;
}

.search-input {
  margin-left: 5px;
  display: inline-block;
  width: 200px;
}

.search-button {
  margin-left: 5px;
  display: inline-block;
  width: 80px;
}

.modify-button {
  margin-left: 20px;
  display: inline-block;
  width: 120px;
}
</style>
