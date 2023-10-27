<template>
  <el-dialog v-bind="$attrs" :title="`${dialogType === 1 ? '新增' : '编辑'} - ${title}`" :width="width" :style="`margin-top:${marginTop}vh;margin-bottom:0`">
    <div class="content" v-loading="loading">
      <el-form ref="formRef" :model="formInline" status-icon label-width="80" class="default_form" :rules="rules">
        <template v-for="item in formOption">
          <template v-if="item.type === 'input'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-input v-model="formInline[item.prop]" placeholder="请输入" clearable :disabled="item.disabled" />
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'passwordInput'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-input v-model="formInline[item.prop]" type="password" show-password placeholder="请输入" clearable :disabled="item.disabled" />
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'select'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-select v-model="formInline[item.prop]" placeholder="请选择" clearable :disabled="item.disabled" @change="(value)=>selectchange(value,item.prop)">
                <el-option :label="option.label" :value="option.value" v-for="(option, i) in item.options" :key="i" />
              </el-select>
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'trueSelect'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-select v-model="formInline[item.prop]" placeholder="请选择" clearable :disabled="item.disabled" :multiple="formInline?.sort === 2">
                <el-option :label="option" :value="String(i+1)" v-for="(option, _,i) in allOptionsArrayMap" :key="i" />
              </el-select>
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'cascader'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-cascader v-model="formInline[item.prop]" :disabled="item.disabled" :options="item.options" :props="item.props" />
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'checkbox'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-checkbox-group v-model="formInline[item.prop]" :disabled="item.disabled">
                <el-checkbox :label="option.label" :name="option.value" :key="index" v-for="(option, index) in item.options" />
              </el-checkbox-group>
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'switch'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-switch v-model="formInline[item.prop]" :disabled="item.disabled" />
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'radio'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-radio-group v-model="formInline[item.prop]" :disabled="item.disabled">
                <el-radio :label="option.label" v-for="(option, index) in item.options" :key="index" />
              </el-radio-group>
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'textarea'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop" style="width: 100%">
              <el-input v-model="formInline[item.prop]" type="textarea" :disabled="item.disabled" />
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'date'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-date-picker v-model="formInline[item.prop]" type="date" placeholder="请选择" value-format="YYYY-MM-DD" :disabled="item.disabled" />
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'allOption'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop" style="width: 100%">
              <div class="allOptions">
                <template v-for="(opt, i) in allOptionsArray" :key="opt">
                  <el-input v-model="allOptionsArrayMap[i]">
                    <template #prepend>{{ ['A', 'B', 'C', 'D', 'E', 'F'][i] }}</template>
                    <template #append
                      ><el-icon @click.stop="deleteOneOption(allOptionsArrayMap[i])" class="delIcon"> <Close /> </el-icon
                    ></template>
                  </el-input>
                </template>

                <div class="addOption">
                  <el-button type="primary" @click.stop="addOption">新增</el-button>
                </div>
              </div>
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'imagesUpload'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop" style="width: 100%">
              <el-upload
                v-model:file-list="formInline[item.prop]"
                action="#"
                multiple
                list-type="picture-card"
                accept=".jpg,.png,.jpeg"
                :http-request="uploadImage"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <el-icon>
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'onlyImagesUpload'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <el-upload
                ref="onlyImagesUpload"
                v-model:file-list="formInline[item.prop]"
                action="#"
                list-type="picture-card"
                accept=".jpg,.png,.jpeg"
                :limit="1"
                :http-request="uploadAnswer"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
              >
                <el-icon>
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
          </template>

          <template v-else-if="item.type === 'setScore'">
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
              <div class="set_score">
                <el-input v-model="formInline[item.prop]" disabled></el-input>
                <el-button type="primary" @click.stop="setScoreDialog">设置分值</el-button>
              </div>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item :label="item.label" :prop="item.prop" :key="item.prop" >
              <component :is="item.render" :data="formInline" :key="item.prop" @updateData="updateData" />
            </el-form-item>
          </template>
        </template>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click.stop="onHandleClose">取消</el-button>
        <el-button type="primary" @click.stop="onSure">确定</el-button>
      </span>
    </template>
    <template v-if="imgDialog">
      <el-dialog v-model="imgDialog" title="图片预览">
        <div class="img_box">
          <el-image :src="dialogImageUrl" fit="cover" />
        </div>
      </el-dialog>
    </template>
    <template v-if="setScore.show">
        <SetQuestionScore
            v-model="setScore.show"
            :data="setScore.data"
            @sureScore="receiveScore"
         />
    </template>
  </el-dialog>
</template>

<script setup>
import SetQuestionScore from '@/pages/simulateExamManage/setQuestionScore'
import { Plus, Close } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import msg from '@/utils/resetMessage'
import { uploadImages } from '@/api/questionBankApi'
import store from '@/store'
const emits = defineEmits(['refreshData'])
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  dialogType: {
    type: Number,
    default: 0
  },
  width: {
    type: String,
    default: '40%'
  },
  formOption: {
    type: Array,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => {}
  },
  rules: {
    type: Object,
    default: () => {}
  },
  addRequestUrl: {
    type: Function
  },
  updateRequestUrl: {
    type: Function
  },
  marginTop:{
    type:String,
    default:'15'
  }
})
const formRef = ref(null)
const formInline = reactive({})

function updateData(data,fidlds){
  formInline[fidlds] = data
}

onMounted(() => {
  if (props.dialogType === 0) {
    Object.assign(formInline, props.formData)
    creareFields()
    allOptionsArray.value = formInline?.allOption?.split('#')
    optionArrayToMap()
  } else {
    formInline.userId = store.state.user.userInfo.id
  }
})
const loading = ref(false)
function uploadAnswer(data) {
  loading.value = true
  const fd = new FormData()
  fd.append('file', data.file)
  fd.append('typeId', formInline.typeId)
  uploadImages(fd)
    .then(res => {
      let currentIndex = isHasFields('answer')
      let addressListArray = formInline['imageList'][currentIndex]
      addressListArray['addressList'] = [res]
    })
    .finally(() => (loading.value = false))
}
function uploadImage(data) {
  const fd = new FormData()
  fd.append('file', data.file)
  fd.append('typeId', formInline.typeId)
  promiseRequest.value.push({ uid: data.file.uid, fd })
}
const promiseRequest = ref([])

function batchUploadImage(fd) {
  uploadImages(fd).then(res => {
    let currentIndex = isHasFields()
    pushImage(currentIndex, res)
  })
}

function pushImage(currentIndex, res) {
  let addressListArray = formInline['imageList'][currentIndex]
  let isHas = addressListArray['addressList']?.find(i => i === res)
  if (!isHas) {
    addressListArray['addressList'].push(res)
  } else {
    msg.warning('图片名称已存在')
  }
}

function isHasFields(fields = 'question') {
  if (!formInline['imageList']) {
    formInline['imageList'] = []
  }
  let isHasQuestion = formInline['imageList']?.find(i => i.type === fields)
  if (!isHasQuestion) {
    formInline['imageList'].push({
      type: fields,
      addressList: []
    })
  }
  return formInline['imageList'].findIndex(i => i.type === fields)
}

const onlyImagesUpload = ref(null)

const handleExceed = uploadFile => {
  uploadAnswer({ file: uploadFile[0] })
  onlyImagesUpload.value.clearFiles()
  onlyImagesUpload.value.handleStart(uploadFile[0])
}

const handleRemove = uploadFile => {
  let deleteUrl = uploadFile.url.split('/')
  formInline.imageList = formInline.imageList.map(i => {
    i.addressList = i.addressList.filter(img => {
      let imgName = img.split('/')
      return imgName[imgName.length - 1] !== deleteUrl[deleteUrl.length - 1]
    })
    return i
  })
}
const dialogImageUrl = ref('')
const imgDialog = ref(false)
const handlePictureCardPreview = uploadFile => {
  dialogImageUrl.value = uploadFile.url
  imgDialog.value = true
}

function creareFields() {
  if (!formInline['imageList']) {
    return
  } else {
    let answerArray = formInline['imageList'].find(i => i.type === 'answer') || { type: 'answer', addressList: [] }
    let questionArray = formInline['imageList'].find(i => i.type === 'question') || { type: 'question', addressList: [] }

    formInline['answerList'] = answerArray.addressList?.map(i => {
      return { url: window.URL_CONFIG.URL + '/exam/' + i }
    })
    formInline['questionList'] = questionArray.addressList?.map(i => {
      return { url: window.URL_CONFIG.URL + '/exam/' + i }
    })
  }
}

function filterFields(params) {
  params['questionList'] && delete params.questionList
  params['answerList'] && delete params.answerList
  if (params.categoryId && typeof params.categoryId === 'object') {
    params.categoryId = params.categoryId[params.categoryId.length - 1]
  }
  if (params.typeId && typeof params.typeId === 'object') {
    params.typeId = params.typeId[params.typeId.length - 1]
  }
  if (allOptionsArrayMap.value && Object.values(allOptionsArrayMap.value)) {
    params.allOption = Object.values(allOptionsArrayMap.value).join('#')
  }
  if (params.parentId && typeof params.parentId === 'object') {
    params.parentId = params.parentId[params.parentId.length - 1]
  }
  return { ...params }
}

function onSure() {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      if (promiseRequest.value.length) {
        let paramsArray = promiseRequest.value.map(i => batchUploadImage(i.fd))
        Promise.all(paramsArray).then(() => {
          promiseRequest.value = []
          setTimeout(() => {
            submitApi()
          }, 2000)
        })
      } else {
        submitApi()
      }
    } else {
      msg.warning('校验不通过')
    }
  })
}

function submitApi() {
  let params = filterFields(formInline)
  if (props.dialogType) {
    props
      .addRequestUrl(params)
      .then(res => {
        console.log(res)
        msg.success('新增成功')
      })
      .finally(() => {
        onHandleClose()
        emits('refreshData')
      })
  } else {
    props
      .updateRequestUrl(params)
      .then(res => {
        console.log(res)
        msg.success('更新成功')
      })
      .finally(() => {
        onHandleClose()
        emits('refreshData')
      })
  }
}

function onHandleClose() {
  emits('update:modelValue', false)
}

const allOptionsArray = ref([])
const allOptionsArrayMap = ref({})

function optionArrayToMap() {
  let obj = {}
  allOptionsArray.value?.map((key, value) => {
    obj[value] = key
  })
  allOptionsArrayMap.value = obj
}

function deleteOneOption(opt) {
  allOptionsArray.value = Object.values(allOptionsArrayMap.value).filter(i => i !== opt)
  optionArrayToMap()
}
function addOption() {
  allOptionsArray.value = Object.values(allOptionsArrayMap.value)
  formInline.allOption = Object.values(allOptionsArrayMap.value).join('#')
  allOptionsArray.value.push('')
    
}
function selectchange(value,fidlds){
  if(fidlds === 'sort'){
    formInline.trueOption = value === 2 ? [formInline.trueOption] : (String(formInline.trueOption[0]) || '')
  }
}

const setScore = reactive({
  show:false,
  data:[]
})

function setScoreDialog(){
  let idsArray = formInline?.questionIds ? formInline.questionIds.split('#') : []
  let scoreArray = formInline?.questionScore ? formInline.questionScore.split('#') : []
  let res = idsArray.map((ids,index)=>{
    let score = scoreArray[index] ? scoreArray[index] : 0
    return {ids,score,name:formInline['questionNameMap'][ids]}
  })
  setScore.show = true
  setScore.data = res
} 
function receiveScore(data=[]){
 let ids = data.map(i=>i.ids).join('#')
 let score = data.map(i=>i.score).join('#')
 let newIdNameMap = {}
 for (const key in data) {
  newIdNameMap[data[key].ids] = data[key].name
 }
 formInline.questionNameMap = newIdNameMap
 formInline.questionIds = ids
 formInline.questionScore = score
}
</script>

<style scoped lang="scss">
.content {
  height: 100%;

  .default_form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: 49%;
      margin: 10px 0;
    }
  }
}

.img_box {
  margin: auto;
  width: 100%;
  height: 100%;

  img {
    height: 100%;
    width: 100%;
  }
}

:deep(.el-form-item__content) {
  align-content: flex-start;
}

.allOptions {
  width: 100%;
  .el-input-group {
    margin: 5px 0;
    .delIcon {
      cursor: pointer;
    }
  }
  .addOption {
    display: flex;
    justify-content: flex-end;
  }
}

.set_score{
  width: 100%;
  display: flex;
  justify-content: space-between;
  .el-input{
    width: 70%;
  }
}
</style>
