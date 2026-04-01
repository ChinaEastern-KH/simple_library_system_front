# 图书管理系统 - 前端项目

基于 Vue 3 + Element Plus 的图书管理系统前端应用。

## 技术栈

- **Vue 3.5.29** - 渐进式 JavaScript 框架
- **Vite 7.3.1** - 下一代前端构建工具
- **Element Plus** - Vue 3 组件库
- **Vue Router 4** - 官方路由管理器
- **Axios** - HTTP 客户端

## 项目结构

```
src/
├── api/              # API 接口
│   └── user.js       # 用户相关接口
├── assets/           # 静态资源
├── components/       # 公共组件
├── router/           # 路由配置
│   └── index.js      # 路由定义
├── utils/            # 工具函数
│   └── request.js    # Axios 封装
├── views/            # 页面组件
│   ├── Login.vue     # 登录页
│   └── Home.vue      # 首页
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 功能说明

### 已实现功能

- ✅ 用户登录（支持读者/管理员角色）
- ✅ 登录状态管理（Token）
- ✅ 路由守卫（未登录自动跳转）
- ✅ 退出登录
- ✅ 响应拦截器（统一错误处理）



## API 配置

默认 API 地址：`http://localhost:8092/BookManager`

如需修改，请编辑 `src/utils/request.js` 中的 `baseURL`。

## 开发规范

- 提交代码前请阅读 `doc/commit-convention.md`
- 遵循 Vue 3 Composition API 风格
- 使用 ESLint 保持代码风格一致

## 相关文档

- [环境配置文档](./doc/env.md)
- [后端 API 文档](./doc/后端API文档.md)
- [页面需求文档](./doc/基本页面要求.md)
- [提交规范](./doc/commit-convention.md)

## 注意事项

1. 确保后端服务已启动并运行在 `http://localhost:8092`
2. 首次登录请使用后端提供的测试账号
3. Token 有效期为 1 小时，过期后需重新登录
