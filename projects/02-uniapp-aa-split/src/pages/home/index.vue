<template>
  <view class="page">
    <view class="header">
      <view class="month-row">
        <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
          <view class="month-pill">
            <text class="month-text">{{ monthKey }}</text>
            <text class="month-sub">本月</text>
          </view>
        </picker>
        <view class="header-actions">
          <button class="ghost-btn" size="mini" @click="goMembers">成员</button>
        </view>
      </view>

      <view class="summary-card">
        <view class="summary-top">
          <view class="summary-item">
            <text class="label">账单数</text>
            <text class="value">{{ monthBills.length }}</text>
          </view>
          <view class="summary-item">
            <text class="label">合计支出</text>
            <text class="value">¥{{ formatCents(monthTotal) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title-row">
        <text class="section-title">最近账单</text>
        <button class="link-btn" size="mini" @click="goBills">查看全部</button>
      </view>
      <view v-if="recentBills.length === 0" class="empty">
        <text class="empty-text">还没有账单，先新增一笔吧</text>
        <button class="primary-btn" @click="goAdd">新增账单</button>
      </view>
      <view v-else class="list">
        <view v-for="b in recentBills" :key="b.id" class="txn" @click="goDetail(b.id)">
          <view class="txn-left">
            <view class="icon" :style="{ backgroundColor: categoryMap.get(b.categoryId)?.color || '#E5E7EB' }">
              <uni-icons :type="categoryMap.get(b.categoryId)?.icon || 'more-filled'" size="24" color="#FFFFFF" />
            </view>
            <view class="meta">
              <text class="name">{{ categoryMap.get(b.categoryId)?.name || "未分类" }}</text>
              <text class="sub">{{ subText(b) }}</text>
            </view>
          </view>
          <view class="txn-right">
            <text class="amt">¥{{ formatCents(b.amountCents) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="floating">
      <button class="fab ghost" @click="goSettle">去结算</button>
      <button class="fab primary" @click="goAdd">新增账单</button>
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
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.month-text {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text);
}

.month-sub {
  font-size: 22rpx;
  color: var(--muted);
}

.header-actions {
  display: flex;
  align-items: center;
}

.ghost-btn {
  background: var(--card);
  color: var(--text);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.summary-card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 18rpx 18rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.summary-top {
  display: flex;
  gap: 16rpx;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.label {
  font-size: 22rpx;
  color: var(--muted);
}

.value {
  font-size: 34rpx;
  font-weight: 900;
  color: var(--text);
}

.section {
  padding: 12rpx 24rpx 170rpx;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8rpx 0 12rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.link-btn {
  background: transparent;
  color: #2563eb;
}

.empty {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.empty-text {
  color: var(--muted);
  font-size: 26rpx;
}

.primary-btn {
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}

.list {
  background: var(--card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
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

.meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.name {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--text);
}

.sub {
  font-size: 22rpx;
  color: var(--muted);
}

.amt {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
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
  width: 320rpx;
  height: 84rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.fab + .fab {
  margin-left: 16rpx;
}

.primary {
  background: var(--primary);
  color: #ffffff;
}

.ghost {
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
</style>
