import { request } from '@/utils/service'

export interface UserInfo {
  email: string
  phonenumber: string
  userName: string
}

export function updateUserInfo(data: Partial<UserInfo>) {
  return request<IApiResponseData<boolean>>({
    url: '/admin/user/updInfo',
    method: 'post',
    data,
  })
}
