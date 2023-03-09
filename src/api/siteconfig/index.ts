import { request } from '@/utils/service'

export interface Siteconfig {
  area?: string
  /**
   * 首页统计多少天内数据 0-1
   */
  custServiceImg?: string
  days?: number
  logo?: string
  shareDesc?: string
  shareLogo?: string
  shareTitle?: string
  siteTitle?: string
  topImg?: string
}

export function save(data: Siteconfig) {
  return request<IApiResponseData<boolean>>({
    url: '/admin/config/save',
    method: 'post',
    data,
  })
}

export function getConfig() {
  return request<IApiResponseData<Siteconfig>>({
    url: '/admin/config/getSiteConfig',
    method: 'get',
  })
}
