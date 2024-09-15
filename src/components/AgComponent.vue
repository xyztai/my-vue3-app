<template>
  <div>
    <h1>Ag</h1>
    <ul v-if="cnts.length">
      <li v-for="detail in cnts" :key="detail.time">{{ detail.time }} {{ detail.cntGap }} {{ detail.cntCalc }} {{ detail.cntCp }} {{ detail.namesMiss }}</li>
    </ul>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>Loading data...</p>
    <button @click="fetchCnts">Refresh Data</button>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:8081'

export default {
  setup() {
    const cnts = ref([])
    const error = ref(null)

    const fetchCnts = async() => {
      try {
        cnts.value = []
        const response = await axios.get('/ag/data/cnt')
        cnts.value = response.data.data
        console.log(cnts)
      } catch (err) {
        error.value = 'Error Fetching cnts: ' + err.message
        console.error('Axios error:', err)
      }
    }

    fetchCnts()

    return {
      cnts, error, fetchCnts
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983
}
</style>
