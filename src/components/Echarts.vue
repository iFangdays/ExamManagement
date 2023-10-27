<!--
  ecahrts组件(支持自适应)
      Attributes
          1、id             echarts图表id（若页面中只有一个ecahrts图表，可不传）
          2、options        echarts配置项（必传）
          3、width          宽，默认100%
          4、height         高，默认100%

      Demo==>
          <div class="echarts-box" style="width: 80%; height: 300px">
            <Echarts id="echarts" :options="echartsOptions.obj"></Echarts>
          </div>

          const echartsOptions = reactive({
            obj: {
              title: {
                text: 'ECharts 入门示例'
              },
              tooltip: {},
              xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
              },
              yAxis: {},
              series: [
                {
                  name: '销量',
                  type: 'bar',
                  data: [5, 20, 36, 10, 10, 20]
                }
              ]
            }
          })
-->
<template>
  <div :id="id" :style="[ecahrtsStyle]"></div>
</template>

<script>
export default { name: 'Echarts' }
</script>
<script setup>
import { computed, onMounted, onUnmounted, watchEffect } from 'vue'
import * as echarts from 'echarts'
const props = defineProps({
  id: {
    type: String,
    default: 'echarts'
  },
  options: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '100%'
  }
})

// 设置echarts的宽高
const ecahrtsStyle = computed(() => {
  return {
    width: typeof props.width === 'string' ? props.width : props.width + 'px',
    height: typeof props.height === 'string' ? props.height : props.height + 'px'
  }
})

let echartsInstance = null
// 初始化echarts,并设置options
onMounted(() => {
  echartsInstance = echarts.init(document.getElementById(props.id))
  watchEffect(() => echartsInstance.setOption(props.options))
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  if (echartsInstance) {
    echartsInstance.dispose()
  }
  window.removeEventListener('resize', resize)
})

function resize() {
  echartsInstance.resize()
}
</script>
