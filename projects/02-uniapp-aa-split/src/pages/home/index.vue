<template>
  <view class="page">
    <view class="top">
      <view class="top-row">
        <view class="title-wrap">
          <text class="title">本月概览</text>
          <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
            <view class="chip">
              <uni-icons type="calendar" size="14" color="var(--muted)" />
              <text class="chip-text">{{ monthKey }}</text>
              <uni-icons type="down" size="12" color="var(--muted)" />
            </view>
          </picker>
        </view>
        <view class="icon-btn" @click="goMembers">
          <uni-icons type="person-filled" size="18" color="var(--text)" />
        </view>
      </view>

      <view class="kpi-grid">
        <view class="kpi">
          <text class="k">总金额</text>
          <text class="v">¥{{ formatCents(monthTotal) }}</text>
        </view>
        <view class="kpi">
          <text class="k">账单数</text>
          <text class="v">{{ monthBills.length }}</text>
        </view>
        <view class="kpi">
          <text class="k">启用成员</text>
          <text class="v">{{ enabledCount }}</text>
        </view>
        <view class="kpi">
          <text class="k">人均</text>
          <text class="v">¥{{ formatCents(perCapita) }}</text>
        </view>
      </view>

      <view class="actions">
        <button class="btn-primary" @click="goAdd">
          <view class="btn-inner">
            <uni-icons type="plus" size="18" color="#ffffff" />
            <text>新增账单</text>
          </view>
        </button>
        <button class="btn-ghost" @click="goSettle">
          <view class="btn-inner">
            <uni-icons type="bars" size="18" color="var(--primary)" />
            <text>生成结算</text>
          </view>
        </button>
      </view>
    </view>

    <view class="section">
      <view class="section-head">
        <text class="section-title">最近账单</text>
        <view class="section-link" @click="goBills">
          <text class="section-link-text">查看全部</text>
          <uni-icons type="forward" size="14" color="var(--muted)" />
        </view>
      </view>

      <view v-if="recentBills.length === 0" class="empty">
        <text class="empty-title">还没有记录</text>
        <text class="empty-sub">先新增一笔账单，再去生成结算</text>
        <button class="btn-primary wide" @click="goAdd">新增账单</button>
      </view>

      <view v-else class="list">
        <view v-for="b in recentBills" :key="b.id" class="cell" @click="goDetail(b.id)">
          <view class="dot" :style="{ backgroundColor: categoryMap.get(b.categoryId)?.color || '#D1D5DB' }" />
          <view class="cell-main">
            <view class="cell-top">
              <text class="cell-title">{{ categoryMap.get(b.categoryId)?.name || "未分类" }}</text>
              <text class="cell-amount">¥{{ formatCents(b.amountCents) }}</text>
            </view>
            <text class="cell-sub">{{ subText(b) }}</text>
          </view>
        </view>
      </view>
    </view>
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

const monthBills = computed(() => store.listBillsByMonth(monthKey.value))
const monthTotal = computed(() => monthBills.value.reduce((s, b) => s + b.amountCents, 0))
const recentBills = computed(() => store.recentBills.value)
const enabledCount = computed(() => store.membersEnabled.value.length || 1)
const perCapita = computed(() => Math.floor(monthTotal.value / enabledCount.value))

function subText(b: AABill) {
  const payer = memberNameMap.value.get(b.payerId) || "付款人"
  return `${parseISOToDateKey(b.occurredAt)} · ${payer} · ${b.participantIds.length}人`
}

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}

function goBills() {
  uni.switchTab({ url: "/pages/bills/index" })
}

function goSettle() {
  uni.switchTab({ url: "/pages/settle/index" })
}

function goAdd() {
  uni.navigateTo({ url: "/pages/bill-edit/index" })
}

function goMembers() {
  uni.navigateTo({ url: "/pages/members/index" })
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/bill-detail/index?id=${encodeURIComponent(id)}` })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
}

.top {
  padding: 24rpx 24rpx 8rpx;
}

.top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14rpx;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 900;
  color: var(--text);
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
  font-weight: 800;
}

.icon-btn {
  width: 76rpx;
  height: 76rpx;
  border-radius: 999rpx;
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-grid {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}

.kpi {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18rpx 18rpx;
  box-shadow: var(--shadow);
}

.k {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.v {
  margin-top: 10rpx;
  font-size: 34rpx;
  font-weight: 900;
  color: var(--text);
}

.actions {
  margin-top: 16rpx;
  display: flex;
  gap: 12rpx;
}

.btn-primary {
  flex: 1;
  height: 86rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}

.btn-ghost {
  flex: 1;
  height: 86rpx;
  border-radius: 999rpx;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  font-weight: 900;
}

.btn-inner {
  height: 86rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.wide {
  width: 100%;
}

.section {
  padding: 8rpx 24rpx 24rpx;
}

.section-head {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.section-link {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.section-link-text {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
}

.empty {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28rpx;
}

.empty-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.empty-sub {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--muted);
  margin-bottom: 16rpx;
}

.list {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
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

.cell-amount {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.cell-sub {
  font-size: 22rpx;
  color: var(--muted);
}
</style>
