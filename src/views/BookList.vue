<template>
  <div class="book-list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <!-- 书名搜索 -->
        <el-form-item label="书名">
          <el-input
            v-model="searchForm.bookname"
            placeholder="请输入书名"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>

        <!-- 作者搜索 -->
        <el-form-item label="作者">
          <el-input
            v-model="searchForm.bookauthor"
            placeholder="请输入作者"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>

        <!-- 图书类型筛选 -->
        <el-form-item label="图书类型">
          <el-select
            v-model="searchForm.booktypeid"
            placeholder="请选择图书类型"
            clearable
            @clear="handleSearch"
          >
            <el-option
              v-for="type in bookTypes"
              :key="type.booktypeid"
              :label="type.booktypename"
              :value="type.booktypeid"
            />
          </el-select>
        </el-form-item>

        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图书列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">图书列表</span>
          <span class="total">共 {{ total }} 本图书</span>
        </div>
      </template>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="bookList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="bookname" label="书名" min-width="180" show-overflow-tooltip />

        <el-table-column prop="bookauthor" label="作者" width="120" show-overflow-tooltip />

        <el-table-column prop="booktypename" label="图书类型" width="120" align="center" />

        <el-table-column prop="bookprice" label="价格" width="100" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.bookprice }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="isborrowed" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isborrowed === 0 ? 'success' : 'danger'">
              {{ row.isborrowed === 0 ? '可借' : '已借出' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="bookdesc" label="描述" min-width="200" show-overflow-tooltip />

        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :disabled="row.isborrowed === 1"
              @click="handleBorrow(row)"
            >
              {{ row.isborrowed === 0 ? '借阅' : '已借出' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { queryBooksByPage } from '@/api/book'
import { readerQueryAllBookTypes } from '@/api/bookType'
import { readerBorrowBook } from '@/api/borrow'

// 搜索表单
const searchForm = reactive({
  bookname: '',
  bookauthor: '',
  booktypeid: null
})

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 10
})

// 数据
const bookList = ref([])
const bookTypes = ref([])
const total = ref(0)
const loading = ref(false)

// 获取图书类型列表
const loadBookTypes = async () => {
  try {
    const response = await readerQueryAllBookTypes()
    bookTypes.value = response || []
  } catch (error) {
    console.error('获取图书类型失败:', error)
  }
}

// 获取图书列表
const loadBookList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm
    }

    // 移除空值参数
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await queryBooksByPage(params)

    if (response.code === 0) {
      bookList.value = response.data || []
      total.value = response.count || 0
    } else {
      ElMessage.error(response.message || '获取图书列表失败')
    }
  } catch (error) {
    console.error('获取图书列表失败:', error)
    ElMessage.error('获取图书列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadBookList()
}

// 重置
const handleReset = () => {
  searchForm.bookname = ''
  searchForm.bookauthor = ''
  searchForm.booktypeid = null
  pagination.page = 1
  loadBookList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.limit = size
  pagination.page = 1
  loadBookList()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.page = page
  loadBookList()
}

// 借阅图书
const handleBorrow = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要借阅《${row.bookname}》吗？`,
      '借阅确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    // 获取用户ID
    const userid = localStorage.getItem('userid')
    if (!userid) {
      ElMessage.error('请先登录')
      return
    }

    // 调用借阅接口
    const result = await readerBorrowBook({
      userid: parseInt(userid),
      bookid: row.bookid
    })

    if (result === 1) {
      ElMessage.success('借阅成功')
      // 刷新列表
      loadBookList()
    } else {
      ElMessage.error('借阅失败，该图书可能已被借出')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('借阅失败:', error)
      ElMessage.error('借阅失败')
    }
  }
}

// 初始化
onMounted(() => {
  loadBookTypes()
  loadBookList()
})
</script>

<style scoped>
.book-list-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.table-card {
  min-height: 500px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-header .total {
  font-size: 14px;
  color: #666;
}

.price {
  color: #f56c6c;
  font-weight: 600;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
