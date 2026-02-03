<template>
  <div>
    <div class="text-container">
      <p>WARN:</p>
      <p>1. 同1板块只能1只</p>
      <p>2. 单只禁止超2w</p>
      <p>3. 总额度禁止超3w</p>
      <p>4. 早10:20左右sell</p>
      <p>5. 下午13:10左右buy</p>
      <p>6. 5k+5k,-5%必须sell</p>
      <p>7. 90天10倍特别注意最近几天的</p>
    </div>
    <div>
      <el-link type="primary">===== 我是底线 =====</el-link>
    </div>
    <div>
      <el-link type="primary">===== 我是底线 =====</el-link>
    </div>
    <div>
      <el-link type="primary">===== 我是底线 =====</el-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import 'element-plus/dist/index.css'

export default {
}
</script>

<style scoped>
.text-container p {
  text-align: left; /* 或者使用 text-align: start; 根据需要 */
  color:brown;
  font-size: 18px;
  line-height: 0.5; /* 调整行间距 */
}
</style>
