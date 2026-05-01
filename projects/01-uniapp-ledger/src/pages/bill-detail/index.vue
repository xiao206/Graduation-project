<template>
  <view class="page">
    <view v-if="!txn" class="empty">
      <text class="empty-title">账单不存在</text>
      <button class="primary" @click="back">返回</button>
    </view>

    <view v-else class="card">
      <view class="top">
        <view class="icon" :style="{ backgroundColor: category?.color || '#E5E7EB' }">
          <text class="icon-text">{{ category?.icon || "🧾" }}</text>
        </view>
        <view class="meta">
          <text class="name">{{ category?.name || "未分类" }}</text>
          <text class="sub">{{ dateKey }} · {{ account?.name || "账户" }}</text>
        </view>
      </view>

      <view class="amount-row">
        <text class="amount" :class="txn.type === 'expense' ? 'expense' : 'income'">
          {{ txn.type === "expense" ? "-" : "+" }}{{ formatCents(txn.amountCents) }}
        </text>
      </view>

      <view v-if="txn.note" class="note">
        <text class="note-label">备注</text>
        <text class="note-text">{{ txn.note }}</text>
      </view>

      <view class="actions">
        <button class="ghost" @click="edit">编辑</button>
        <button class="danger" @click="remove">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useLedgerStore } from "@/store/useLedgerStore"
import { parseISOToDateKey } from "@/utils/date"
import { formatCents } from "@/utils/money"

const store = useLedgerStore()
const id = ref("")
const PENDING_EDIT_KEY = "gp:pendingEditTxnId"

const txn = computed(() => (id.value ? store.getTxnById(id.value) : undefined))

const category = computed(() => {
  const t = txn.value
  if (!t) return undefined
  return store.state.data.categories.find((c) => c.id === t.categoryId)
})

const account = computed(() => {
  const t = txn.value
  if (!t) return undefined
  return store.state.data.accounts.find((a) => a.id === t.accountId)
})

const dateKey = computed(() => {
  const t = txn.value
  if (!t) return ""
  return parseISOToDateKey(t.occurredAt)
})

function back() {
  uni.navigateBack()
}

function edit() {
  if (!id.value) return
  uni.setStorageSync(PENDING_EDIT_KEY, id.value)
  uni.switchTab({ url: "/pages/add/index" })
}

function remove() {
  if (!id.value) return
  uni.showModal({
    title: "确认删除",
    content: "删除后无法恢复，是否继续？",
    success(res) {
      if (!res.confirm) return
      const ok = store.deleteTransaction(id.value)
      if (!ok) return uni.showToast({ title: "删除失败", icon: "none" })
      uni.showToast({ title: "已删除", icon: "success" })
      setTimeout(() => uni.navigateBack(), 300)
    },
  })
}

onLoad((q: any) => {
  id.value = String(q?.id || "")
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f7fb;
  padding: 24rpx;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  padding: 20rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.08);
}

.top {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 40rpx;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 800;
  color: #0f172a;
}

.sub {
  font-size: 24rpx;
  color: #64748b;
}

.amount-row {
  margin-top: 20rpx;
  padding: 18rpx 18rpx;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 18rpx;
}

.amount {
  font-size: 52rpx;
  font-weight: 900;
}

.expense {
  color: #ef4444;
}

.income {
  color: #22c55e;
}

.note {
  margin-top: 16rpx;
  padding: 16rpx 18rpx;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 18rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.note-label {
  font-size: 22rpx;
  color: #64748b;
}

.note-text {
  font-size: 26rpx;
  color: #0f172a;
  font-weight: 700;
}

.actions {
  margin-top: 20rpx;
  display: flex;
  gap: 12rpx;
}

.ghost {
  flex: 1;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18rpx;
  color: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.danger {
  flex: 1;
  background: rgba(239, 68, 68, 0.12);
  border-radius: 18rpx;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.empty {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: flex-start;
}

.empty-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #0f172a;
}

.primary {
  background: #111827;
  color: #ffffff;
  border-radius: 18rpx;
}
</style>

