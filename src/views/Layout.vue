<template>
  <div class="layout-container">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <h2>图书管理系统</h2>
        </div>
        <div class="header-right">
          <span class="username">欢迎，{{ username }}</span>
          <el-tag :type="isAdmin ? 'danger' : 'success'" style="margin-left: 8px">
            {{ isAdmin ? '管理员' : '读者' }}
          </el-tag>
          <el-button type="danger" size="small" @click="handleLogout" style="margin-left: 16px">
            退出登录
          </el-button>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px" class="aside">
          <el-menu
            :default-active="activeMenu"
            router
            class="menu"
          >
            <el-menu-item index="/dashboard">
              <el-icon><HomeFilled /></el-icon>
              <span>首页</span>
            </el-menu-item>

            <el-menu-item index="/books">
              <el-icon><Reading /></el-icon>
              <span>图书查询</span>
            </el-menu-item>

            <el-menu-item index="/borrow-record">
              <el-icon><Document /></el-icon>
              <span>借阅记录</span>
            </el-menu-item>

            <el-menu-item index="/password" disabled>
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </el-menu-item>

            <!-- 管理员菜单 -->
            <template v-if="isAdmin">
              <el-divider />

              <el-menu-item index="/admin/book-manage">
                <el-icon><Reading /></el-icon>
                <span>图书管理</span>
              </el-menu-item>

              <el-menu-item index="/admin/borrow-manage">
                <el-icon><Document /></el-icon>
                <span>借阅管理</span>
              </el-menu-item>

              <el-menu-item index="/admin/users" disabled>
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </el-menu-item>

              <el-menu-item index="/admin/book-types" disabled>
                <el-icon><Collection /></el-icon>
                <span>类型管理</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>

        <!-- 主体内容 -->
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { HomeFilled, Reading, Document, Lock, User, Collection } from '@element-plus/icons-vue'
import { logout } from '@/api/user'

const router = useRouter()
const route = useRoute()
const username = ref('')
const isAdmin = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

onMounted(() => {
  // 从 localStorage 获取用户信息
  username.value = localStorage.getItem('username') || '用户'
  isAdmin.value = localStorage.getItem('isadmin') === '1'
})

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const token = localStorage.getItem('token')
    if (token) {
      await logout(token)
    }

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('isadmin')

    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退出失败:', error)
    }
  }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  z-index: 100;
}

.header-left h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.username {
  color: #666;
  font-size: 14px;
}

.aside {
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.menu {
  border-right: none;
  height: 100%;
}

.main {
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

:deep(.el-menu-item.is-disabled) {
  opacity: 0.5;
}
</style>
