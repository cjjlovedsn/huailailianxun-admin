import { request } from '@/utils/service'
import { ApiPagination, Pagination } from '../api'

export function upload(file: File) {
  const data = new FormData()
  data.append('file', file)
  return request<IApiResponseData<string>>({
    url: '/admin/file/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function deleteFile(id: string | string[]) {
  return request({
    url: '/admin/file/delete',
    method: 'post',
    data: {
      ids: typeof id === 'string' ? [id] : id,
    },
  })
}

export interface FileListRequestData extends Pagination {
  fileKey?: number
  status?: 0 | 1
  fileName?: string
}

export function fileList(data: FileListRequestData) {
  return request<IApiResponseData<ApiPagination>>({
    url: '/admin/file/list',
    method: 'post',
    data,
  })
}
