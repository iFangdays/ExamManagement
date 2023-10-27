<template>
  <Echarts :id="id" :options="options" :width="size[0]" :height="size[1]"/>
</template>
<script>
export default { name: 'LineAndBar' }
</script>
<script setup>
import Echarts from './Echarts'
import {onMounted, ref, watchEffect} from "vue";

const options = ref()
const props = defineProps({
  id: {
    type: String,
    default: 'lineAndBar_echarts'
  },
  size: {
    type: Array,
    default: () => ["100%", "100%"]
  },
  xData: {
    type: Array,
    default: () => []
  },
  yData: {
    type: Array,
    default: () => []
  },
  textColor: {
    type: String,
    default: "#777"
  },
  grid: {
    type: Object,
    default: () => {
      return {top: "80", left: "30", right: "30", bottom: "30", containLabel: true,}
    }
  },
  dataZoom: {
    type: Boolean,
    default: false
  },
  title: {
    type: Object,
    default: () => {
      return {}
    }
  },
  legend:{
    type:Object,
    default:()=>{
      return {
        top:20
      }
    }
  },
  isToolbox:{
    type:Boolean,
    default:true
  },
  yUnit: {
    type: Array,
    default: () => []
  }
})
watchEffect(()=>loadEcharts())
onMounted(()=>{
  loadEcharts()
})

function loadEcharts() {
  // 获取主题颜色
  let colors = props.yData.length ? props.yData?.map(v => v.color) : [];
  // 获取每种表格的数据
  let series = [];
  props.yData.length ? props.yData?.forEach((v) => {
        let item = {
          type: v.type,
          name: v.name,
          yAxisIndex: v.index,
          data: v.list
        }
        switch (v.type) {
          case 'line':
            item = {
              ...item,
              smooth: v.smooth ?? true,
              symbol: 'circle',
              showSymbol: v.smooth ?? false,
              symbolSize: v.symbolSize ?? 8,
              areaStyle: {
                opacity: 0.04
              },
              ...v
            }
            break
          case 'bar':
            item = {
              ...item,
              barMaxWidth: 15
            }
            break
          default:
            break
        }
        series.push(item)
      })
      : (series = []);
  options.value = {
    backgroundColor: "transparent",
    // 提示信息配置
    tooltip: {
      trigger: "axis",
      borderColor: "transparent",
      borderWidth: 1,
      backgroundColor: "rgba(0,0,0,.6)",
      padding: 10,
      // 坐标轴指示器配置项
      axisPointer: {
        lineStyle: {
          type: "dashed",
          color: "rgba(0, 0, 0, 0.1)"
        }
      },
      // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
      formatter: params => {
        let a = "";
        let b = "";
        let html = "";
        params.forEach((v, i) => {
          a = `
                  <div style="display: flex; flex-direction: column;font-size: 14px;">
                    <div style="color:#fff;margin-bottom:5px">
                      <span>${v.name}</span>
                    </div>
                `;
          b += `
                  <div style="color: #fff;display:flex;align-items:center;">
                    <i style="width:8px;height:8px;border-radius:8px;margin-right:5px;background-color:${v.color}"></i>
                    <span>${props.yData[i].name} ：</span>
                    <span>${v.value}${props.yData[i].unit}</span>
                  </div>
                `;
        });
        html = a + b + "</div>";
        return html;
      }
    },

    // X轴配置项(刻度线、文本、数据)
    xAxis: [
      {
        type: "category",
        axisLine: { show: true, lineStyle: { type: "solid", color: "#d8d9dc", width: "1" } },
        axisLabel: {
          color: props.textColor,
          lineHeight: 16,
          rotate:45,
          // interval: 0, // 强制文字产生间隔
          // formatter: params => {
          //   let newParamsName = ""; // 最终拼接成的字符串
          //   let paramsNameNumber = params.length; // 实际标签的个数
          //   let provideNumber = 10; // 每行能显示的字的个数
          //   let rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
          //   /**
          //    * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
          //    */
          //   // 条件等同于rowNumber>1
          //   if (paramsNameNumber > provideNumber) {
          //     /** 循环每一行,p表示行 */
          //     for (let p = 0; p < rowNumber; p++) {
          //       let tempStr = ""; // 表示每一次截取的字符串
          //       let start = p * provideNumber; // 开始截取的位置
          //       let end = start + provideNumber; // 结束截取的位置
          //       // 此处特殊处理最后一行的索引值
          //       if (p === rowNumber - 1) {
          //         // 最后一次不换行
          //         tempStr = params.substring(start, paramsNameNumber);
          //       } else {
          //         // 每一次拼接字符串并换行
          //         tempStr = params.substring(start, end) + "\n";
          //       }
          //       newParamsName += tempStr; // 最终拼成的字符串
          //     }
          //   } else {
          //     // 将旧标签的值赋给新标签
          //     newParamsName = params;
          //   }
          //   // 将最终的字符串返回
          //   return newParamsName;
          // }
        },
        splitLine: { show: false },
        boundaryGap: props.yData.some(item=>item.type === 'bar'),
        data: props.xData
      }
    ],
    // y轴配置项(刻度线及文本)
    yAxis:props.yUnit?.map((v)=>{
      return {
        type: "value",
        name:v,
        alignTicks:true,
        nameLocation:'end',
        nameTextStyle:{ color:'#666'},
        nameGap: 20,
        splitLine: { show: true, lineStyle: { color: "#d8d9dc", opacity: 1, type: "dashed" } },
        axisLabel: { show: true, margin: 15, color: props.textColor, align: "center" },
        axisTick: { show: false },
        axisLine: { show: true , lineStyle: { type: "solid", color: "#d8d9dc", width: "1" }}
      }
    }),
    // 标题
    title: props.title,
    // 图标距离上下左右的边距
    grid: props.grid,
    // 调色盘颜色列表。如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色。
    color: colors,
    // 图标类型配置(支持曲线图、柱状图、散点气泡图)
    series: series,
    // 工具
    toolbox:{
      show:props.isToolbox,
      top:15,
      feature:{
        // 局部缩放还原
        dataZoom: {
          yAxisIndex: 'none'
        },
        // 下载
        saveAsImage:{},
      }
    },
    legend: props.legend,
    // 缩放
    dataZoom: props.dataZoom ? [{
      type: "slider",
      start: 0,
      end: 100,
      height: 16,
      textStyle: { color: props.textColor, fontWeight: "bold", fontSize: 12 },
      xAxisIndex: [0, 1],
      bottom: 10
    }] : []
  };
}


</script>

<style scoped>

</style>
