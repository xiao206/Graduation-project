<template>
  <view class="page">
    <view class="hero">
      <text class="title">结算结果</text>
      <text class="sub">{{ rangeText }}</text>

      <view v-if="results.length > 0" class="summary">
        <view class="s-item">
          <text class="s-k">应收合计</text>
          <text class="s-v pos">¥{{ formatCents(sumReceive) }}</text>
        </view>
        <view class="s-item">
          <text class="s-k">应付合计</text>
          <text class="s-v neg">¥{{ formatCents(sumPay) }}</text>
        </view>
      </view>
    </view>

    <view v-if="results.length === 0" class="card">
      <text class="title">暂无数据</text>
      <text class="sub">所选范围内没有可结算的账单</text>
    </view>

    <view v-else class="section">
      <view v-if="receives.length" class="group">
        <view class="group-head">
          <text class="group-title">应收</text>
          <view class="group-chip">{{ receives.length }}人</view>
        </view>
        <view class="list">
          <view v-for="r in receives" :key="r.memberId" class="row">
            <view class="avatar pos-bg">
              <text class="avatar-t">{{ r.name.slice(0, 1) }}</text>
            </view>
            <view class="main">
              <text class="name">{{ r.name }}</text>
              <text class="meta">已付 ¥{{ formatCents(r.paidCents) }} · 应摊 ¥{{ formatCents(r.shareCents) }}</text>
            </view>
            <text class="amount pos">¥{{ formatCents(r.receiveCents) }}</text>
          </view>
        </view>
      </view>

      <view v-if="pays.length" class="group">
        <view class="group-head">
          <text class="group-title">应付</text>
          <view class="group-chip">{{ pays.length }}人</view>
        </view>
        <view class="list">
          <view v-for="r in pays" :key="r.memberId" class="row">
            <view class="avatar neg-bg">
              <text class="avatar-t">{{ r.name.slice(0, 1) }}</text>
            </view>
            <view class="main">
              <text class="name">{{ r.name }}</text>
              <text class="meta">已付 ¥{{ formatCents(r.paidCents) }} · 应摊 ¥{{ formatCents(r.shareCents) }}</text>
            </view>
            <text class="amount neg">¥{{ formatCents(r.payCents) }}</text>
          </view>
        </view>
      </view>

      <view v-if="zeros.length" class="group">
        <view class="group-head">
          <text class="group-title">已平</text>
          <view class="group-chip">{{ zeros.length }}人</view>
        </view>
        <view class="list">
          <view v-for="r in zeros" :key="r.memberId" class="row">
            <view class="avatar">
              <text class="avatar-t">{{ r.name.slice(0, 1) }}</text>
            </view>
            <view class="main">
              <text class="name">{{ r.name }}</text>
              <text class="meta">已付 ¥{{ formatCents(r.paidCents) }} · 应摊 ¥{{ formatCents(r.shareCents) }}</text>
            </view>
            <text class="amount muted">¥0.00</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useAASplitStore } from "@/store/useAASplitStore"
import { formatCents } from "@/utils/money"

const store = useAASplitStore()

const startISO = ref("")
const endISO = ref("")

const results = computed(() => {
  if (!startISO.value || !endISO.value) return []
  return store.settle({ startISO: startISO.value, endISO: endISO.value })
})

const receives = computed(() => results.value.filter((x) => x.receiveCents > 0))
const pays = computed(() => results.value.filter((x) => x.payCents > 0))
const zeros = computed(() => results.value.filter((x) => x.receiveCents === 0 && x.payCents === 0))

const sumReceive = computed(() => receives.value.reduce((s, x) => s + x.receiveCents, 0))
const sumPay = computed(() => pays.value.reduce((s, x) => s + x.payCents, 0))

const rangeText = computed(() => {
  const s = startISO.value.slice(0, 10)
  const e = endISO.value.slice(0, 10)
  if (!s || !e) return ""
  return `${s} ~ ${e}`
})

onLoad((q: any) => {
  startISO.value = String(q?.start || "")
  endISO.value = String(q?.end || "")
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx 24rpx;
}

.hero {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 14rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
}

.sub {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--muted);
}

.summary {
  margin-top: 14rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}

.s-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18rpx;
  padding: 14rpx 16rpx;
}

.s-k {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.s-v {
  margin-top: 10rpx;
  font-size: 30rpx;
  font-weight: 900;
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 14rpx;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.group {
  background: var(--card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}

.group-head {
  padding: 16rpx 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.group-title {
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
  display: flex;
  flex-direction: column;
}

.row {
  padding: 18rpx 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  border-bottom: none;
}

.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 999rpx;
  background: var(--chip);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
}

.pos-bg {
  background: rgba(22, 163, 74, 0.12);
  border-color: rgba(22, 163, 74, 0.2);
}

.neg-bg {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.2);
}

.avatar-t {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.name {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.meta {
  font-size: 22rpx;
  color: var(--muted);
}

.amount {
  font-size: 24rpx;
  font-weight: 900;
}

.pos {
  color: var(--success);
}

.neg {
  color: var(--danger);
}

.muted {
  color: var(--muted);
}
</style>
