import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import BookList from '@/views/BookList.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '首页' }
      },
      {
        path: '/books',
        name: 'BookList',
        component: BookList,
        meta: { title: '图书查询' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 图书管理系统` : '图书管理系统'

  // 获取 token
  const token = localStorage.getItem('token')

  // 如果访问登录页，直接放行
  if (to.path === '/login') {
    next()
  } else {
    // 访问其他页面需要验证 token
    if (token) {
      next()
    } else {
      // 未登录，跳转到登录页
      next('/login')
    }
  }
})

export default router
