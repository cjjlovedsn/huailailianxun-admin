<template>
  <el-dialog v-model="visible" :title="type === 'create' ? '新增用户' : '修改用户'" @close="resetForm" width="30%">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="left">
      <el-form-item prop="title" label="标题">
        <el-input v-model="formData.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="content" label="内容">
        <QuillEditor v-model:content="formData.content" theme="snow" />
        <el-input v-model="formData.content" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary">确认</el-button>
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
import { FormInstance } from 'element-plus'
import { IFormRules } from 'types/app'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const visible = ref(false)
const type = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance | null>(null)
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
  typeId: 0,
  content: '',
})

function resetForm() {
  formRef.value?.resetFields()
}

defineExpose({
  edit(data: MessageFormData) {
    type.value = 'edit'
    formData.value = Object.assign(formData.value, data)
    visible.value = true
  },
  create() {
    type.value = 'create'
    formData.value = {
      images: [],
      title: '',
      typeId: 0,
      content: '',
    }
    visible.value = true
  },
})
</script>

<style lang="scss" scoped></style>
