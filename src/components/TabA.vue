<template>
  <div class="tabA">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :key="'0'" label="data-cnt" name="first">
        <child1 v-if="isChildUpdate1" />
      </el-tab-pane>
      <el-tab-pane :key="'1'" label="expect-hard2" name="second">
        <child2 v-if="isChildUpdate2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import AgCnt from './tabAComponents/AgCnt'
import ExpectHard2 from './tabAComponents/ExpectHard2'
export default {
  components: {
    child1: AgCnt,
    child2: ExpectHard2
  },
  setup() {
    const activeName = ref('first')
    const isChildUpdate1 = ref(true)
    const isChildUpdate2 = ref(false)
    return { activeName, isChildUpdate1, isChildUpdate2 }
  },
  methods: {
    handleClick(tab) {
      console.log('tab=', tab)
      if (tab.paneName === 'first') {
        console.log('tab-first')
        this.activeName = 'first'
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
      } else if (tab.paneName === 'second') {
        console.log('tab-second')
        this.activeName = 'second'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
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
