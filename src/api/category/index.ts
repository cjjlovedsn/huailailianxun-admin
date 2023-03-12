import { request } from '@/utils/service'
import { ApiPagination, Pagination } from '../api'

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

export interface CategoryListRequestData extends Pagination {
  status?: number
  title?: string
}

export interface CategoryData {
  createTime: string
  id: number
  logo: string
  sort: number
  status: 0 | 1
  title: string
  updateTime: string
}

export interface CategoryFormData {
  id?: number
  title: string
  logo?: string
}

/**
 * 分类列表
 */
export function list(data: CategoryListRequestData) {
  return request<IApiResponseData<ApiPagination<CategoryData>>>({
    url: '/admin/category/list',
    method: 'post',
    data,
  })
}

/**
 * 添加分类
 */
export function create(data: CategoryFormData) {
  return request({
    url: '/admin/category/save',
    method: 'post',
    data,
  })
}

/**
 * 修改分类
 */
export function update(data: CategoryFormData) {
  return request({
    url: '/admin/category/edit',
    method: 'post',
    data,
  })
}

/**
 * 修改分类
 */
export function del(id: number | number[]) {
  return request({
    url: '/admin/category/delete',
    method: 'post',
    data: {
      ids: typeof id === 'number' ? [id] : id,
    },
  })
}

export function setStatus(id: number, status: 0 | 1) {
  return request<IApiResponseData<boolean>>({
    url: '/admin/category/updStatus',
    method: 'post',
    data: {
      id,
      status,
    },
  })
}
