<template>
  <view class="page">
    <view class="header">
      <view class="month-row">
        <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
          <view class="month-pill">
            <text class="month-text">{{ monthKey }}</text>
            <text class="month-sub">切换</text>
          </view>
        </picker>
        <view class="header-actions">
          <button class="ghost-btn" size="mini" @click="goAssets">预算与资产</button>
        </view>
      </view>

      <view class="summary-card">
        <view class="summary-top">
          <view class="summary-item">
            <text class="label">本月支出</text>
            <text class="value expense">-{{ formatCents(monthExpense) }}</text>
          </view>
          <view class="summary-item">
            <text class="label">本月收入</text>
            <text class="value income">+{{ formatCents(monthIncome) }}</text>
          </view>
        </view>
        <view class="summary-bottom">
          <view class="summary-item">
            <text class="label">结余</text>
            <text class="value">{{ formatCents(monthIncome - monthExpense) }}</text>
          </view>
          <view class="summary-item">
            <text class="label">预算剩余</text>
            <text class="value">{{ budgetRemainText }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title-row">
        <text class="section-title">最近账单</text>
        <button class="link-btn" size="mini" @click="goBills">查看全部</button>
      </view>
      <view v-if="recent.length === 0" class="empty">
        <text class="empty-text">还没有账单，先记一笔吧</text>
        <button class="primary-btn" @click="goAdd">记一笔</button>
      </view>
      <view v-else class="list">
        <view v-for="t in recent" :key="t.id" class="txn" @click="goDetail(t.id)">
          <view class="txn-left">
            <view class="icon" :style="{ backgroundColor: categoryMap.get(t.categoryId)?.color || '#E5E7EB' }">
              <text class="icon-text">{{ categoryMap.get(t.categoryId)?.icon || "🧾" }}</text>
            </view>
            <view class="meta">
              <text class="name">{{ categoryMap.get(t.categoryId)?.name || "未分类" }}</text>
              <text class="sub">{{ txnSub(t) }}</text>
            </view>
          </view>
          <view class="txn-right">
            <text class="amt" :class="t.type === 'expense' ? 'expense' : 'income'">
              {{ t.type === "expense" ? "-" : "+" }}{{ formatCents(t.amountCents) }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="floating">
      <button class="fab" @click="goAdd">记一笔</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { Transaction } from "@/domain/types"
import { useLedgerStore } from "@/store/useLedgerStore"
import { parseISOToDateKey, toMonthKey } from "@/utils/date"
import { formatCents } from "@/utils/money"

const store = useLedgerStore()

const monthKey = ref(toMonthKey(new Date()))

const categoryMap = computed(() => {
  const m = new Map<string, { name: string; icon?: string; color?: string }>()
  for (const c of store.state.data.categories) m.set(c.id, { name: c.name, icon: c.icon, color: c.color })
  return m
})

const accountMap = computed(() => {
  const m = new Map<string, string>()
  for (const a of store.state.data.accounts) m.set(a.id, a.name)
  return m
})

const monthTxns = computed(() => store.listTxnsByMonth(monthKey.value))

const monthExpense = computed(() => monthTxns.value.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0))
const monthIncome = computed(() => monthTxns.value.filter((t) => t.type === "income").reduce((s, t) => s + t.amountCents, 0))

const budgetRemainText = computed(() => {
  const b = store.getBudget(monthKey.value)
  if (!b || typeof b.totalCents !== "number") return "未设置"
  const remain = b.totalCents - monthExpense.value
  return formatCents(remain)
})

const recent = computed(() => store.state.data.transactions.slice(0, 8))

function txnSub(t: Transaction) {
  const date = parseISOToDateKey(t.occurredAt)
  const acc = accountMap.value.get(t.accountId) || "账户"
  const note = t.note?.trim()
  return note ? `${date} · ${acc} · ${note}` : `${date} · ${acc}`
}

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}

function goAdd() {
  uni.switchTab({ url: "/pages/add/index" })
}

function goBills() {
  uni.switchTab({ url: "/pages/bills/index" })
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/bill-detail/index?id=${encodeURIComponent(id)}` })
}

function goAssets() {
  uni.navigateTo({ url: "/pages/assets/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f7fb;
}

.header {
  padding: 24rpx 24rpx 12rpx;
}

.month-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.month-pill {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  padding: 12rpx 16rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 18rpx;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.06);
}

.month-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #0f172a;
}

.month-sub {
  font-size: 22rpx;
  color: #64748b;
}

.header-actions {
  display: flex;
  align-items: center;
}

.ghost-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  border-radius: 16rpx;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.summary-card {
  background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0.92));
  border-radius: 22rpx;
  padding: 18rpx 18rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.08);
}

.summary-top,
.summary-bottom {
  display: flex;
  gap: 16rpx;
}

.summary-top {
  margin-bottom: 12rpx;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.label {
  font-size: 22rpx;
  color: #64748b;
}

.value {
  font-size: 34rpx;
  font-weight: 800;
  color: #0f172a;
}

.expense {
  color: #ef4444;
}

.income {
  color: #22c55e;
}

.section {
  padding: 12rpx 24rpx 160rpx;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8rpx 0 12rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #0f172a;
}

.link-btn {
  background: transparent;
  color: #2563eb;
}

.empty {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.06);
}

.empty-text {
  color: #334155;
  font-size: 26rpx;
}

.primary-btn {
  background: #111827;
  color: #ffffff;
  border-radius: 18rpx;
}

.list {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  overflow: hidden;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.06);
}

.txn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 18rpx;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.txn:last-child {
  border-bottom: none;
}

.txn-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 34rpx;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.name {
  font-size: 28rpx;
  font-weight: 700;
  color: #0f172a;
}

.sub {
  font-size: 22rpx;
  color: #64748b;
}

.txn-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.amt {
  font-size: 30rpx;
  font-weight: 800;
}

.floating {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 30rpx;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.fab {
  pointer-events: auto;
  width: 340rpx;
  background: #111827;
  color: #ffffff;
  border-radius: 999rpx;
  box-shadow: 0 22rpx 60rpx rgba(17, 24, 39, 0.3);
}
</style>

