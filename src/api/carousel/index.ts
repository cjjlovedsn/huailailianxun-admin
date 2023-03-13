import { request } from '@/utils/service'
import { ApiPagination, Pagination } from '../api'

export interface CarouselListRequestData extends Pagination {
  status?: number
  title?: string
  type?: 0 | 1 | 2
}

export interface CarouselData {
  createTime: string
  id: number
  title: string
  content: string
  image: string
  status: 0 | 1
  type: 0 | 1 | 2
  updateTime: string
}

export interface CarouselFormData {
  id?: number
  title: string
  content?: string
  image?: string
  type?: 0 | 1 | 2
}

/**
 * 轮播图列表
 */
export function list(data: CarouselListRequestData) {
  return request<IApiResponseData<ApiPagination<CarouselData>>>({
    url: '/admin/swiper/list',
    method: 'post',
    data,
  })
}

/**
 * 添加轮播图
 */
export function create(data: CarouselFormData) {
  return request({
    url: '/admin/swiper/save',
    method: 'post',
    data,
  })
}

/**
 * 修改轮播图
 */
export function update(data: CarouselFormData) {
  return request({
    url: '/admin/swiper/edit',
    method: 'post',
    data,
  })
}

/**
 * 删除轮播图
 */
export function del(id: number | number[]) {
  return request({
    url: '/admin/swiper/delete',
    method: 'post',
    data: {
      ids: typeof id === 'number' ? [id] : id,
    },
  })
}

export function setStatus(id: number, status: 0 | 1) {
  return request<IApiResponseData<boolean>>({
    url: '/admin/swiper/updStatus',
    method: 'post',
    data: {
      id,
      status,
    },
  })
}
