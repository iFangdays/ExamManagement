<template>
  <div class="content" v-loading="loading">
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="题库名称">
          <el-input v-model="formInline.query" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-cascader v-model="formInline.id" :options="sortOptions" :props="props" @change="getAgainCategory" />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" :icon="Search" @click.stop="search">查询</el-button>
        <el-button :icon="Refresh" @click="refresh">重置</el-button>
        <el-button v-if="!isSelect" type="primary" :icon="Plus" @click.stop="openDialog(1)">新增</el-button>
        <el-button  v-if="!isSelect" type="warning" @click.stop="openShowBatchUpload">批量上传</el-button>
      </div>
    </div>
    <div class="table_box">
      <CommonTable ref="commonTable" :tableData="tableData" :columns="isSelect?columns.filter(i=>(i.label !== '序号' && i.label !== '操作')):columns.filter(i=>(i.label !== '选择'))" 
        :totalData="totalData" :pageable="pageable" @onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" @onSelectionChange="onSelectionChange" />
    </div>
    <template v-if="detailData.show">
      <CommonDialogForm
        width="60%"
        marginTop="1"
        v-model="detailData.show"
        title="题库管理"
        :rules="rules"
        :dialogType="detailData.type"
        :form-data="detailData.data"
        :form-option="formOptions()"
        :update-request-url="updateQuestion"
        :add-request-url="updateQuestion"
        @refreshData="getTableData"
      />
    </template>
    <template v-if="batchUpload.show">
      <BatchUpload v-model="batchUpload.show" @refresh="getTableData" />
    </template>
  </div>
</template>

<script setup lang="jsx">
import CommonTable from "@/components/commonTable";
import CommonDialogForm from "@/components/CommonDialogForm"
import {reactive, ref, onMounted, toRaw} from "vue";
import {ElMessage,ElMessageBox} from 'element-plus'
import {Search, Refresh, Plus} from '@element-plus/icons-vue'
import {getAllQuestion, updateQuestion, deleteQuestion} from "@/api/questionBankApi"
import {getAllQuestionType} from "@/api/tagManageApi"
import {getAllCategories} from "@/api/cascadeManageApi"
import {getLabelsByTypeId} from '@/api/tagManageApi'
import BatchUpload from "./batchUploadFile"
import {findFields} from "@/utils/utilsTool.js"
import { useStore } from 'vuex'
const store = useStore()
const loading = ref(false)
const deinfeEmit = defineEmits(['getSelect'])
const defineProps = defineProps({
  isSelect:{
    type:Boolean,
    default:false
  },
  selectId:{
    type:Array,
    default:()=>[]
  }
})

const batchUpload = reactive({
  show:false
})
function openShowBatchUpload(){
  batchUpload.show = true
}

const sortOptions = ref([])

const props = { children:'questionTypes',label:'typeName',value:'id' }
function getSortOptions(){
  getAllQuestionType()
      .then(res=>{
        sortOptions.value =  res
      })
      .finally(()=>{
        getCategoriesOptions()
        getAllTag()
      })
}

const categoryOptions = ref([])
function getAgainCategory(value){
  getCategoriesOptions(value[value.length - 1])
  getAllTag(value[value.length - 1])
}
function getCategoriesOptions(typeId = 2){
  let params = {typeId}
  getAllCategories(params)
    .then(res=>{
      categoryOptions.value = res
    })
}

const allTags = ref([])
function getAllTag(id = 2){
    getLabelsByTypeId(id)
      .then(res=>{
        allTags.value = res
      })
}

const formInline = reactive({
  query: '',
  id: [1,2]
})
const commonTable = ref(null)
const totalData = ref(0)
const pageable = reactive({
  page: 1, limit: 15
})
const tableData = ref([])
const rules = {
  quContent: [{required: true, message: '请输入问题内容', trigger: 'blur'}],
  sort: [{required: true, message: '请选择问题类型', trigger: 'blur'}],
  typeId: [{required: true, message: '请选择所属分类', trigger: 'blur'}],
  categoryId: [{required: true, message: '请选择级联类型', trigger: 'blur'}],
  trueOption: [{required: true, message: '请选择正确答案', trigger: 'blur'}],
  allOption: [{required: true, message: '请填写选项', trigger: 'blur'}],
  analysis: [{required: true, message: '请填写题目解析', trigger: 'blur'}],
}
const formOptions = ()=>[
  {label: '问题内容', prop: 'quContent', type: 'input'},
  {label: '内容图片 (单张)', prop: 'answerList', type:'onlyImagesUpload'},
  {
    label: '问题类型',
    prop: 'sort',
    type: 'select',
    options: [{label: '单选', value: 1}, {label: '多选', value: 2}, {label: '判断', value: 3}, {label: '解答', value: 4}]
  },
  {label: '问题难度', prop: 'level', type: 'input'},
  {label: '所属分类', prop: 'typeId',type:'cascader',options:sortOptions.value,props:{ children:'questionTypes',label:'typeName',value:'id' }},
  {label: '级联类型', prop: 'categoryId', type: 'cascader',options:categoryOptions.value,props:{ children:'categories',label:'categoryName',value:'id' }},
  {label: '所有选项', prop: 'allOption', type: 'allOption'},
  {label: '正确答案', prop: 'trueOption', type: 'trueSelect'},
  {label:'标签分类',prop:'questionLabels',render:({data,onUpdateData})=>{
    const selectId = ref([])
    let userId = store.getters['user/getUserId']
    selectId.value = data.questionLabels?.map(i=>i.labelId)
    const onChange = (val)=>{
      let res = val.map(i=>{
        let params = {
          createTime:null,
          userId:userId,
          questionId:data.id,
          labelId:i,
          labelName:allTags.value.find(item=>item.id === i).labelName
        }
        let oldId = data.questionLabels.find(item=>item.labelId === i)
        if(oldId){
          params.id = oldId.id
        }
        return params
      })
      onUpdateData(res,'questionLabels')
    }
    let allOption = allTags.value.map(i=>{
      return <el-option label={i.labelName} value={i.id}></el-option>
    })
    return (
      <el-select model-value={selectId.value} placeholder="请选择" collapse-tags collapse-tags-tooltip clearable multiple onChange={onChange}>
          {allOption}
      </el-select>
    )
  }},
  {label: '问题图片 (多张)', prop: 'questionList', type:'imagesUpload'},
  {label: '题目解析', prop: 'analysis', type: 'textarea'}
]
const columns = ref([
  {label: '序号', type: 'index', width: 80, align: 'center'},
  {label: '选择', type: 'selection', width: 80, align: 'center'},
  {label: '问题内容', prop: 'quContent'},
  {label: '问题类型', prop: 'sort',render:({row})=>{
    return <el-tag>{[_,'单选','多选','判断','解答'][row.sort]}</el-tag>
  }},
  {label: '问题难度', prop: 'level'},
  {label: '所属分类', prop: 'typeId',render:({row})=>{
    let res = findFields(toRaw(sortOptions.value),'id',row.typeId,'questionTypes')
    return res && res.typeName
  }},
  // {label: '所有选项', prop: 'allOption',render:({row})=>{
  //   if(row.allOption){
  //     return (
  //       <>
  //         { row.allOption.split('#').map((item,index)=><el-tag type="warning" key={index}>{item}</el-tag>) || null }
  //       </>
  //     )
  //   }
  // }},
  // {label: '正确答案', prop: 'trueOption',render:({row})=>{
  //   if(row.allOption){
  //     let optionsArr = row.allOption.split('#')
  //     return <el-tag type="success">{optionsArr[row.trueOption]}</el-tag>
  //   }
  // }},
  {label: '题目解析', prop: 'analysis'},
  // {
  //   label: '相关图片', prop: 'imageUrl', render: ({row}) => {
  //     return (
  //         <el-image
  //             style={{height: '80%', width: '80%'}}
  //             src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"
  //             preview-src-list={['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg']}
  //             preview-teleported
  //         />
  //     )
  //   }
  // },
  {
    label: "操作", width: 120, fixed: 'right', render: ({row}) => {
      return (
          <>
            <el-button type="primary" link onClick={()=>{openDialog(0,row)}}>
              编辑
            </el-button>
            <el-button type="danger" link onClick={()=>delQuestion(row.id)}>
              删除
            </el-button>
          </>
      )
    }
  },
])

onMounted(()=>{
  getSortOptions()
  getTableData()
})

function delQuestion(questionId){
  ElMessageBox.confirm('确定删除吗？',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{
  let params = {questionId}
  deleteQuestion(params)
    .then(res=>getTableData())
  }).catch(()=>{
    ElMessage({type:'info',message:'已取消'})
  })
  
}

function getTableData() {
  loading.value = true
    let params = {
    query:formInline.query,
    typeId:formInline.id[formInline.id.length - 1],
    pageNo:pageable.page,
    pageSize:pageable.limit
  }
  getAllQuestion(params)
    .then(res=>{
      tableData.value = res.data
      totalData.value = res.total
    })
    .finally(()=>{
      loading.value = false
      defineProps.selectId.length && toggleSelect(defineProps.selectId)
    })
}

function refresh(){
  formInline.query = ''
  formInline.id = [1,2]
  pageable.page = 1
  getTableData()
}

function search() {
  pageable.page = 1
  getTableData()
}

const detailData = reactive({
  show: false,
  type:0,
  data: {}
})

function openDialog(type = 0,data) {
  detailData.show = true
  detailData.type = type
  detailData.data = data
}

function onSizeChange(val) {
  pageable.pageSize = val
  getTableData()
}

function onCurrentChange(val) {
  pageable.pageNum = val
  getTableData()
}

function toggleSelect(array=[]){
  let selectArray = []
  array.forEach(element => {
    let res = tableData.value.find(i=>i.id == element);
    res && selectArray.push(res)
  });
  if(selectArray.length){
    selectArray.forEach(i=>{
    commonTable.value.tableRef.toggleRowSelection(i)
    })
  }

}

function onSelectionChange(val){
  deinfeEmit('getSelect',val)
}

</script>

<style scoped lang="scss">
.content {
  height: 100%;
  background: #ffffff;
  padding: 20px 10px;

  .search {
    height: 80px;
    display: flex;
    justify-content: space-between;
  }

  .table_box {
    height: calc(100% - 80px);
  }
}
:deep(.el-upload-list--picture-card .el-upload-list__item-actions span + span) {
  margin-left: 0.5rem !important;
}

:deep(.el-tag) {
  margin: 5px 2px;
}
</style>
