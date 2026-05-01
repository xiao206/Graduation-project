<template>
  <view class="page">
    <view class="toolbar">
      <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
        <view class="pill">
          <text class="pill-text">{{ monthKey }}</text>
          <text class="pill-sub">月份</text>
        </view>
      </picker>
    </view>

    <view class="summary">
      <view class="sum-item">
        <text class="label">支出</text>
        <text class="value expense">-{{ formatCents(monthExpense) }}</text>
      </view>
      <view class="sum-item">
        <text class="label">收入</text>
        <text class="value income">+{{ formatCents(monthIncome) }}</text>
      </view>
      <view class="sum-item">
        <text class="label">结余</text>
        <text class="value">{{ formatCents(monthIncome - monthExpense) }}</text>
      </view>
    </view>

    <view class="card">
      <view class="card-head">
        <text class="title">支出结构</text>
        <text class="sub">按分类汇总</text>
      </view>
      <view v-if="expenseTotalCents <= 0" class="empty">
        <text class="empty-text">本月还没有支出</text>
      </view>
      <view v-else class="chart-row">
        <view class="chart">
          <DonutChart canvas-id="donut-expense" :segments="donutSegments" />
          <view class="center">
            <text class="center-label">支出</text>
            <text class="center-val">¥{{ formatCents(expenseTotalCents) }}</text>
          </view>
        </view>
        <view class="legend">
          <view v-for="x in expenseTop" :key="x.id" class="legend-row">
            <view class="dot" :style="{ backgroundColor: x.color }" />
            <text class="legend-name">{{ x.icon }} {{ x.name }}</text>
            <text class="legend-val">{{ percentText(x.cents) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="card-head">
        <text class="title">每日支出</text>
        <text class="sub">横向条表示相对大小</text>
      </view>
      <view v-if="dailyExpenseMax <= 0" class="empty">
        <text class="empty-text">暂无数据</text>
      </view>
      <view v-else class="trend">
        <view v-for="d in daily" :key="d.date" class="trend-row">
          <text class="trend-date">{{ d.date.slice(5) }}</text>
          <view class="bar-wrap">
            <view class="bar" :style="{ width: barWidth(d.expense) }" />
          </view>
          <text class="trend-val">-{{ formatCents(d.expense) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import DonutChart from "@/components/DonutChart.vue"
import { useLedgerStore } from "@/store/useLedgerStore"
import { toMonthKey } from "@/utils/date"
import { formatCents } from "@/utils/money"

const store = useLedgerStore()
const monthKey = ref(toMonthKey(new Date()))

const categoryMap = computed(() => {
  const m = new Map<string, { name: string; icon?: string; color?: string }>()
  for (const c of store.state.data.categories) m.set(c.id, { name: c.name, icon: c.icon, color: c.color })
  return m
})

const monthTxns = computed(() => store.listTxnsByMonth(monthKey.value))

const monthExpense = computed(() => monthTxns.value.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0))
const monthIncome = computed(() => monthTxns.value.filter((t) => t.type === "income").reduce((s, t) => s + t.amountCents, 0))

const expenseTotalCents = computed(() => monthExpense.value)

const expenseTop = computed(() => {
  const map = new Map<string, number>()
  for (const t of monthTxns.value) {
    if (t.type !== "expense") continue
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amountCents)
  }
  const arr = Array.from(map.entries())
    .map(([id, cents]) => {
      const meta = categoryMap.value.get(id)
      return { id, cents, name: meta?.name || "未分类", icon: meta?.icon || "🧾", color: meta?.color || "#94A3B8" }
    })
    .sort((a, b) => b.cents - a.cents)

  const top = arr.slice(0, 5)
  const rest = arr.slice(5).reduce((s, x) => s + x.cents, 0)
  if (rest > 0) top.push({ id: "rest", cents: rest, name: "其他", icon: "🧾", color: "#CBD5E1" })
  return top
})

const donutSegments = computed(() => expenseTop.value.map((x) => ({ value: x.cents, color: x.color })))

function percentText(cents: number) {
  const total = expenseTotalCents.value
  if (total <= 0) return "0%"
  return `${Math.round((cents / total) * 100)}%`
}

const daily = computed(() => {
  const map = new Map<string, number>()
  for (const t of monthTxns.value) {
    if (t.type !== "expense") continue
    const d = new Date(t.occurredAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    map.set(key, (map.get(key) ?? 0) + t.amountCents)
  }
  const keys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1))
  return keys.map((k) => ({ date: k, expense: map.get(k) ?? 0 }))
})

const dailyExpenseMax = computed(() => daily.value.reduce((m, x) => Math.max(m, x.expense), 0))

function barWidth(cents: number) {
  const max = dailyExpenseMax.value
  if (max <= 0) return "0%"
  const p = Math.max(0.08, cents / max)
  return `${Math.round(p * 100)}%`
}

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f7fb;
  padding: 18rpx 24rpx 24rpx;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
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

.summary {
  display: flex;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.sum-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20rpx;
  padding: 16rpx;
  box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.label {
  font-size: 22rpx;
  color: #64748b;
}

.value {
  font-size: 30rpx;
  font-weight: 900;
  color: #0f172a;
}

.expense {
  color: #ef4444;
}

.income {
  color: #22c55e;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  padding: 28rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.08);
  margin-bottom: 14rpx;
}

.card-head {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  margin-bottom: 14rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: #0f172a;
}

.sub {
  font-size: 24rpx;
  color: #64748b;
}

.empty {
  padding: 10rpx 0;
}

.empty-text {
  font-size: 24rpx;
  color: #64748b;
}

.chart-row {
  display: flex;
  gap: 18rpx;
  align-items: center;
}

.chart {
  width: 240px;
  height: 240px;
  position: relative;
}

.center {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  pointer-events: none;
}

.center-label {
  font-size: 22rpx;
  color: #64748b;
}

.center-val {
  font-size: 26rpx;
  font-weight: 900;
  color: #0f172a;
}

.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 999rpx;
}

.legend-name {
  flex: 1;
  font-size: 24rpx;
  color: #0f172a;
  font-weight: 700;
}

.legend-val {
  font-size: 22rpx;
  color: #64748b;
}

.trend {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.trend-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.trend-date {
  width: 84rpx;
  font-size: 22rpx;
  color: #64748b;
}

.bar-wrap {
  flex: 1;
  height: 20rpx;
  background: rgba(148, 163, 184, 0.18);
  border-radius: 999rpx;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.9));
  border-radius: 999rpx;
}

.trend-val {
  width: 160rpx;
  text-align: right;
  font-size: 22rpx;
  color: #ef4444;
  font-weight: 800;
}
</style>
