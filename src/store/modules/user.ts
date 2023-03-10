import { ref } from 'vue'
import store from '@/store'
import { defineStore } from 'pinia'
import { usePermissionStore } from './permission'
import { useTagsViewStore } from './tags-view'
import { getToken, removeToken, setToken } from '@/utils/cache/cookies'
import router, { resetRouter } from '@/router'
import { loginApi } from '@/api/login'
import { type ILoginRequestData } from '@/api/login/types/login'
import { type RouteRecordRaw } from 'vue-router'
import asyncRouteSettings from '@/config/async-route'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '')
  const roles = ref<string[]>([])
  const username = ref<string>('')

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (loginData: ILoginRequestData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        loginName: loginData.loginName,
        password: loginData.password,
      })
        .then((res) => {
          setToken(res.data.token)
          token.value = res.data.token
          username.value = res.data.userName
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve) => {
      roles.value = asyncRouteSettings.defaultRoles
      resolve(null)
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = 'token-' + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
    _resetTagsView()
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ''
    roles.value = []
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ''
    roles.value = []
  }
  /** 重置 visited views 和 cached views */
  const _resetTagsView = () => {
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  return { token, roles, username, setRoles, login, getInfo, changeRoles, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
