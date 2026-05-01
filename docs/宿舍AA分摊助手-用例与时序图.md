**宿舍AA分摊助手（纯本地）用例与时序图**

# 1 用例图

## 1.1 整体用例图

```mermaid
flowchart LR
  U((用户))
  UC1([新增账单])
  UC2([编辑账单])
  UC3([删除账单])
  UC4([查看账单列表])
  UC5([查看账单详情])
  UC6([生成结算汇总])
  UC7([查看结算详情])
  UC8([成员管理])
  UC9([分类管理])
  UC10([数据导出])
  UC11([数据导入覆盖])

  U --> UC1
  U --> UC2
  U --> UC3
  U --> UC4
  U --> UC5
  U --> UC6
  U --> UC7
  U --> UC8
  U --> UC9
  U --> UC10
  U --> UC11
```

图1-1 宿舍AA分摊助手整体用例图

## 1.2 新增账单用例图

```mermaid
flowchart LR
  U((用户))
  A1([输入金额])
  A2([选择分类])
  A3([选择付款人])
  A4([选择参与人])
  A5([选择发生日期])
  A6([填写备注 可选])
  A7([保存])

  U --> A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7
```

图1-2 新增账单用例图

## 1.3 生成结算汇总用例图

```mermaid
flowchart LR
  U((用户))
  S1([选择结算范围])
  S2([生成汇总])
  S3([查看每人应收/应付])

  U --> S1 --> S2 --> S3
```

图1-3 生成结算汇总用例图

# 2 时序图

## 2.1 新增账单时序图

```mermaid
sequenceDiagram
  participant U as 用户
  participant P as 账单编辑页
  participant S as Store(本地数据)
  participant L as Storage

  U->>P: 输入金额/选择付款人/参与人/日期
  U->>P: 点击保存
  P->>S: createBill(billInput)
  S->>S: 校验字段与金额
  S->>S: 写入 bills[]
  S->>L: setStorageSync(aa:ledger)
  S-->>P: 返回 billId
  P-->>U: Toast“已保存”并返回列表
```

图2-1 新增账单时序图

## 2.2 生成结算汇总时序图（平均分摊）

```mermaid
sequenceDiagram
  participant U as 用户
  participant P as 结算页
  participant S as Store(本地数据)

  U->>P: 选择范围(本月/自定义)
  U->>P: 点击生成结算
  P->>S: settle(range)
  S->>S: 过滤账单
  S->>S: 计算 paidCents/shareCents
  S->>S: 余数分配(分为单位)
  S->>S: 输出 net(应收/应付汇总)
  S-->>P: 返回 results[]
  P-->>U: 展示结算详情列表
```

图2-2 生成结算汇总时序图

