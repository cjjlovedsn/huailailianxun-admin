<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData" @submit.prevent="getTableData">
        <el-form-item prop="fileName" label="文件名">
          <el-input v-model="searchData.fileName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="fileKey" label="ID">
          <el-input v-model="searchData.fileKey" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="searchData.status">
            <el-radio :label="0">有效</el-radio>
            <el-radio :label="1">无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="getTableData">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="fileKey" label="ID" align="center" />
          <el-table-column prop="fileOrigName" label="文件原始名称" align="center" show-overflow-tooltip />
          <el-table-column prop="avator" label="七牛云地址" align="center" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link :href="row.address">{{ row.address }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="filePath" label="文件路径	" align="center" show-overflow-tooltip />
          <el-table-column prop="fileSize" label="文件大小	" align="center" />
          <el-table-column prop="fileType" label="文件类型	" align="center" />
          <el-table-column prop="uploadTime" label="上传时间" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column prop="statusText" label="状态" align="center">
            <template #default="{ row }">
              <span v-if="row.status === '0'">正常</span>
              <span v-else-if="row.status === '1'">关闭</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" />
          <el-table-column label="操作" fixed="right" width="150" align="center">
            <template #default="{ row }">
              <el-popconfirm title="确定删除吗" @confirm="deleteOne(row.fileKey)">
                <template #reference>
                  <el-button type="danger" text bg size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MessageList',
}
</script>

<script lang="ts" setup>
import { usePagination } from '@/hooks/usePagination'
import { ref, watch } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { util } from '@/api'
import { MessageObject } from '@/api/messages'
import { FormInstance } from 'element-plus'
import { FileListRequestData } from '@/api/util'

const searchFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
const tableData = ref<MessageObject[]>([])
const searchData = ref<FileListRequestData>({
  pageNo: 1,
  pageSize: 20,
  fileName: '',
})

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function getTableData() {
  util
    .fileList(
      Object.assign(searchData.value, {
        pageNo: paginationData.currentPage,
        pageSize: paginationData.pageSize,
      })
    )
    .then((res) => {
      tableData.value = res.data.list
      paginationData.total = res.data.total
    })
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

function deleteOne(id: string) {
  util.deleteFile(id).then(() => {
    getTableData()
  })
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped></style>
