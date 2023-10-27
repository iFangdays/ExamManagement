<template>
  <el-dialog v-bind="$attrs" title="选择题目" width="90%" append-to-body style="margin-top:2vh;margin-bottom:0">
    <div class="content">
        <QuestionBankManage isSelect @getSelect="getSelect" :selectId="selectId" />  
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.stop="onHandleClose">取消</el-button>
        <el-button type="primary" @click.stop="onSure">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import QuestionBankManage from "@/pages/questionBankManage";
import msg from "@/utils/resetMessage";
const emits = defineEmits(['getChangeSelection'])
const props = defineProps(['selectId'])
const selectArray = ref([])

function getSelect(val){
    if(val.length){
        selectArray.value =  val.map(i=>{
          return {id:i.id,name:i.quContent}
        })
    }
}

function onHandleClose() {
  emits('update:modelValue', false)
}
function onSure() {
  msg.success('选题成功，请填写对应分值')
  emits('getChangeSelection',selectArray.value)
  onHandleClose()
}
</script>

<style scoped lang="scss">
.content{
    height: 75vh;
    overflow: auto;
}
</style>
