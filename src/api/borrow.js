import request from '@/utils/request'

/**
 * 获取借阅总数
 */
export function getBorrowCount() {
  return request({
    url: '/borrow/getCount',
    method: 'get'
  })
}

/**
 * 分页查询借阅记录
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @param {number} params.userid - 用户ID（可选）
 * @param {number} params.bookid - 图书ID（可选）
 */
export function queryBorrowsByPage(params) {
  return request({
    url: '/borrow/queryBorrowsByPage',
    method: 'get',
    params
  })
}

/**
 * 借书
 * @param {Object} params - 借书参数
 * @param {number} params.userid - 用户ID
 * @param {number} params.bookid - 图书ID
 */
export function borrowBook(params) {
  return request({
    url: '/borrow/borrowBook',
    method: 'post',
    params
  })
}

/**
 * 读者借书
 * @param {Object} params - 借书参数
 * @param {number} params.userid - 用户ID
 * @param {number} params.bookid - 图书ID
 */
export function readerBorrowBook(params) {
  return request({
    url: '/borrow/reader/borrowBook',
    method: 'post',
    params
  })
}

/**
 * 还书
 * @param {Object} params - 还书参数
 * @param {number} params.borrowid - 借阅记录ID
 * @param {number} params.bookid - 图书ID
 */
export function returnBook(params) {
  return request({
    url: '/borrow/returnBook',
    method: 'post',
    params
  })
}

/**
 * 读者还书
 * @param {Object} params - 还书参数
 * @param {number} params.borrowid - 借阅记录ID
 * @param {number} params.bookid - 图书ID
 */
export function readerReturnBook(params) {
  return request({
    url: '/borrow/reader/returnBook',
    method: 'post',
    params
  })
}

/**
 * 添加借阅记录（管理员）
 * @param {Object} data - 借阅记录信息
 */
export function addBorrow(data) {
  return request({
    url: '/borrow/addBorrow',
    method: 'post',
    data
  })
}

/**
 * 删除借阅记录（管理员）
 * @param {Object} data - 包含 borrowid
 */
export function deleteBorrow(data) {
  return request({
    url: '/borrow/deleteBorrow',
    method: 'delete',
    data
  })
}

/**
 * 批量删除借阅记录（管理员）
 * @param {Array} data - 借阅记录ID数组
 */
export function deleteBorrows(data) {
  return request({
    url: '/borrow/deleteBorrows',
    method: 'delete',
    data
  })
}

/**
 * 更新借阅记录（管理员）
 * @param {Object} data - 借阅记录信息
 */
export function updateBorrow(data) {
  return request({
    url: '/borrow/updateBorrow',
    method: 'put',
    data
  })
}
