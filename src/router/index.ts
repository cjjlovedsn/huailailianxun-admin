import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true,
    },
    alias: '/:pathMatch(.*)*',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/',
    redirect: '/messages',
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index.vue'),
    //     name: 'Dashboard',
    //     meta: {
    //       title: '首页',
    //       svgIcon: 'dashboard',
    //       affix: true,
    //     },
    //   },
    // ],
  },
  {
    path: '/messages',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/messages/index.vue'),
        name: 'messages',
        meta: {
          title: '信息列表',
          svgIcon: 'publish',
        },
      },
    ],
  },
  {
    path: '/category',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/category/index.vue'),
        name: 'category',
        meta: {
          title: '分类管理',
          svgIcon: 'category',
        },
      },
    ],
  },
  {
    path: '/carousel',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/carousel/index.vue'),
        name: 'carousel',
        meta: {
          title: '轮播图管理',
          svgIcon: 'category',
        },
      },
    ],
  },
  {
    path: '/resources',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/resources/index.vue'),
        name: 'resources',
        meta: {
          title: '资源列表',
          svgIcon: 'resource',
        },
      },
    ],
  },
  {
    path: '/siteconfig',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/siteconfig/index.vue'),
        name: 'siteconfig',
        meta: {
          title: '网站配置',
          svgIcon: 'config',
        },
      },
    ],
  },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*', // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: '/404',
    name: 'ErrorPage',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes,
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
