<template>
  <div class="tabA">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :key="'0'" label="dc-stock" name="first">
        <child1 v-if="isChildUpdate1" />
      </el-tab-pane>
      <el-tab-pane :key="'1'" label="top-t" name="second">
        <child2 v-if="isChildUpdate2" />
      </el-tab-pane>
      <el-tab-pane :key="'2'" label="expect" name="third">
        <child3 v-if="isChildUpdate3" />
      </el-tab-pane>
      <el-tab-pane :key="'3'" label="factor" name="th_4">
        <child4 v-if="isChildUpdate4" />
      </el-tab-pane>
      <el-tab-pane :key="'4'" label="expma" name="th_5">
        <child5 v-if="isChildUpdate5" />
      </el-tab-pane>
      <el-tab-pane :key="'5'" label="data-cnt" name="th_6">
        <child6 v-if="isChildUpdate6" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import ExpectHard2 from './tabAComponents/ExpectHard2'
import AgCnt from './tabAComponents/AgCnt'
import MyExpma from './tabAComponents/MyExpma.vue'
import MyPara from './tabAComponents/MyPara.vue'
import AgNewSpecialCare from './tabAComponents/AgNewSpecialCare.vue'
import AgNewSpecialCareDays from './tabAComponents/AgNewSpecialCareDays.vue'
import AgEastmoneyStock from './tabAComponents/AgEastmoneyStock.vue'
import AgEastmoneyETF from './tabAComponents/AgEastmoneyETF.vue'
export default {
  components: {
    child1: AgEastmoneyStock,
    child2: AgEastmoneyETF,
    // child1: AgNewSpecialCareDays,
    // child2: AgNewSpecialCare,
    child3: ExpectHard2,
    child4: MyPara,
    child5: MyExpma,
    child6: AgCnt
  },
  setup() {
    const activeName = ref('first')
    const isChildUpdate1 = ref(true)
    const isChildUpdate2 = ref(false)
    const isChildUpdate3 = ref(false)
    const isChildUpdate4 = ref(false)
    const isChildUpdate5 = ref(false)
    const isChildUpdate6 = ref(false)
    return { activeName, isChildUpdate1, isChildUpdate2, isChildUpdate3, isChildUpdate4, isChildUpdate5, isChildUpdate6 }
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
        this.isChildUpdate5 = false
        this.isChildUpdate6 = false
      } else if (tab.paneName === 'second') {
        console.log('tab-second')
        this.activeName = 'second'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
        this.isChildUpdate3 = false
        this.isChildUpdate4 = false
        this.isChildUpdate5 = false
        this.isChildUpdate6 = false
      } else if (tab.paneName === 'third') {
        console.log('tab-third')
        this.activeName = 'third'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = true
        this.isChildUpdate4 = false
        this.isChildUpdate5 = false
        this.isChildUpdate6 = false
      } else if (tab.paneName === 'th_4') {
        console.log('tab-th_4')
        this.activeName = 'th_4'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
        this.isChildUpdate4 = true
        this.isChildUpdate5 = false
        this.isChildUpdate6 = false
      } else if (tab.paneName === 'th_5') {
        console.log('tab-th_5')
        this.activeName = 'th_5'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
        this.isChildUpdate4 = false
        this.isChildUpdate5 = true
        this.isChildUpdate6 = false
      } else if (tab.paneName === 'th_6') {
        console.log('tab-th_6')
        this.activeName = 'th_6'
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
        this.isChildUpdate4 = false
        this.isChildUpdate5 = false
        this.isChildUpdate6 = true
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
