<template>
  <div class="common_tables">
    <div class="common_table" :style="{ height: !isPagination ? '100%' : 'calc(100% - 50px)' }">
      <el-table border ref="tableRef" v-bind="$attrs" :cell-style="$attrs.cellStyle || { 'font-size': '13px' }" :data="tableData" height="100%"
                @selection-change="doSelectChange">
        <template v-for="item in columns" :key="item">
          <el-table-column v-bind="item" v-if="item.type === 'selection' || item.type === 'index'" />
          <el-table-column v-bind="{ ...item, align: item.align || 'center' }" v-else v-slot="scope">
            <component :is="item.render" v-bind="scope" v-if="item.render"> </component>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="common_pagination" v-if="isPagination">
      <el-pagination :background="true" v-model:current-page="pageable.page"
                     v-model:page-size="pageable.limit" :page-sizes="[15, 30, 50, 100]"
                     :layout="layout" :total="totalData"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange" :pager-count="pagerCount"  :small="true" />
    </div>
  </div>
</template>

<script>
export default { name: 'CommonTable' }
</script>

<script setup>
import {ref} from 'vue'
const emits = defineEmits(['onSizeChange', 'onCurrentChange', 'onSelectionChange', 'onSelect'])
const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  isPagination: {
    type: Boolean,
    default: true
  },
  totalData:{
    type: Number,
    default:0
  },
  pageable: {
    type: Object,
    default: () => {
      return { page: 1, limit: 15 }
    }
  },
  pagerCount:{
    type: Number,
    default:5
  },
  layout:{
    type: String,
    default:'total, sizes, prev, pager, next, jumper'
  }
})

const tableRef = ref(null)

function handleSizeChange(val) {
  emits('onSizeChange',val)
}

function handleCurrentChange(val) {
  emits('onCurrentChange',val)
}

function doSelectChange(val) {
  emits('onSelectionChange',val)
}

defineExpose({tableRef})
</script>

<style scoped lang="scss">
.common_tables {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .common_pagination{
    align-self: flex-end;
  }
}
</style>


