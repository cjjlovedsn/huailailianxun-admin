<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <div>
          <div class="h1">网站配置</div>
        </div>
      </template>
      <el-form :model="info" ref="form" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="网站标题" prop="siteTitle">
          <el-input v-model="info.siteTitle" />
        </el-form-item>
        <el-form-item label="运营区域" prop="area">
          <el-input v-model="info.area" />
        </el-form-item>
        <el-form-item label="Logo" prop="logo">
          <image-upload :images="[info.logo]" :limit="1" @update:images="info.logo = $event[0]" />
        </el-form-item>
        <el-form-item label="客服图片" prop="custServiceImg">
          <image-upload :images="[info.custServiceImg]" :limit="1" @update:images="info.custServiceImg = $event[0]" />
        </el-form-item>
        <el-form-item label="置顶" prop="topImg">
          <image-upload :images="[info.topImg]" :limit="1" @update:images="info.topImg = $event[0]" />
        </el-form-item>
        <el-form-item label="显示天数" prop="area">
          <el-input-number v-model="info.msgDays" :min="1" :max="365 * 3" />
          <div class="text-sm text-bluegray ml-4">tips: 设置消息列表只显示多少天内的消息</div>
        </el-form-item>
        <el-form-item label="分享标题" prop="shareTitle">
          <el-input v-model="info.shareTitle" />
        </el-form-item>
        <el-form-item label="分享描述" prop="shareDesc">
          <el-input v-model="info.shareDesc" />
        </el-form-item>
        <el-form-item label="分享logo" prop="shareLogo">
          <el-input v-model="info.shareLogo" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ViewSiteconfig',
}
</script>

<script lang="ts" setup>
import { siteconfig } from '@/api'
import { Siteconfig } from '@/api/siteconfig'
import { ElMessage } from 'element-plus'
import { IFormRules } from 'types/app'

const info = ref<Siteconfig>({})
const rules: IFormRules = {
  title: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入标题',
    },
  ],
}

function getConfig() {
  siteconfig.getConfig().then((res) => {
    info.value = res.data
  })
}

getConfig()

function save() {
  siteconfig
    .save(info.value)
    .then((res) => {
      if (res.data) {
        ElMessage.success('保存成功')
      }
    })
    .catch((e) => {
      ElMessage.error(e.message || '操作失败')
      getConfig()
    })
}
</script>

<style lang="scss" scoped></style>
