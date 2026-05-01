# 校园失物招领助手（UniApp）

一个本地优先的校园失物招领小程序：支持本地账号登录注册、发布寻物/招领信息、列表检索、统计与数据导出/导入备份。

## 功能

- 登录注册：本地账号体系（仅用于本机管理你发布的信息）
- 信息发布：寻物/招领、分类、地点、日期、联系方式、描述
- 信息列表：搜索、状态显示（进行中/已认领/已结束）
- 详情管理：发布者可标记已认领/已结束、删除
- 分类管理：新增/启用停用分类
- 数据备份：导出/导入 JSON

## 技术栈

- UniApp（Vue 3）
- TypeScript
- 本机存储：`uni.setStorage` / `uni.getStorage`

## 开发

安装依赖：

```bash
pnpm install
```

运行到 H5：

```bash
pnpm dev:h5
```

运行到微信小程序：

```bash
pnpm dev:mp-weixin
```

类型检查：

```bash
pnpm type-check
```

构建（H5）：

```bash
pnpm build:h5
```
