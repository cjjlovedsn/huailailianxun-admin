<template>
  <el-dialog
    v-model="visible"
    :title="type === 'create' ? '新增用户' : '修改用户'"
    width="80vw"
    :before-close="beforeClose"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="title" label="标题">
        <el-input v-model="formData.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="typeId" label="分类">
        <el-select v-model="formData.typeId" placeholder="请选择" clearable filterable>
          <el-option v-for="item in categoryList" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="content" label="内容">
        <div class="w-full">
          <QuillEditor v-model:content="formData.content" theme="snow" content-type="html" />
        </div>
      </el-form-item>
      <el-form-item label="图片" prop="images">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          multiple
          accept="image/*,video/*"
          :http-request="httpRequest"
          :limit="9"
          :disabled="fileList.length >= 9"
          :on-success="onUploaded"
          :on-exceed="onExceed"
          :before-upload="beforeUpload"
        >
          <el-icon><Plus /></el-icon>
          <template #file="{ file }">
            <el-image class="el-upload-list__item-thumbnail" :src="file.url" :preview-src-list="images" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <el-icon><Delete /></el-icon>
              </span>
            </span>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'MessageForm',
}
</script>

<script lang="ts" setup>
import { MessageFormData } from '@/api/messages'
import {
  ElMessage,
  ElMessageBox,
  FormInstance,
  UploadFile,
  UploadFiles,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
} from 'element-plus'
import type { IFormRules } from 'types/app'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { CategoryInfo } from '@/api/category'
import { category, messages, util } from '@/api'

const visible = ref(false)
const type = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance | null>(null)
const categoryList = ref<CategoryInfo[]>([])
const rules: IFormRules<keyof MessageFormData> = {
  title: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入标题',
    },
  ],
}

const formData = ref<MessageFormData>({
  images: [],
  title: '',
  content: '',
})

const fileList = shallowRef<Partial<UploadUserFile>[]>([])
const images = computed<string[]>(() => fileList.value.map((item) => item.url ?? '').filter(Boolean))
const uploading = ref(false)

function httpRequest(options: UploadRequestOptions) {
  if (fileList.value.length > 9) return Promise.reject(new Error('选择的文件数量超出限制'))
  uploading.value = true
  return util
    .upload(options.file)
    .then((res) => res.data)
    .finally(() => {
      uploading.value = false
    })
}

function onUploaded(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  fileList.value = uploadFiles.map((item) => {
    return {
      ...item,
      url: typeof item.response === 'string' ? item.response : item.url,
    }
  })
}

const loading = ref(false)
function submit() {
  if (type.value === 'create') {
    return messages.create({
      ...formData.value,
      images: fileList.value.map((item) => item.url).filter(Boolean) as string[],
    })
  }
  return messages.update({
    ...formData.value,
    images: fileList.value.map((item) => item.url).filter(Boolean) as string[],
  })
}

function handleConfirm() {
  loading.value = true
  submit()
    .then(() => {
      ElMessage.success('操作成功')
      close()
    })
    .finally(() => {
      loading.value = false
    })
}

function close() {
  resetForm()
  visible.value = false
}

function beforeUpload(rawFile: UploadRawFile) {
  if (rawFile.size > 20 * 1024 * 1024) {
    ElMessage.error('文件大小不能大于20MB')
    return false
  }
  return true
}

function handleRemove(file: UploadFile) {
  const i = fileList.value.indexOf(file)
  fileList.value.splice(i, 1)
}

function onExceed() {
  ElMessage.error('最多上传9个文件')
}

function resetForm() {
  formRef.value?.resetFields()
}

category.all().then((res) => {
  categoryList.value = res.data
})

function beforeClose(done: () => void) {
  if (uploading.value) {
    ElMessageBox.confirm('有文件正在上传中，确认关闭对话框？')
      .then(done)
      .catch(() => {})
  } else {
    done()
  }
}

defineExpose({
  edit(data: MessageFormData) {
    type.value = 'edit'
    visible.value = true
    nextTick(() => {
      formData.value = Object.assign(formData.value, data)
      fileList.value = (data.images ?? []).map((url) => ({ url }))
    })
  },
  create() {
    type.value = 'create'
    formData.value = {
      images: [],
      title: '',
      content: '',
    }
    visible.value = true
  },
})
</script>

<style lang="scss" scoped></style>
