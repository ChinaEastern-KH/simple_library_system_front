import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8092/BookManager', // 基础URL
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.params = {
        ...config.params,
        token
      }
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data

    // 处理操作结果响应（status: 200/420）
    if (res.status !== undefined) {
      if (res.status === 200) {
        return res
      } else if (res.status === 420) {
        ElMessage.error(res.message || '操作失败')
        return Promise.reject(new Error(res.message || '操作失败'))
      }
    }

    // 处理分页查询响应（code: 0）
    if (res.code !== undefined) {
      if (res.code === 0) {
        return res
      } else {
        ElMessage.error(res.message || '查询失败')
        return Promise.reject(new Error(res.message || '查询失败'))
      }
    }

    // 直接返回数据（如数字类型的响应）
    return response.data
  },
  error => {
    console.error('响应错误:', error)
    ElMessage.error(error.message || '网络请求失败')
    return Promise.reject(error)
  }
)

export default request
