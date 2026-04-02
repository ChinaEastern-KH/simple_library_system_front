import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import BookList from '@/views/BookList.vue'
import BorrowRecord from '@/views/BorrowRecord.vue'
import BookManage from '@/views/admin/BookManage.vue'
import BorrowManage from '@/views/admin/BorrowManage.vue'

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
      },
      {
        path: '/borrow-record',
        name: 'BorrowRecord',
        component: BorrowRecord,
        meta: { title: '借阅记录' }
      },
      {
        path: '/admin/book-manage',
        name: 'BookManage',
        component: BookManage,
        meta: { title: '图书管理', requireAdmin: true }
      },
      {
        path: '/admin/borrow-manage',
        name: 'BorrowManage',
        component: BorrowManage,
        meta: { title: '借阅管理', requireAdmin: true }
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
      // 检查是否需要管理员权限
      if (to.meta.requireAdmin) {
        const isAdmin = localStorage.getItem('isadmin') === '1'
        if (isAdmin) {
          next()
        } else {
          // 非管理员，跳转到首页
          next('/dashboard')
        }
      } else {
        next()
      }
    } else {
      // 未登录，跳转到登录页
      next('/login')
    }
  }
})

export default router
