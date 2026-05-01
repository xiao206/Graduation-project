# 毕业设计项目仓库

用于集中存放我在毕业设计期间编写的各类项目（前端/全栈为主）、论文/报告，以及相关资料与数据。

## 目录结构

```
.
├── projects/                # 各子项目（按项目分目录）
│   ├── _template/           # 新建项目模板
│   └── README.md            # 项目清单与约定
├── docs/                    # 论文与报告
│   └── README.md
└── data/                    # 数据/素材（尽量只放可版本化的小文件）
    └── README.md
```

## 如何新增一个项目

1. 复制 `projects/_template` 为 `projects/NN-项目短名`（例如 `projects/01-web-demo`）
2. 完善该项目下的 `README.md`（目标、技术栈、启动方式、截图/演示链接等）
3. 在 [projects/README.md](file:///workspace/projects/README.md) 里把项目登记到清单

## 基本约定

- 不提交任何密钥/账号信息：使用 `.env`，并确保被忽略
- 大文件/数据集不要直接进 Git：放在 `data/` 并遵循其中说明（必要时再用 Git LFS）
- 每个项目尽量做到可复现：写清楚安装、启动、构建与运行环境要求
