<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 欢迎卡片 -->
      <el-col :span="24">
        <el-card class="welcome-card" shadow="hover">
          <div class="welcome-content">
            <h1>欢迎使用图书管理系统</h1>
            <p>您当前的角色是：<el-tag :type="isAdmin ? 'danger' : 'success'">{{ isAdmin ? '管理员' : '读者' }}</el-tag></p>
          </div>
        </el-card>
      </el-col>

      <!-- 快捷入口 -->
      <el-col :span="24" style="margin-top: 20px">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷入口</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="quick-link" @click="goTo('/books')">
                <el-icon :size="40" color="#409EFF"><Reading /></el-icon>
                <p>图书查询</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quick-link" @click="goTo('/borrow-record')">
                <el-icon :size="40" color="#67C23A"><Document /></el-icon>
                <p>借阅记录</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quick-link disabled">
                <el-icon :size="40" color="#909399"><Lock /></el-icon>
                <p>修改密码</p>
                <el-tag size="small" type="info">开发中</el-tag>
              </div>
            </el-col>
            <el-col :span="6" v-if="isAdmin">
              <div class="quick-link" @click="goTo('/admin/book-manage')">
                <el-icon :size="40" color="#E6A23C"><Reading /></el-icon>
                <p>图书管理</p>
              </div>
            </el-col>
            <el-col :span="6" v-if="isAdmin">
              <div class="quick-link" @click="goTo('/admin/borrow-manage')">
                <el-icon :size="40" color="#F56C6C"><Document /></el-icon>
                <p>借阅管理</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 系统信息 -->
      <el-col :span="24" style="margin-top: 20px">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ username }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ isAdmin ? '管理员' : '读者' }}</el-descriptions-item>
            <el-descriptions-item label="登录时间">{{ loginTime }}</el-descriptions-item>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Reading, Document, Lock, User } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref('')
const isAdmin = ref(false)
const loginTime = ref('')

onMounted(() => {
  // 从 localStorage 获取用户信息
  username.value = localStorage.getItem('username') || '用户'
  isAdmin.value = localStorage.getItem('isadmin') === '1'
  loginTime.value = new Date().toLocaleString('zh-CN')
})

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-content {
  text-align: center;
  padding: 40px 20px;
}

.welcome-content h1 {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 600;
}

.welcome-content p {
  margin: 0;
  font-size: 16px;
}

.welcome-content :deep(.el-tag) {
  font-size: 14px;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f5f7fa;
}

.quick-link:not(.disabled):hover {
  background-color: #ecf5ff;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-link.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.quick-link p {
  margin: 12px 0 0 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.quick-link :deep(.el-tag) {
  margin-top: 8px;
}
</style>
