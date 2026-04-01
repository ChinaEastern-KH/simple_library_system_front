import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.userpassword - 密码
 * @param {number} data.isadmin - 角色标识（0-读者，1-管理员）
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param {string} token - 登录令牌
 */
export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 用户登出
 * @param {string} token - 登录令牌
 */
export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'get',
    params: { token }
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 */
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
