<template>
  <el-dialog v-bind="$attrs" title="批量上传题库" width="40%">
    <div class="upload_content">
        <el-upload
          drag
          action="#"
          accept=".xlsx,.xls"
          :http-request="uploadData"
        >
        <el-icon class="upload_icon"> <UploadFilled/> </el-icon>
        <template #tip>
          <div class="upload_tip">
           注意 : 仅允许上传 .xlsx 和 .xls 后缀的 Excel 文件
          </div>
        </template>
        </el-upload>
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
import {onMounted, reactive, ref} from "vue";
import {UploadFilled} from '@element-plus/icons-vue'
import { uploadDataFile } from "@/api/questionBankApi";
import msg from "@/utils/resetMessage"
const emits = defineEmits(['refresh']);

const fileData = ref()

function uploadData(file){
    if(file.file){
        fileData.value = file.file
        msg.success('导入成功,等待上传')
    }
}

function onSure(){
  if(!fileData.value){
    msg.warning('请导入 Excel 文件')
    return 
  }
  const fd = new FormData()
  fd.append('file',fileData.value)
  uploadDataFile(fd)
    .then(res=>{
        msg.success('上传成功')
        onHandleClose()
        emits('refresh')
    })
}
function onHandleClose() {
  emits('update:modelValue', false)
}   
</script>

<style lang="scss">
.upload_icon{
    font-size: 50px;
}
.upload_tip{
  margin-top: 20px;
  color: red;
}
</style>