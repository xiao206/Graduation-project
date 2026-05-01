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

    <view v-if="groups.length === 0" class="empty">
      <text class="empty-title">本月还没有账单</text>
      <text class="empty-sub">去记一笔，之后这里会按日期整理</text>
      <button class="primary" @click="goAdd">记一笔</button>
    </view>

    <scroll-view v-else scroll-y class="scroll">
      <view v-for="g in groups" :key="g.date" class="group">
        <view class="group-head">
          <text class="group-date">{{ g.date }}</text>
          <text class="group-sum">支出 -{{ formatCents(g.expense) }} · 收入 +{{ formatCents(g.income) }}</text>
        </view>
        <view class="list">
          <view v-for="t in g.items" :key="t.id" class="item" @click="goDetail(t.id)">
            <view class="left">
              <view class="icon" :style="{ backgroundColor: categoryMap.get(t.categoryId)?.color || '#E5E7EB' }">
                <text class="icon-text">{{ categoryMap.get(t.categoryId)?.icon || "🧾" }}</text>
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
      <view style="height: 60rpx" />
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

const groups = computed(() => {
  const raw = store.groupTxnsByDate(filtered.value)
  return raw.map((g) => {
    const expense = g.items.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0)
    const income = g.items.filter((t) => t.type === "income").reduce((s, t) => s + t.amountCents, 0)
    return { ...g, expense, income }
  })
})

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
  background: #f6f7fb;
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
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18rpx;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.06);
}

.pill-text {
  font-size: 26rpx;
  font-weight: 800;
  color: #0f172a;
}

.pill-sub {
  font-size: 22rpx;
  color: #64748b;
}

.search {
  flex: 1;
  height: 72rpx;
  padding: 0 16rpx;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18rpx;
  font-size: 26rpx;
  color: #0f172a;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.06);
}

.ph {
  color: #94a3b8;
}

.scroll {
  height: calc(100vh - 108rpx);
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
  color: #0f172a;
}

.group-sum {
  font-size: 22rpx;
  color: #64748b;
}

.list {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  overflow: hidden;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.06);
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
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.06);
}

.empty-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #0f172a;
}

.empty-sub {
  font-size: 24rpx;
  color: #64748b;
}

.primary {
  margin-top: 6rpx;
  background: #111827;
  color: #ffffff;
  border-radius: 18rpx;
}
</style>

