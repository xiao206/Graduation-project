<template>
  <view class="page">
    <view class="toolbar">
      <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
        <view class="pill">
          <text class="pill-text">{{ monthKey }}</text>
          <text class="pill-sub">月份</text>
        </view>
      </picker>
      <input v-model="keyword" class="search" placeholder="搜索备注/分类" placeholder-class="ph" />
    </view>

    <view class="summary">
      <view class="sum-item">
        <text class="sum-k">支出</text>
        <text class="sum-v expense">{{ monthExpenseText }}</text>
      </view>
      <view class="sum-item">
        <text class="sum-k">收入</text>
        <text class="sum-v income">{{ monthIncomeText }}</text>
      </view>
      <view class="sum-item">
        <text class="sum-k">结余</text>
        <text class="sum-v">{{ formatCents(monthIncome - monthExpense) }}</text>
      </view>
    </view>

    <view v-if="groups.length === 0" class="empty">
      <text class="empty-title">本月还没有账单</text>
      <text class="empty-sub">去记一笔，之后这里会按日期整理</text>
      <text class="empty-sub">支持搜索备注/分类</text>
      <button class="primary" @click="goAdd">记一笔</button>
    </view>

    <scroll-view v-else scroll-y class="scroll">
      <view v-for="g in groups" :key="g.date" class="group">
        <view class="group-head">
          <text class="group-date">{{ g.date }}</text>
            <text class="group-sum">支出 {{ expenseText(g.expense) }} · 收入 {{ incomeText(g.income) }}</text>
        </view>
        <view class="list">
          <view v-for="t in g.items" :key="t.id" class="item" @click="goDetail(t.id)">
            <view class="left">
              <view class="icon" :style="{ backgroundColor: categoryMap.get(t.categoryId)?.color || '#E5E7EB' }">
                <uni-icons :type="categoryMap.get(t.categoryId)?.icon || 'more-filled'" size="24" color="#FFFFFF" />
              </view>
              <view class="meta">
                <text class="name">{{ categoryMap.get(t.categoryId)?.name || "未分类" }}</text>
                <text class="sub">{{ itemSub(t) }}</text>
              </view>
            </view>
            <text class="amt" :class="t.type === 'expense' ? 'expense' : 'income'">
              {{ t.type === "expense" ? "-" : "+" }}{{ formatCents(t.amountCents) }}
            </text>
          </view>
        </view>
      </view>
      <view class="tail">
        <text class="tail-title">本月共 {{ filtered.length }} 笔</text>
        <text class="tail-sub">继续记账，数据会更清晰</text>
        <button class="tail-btn" @click="goAdd">记一笔</button>
      </view>
    </scroll-view>
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
const keyword = ref("")

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

const filtered = computed(() => {
  const txns = store.listTxnsByMonth(monthKey.value)
  const q = keyword.value.trim().toLowerCase()
  if (!q) return txns
  return txns.filter((t) => {
    const c = categoryMap.value.get(t.categoryId)?.name || ""
    const note = t.note || ""
    return `${c} ${note}`.toLowerCase().includes(q)
  })
})

const monthExpense = computed(() => filtered.value.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0))
const monthIncome = computed(() => filtered.value.filter((t) => t.type === "income").reduce((s, t) => s + t.amountCents, 0))
const monthExpenseText = computed(() => (monthExpense.value > 0 ? `-${formatCents(monthExpense.value)}` : "0.00"))
const monthIncomeText = computed(() => `+${formatCents(monthIncome.value)}`)

const groups = computed(() => {
  const raw = store.groupTxnsByDate(filtered.value)
  return raw.map((g) => {
    const expense = g.items.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0)
    const income = g.items.filter((t) => t.type === "income").reduce((s, t) => s + t.amountCents, 0)
    return { ...g, expense, income }
  })
})

function expenseText(cents: number) {
  return cents > 0 ? `-${formatCents(cents)}` : "0.00"
}

function incomeText(cents: number) {
  return `+${formatCents(cents)}`
}

function itemSub(t: Transaction) {
  const acc = accountMap.value.get(t.accountId) || "账户"
  const note = t.note?.trim()
  return note ? `${acc} · ${note}` : acc
}

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/bill-detail/index?id=${encodeURIComponent(id)}` })
}

function goAdd() {
  uni.switchTab({ url: "/pages/add/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
}

.toolbar {
  padding: 18rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.pill {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  padding: 12rpx 16rpx;
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.pill-text {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--text);
}

.pill-sub {
  font-size: 22rpx;
  color: var(--muted);
}

.search {
  flex: 1;
  height: 72rpx;
  padding: 0 16rpx;
  background: var(--card);
  border-radius: var(--radius);
  font-size: 26rpx;
  color: var(--text);
  border: 1px solid var(--border);
}

.ph {
  color: #94a3b8;
}

.summary {
  padding: 0 24rpx 14rpx;
  display: flex;
  gap: 12rpx;
}

.sum-item {
  flex: 1;
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 16rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.sum-k {
  font-size: 22rpx;
  color: var(--muted);
}

.sum-v {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
}

.scroll {
  height: calc(100vh - 108rpx - 130rpx);
  padding-bottom: calc(24rpx + var(--tabbar) + var(--safe-bottom));
}

.group {
  padding: 0 24rpx 18rpx;
}

.group-head {
  padding: 8rpx 6rpx 12rpx;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14rpx;
}

.group-date {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--text);
}

.group-sum {
  font-size: 22rpx;
  color: var(--muted);
}

.list {
  background: var(--card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 18rpx;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.item:last-child {
  border-bottom: none;
}

.left {
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
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.icon::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(0, 0, 0, 0.12));
}

.icon > * {
  position: relative;
  z-index: 1;
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
  color: var(--text);
}

.sub {
  font-size: 22rpx;
  color: var(--muted);
}

.amt {
  font-size: 30rpx;
  font-weight: 800;
}

.expense {
  color: #ef4444;
}

.income {
  color: #22c55e;
}

.empty {
  margin: 24rpx;
  padding: 28rpx;
  background: var(--card);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.empty-title {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--text);
}

.empty-sub {
  font-size: 24rpx;
  color: var(--muted);
}

.primary {
  margin-top: 6rpx;
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}

.tail {
  margin: 8rpx 24rpx 0;
  background: rgba(15, 23, 42, 0.03);
  border: 1px dashed rgba(148, 163, 184, 0.7);
  border-radius: var(--radius-lg);
  padding: 22rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  align-items: flex-start;
}

.tail-title {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
}

.tail-sub {
  font-size: 22rpx;
  color: var(--muted);
}

.tail-btn {
  margin-top: 4rpx;
  height: 76rpx;
  padding: 0 26rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
}
</style>
