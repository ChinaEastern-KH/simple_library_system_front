<template>
  <div class="borrow-manage-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="用户ID">
          <el-input
            v-model="searchForm.userid"
            placeholder="请输入用户ID"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>

        <el-form-item label="图书ID">
          <el-input
            v-model="searchForm.bookid"
            placeholder="请输入图书ID"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>

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

    <!-- 借阅记录列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">借阅记录管理</span>
          <span class="total">共 {{ total }} 条记录</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="borrowList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="borrowid" label="借阅ID" width="80" align="center" />

        <el-table-column prop="userid" label="用户ID" width="80" align="center" />

        <el-table-column prop="username" label="用户名" width="120" show-overflow-tooltip />

        <el-table-column prop="bookid" label="图书ID" width="80" align="center" />

        <el-table-column prop="bookname" label="书名" min-width="200" show-overflow-tooltip />

        <el-table-column prop="borrowtime" label="借阅时间" width="180" align="center" />

        <el-table-column prop="returntime" label="归还时间" width="180" align="center">
          <template #default="{ row }">
            <span v-if="row.returntime">{{ row.returntime }}</span>
            <el-tag v-else type="warning">未归还</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.returntime ? 'success' : 'danger'">
              {{ row.returntime ? '已归还' : '借阅中' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="!row.returntime"
              type="primary"
              size="small"
              @click="handleReturn(row)"
            >
              归还
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { queryBorrowsByPage, returnBook, deleteBorrow } from '@/api/borrow'

// 搜索表单
const searchForm = reactive({
  userid: '',
  bookid: ''
})

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 10
})

// 数据
const borrowList = ref([])
const total = ref(0)
const loading = ref(false)

// 获取借阅记录列表
const loadBorrowList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit
    }

    // 添加搜索条件
    if (searchForm.userid) {
      params.userid = parseInt(searchForm.userid)
    }
    if (searchForm.bookid) {
      params.bookid = parseInt(searchForm.bookid)
    }

    const response = await queryBorrowsByPage(params)

    if (response.code === 0) {
      borrowList.value = response.data || []
      total.value = response.count || 0
    } else {
      ElMessage.error(response.message || '获取借阅记录失败')
    }
  } catch (error) {
    console.error('获取借阅记录失败:', error)
    ElMessage.error('获取借阅记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadBorrowList()
}

// 重置
const handleReset = () => {
  searchForm.userid = ''
  searchForm.bookid = ''
  pagination.page = 1
  loadBorrowList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.limit = size
  pagination.page = 1
  loadBorrowList()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.page = page
  loadBorrowList()
}

// 归还图书
const handleReturn = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要将《${row.bookname}》标记为已归还吗？`,
      '归还确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    const result = await returnBook({
      borrowid: row.borrowid,
      bookid: row.bookid
    })

    if (result === 1) {
      ElMessage.success('归还成功')
      loadBorrowList()
    } else {
      ElMessage.error('归还失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('归还失败:', error)
      ElMessage.error('归还失败')
    }
  }
}

// 删除借阅记录
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条借阅记录吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await deleteBorrow({ borrowid: row.borrowid })

    if (result === 1) {
      ElMessage.success('删除成功')
      loadBorrowList()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 初始化
onMounted(() => {
  loadBorrowList()
})
</script>

<style scoped>
.borrow-manage-container {
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
