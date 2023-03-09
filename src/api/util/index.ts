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

export interface QueryCountInfo {
  /**
   * 无效消息总量
   */
  invalidMessageCount: number
  /**
   * 点赞总量
   */
  likeCount: number
  /**
   * 发布消息总量
   */
  publishCount: number
  /**
   * 设置置顶总次数
   */
  reqTopCount: number
  /**
   * 请求分享总量
   */
  shareCount: number
  /**
   * 今日点赞量
   */
  todayLikeCount: number
  /**
   * 今日发布消息量
   */
  todayPublishCount: number
  /**
   * 今日请求置顶量
   */
  todayReqTopCount: number
  /**
   * 今日请求分享量
   */
  todayShareCount: number
  /**
   * 现有置顶量
   */
  topCount: number
  /**
   * 有效消息总量
   */
  validMessageCount: number
}

export function queryCount() {
  return request<IApiResponseData<QueryCountInfo>>({
    url: '/admin/count/queryCount',
  })
}
