<template>
  <div class="content" v-loading="loading">
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="考试名称">
          <el-input v-model="formInline.query"/>
        </el-form-item>
         <el-form-item label="所属分类">
          <el-cascader v-model="formInline.id" :options="sortOptions" :props="props" @change="getAgainCategory" />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" :icon="Search" @click.stop="search">查询</el-button>
        <el-button :icon="Refresh" @click.stop="refresh">重置</el-button>
        <el-button type="primary" :icon="Plus" @click.stop="openDialog(1)">新增</el-button>
      </div>
    </div>
    <div class="table_box">
      <CommonTable :tableData="tableData"
                   :columns="columns"
                   :totalData="totalData"
                   :pageable="pageable"
                   @onSizeChange="onSizeChange"
                   @onCurrentChange="onCurrentChange" />
    </div>
    <template v-if="detailData.show">
      <CommonDialogForm
          v-model="detailData.show"
          title="真题管理"
          width='60%'
          :rules='rules'
          :dialogType="detailData.type"
          :form-option="formOptions()"
          :form-data="detailData.data"
          :update-request-url="addAndUpdateExam"
          :add-request-url="addAndUpdateExam"
          @refresh-data="getTableData"
      />
    </template>

  </div>
</template>

<script setup lang="jsx">
import CommonTable from "@/components/commonTable";
import {onMounted, reactive, ref, toRaw} from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import CommonDialogForm from "@/components/CommonDialogForm"
import {getSimulateExam,addAndUpdateExam,deleteSimulateExam} from "@/api/simulateExamManageApi";
import {getAllQuestionType} from "@/api/tagManageApi"
import msg from "@/utils/resetMessage";
import {findFields} from "@/utils/utilsTool.js"


const loading = ref(false)


const formInline = reactive({
  query: '',
  id: [1,2]
})
const sortOptions = ref([])
const props = { children:'questionTypes',label:'typeName',value:'id' }
function getSortOptions(){
  getAllQuestionType()
      .then(res=>{  
        sortOptions.value =  res
      })
      .finally(()=>{})
}


const totalData = ref(0)
const pageable = reactive({
  page: 1, limit: 15
})
const tableData = ref([])
const rules = {
  examName:[{required: true, message: '请输入考试名称', trigger: 'blur'}],
  questionScore:[{required: true, message: '请设置问题得分', trigger: 'blur'}],
  typeId:[{required: true, message: '请选择具体分类', trigger: 'blur'}],
  duration:[{required: true, message: '请设置考试时间', trigger: 'blur'}],
  totalScore:[{required: true, message: '请设置考试总分', trigger: 'blur'}],
  passScore:[{required: true, message: '请设置及格线', trigger: 'blur'}],
  status:[{required: true, message: '请选择考试状态', trigger: 'blur'}],
}
const formOptions = ()=>[
  {label:'考试名称',prop:'examName',type:'input'},
  {label:'问题得分',prop:'questionScore',type:'setScore'},
  {label:'具体分类',prop: 'typeId',type:'cascader',options:sortOptions.value,props:{ children:'questionTypes',label:'typeName',value:'id' }},
  {label:'考试时间',prop:'duration',type:'input'},
  {label:'考试总分',prop:'totalScore',render:({data,onUpdateData})=>{
    let total = data.questionScore?.split('#') || []
    let value = total.reduce((pre,item)=>{
        return pre + Number(item)
    },0)
    onUpdateData(value,'totalScore')
    return (
        <el-input input-style={{'text-align':'center'}} model-value={value} disabled v-slots={{
                append:()=>'分'
            }}/>
    )
  }},
  {label:'及格线',prop:'passScore',render:({data,onUpdateData})=>{
    const changeData = (val)=> onUpdateData(val,'passScore')
    return (
        <el-input input-style={{'text-align':'center'}} onChange={changeData} v-model={data.passScore}  v-slots={{
                append:()=>'分'
            }}/>
    )
  }},
  {label:'考试状态',prop:'status',type:'select',options:[{label:'有效',value:0},{label:'无效',value:1}]},
  {label:'考试描述',prop:'examDesc',type:'textarea'},
]
const columns = ref([
  {label:'考试名称', prop:'examName'},
  {label:'具体分类', prop:'typeId',render:({row})=>{
    let res = findFields(toRaw(sortOptions.value),'id',row.typeId,'questionTypes')
    return res && res.typeName 
  }},
  {label:'考试时间（min）', prop:'duration'},
  {label:'考试及格线', prop:'passScore'},
  {label:'考试总分', prop:'totalScore'},
  {label:'考试状态', prop:'status',render:({row})=>{
    return <el-tag type={row.status?'error':'success'}>{['有效','无效'][row.status]}</el-tag>
  }},
  {label:'考试描述', prop:'examDesc'},
  {
    label: "操作", width: 120, fixed: 'right', render: ({row}) => {
      return (
          <div>
            <el-button type="primary" link onClick={()=>openDialog(0,row)}>
              编辑
            </el-button>
            <el-button type="danger" link onClick={()=>deleteTag(row.id)}>
              删除
            </el-button>
          </div>
      )
    }
  },    
])

onMounted(()=>{
  getSortOptions()
  getTableData()
})

function getTableData(){
  loading.value = true
  let params = {
    query:formInline.query,
    typeId:formInline.id[formInline.id.length - 1],
  }
  getSimulateExam(params)
      .then(res=>{
        tableData.value = res
      })
    .finally(()=>loading.value = false)
}
function refresh(){
 formInline.query = ''
  formInline.id = [1,2]
    search()
}
function search(){
  pageable.page = 1
  getTableData()
}
function deleteTag(examId){
  ElMessageBox.confirm('确定删除吗？',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{
  let params = {examId}
  deleteSimulateExam(params)
      .then(res=>{
        msg.success('删除成功')
        getTableData()
      })
  }).catch(()=>{
    ElMessage({type:'info',message:'已取消'})
  })
}

const detailData = reactive({
  show:false,
  type:0,
  data:{}
})
function openDialog(type=0,data){
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

</script>

<style scoped lang="scss">
.content {
  height: 100%;
  background: #ffffff;
  padding: 20px 10px;
  .search{
    height: 80px;
    display: flex;
    justify-content: space-between;
  }
  .table_box{
    height: calc(100% - 80px);
  }
}
</style>
