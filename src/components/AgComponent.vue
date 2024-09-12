<template>
  <div>
    <h1>Ag</h1>
    <ul v-if="cnts.length">
      <li v-for="detail in cnts" :key="detail.time">{{ detail.time }}</li>
    </ul>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>Loading data...</p>
    <button @click="fetchCnt">Refresh Data</button>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8081'

export default {
  setup() {
    var cnts = ref([])
    const error = ref(null)

    const fetchCnts = async() => {
      try {
        const response = await axios.get('/e/ag/data/cnt')
        cnts = response.data
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
