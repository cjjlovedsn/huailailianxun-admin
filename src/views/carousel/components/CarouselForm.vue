<template>
  <el-dialog
    v-model="visible"
    :title="type === 'create' ? '新增轮播图' : '修改轮播图'"
    width="80vw"
    :before-close="beforeClose"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="title" label="标题">
        <el-input v-model="formData.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          accept="image/*"
          :http-request="httpRequest"
          :limit="9"
          :disabled="fileList.length >= 1"
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
      <el-form-item prop="content" label="内容">
        <div class="w-full">
          <QuillEditor v-model:content="formData.content" theme="snow" content-type="html" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="loading || uploading" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'CategoryForm',
}
</script>

<script lang="ts" setup>
import { CarouselFormData } from '@/api/carousel'
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
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { carousel, util } from '@/api'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

interface Emits {
  (event: 'change'): void
}

const emit = defineEmits<Emits>()

const visible = ref(false)
const type = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance | null>(null)
const rules: IFormRules<keyof CarouselFormData> = {
  title: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入标题',
    },
  ],
}

const formData = ref<CarouselFormData>({
  title: '',
  image: '',
  content: '',
  type: 0,
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
    return carousel.create({
      ...formData.value,
      type: 0,
      image: fileList.value[0]?.url,
    })
  }
  return carousel.update({
    ...formData.value,
    image: fileList.value[0]?.url,
  })
}

function handleConfirm() {
  if (uploading.value) return
  loading.value = true
  submit()
    .then(() => {
      ElMessage.success('操作成功')
      close()
      emit('change')
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
  if (rawFile.size > 40 * 1024 * 1024) {
    ElMessage.error('文件大小不能大于40MB')
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
  edit(data: CarouselFormData) {
    type.value = 'edit'
    visible.value = true
    nextTick(() => {
      formData.value = Object.assign(formData.value, data)
      fileList.value = [data.image].filter(Boolean).map((url) => ({ url }))
    })
  },
  create() {
    type.value = 'create'
    formData.value = {
      image: '',
      title: '',
    }
    visible.value = true
  },
})
</script>

<style lang="scss" scoped></style>
