# 记账小程序（UniApp）

一个本地优先的记账小程序项目：支持记账、账单、统计、预算与资产管理，并提供数据导出/导入能力。

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
