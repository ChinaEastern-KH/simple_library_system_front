<template>
  <div class="home-container">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <h2>图书管理系统</h2>
        </div>
        <div class="header-right">
          <span class="username">欢迎，{{ username }}</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-main class="main">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>系统首页</span>
            </div>
          </template>
          <div class="welcome-content">
            <h1>欢迎使用图书管理系统</h1>
            <p>您当前的角色是：<el-tag>{{ isAdmin ? '管理员' : '读者' }}</el-tag></p>
            <p class="tip">更多功能正在开发中...</p>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logout } from '@/api/user'

const router = useRouter()
const username = ref('')
const isAdmin = ref(false)

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
.home-container {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
}

.header-left h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  color: #666;
  font-size: 14px;
}

.main {
  padding: 24px;
}

.welcome-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

.welcome-content {
  text-align: center;
  padding: 40px 20px;
}

.welcome-content h1 {
  margin-bottom: 24px;
  color: #333;
  font-size: 32px;
}

.welcome-content p {
  margin: 16px 0;
  font-size: 16px;
  color: #666;
}

.tip {
  margin-top: 32px;
  color: #999;
  font-size: 14px;
}
</style>
