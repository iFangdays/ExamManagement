<template>
  <div class="content" v-loading="loading">
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名称">
          <el-input v-model="formInline.nickname" placeholder="请输入" clearable/>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" :icon="Search" @click.stop="search">查询</el-button>
        <el-button :icon="Refresh" @click="reset">重置</el-button>
        <el-button type="primary" :icon="Plus" @click.stop="openDialog(1)">新增</el-button>
         <el-button type="warning" @click.stop="openChangeUserStatus">修改状态</el-button>
      </div>
    </div>
    <div class="table_box">
      <CommonTable :tableData="tableData"
                   :columns="columns"
                   :totalData="totalData"
                   :pageable="pageable"
                   ref="commonTable"
                   @onSizeChange="onSizeChange"
                   @onCurrentChange="onCurrentChange"/>
    </div>
    <template v-if="detailData.show">
      <CommonDialogForm
          v-model="detailData.show"
          title="用户管理"
          :dialogType="detailData.type"
          :form-data="detailData.data"
          :form-option="formOptions()"
          :rules="rules"
          :addRequestUrl="addUser"
          :updateRequestUrl="updateUserRoleStatus"
          @refreshData="getTableData"
      />
    </template>
    <template v-if="changeUserStatus.show">
      <el-dialog v-model="changeUserStatus.show" title="修改状态" width="400px">
            <div class="changeUserStatus_content">
              <span> 账号状态: </span>
            <el-select v-model="changeUserStatus.value"  placeholder="请选择" clearable >
              <el-option :label="option.label" :value="option.value" v-for="(option,i) in statusOptions" :key="i"/>
            </el-select>
            </div>
                <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click.stop="onSureChange">确定</el-button>
            </span>
    </template>
      </el-dialog>
    </template>
  </div>
</template>

<script setup lang="jsx">
import CommonTable from "@/components/commonTable";
import CommonDialogForm from "@/components/CommonDialogForm"
import {onMounted, reactive, ref} from "vue";
import {Search, Refresh, Plus} from '@element-plus/icons-vue'
import {getAllUsers,addUser,updateUserRoleStatus,getAllRole,handleUser} from "@/api/user";
import msg from "@/utils/resetMessage"
const loading = ref(false)

const formInline = reactive({
  nickname: '',
})

const commonTable = ref(null)
const changeUserStatus = reactive({
  show:false,
  value:0,
  userIds:null
})
const statusOptions = [
  {label:'启用',value:0},
  {label:'禁用',value:1},
  {label:'删除',value:2},
]
function openChangeUserStatus(){
  let getSelection = commonTable.value.tableRef.getSelectionRows()
  if(!getSelection.length){
    msg.warning('请勾选用户')
  }else{
    changeUserStatus.show = true
    userIds:changeUserStatus.userIds = getSelection.map(i=>i.id)
  }
}
function onSureChange(){
  let params = {
    operation:changeUserStatus.value,
    userIds:changeUserStatus.userIds
  }
  handleUser(params)
    .then(res=>{
      changeUserStatus.show = false
      changeUserStatus.value = 0
      changeUserStatus.userIds = null
      getTableData()
    })
}

const userRoleOptions = ref([])
function getUserRole(){
  getAllRole()
    .then(res=>{
      userRoleOptions.value = res.map(i=>{
        return {label:i.roleName,value:i.id}
      })
    })
}

const totalData = ref(0)
const pageable = reactive({
  page: 1, limit: 15
})
const tableData = ref([])
const formOptions = ()=>[
  {
    label: '头像', prop: 'avatarUrl', render: (prop) => {
      return <el-avatar size={100} src={prop.data || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'} />
    }
  },
  {label: '昵称', prop: 'nickname', type: 'input'},
  {label: '用户名', prop: 'username', type: 'input',disabled:isEdit.value},
  {label: '密码', prop: 'password', type: 'passwordInput'},
  {label: '角色', prop:'roleId',type:'select',options:userRoleOptions.value},
  {label: '手机号', prop: 'mobile', type: 'input'},
  
]
const rules = {
  nickname: [{required: true, message: '请输入昵称', trigger: 'blur'}],
  roleId:[{required: true, message: '请选择角色', trigger: 'blur'}],
  password:[{required: true, message: '请输入密码', trigger: 'blur'}],
  username:[{required: true, message: '请输入用户名', trigger: 'blur',},{pattern:/^[A-z]{5,10}$/,message: '请输入5-10位纯英文', trigger: 'blur',}]
}

const columns = ref([
  {label: '选择', type: 'selection', width: 80, align: 'center'},
  {label: '昵称', prop: 'nickname'},
  {label: '用户名', prop: 'username'},
  {label: '头像地址', prop: 'avatarUrl'},
  {label: '角色', prop: 'roleId',render:({row})=>{
    return <span> {[_,'普通用户','管理员'][row.roleId]}</span>
  }},
  {label: '状态', prop: 'status',render:({row})=>{
    return <el-tag type={row.status?'error':'success'}>{['正常','失效'][row.status]}</el-tag>
  }},
  {label: '手机号', prop: 'mobile'},
  {
    label: "操作", width: 150, fixed: 'right', render: ({row}) => {
      return (
          <div>
            <el-button type="primary" link onClick={()=>openDialog(0,row)}>
              编辑
            </el-button>
          </div>
      )
    }
  },
])

onMounted(()=>{
  getUserRole()
  getTableData()
})

function getTableData() {
  loading.value = true
  let params = {
    ...formInline,
    pageNo:pageable.page,
    pageSize:pageable.limit
  }
  getAllUsers(params)
    .then(res=>{
      tableData.value = res.data
      totalData.value = res.total
    })
    .finally(()=>loading.value = false)
}

function search() {
  pageable.page = 1
  getTableData()
}

function reset(){
  formInline.nickname = ''
  search()
}

const detailData = reactive({
  show: false,
  data: {}
})

const isEdit = ref(false)

function openDialog(type = 0,data) {
  detailData.show = true
  detailData.type = type
  detailData.data = data
  isEdit.value = !type
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

  .search {
    height: 80px;
    display: flex;
    justify-content: space-between;
  }

  .table_box {
    height: calc(100% - 80px);
  }
}
.changeUserStatus_content{
  display: flex;
  justify-content: center;
  align-items: center;
  span{
    margin: 0 20px;
  }
}
</style>
