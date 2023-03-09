<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData" @submit.prevent="getTableData">
        <el-form-item prop="keyword" label="查询">
          <el-input v-model="searchData.keyword" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="typeId" label="分类">
          <el-select v-model="searchData.typeId" placeholder="请选择" clearable filterable>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="searchData.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">关闭</el-radio>
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
          <el-table-column prop="avator" label="头像" align="center">
            <template #default="{ row }">
              <el-image :src="row.avator" fit="fill" :lazy="true" />
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="分类" align="center" />
          <el-table-column prop="content" label="内容" align="center">
            <template #default="{ row }">
              <div v-html="row.content" style="max-height: 2em" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="昵称" align="center" />
          <el-table-column prop="images" label="图片" align="center">
            <template #default="{ row }">
              <div class="grid auto-cols-fr grid-cols-3">
                <el-image
                  v-for="(src, i) in row.images"
                  :key="i"
                  :src="src"
                  fit="fill"
                  :initial-index="i"
                  :preview-src-list="row.images"
                  :lazy="true"
                  preview-teleported
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="likeNum" label="点赞数" align="center" />
          <el-table-column prop="readNum" label="浏览数" align="center" />
          <el-table-column prop="createTimeText" label="创建时间" align="center" />
          <el-table-column prop="updateTimeText" label="更新时间" align="center" />
          <el-table-column prop="statusText" label="状态" align="center">
            <template #default="{ row }">
              <el-button
                text
                :type="row.status === 0 ? 'primary' : 'danger'"
                size="default"
                @click="updateStatus(row)"
                >{{ row.statusText }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="top" label="置顶" align="center">
            <template #default="{ row }">
              <el-button text :type="row.top === 0 ? 'primary' : 'success'" size="default" @click="updateTop(row)">{{
                row.top === 0 ? '未置顶' : '已置顶'
              }}</el-button>
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
    <MessageForm ref="formEl" />
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
import { Search, Refresh, CirclePlus } from '@element-plus/icons-vue'
import { category, messages } from '@/api'
import { MessageListRequestData, MessageObject } from '@/api/messages'
import { FormInstance } from 'element-plus'
import { CategoryInfo } from '@/api/category'
import MessageForm from './components/MessageForm.vue'

const searchFormRef = ref<FormInstance | null>(null)
const formEl = ref<InstanceType<typeof MessageForm> | null>(null)
const loading = ref(false)
const tableData = ref<MessageObject[]>([])
const categoryList = ref<CategoryInfo[]>([])
const searchData = ref<MessageListRequestData>({
  pageNo: 1,
  pageSize: 20,
  keyword: '',
})

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

function getTableData() {
  messages
    .list(
      Object.assign(searchData.value, {
        pageNo: paginationData.currentPage,
        pageSize: paginationData.pageSize,
      })
    )
    .then((res) => {
      tableData.value = res.data.list
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

function deleteOne(id: string) {
  messages.del(id).then(() => {
    getTableData()
  })
}

function add() {
  formEl.value?.create()
}

function edit(data: MessageObject) {
  const { id, title, content, images, typeId } = data
  formEl.value?.edit({ id, title, content, images, typeId })
}

function updateStatus(data: MessageObject) {
  messages.setStatus(data.id, data.status === 0 ? 1 : 0).then(() => {
    getTableData()
  })
}

function updateTop(data: MessageObject) {
  messages.setTop(data.id, data.top === 0 ? 1 : 0).then(() => {
    getTableData()
  })
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss" scoped></style>
