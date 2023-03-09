import { request } from '@/utils/service'

export interface CategoryInfo {
  createTime: string
  id: number
  logo: string
  sort: number
  status: 0 | 1
  title: string
  updateTime: string
}

export function all() {
  return request<IApiResponseData<CategoryInfo[]>>({
    url: '/admin/category/all',
    method: 'GET',
  })
}
