<template>
  <el-row>
    <el-col :span="24">
      <v-chart class="chart" :options="chartOptions" autoresize />
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
} from 'echarts/components';
import 'echarts/i18n/langEN'; // 根据需要引入语言包

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
]);

export default defineComponent({
  components: { VChart },
  data() {
    return {
      chartOptions: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      }
    };
  }
});
</script>

<style scoped>
  .chart {
    width: 100%; /* 或者具体宽度 */
    height: 400px; /* 或者具体高度 */
  }
</style>
  