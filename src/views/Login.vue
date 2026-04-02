<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 标题 -->
      <div class="login-header">
        <h2>图书管理系统</h2>
        <p>欢迎登录</p>
      </div>

      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="userpassword">
          <el-input
            v-model="loginForm.userpassword"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            clearable
          />
        </el-form-item>

        <!-- 角色选择 -->
        <el-form-item prop="isadmin">
          <el-radio-group v-model="loginForm.isadmin" size="large">
            <el-radio :value="0">读者</el-radio>
            <el-radio :value="1">管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>

        <!-- 注册入口 -->
        <div class="register-link">
          还没有账号？
          <el-link type="primary" @click="goToRegister">立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  userpassword: '',
  isadmin: 0 // 默认读者
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  userpassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  isadmin: [
    { required: true, message: '请选择登录角色', trigger: 'change' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const response = await login(loginForm)

        if (response.status === 200 && response.data.token) {
          // 保存 token 和用户信息到 localStorage
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('username', loginForm.username)
          localStorage.setItem('isadmin', loginForm.isadmin)
          localStorage.setItem('userid', response.data.userid)

          ElMessage.success('登录成功')

          // 跳转到首页
          router.push('/dashboard')
        } else {
          ElMessage.error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查用户名、密码和角色是否正确')
      } finally {
        loading.value = false
      }
    }
  })
}

// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 420px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.login-header p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.login-form {
  margin-top: 24px;
}

.login-button {
  width: 100%;
  margin-top: 8px;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-radio-group) {
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.el-radio) {
  margin-right: 32px;
}
</style>
