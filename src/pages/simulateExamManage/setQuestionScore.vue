<template>
<el-dialog v-bind="$attrs" title="设置分值" width="50%">
    <div class="content">
      <div class="addQuestion">
        <el-button type="primary" @click.stop="addNewQuestion">新增考题</el-button>
      </div>
      <CommonTable :tableData="tableData" :columns="columns" :isPagination="false" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.stop="onHandleClose">取消</el-button>
        <el-button type="primary" @click.stop="onSure">确定</el-button>
      </span>
    </template>
    <template v-if="addQuestionDialog.show">
      <SelectQuestion
      v-model="addQuestionDialog.show"
      :selectId="addQuestionDialog.data"
      @getChangeSelection="getChangeSelection"
       />
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import { onMounted, reactive, ref } from 'vue'
import CommonTable from '@/components/commonTable'
import SelectQuestion from './selectQuestion.vue'
import msg from "@/utils/resetMessage";
const emits = defineEmits(['sureScore'])
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {
  tableData.value = props.data
})

const tableData = ref([])
const columns = ref([
  { label: '序号', type: 'index', width: 80, align: 'center' },
  { label: '题号', prop: 'ids' },
  {label:"题目",prop:'name'},
  {
    label: '分值',
    prop: 'score',
    render: ({ row }) => {
      return <el-input v-model={row.score}></el-input>
    }
  },
  {
    label: '操作',
    width: 100,
    render: ({ row }) => {
      return (
        <el-tag type="danger" style={{ cursor: 'pointer' }} onClick={()=>delIds(row.ids)}>
          删除
        </el-tag>
      )
    }
  }
])

function delIds(ids){
    tableData.value = tableData.value.filter(i=>i.ids !== ids)
    msg.success('删除成功, 提交生效')
}

const addQuestionDialog = reactive({
  show: false,
  data:[]
})
function addNewQuestion() {
  addQuestionDialog.show = true
  addQuestionDialog.data = tableData.value.map(i=>i.ids)
}

function onHandleClose() {
  emits('update:modelValue', false)
}
function onSure() {
  let isEmpty = tableData.value.some(i=>i.score == '')
  if(isEmpty){
  msg.error('存在未设置分值的题目，请完善！')
  }else{
  msg.success('分值设置成功')
  emits('sureScore', tableData.value)
  onHandleClose()
  }

}

function getChangeSelection(val){
    if(val.length){
      let res = val.map(i=>{
           let has = tableData.value.find(item=>item.ids == i.id)
           return has ? has : {ids:i.id,score:'',name:i.name}
        })
      tableData.value = res
    }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  .addQuestion {
    display: flex;
    justify-content: flex-end;
    height: 50px;
  }
}
</style>
