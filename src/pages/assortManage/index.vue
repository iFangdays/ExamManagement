<template>
  <div class="content">
    <div class="search" style="justify-content:flex-end">
      <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="分类名称">
          <el-input v-model="formInline.name"/>
        </el-form-item>
      </el-form> -->
      <div class="btns">
        <!-- <el-button type="primary" :icon="Search" @click.stop="search">查询</el-button>
        <el-button :icon="Refresh" @click.stop="refresh">重置</el-button> -->
        <el-button type="primary" :icon="Plus" @click.stop="openDialog(1)">新增</el-button>
      </div>
    </div>
    <div class="table_box">
      <CommonTable :tableData="tableData"
                   :columns="columns"
                   :totalData="totalData"
                   :pageable="pageable"
                   row-key="id"
                   default-expand-all
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
          :update-request-url="updateQuestionType"
          :add-request-url="addQuestionType"
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
import {getAllQuestionType, updateQuestionType, deleteQuestionType,addQuestionType} from "@/api/tagManageApi";
import msg from "@/utils/resetMessage";
const loading = ref(false)


const formInline = reactive({
  name:'',
})
const onlyFatherOptions = ref([])
const totalData = ref(0)
const pageable = reactive({
  page: 1, limit: 15
})
const tableData = ref([])
const rules = {
  typeName:[{required: true, message: '请输入分类名称', trigger: 'blur'}],
  parentId:[{required: true, message: '请选择所属父类', trigger: 'blur'}],
}
const formOptions = ()=>[
  {label:'分类名称',prop:'typeName',type:'input'},
  {label:'所属父类',prop:'parentId',type:'select',options:onlyFatherOptions.value},
]
const columns = ref([
  {label:'标签名称', prop:'typeName',align:'left'},
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
  getTableData()
})

function getTableData(){
  getAllQuestionType()
      .then(res=>{
        onlyFatherOptions.value = res.map(i=>{
          return {label:i.typeName,value:i.id}
        })
        tableData.value = res.map(i=>{
          i.children = i.questionTypes
          return i
        })
      })
}
function refresh(){
  // formInline.id = [1,2]
  search()
}
function search(){
  // let {id} = formInline
  // if(!id.length){
  //   msg.warning('请选择分类')
  // }else{
  //   pageable.page = 1
  //   getTableData(id[id.length - 1])
  // }
  pageable.page = 1
  getTableData()
}
function deleteTag(typeId){
  ElMessageBox.confirm('确定删除吗？',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(()=>{
  let params = {typeId}
  deleteQuestionType(params)
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
