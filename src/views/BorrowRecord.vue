<template>
  <div class="borrow-record-container">
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">我的借阅记录</span>
          <el-button type="primary" :icon="Refresh" @click="loadBorrowList">
            刷新
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="borrowList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

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

        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="!row.returntime"
              type="primary"
              size="small"
              @click="handleReturn(row)"
            >
              归还
            </el-button>
            <span v-else style="color: #909399">已归还</span>
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
import { Refresh } from '@element-plus/icons-vue'
import { queryBorrowsByPage, readerReturnBook } from '@/api/borrow'

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
    const userid = localStorage.getItem('userid')
    if (!userid) {
      ElMessage.error('请先登录')
      return
    }

    const params = {
      page: pagination.page,
      limit: pagination.limit,
      userid: parseInt(userid)
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
      `确定要归还《${row.bookname}》吗？`,
      '归还确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    const result = await readerReturnBook({
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

// 初始化
onMounted(() => {
  loadBorrowList()
})
</script>

<style scoped>
.borrow-record-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
