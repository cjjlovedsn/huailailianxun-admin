<template>
  <div class="app-container">
    <el-card shadow="never">
      <div class="text-2xl">欢迎使用怀来联讯管理系统</div>
      <!-- <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">无效消息总量</div>
            <div class="text-2xl text-center">{{ info?.invalidMessageCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">点赞总量</div>
            <div class="text-2xl text-center">{{ info?.likeCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">发布消息总量</div>
            <div class="text-2xl text-center">{{ info?.publishCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">设置置顶总次数</div>
            <div class="text-2xl text-center">{{ info?.reqTopCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">请求分享总量</div>
            <div class="text-2xl text-center">{{ info?.shareCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">今日点赞量</div>
            <div class="text-2xl text-center">{{ info?.todayLikeCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">今日发布消息量</div>
            <div class="text-2xl text-center">{{ info?.todayPublishCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">今日请求置顶量</div>
            <div class="text-2xl text-center">{{ info?.todayReqTopCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">今日请求分享量</div>
            <div class="text-2xl text-center">{{ info?.todayShareCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">现有置顶量</div>
            <div class="text-2xl text-center">{{ info?.topCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="mb-2">
            <div class="text-lg font-600">有效消息总量</div>
            <div class="text-2xl text-center">{{ info?.validMessageCount }}</div>
          </el-card>
        </el-col>
      </el-row> -->
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ViewDashboard',
}
</script>

<script lang="ts" setup>
import { util } from '@/api'
import { QueryCountInfo } from '@/api/util'

const info = ref<QueryCountInfo>()

util.queryCount().then((res) => {
  info.value = res.data
})
</script>

<style lang="scss" scoped></style>
