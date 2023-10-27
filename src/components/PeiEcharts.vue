<template>
  <Echarts :id="id" :options="options" :width="size[0]" :height="size[1]"/>
</template>

<script>
export default { name: "PeiEcharts" }
</script>

<script setup>
import Echarts from './Echarts'
import {ref, onMounted, watchEffect} from "vue";


const props = defineProps({
  id: {
    type: String,
    default: "PeiEcharts"
  },
  size: {
    type: Array,
    default: () => ["100%", "100%"]
  },
  data:{
    type: Array,
    default:() => []
  },
  textColor: {
    type: String,
    default: '#000'
  },
  legend: {
    type: Object,
    default: () => {
      return {show: true,top: 35, right: 5, itemGap: 20,orient:'vertical',icon: "circle",}
    }
  },
})

const radius = ref(['50%', '65%'])
const options = ref({})
function loadEcharts(){
  let peiData = props.data.map((v,i)=>{
    let total = 0
    v.data = v.data.map((item, index) => {
      total += item.value
      return {
        ...item,
        // 设置圆圈样式
        itemStyle : {
          borderWidth: 5,
          borderRadius: 100,
          color:v.colors[index],
          borderColor: '#fff',
          ...v.style,
        },
      }
    });
    return {
      ...v,
      total
    }
  })
  options.value = {
    backgroundColor: 'transparent',
    legend: props.legend,
    toolbox:{
      show:true,
      top:0,
      feature:{
        saveAsImage:{},
      }
    },

    title: {
      show: false,
      text: peiData[0].total,
      subtext: peiData[0].unit ? `总数(${peiData[0].unit})` : `总数`,
      left: 'center',
      top: 'center',
      textStyle: {
        color: props.textColor,
        fontSize: 32
      },
      subtextStyle: {
        color: props.textColor,
        fontSize: 18
      }
    },

    tooltip: {
      borderColor: 'transparent',
      borderWidth: 1,
      backgroundColor: 'rgba(0,0,0,.6)',
      padding: 10,
      textStyle: { color: '#fff' },
      formatter:  (params) => {
        let html
        if(params.name){
          html = `<div style="display: flex; flex-direction: column;font-size: 14px;">
                      <span style="font-size: 18px;margin-bottom:10px">${params.name}</span>
                      <span>数值：${params.value}</span>
                      <span>占比：${params.percent}%</span>
                    </div>`
        }else{
          html = ''
        }

        return html
      }
    },
    series: createSeries(peiData),
  }
}

function createSeries(peiData){
  return peiData.map((v)=>{
    return {
      ...v,
      name: '',
      type: 'pie',
      radius: v.radius ||radius.value,
      left:'-30%',
      emphasis:{
        disabled:true,
        scaleSize:15,
        focus:'self'
      },
      label: {
        show:false,
        position: 'outside',
        color: props.textColor,
        formatter: (params) => {
          let total = 0
          v.data.forEach(v => (total += v.value))
          if (params.name !== '') {
            return `${params.name}\n\n${params.value}${v.unit} ${params.percent}%`
          }
          return ''
        }
      },
      labelLine: { show: false, length: 50 },
      data: v.data,
    }
  })
}
watchEffect(()=>loadEcharts())
onMounted(()=>loadEcharts())
</script>

<style scoped lang="scss">

</style>
