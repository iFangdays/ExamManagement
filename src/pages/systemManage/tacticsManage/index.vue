<template>
  <div class="content" v-loading="loading">
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="所属分类">
          <el-cascader
              v-model="formInline.id"
              :options="sortOptions"
              :props="props"
          />
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
          title="推荐策略管理"
          :rules='rules'
          :dialogType="detailData.type"
          :form-option="formOptions()"
          :form-data="detailData.data"
          :update-request-url="updateQuestionType"
          :add-request-url="updateQuestionType"
          @refresh-data="getTableData"
      />
    </template>
  </div>
</template>

<script setup lang="jsx">
import CommonTable from "@/components/commonTable";
import {onMounted, reactive, ref, toRaw} from "vue";
import { ElMessage,ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import CommonDialogForm from "@/components/CommonDialogForm"
import {getAllConfigs,deleteConfigById,updateQuestionType} from "@/api/tacticsManageApi";
import {getAllQuestionType} from "@/api/tagManageApi"
import msg from "@/utils/resetMessage";
import {findFields} from "@/utils/utilsTool.js"

const loading = ref(false)

const sortOptions = ref([])
const onlyFatherOptions = ref([])
const props = { children:'questionTypes',label:'typeName',value:'id' }
function getSortOptions(){
  getAllQuestionType()
      .then(res=>{
        onlyFatherOptions.value = res.map(i=>{
          if(i.questionTypes.length){
           return i.questionTypes.map(item=>{
              return {label:item.typeName,value:item.id}
            })
          }
        })    
        sortOptions.value =  res
      })
      .finally(()=>getTableData())
}

const formInline = reactive({
  id:[1,2],
})

const totalData = ref(0)
const pageable = reactive({
  page: 1, limit: 15
})
const tableData = ref([])
const rules = {
  code:[{required: true, message: '请输入配置名称', trigger: 'blur'}],
  value:[{required: true, message: '请输入配置项值', trigger: 'blur'}],
  status:[{required: true, message: '请选择状态', trigger: 'blur'}],
}
const formOptions = ()=>[
  {label:'配置名称',prop:'code',type:'input'},
  {label:'配置项值',prop:'value',type:'input'},
  {label: '所属分类', prop: 'typeId',type:'cascader',options:sortOptions.value,props:{ children:'questionTypes',label:'typeName',value:'id' }},
  {label:'状态',prop:'status',type:'select',options:[{label:'正常',value:0},{label:'失效',value:1}]},
  {label:'备注',prop:'msg',type:'textarea'},
]
const columns = ref([
  {label:'序号',type:'index',width:80,align:'center'},
  {label:'配置项名称', prop:'code'},
  {label:'配置项值', prop:'value'},
  {label:'所属分类', prop:'typeId',render:({row})=>{
    let res = findFields(toRaw(sortOptions.value),'id',row.typeId,'questionTypes')
    return res && res.typeName 
  }},

  {label:'状态', prop:'status',render:({row})=>{
    return <el-tag type={row.status?'error':'success'}>{['正常','失效'][row.status]}</el-tag>
  }},
  {label:'更新时间',prop:'updateTime'},
    {label:'备注', prop:'msg'},
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
})

function getTableData(typeId = 2){
  loading.value = true
  let params = {typeId}
  getAllConfigs(params)
      .then(res=>{
        tableData.value = res
      })
      .finally(()=>loading.value = false)
}
function refresh(){
  formInline.id = [1,2]
  pageable.page = 1
  getTableData()
}
function search(){
  let {id} = formInline
  if(!id.length){
    msg.warning('请选择分类')
  }else{
    pageable.page = 1
    getTableData(id[id.length - 1])
  }
}
function deleteTag(id){
  ElMessageBox.confirm('确定删除吗？',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{
  let params = {id}
  deleteConfigById(params)
    .then(res=>{
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
