<template>
  <view class="page">
    <view class="toolbar">
      <view class="toolbar-top">
        <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
          <view class="chip">
            <uni-icons type="calendar" size="14" color="var(--muted)" />
            <text class="chip-text">{{ monthKey }}</text>
            <uni-icons type="down" size="12" color="var(--muted)" />
          </view>
        </picker>
        <view class="add" @click="goAdd">
          <uni-icons type="plus" size="18" color="#ffffff" />
        </view>
      </view>
      <view class="search-wrap">
        <uni-icons type="search" size="16" color="var(--muted)" />
        <input v-model="keyword" class="search" placeholder="搜索备注/分类/成员" placeholder-class="ph" />
      </view>
    </view>

    <view class="summary">
      <view class="summary-card">
        <text class="summary-k">本月合计</text>
        <text class="summary-v">¥{{ formatCents(monthTotal) }}</text>
      </view>
      <view class="summary-card">
        <text class="summary-k">筛选结果</text>
        <text class="summary-v">{{ filteredCount }} 笔</text>
      </view>
    </view>

    <view v-if="groups.length === 0" class="empty">
      <text class="empty-title">本月还没有账单</text>
      <text class="empty-sub">新增一笔后，这里会按发生日期整理</text>
      <button class="primary" @click="goAdd">新增账单</button>
    </view>

    <scroll-view v-else scroll-y class="scroll">
      <view v-for="g in groups" :key="g.date" class="group">
        <view class="group-head">
          <text class="group-date">{{ g.date }}</text>
          <view class="group-chip">¥{{ formatCents(g.total) }}</view>
        </view>
        <view class="list">
          <view v-for="b in g.items" :key="b.id" class="cell" @click="goDetail(b.id)">
            <view class="dot" :style="{ backgroundColor: categoryMap.get(b.categoryId)?.color || '#D1D5DB' }" />
            <view class="cell-main">
              <view class="cell-top">
                <text class="cell-title">{{ categoryMap.get(b.categoryId)?.name || "未分类" }}</text>
                <text class="cell-amount">¥{{ formatCents(b.amountCents) }}</text>
              </view>
              <text class="cell-sub">{{ itemSub(b) }}</text>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 60rpx" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { AABill } from "@/domain/types"
import { useAASplitStore } from "@/store/useAASplitStore"
import { parseISOToDateKey, toMonthKey } from "@/utils/date"
import { formatCents } from "@/utils/money"

const store = useAASplitStore()

const monthKey = ref(toMonthKey(new Date()))
const keyword = ref("")

const categoryMap = computed(() => {
  const m = new Map<string, { name: string; icon?: string; color?: string }>()
  for (const c of store.state.data.categories) m.set(c.id, { name: c.name, icon: c.icon, color: c.color })
  return m
})

const memberNameMap = computed(() => {
  const m = new Map<string, string>()
  for (const x of store.state.data.members) m.set(x.id, x.name)
  return m
})

const filtered = computed(() => {
  const bills = store.listBillsByMonth(monthKey.value)
  const q = keyword.value.trim().toLowerCase()
  if (!q) return bills
  return bills.filter((b) => {
    const c = categoryMap.value.get(b.categoryId)?.name || ""
    const note = b.note || ""
    const payer = memberNameMap.value.get(b.payerId) || ""
    const parts = b.participantIds.map((id) => memberNameMap.value.get(id) || id).join(" ")
    return `${c} ${note} ${payer} ${parts}`.toLowerCase().includes(q)
  })
})

const monthTotal = computed(() => store.listBillsByMonth(monthKey.value).reduce((s, b) => s + b.amountCents, 0))
const filteredCount = computed(() => filtered.value.length)

const groups = computed(() => {
  const raw = store.groupBillsByDate(filtered.value)
  return raw.map((g) => ({ ...g, total: g.items.reduce((s, x) => s + x.amountCents, 0) }))
})

function itemSub(b: AABill) {
  const payer = memberNameMap.value.get(b.payerId) || "付款人"
  const note = b.note?.trim()
  const base = `${payer} · ${b.participantIds.length}人`
  return note ? `${base} · ${note}` : base
}

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/bill-detail/index?id=${encodeURIComponent(id)}` })
}

function goAdd() {
  uni.navigateTo({ url: "/pages/bill-edit/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
}

.toolbar {
  padding: 18rpx 24rpx 10rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.toolbar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 10rpx 12rpx;
  border-radius: 999rpx;
  background: var(--chip);
}

.chip-text {
  font-size: 24rpx;
  color: var(--text);
  font-weight: 900;
}

.add {
  width: 76rpx;
  height: 76rpx;
  border-radius: 999rpx;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}

.search-wrap {
  height: 76rpx;
  padding: 0 16rpx;
  background: var(--card);
  border-radius: 999rpx;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.search {
  flex: 1;
  height: 76rpx;
  padding: 0;
  background: transparent;
  font-size: 26rpx;
  color: var(--text);
}

.ph {
  color: rgba(107, 114, 128, 0.7);
}

.scroll {
  height: calc(100vh - 190rpx);
}

.summary {
  padding: 0 24rpx 6rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}

.summary-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16rpx 16rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.summary-k {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.summary-v {
  font-size: 30rpx;
  color: var(--text);
  font-weight: 900;
}

.group {
  padding: 0 24rpx 18rpx;
}

.group-head {
  padding: 8rpx 6rpx 12rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
}

.group-date {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
}

.group-chip {
  padding: 6rpx 10rpx;
  border-radius: 999rpx;
  background: var(--chip);
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.list {
  background: var(--card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
}

.cell {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  padding: 18rpx 18rpx;
  border-bottom: 1px solid var(--border);
}

.cell:last-child {
  border-bottom: none;
}

.dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 999rpx;
  margin-top: 10rpx;
}

.cell-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.cell-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12rpx;
}

.cell-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.cell-sub {
  font-size: 22rpx;
  color: var(--muted);
}

.cell-amount {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
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
  border-radius: 999rpx;
  height: 86rpx;
  font-weight: 900;
}
</style>
