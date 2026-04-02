<template>
  <div class="book-manage-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="书名">
          <el-input
            v-model="searchForm.bookname"
            placeholder="请输入书名"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>

        <el-form-item label="作者">
          <el-input
            v-model="searchForm.bookauthor"
            placeholder="请输入作者"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>

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
          <span class="title">图书管理</span>
          <div>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增图书
            </el-button>
            <el-button
              type="danger"
              :icon="Delete"
              :disabled="selectedBooks.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="bookList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
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

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              :disabled="row.isborrowed === 1"
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="bookForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="书名" prop="bookname">
          <el-input v-model="bookForm.bookname" placeholder="请输入书名" />
        </el-form-item>

        <el-form-item label="作者" prop="bookauthor">
          <el-input v-model="bookForm.bookauthor" placeholder="请输入作者" />
        </el-form-item>

        <el-form-item label="价格" prop="bookprice">
          <el-input-number
            v-model="bookForm.bookprice"
            :min="0"
            :precision="2"
            :step="0.1"
            placeholder="请输入价格"
          />
        </el-form-item>

        <el-form-item label="图书类型" prop="booktypeid">
          <el-select v-model="bookForm.booktypeid" placeholder="请选择图书类型">
            <el-option
              v-for="type in bookTypes"
              :key="type.booktypeid"
              :label="type.booktypename"
              :value="type.booktypeid"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="图书描述" prop="bookdesc">
          <el-input
            v-model="bookForm.bookdesc"
            type="textarea"
            :rows="4"
            placeholder="请输入图书描述"
          />
        </el-form-item>

        <el-form-item label="封面图片" prop="bookimg">
          <el-input v-model="bookForm.bookimg" placeholder="请输入图片路径" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { queryBooksByPage, addBook, updateBook, deleteBook, deleteBooks } from '@/api/book'
import { queryAllBookTypes } from '@/api/bookType'

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
const selectedBooks = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增图书')
const isEdit = ref(false)
const formRef = ref(null)

// 图书表单
const bookForm = reactive({
  bookid: null,
  bookname: '',
  bookauthor: '',
  bookprice: 0,
  booktypeid: null,
  bookdesc: '',
  bookimg: ''
})

// 表单验证规则
const formRules = {
  bookname: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  bookauthor: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  bookprice: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  booktypeid: [{ required: true, message: '请选择图书类型', trigger: 'change' }]
}

// 获取图书类型列表
const loadBookTypes = async () => {
  try {
    const response = await queryAllBookTypes()
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

// 选择改变
const handleSelectionChange = (selection) => {
  selectedBooks.value = selection
}

// 新增图书
const handleAdd = () => {
  dialogTitle.value = '新增图书'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑图书
const handleEdit = (row) => {
  dialogTitle.value = '编辑图书'
  isEdit.value = true
  Object.assign(bookForm, row)
  dialogVisible.value = true
}

// 删除图书
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除《${row.bookname}》吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await deleteBook({ bookid: row.bookid })

    if (result === 1) {
      ElMessage.success('删除成功')
      loadBookList()
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

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedBooks.value.length} 本图书吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const bookIds = selectedBooks.value.map(book => ({ bookid: book.bookid }))
    const result = await deleteBooks(bookIds)

    ElMessage.success(`成功删除 ${result} 本图书`)
    loadBookList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    const data = { ...bookForm }

    if (isEdit.value) {
      const result = await updateBook(data)
      if (result === 1) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        loadBookList()
      } else {
        ElMessage.error('更新失败')
      }
    } else {
      delete data.bookid
      const result = await addBook(data)
      if (result === 1) {
        ElMessage.success('添加成功')
        dialogVisible.value = false
        loadBookList()
      } else {
        ElMessage.error('添加失败')
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  bookForm.bookid = null
  bookForm.bookname = ''
  bookForm.bookauthor = ''
  bookForm.bookprice = 0
  bookForm.booktypeid = null
  bookForm.bookdesc = ''
  bookForm.bookimg = ''
  formRef.value?.clearValidate()
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 初始化
onMounted(() => {
  loadBookTypes()
  loadBookList()
})
</script>

<style scoped>
.book-manage-container {
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
