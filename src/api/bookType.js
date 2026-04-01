import request from '@/utils/request'

/**
 * 获取图书类型总数
 */
export function getBookTypeCount() {
  return request({
    url: '/bookType/getCount',
    method: 'get'
  })
}

/**
 * 查询所有图书类型
 */
export function queryAllBookTypes() {
  return request({
    url: '/bookType/queryBookTypes',
    method: 'get'
  })
}

/**
 * 读者查询所有图书类型
 */
export function readerQueryAllBookTypes() {
  return request({
    url: '/bookType/reader/queryBookTypes',
    method: 'get'
  })
}

/**
 * 分页查询图书类型（管理员）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.booktypename - 类型名称（可选）
 */
export function queryBookTypesByPage(params) {
  return request({
    url: '/bookType/queryBookTypesByPage',
    method: 'get',
    params
  })
}

/**
 * 添加图书类型（管理员）
 * @param {Object} data - 类型信息
 */
export function addBookType(data) {
  return request({
    url: '/bookType/addBookType',
    method: 'post',
    data
  })
}

/**
 * 删除图书类型（管理员）
 * @param {Object} data - 包含 booktypeid
 */
export function deleteBookType(data) {
  return request({
    url: '/bookType/deleteBookType',
    method: 'delete',
    data
  })
}

/**
 * 批量删除图书类型（管理员）
 * @param {Array} data - 类型ID数组
 */
export function deleteBookTypes(data) {
  return request({
    url: '/bookType/deleteBookTypes',
    method: 'delete',
    data
  })
}

/**
 * 更新图书类型（管理员）
 * @param {Object} data - 类型信息
 */
export function updateBookType(data) {
  return request({
    url: '/bookType/updateBookType',
    method: 'put',
    data
  })
}
