<template>
  <el-upload
    v-model:file-list="fileList"
    action="#"
    list-type="picture-card"
    accept="image/*"
    :http-request="httpRequest"
    :limit="limit"
    :disabled="!!limit && fileList.length >= limit"
    :on-success="onUploaded"
    :on-exceed="onExceed"
    :before-upload="beforeUpload"
  >
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <el-image class="el-upload-list__item-thumbnail" :src="file.url" />
      <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
          <el-icon><Delete /></el-icon>
        </span>
      </span>
    </template>
  </el-upload>
</template>

<script lang="ts">
export default {
  name: 'ImageUpload',
}
</script>

<script lang="ts" setup>
import { util } from '@/api'
import { ElMessage, UploadFile, UploadFiles, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus'

interface Props {
  images?: string[]
  limit?: number
}

const props = defineProps<Props>()

interface Emits {
  (event: 'update:images', value: string[]): void
}

const emit = defineEmits<Emits>()

const fileList = shallowRef<Partial<UploadUserFile>[]>([])

watch(
  () => props.images,
  (value) => {
    if (value) {
      fileList.value = value.map((url) => ({ url })).filter(Boolean)
    }
  },
  { immediate: true }
)

function httpRequest(options: UploadRequestOptions) {
  if (fileList.value.length > 9) return Promise.reject(new Error('选择的文件数量超出限制'))
  return util.upload(options.file).then((res) => {
    if (/^blob/.test(res.data)) throw new Error('上传的文件不正确')
    return res.data
  })
}

function onUploaded(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  const list = uploadFiles.map((item) => {
    return {
      ...item,
      url: typeof item.response === 'string' ? item.response : item.url,
    }
  })
  const images = list.map((item) => item.url ?? '').filter(Boolean)
  emit('update:images', images)
}

function beforeUpload(rawFile: UploadRawFile) {
  if (rawFile.size > 40 * 1024 * 1024) {
    ElMessage.error('文件大小不能大于40MB')
    return false
  }
  return true
}

function handleRemove(file: UploadFile) {
  const i = fileList.value.indexOf(file)
  fileList.value.splice(i, 1)
  const images = fileList.value.map((item) => item.url ?? '').filter(Boolean)
  emit('update:images', images)
}

function onExceed() {
  ElMessage.error(`最多上传${props.limit}个文件`)
}
</script>

<style lang="scss" scoped></style>
