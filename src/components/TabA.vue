<template>
  <div class="tabA">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :key="'0'" label="dc-stock" name="first">
        <child1 v-if="isChildUpdate1" />
      </el-tab-pane>
      <el-tab-pane :key="'1'" label="dc-etf" name="second">
        <child2 v-if="isChildUpdate2" />
      </el-tab-pane>
      <el-tab-pane :key="'2'" label="dc-echarts" name="third">
        <child3 v-if="isChildUpdate3" />
      </el-tab-pane>
      <el-tab-pane :key="'3'" label="warn" name="_4th">
        <child4 v-if="isChildUpdate4" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import AgEastmoneyStock from './tabAComponents/AgEastmoneyStock.vue'
import AgEastmoneyETF from './tabAComponents/AgEastmoneyETF.vue'
import AgEastmoneyECharts from './tabAComponents/AgEastmoneyECharts.vue'
import AgEastmoneyMust from './tabAComponents/AgEastmoneyMust.vue'
export default {
  components: {
    child1: AgEastmoneyStock,
    child2: AgEastmoneyETF,
    child3: AgEastmoneyECharts,
    child4: AgEastmoneyMust,
  },
  setup() {
    const activeName = ref('first')
    const isChildUpdate1 = ref(true)
    const isChildUpdate2 = ref(false)
    const isChildUpdate3 = ref(false)
    const isChildUpdate4 = ref(false)
    return { activeName, isChildUpdate1, isChildUpdate2, isChildUpdate3, isChildUpdate4}
  },
  methods: {
    handleClick(tab) {
      console.log('tab=', tab)
      if (tab.paneName === 'first') {
        console.log('tab-first')
        this.activeName = 'first'
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
        this.isChildUpdate4 = false
      } else if (tab.paneName === 'second') {
        console.log('tab-second')
        this.activeName = 'second'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
        this.isChildUpdate3 = false
        this.isChildUpdate4 = false
      } else if (tab.paneName === 'third') {
        console.log('tab-third')
        this.activeName = 'third'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = true
        this.isChildUpdate4 = false
      } else if (tab.paneName === '_4th') {
        console.log('tab-_4th')
        this.activeName = '_4th'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
        this.isChildUpdate4 = true
      }
    }
  }
}
</script>

<style scoped>
:deep(.tabA) {
  background: #40f2ffbd !important; /* 浅蓝色 */
  color:rgb(6, 6, 6);
  font-size: 16px;
  height: auto;
}
</style>
