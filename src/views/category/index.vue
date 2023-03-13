<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData" @submit.prevent="getTableData">
        <el-form-item prop="title" label="标题">
          <el-input v-model="searchData.title" placeholder="请输入" />
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
      <div class="flex mb-5">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="add">新增</el-button>
        </div>
        <!--
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div> -->
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="ID" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column prop="images" label="图片" align="center">
            <template #default="{ row }">
              <el-image v-if="row.logo" :src="row.logo" fit="fill" class="w-8 h-8" :lazy="true" preview-teleported />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column prop="statusText" label="状态" align="center">
            <template #default="{ row }">
              <el-button
                text
                :type="row.status === 0 ? 'primary' : 'danger'"
                size="default"
                @click="updateStatus(row)"
                >{{ row.status === 0 ? '有效' : '无效' }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150" align="center">
            <template #default="{ row }">
              <el-button type="primary" text bg size="small" @click="edit(row)">修改</el-button>
              <el-popconfirm title="确定删除吗" @confirm="deleteOne(row.id)">
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
    <!-- 新增/修改 -->
    <CategoryForm ref="formEl" @change="resetSearch" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'CategoryList',
}
</script>

<script lang="ts" setup>
import { usePagination } from '@/hooks/usePagination'
import { ref, watch } from 'vue'
import { Search, Refresh, CirclePlus } from '@element-plus/icons-vue'
import { category } from '@/api'
import { CategoryListRequestData, CategoryData } from '@/api/category'
import { ElMessage, FormInstance } from 'element-plus'
import { CategoryInfo } from '@/api/category'
import CategoryForm from './components/CategoryForm.vue'

const searchFormRef = ref<FormInstance | null>(null)
const formEl = ref<InstanceType<typeof CategoryForm> | null>(null)
const loading = ref(false)
const tableData = ref<CategoryData[]>([])
const categoryList = ref<CategoryInfo[]>([])
const searchData = ref<CategoryListRequestData>({
  pageNo: 1,
  pageSize: 20,
  title: '',
})

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function getTableData() {
  category
    .list(
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

category.all().then((res) => {
  categoryList.value = res.data
})

function deleteOne(id: number) {
  category.del(id).then(() => {
    ElMessage.success('删除成功')
    getTableData()
  })
}

function add() {
  formEl.value?.create()
}

function edit(data: CategoryData) {
  const { id, title, logo } = data
  formEl.value?.edit({ id, title, logo })
}

function updateStatus(data: CategoryData) {
  category.setStatus(data.id, data.status === 0 ? 1 : 0).then(() => {
    getTableData()
  })
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped></style>
