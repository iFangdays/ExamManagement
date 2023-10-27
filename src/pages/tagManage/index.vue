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
          title="标签管理"
          :rules='rules'
          :dialogType="detailData.type"
          :form-option="formOptions()"
          :form-data="detailData.data"
          :update-request-url="updateLabel"
          :add-request-url="addLabel"
          @refresh-data="getTableData"
      />
    </template>
  </div>
</template>

<script setup lang="jsx">
import CommonTable from "@/components/commonTable";
import {onMounted, reactive, ref} from "vue";
import { ElMessage,ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import CommonDialogForm from "@/components/CommonDialogForm"
import {getAllQuestionType, getLabelsByTypeId, updateLabel, addLabel, deleteLabel} from "@/api/tagManageApi";
import msg from "@/utils/resetMessage";
const loading = ref(false)

const sortOptions = ref([])
const props = { children:'questionTypes',label:'typeName',value:'id' }
function getSortOptions(){
  getAllQuestionType()
      .then(res=>{  
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
  labelName:[{required: true, message: '请输入标签名称', trigger: 'blur'}],
  typeId:[{required: true, message: '请选择所属分类', trigger: 'blur'}],
}
const formOptions = ()=>[
  {label:'标签名称',prop:'labelName',type:'input'},
  {label: '所属分类', prop: 'typeId',type:'cascader',options:sortOptions.value,props:{ children:'questionTypes',label:'typeName',value:'id' }},
  // {label:'创建时间',prop:'createTime',type:'date'},
]
const columns = ref([
  {label:'序号',type:'index',width:80,align:'center'},
  {label:'标签名称', prop:'labelName'},
  {label:'创建时间', prop:'createTime'},
  {label:'创建人', prop:'createPerson'},
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

function getTableData(id = 2){
  loading.value = true
  getLabelsByTypeId(id)
      .then(res=>{
        tableData.value = res
      })
      .finally(()=>loading.value = false)
}
function refresh(){
  formInline.id = [1,2]
  pageable.page = 1
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
function deleteTag(labelId){
  ElMessageBox.confirm('确定删除吗？',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{
  let params = {labelId}
  deleteLabel(params)
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
