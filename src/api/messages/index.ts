import { request } from '@/utils/service'
import { ApiPagination, Pagination } from '../api'
export interface MessageListRequestData extends Pagination {
  keyword?: string
  status?: number
  typeId?: number
}

export interface MessageObject {
  avator: string
  content: string
  createTime: string
  createTimeText: string
  id: string
  images: string[]
  likeNum: number
  nickName: string
  readNum: number
  status: number
  statusText: string
  title: string
  top: number
  typeId: number
  typeName: string
  updateTime: string
  updateTimeText: string
}

export function list(data: MessageListRequestData) {
  return request<IApiResponseData<ApiPagination<MessageObject>>>({
    url: '/admin/message/list',
    method: 'post',
    data,
  })
}

export function del(id: string | string[]) {
  const ids = typeof id === 'string' ? [id] : id
  return request({
    url: '/admin/message/delete',
    method: 'post',
    data: { ids },
  })
}

export interface MessageFormData extends Partial<MessageObject> {
  content: string
  images: string[]
  title: string
  typeId?: number
}

export function create(data: MessageFormData) {
  return request<IApiResponseData<boolean>>({
    url: '/admin/message/publish',
    method: 'post',
    data,
  })
}

export function update(data: MessageFormData) {
  return request<IApiResponseData<boolean>>({
    url: '/admin/message/edit',
    method: 'post',
    data,
  })
}

export function setStatus(id: string, status: 0 | 1) {
  return request<IApiResponseData<boolean>>({
    url: '/admin/message/updStatus',
    method: 'post',
    data: {
      id,
      status,
    },
  })
}

export function setTop(id: string | string[], status: 0 | 1) {
  const ids = typeof id === 'string' ? [id] : id
  return request<IApiResponseData<boolean>>({
    url: '/admin/message/top',
    method: 'post',
    data: {
      ids,
      status,
    },
  })
}
