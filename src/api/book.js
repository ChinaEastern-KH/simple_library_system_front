import request from '@/utils/request'

/**
 * 获取图书总数
 */
export function getBookCount() {
  return request({
    url: '/bookInfo/getCount',
    method: 'get'
  })
}

/**
 * 查询所有图书
 */
export function queryAllBooks() {
  return request({
    url: '/bookInfo/queryBookInfos',
    method: 'get'
  })
}

/**
 * 分页查询图书
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {string} params.bookname - 书名（可选）
 * @param {string} params.bookauthor - 作者（可选）
 * @param {number} params.booktypeid - 图书类型ID（可选）
 */
export function queryBooksByPage(params) {
  return request({
    url: '/bookInfo/queryBookInfosByPage',
    method: 'get',
    params
  })
}

/**
 * 添加图书（管理员）
 * @param {Object} data - 图书信息
 */
export function addBook(data) {
  return request({
    url: '/bookInfo/addBookInfo',
    method: 'post',
    data
  })
}

/**
 * 删除图书（管理员）
 * @param {Object} data - 包含 bookid
 */
export function deleteBook(data) {
  return request({
    url: '/bookInfo/deleteBookInfo',
    method: 'delete',
    data
  })
}

/**
 * 批量删除图书（管理员）
 * @param {Array} data - 图书ID数组
 */
export function deleteBooks(data) {
  return request({
    url: '/bookInfo/deleteBookInfos',
    method: 'delete',
    data
  })
}

/**
 * 更新图书（管理员）
 * @param {Object} data - 图书信息
 */
export function updateBook(data) {
  return request({
    url: '/bookInfo/updateBookInfo',
    method: 'put',
    data
  })
}
