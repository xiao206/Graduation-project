<template>
  <view class="page">
    <view class="card">
      <text class="title">结算范围</text>
      <view class="range-toggle">
        <view class="seg" :class="mode === 'month' ? 'seg-active' : ''" @click="mode = 'month'">
          <text class="seg-text">本月</text>
        </view>
        <view class="seg" :class="mode === 'custom' ? 'seg-active' : ''" @click="mode = 'custom'">
          <text class="seg-text">自定义</text>
        </view>
      </view>

      <view v-if="mode === 'month'" class="block">
        <text class="k">月份</text>
        <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
          <view class="picker">
            <text class="picker-text">{{ monthKey }}</text>
            <uni-icons type="forward" size="16" color="#94A3B8" />
          </view>
        </picker>
      </view>

      <view v-else class="block">
        <text class="k">开始</text>
        <picker mode="date" :value="startDate" @change="onPickStart">
          <view class="picker">
            <text class="picker-text">{{ startDate }}</text>
            <uni-icons type="forward" size="16" color="#94A3B8" />
          </view>
        </picker>
        <text class="k">结束</text>
        <picker mode="date" :value="endDate" @change="onPickEnd">
          <view class="picker">
            <text class="picker-text">{{ endDate }}</text>
            <uni-icons type="forward" size="16" color="#94A3B8" />
          </view>
        </picker>
      </view>

      <button class="primary" @click="goDetail">生成结算</button>
    </view>

    <view class="card">
      <text class="title">说明</text>
      <text class="sub">平均分摊：每笔账单按参与人数平均分摊到每人（以分为单位处理余数）。</text>
      <text class="sub">汇总结果：净额=已付-应摊，净额>0为应收，净额<0为应付。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { toMonthKey } from "@/utils/date"

const mode = ref<"month" | "custom">("month")
const monthKey = ref(toMonthKey(new Date()))

const startDate = ref(new Date().toISOString().slice(0, 10))
const endDate = ref(new Date().toISOString().slice(0, 10))

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}

function onPickStart(e: any) {
  startDate.value = String(e?.detail?.value || startDate.value)
}

function onPickEnd(e: any) {
  endDate.value = String(e?.detail?.value || endDate.value)
}

function toStartISOByMonth(m: string) {
  return new Date(`${m}-01T00:00:00`).toISOString()
}

function toEndISOByMonth(m: string) {
  const d = new Date(`${m}-01T00:00:00`)
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
  return end.toISOString()
}

function toStartISOByDate(d: string) {
  return new Date(`${d}T00:00:00`).toISOString()
}

function toEndISOByDate(d: string) {
  return new Date(`${d}T23:59:59.999`).toISOString()
}

function goDetail() {
  const startISO = mode.value === "month" ? toStartISOByMonth(monthKey.value) : toStartISOByDate(startDate.value)
  const endISO = mode.value === "month" ? toEndISOByMonth(monthKey.value) : toEndISOByDate(endDate.value)
  uni.navigateTo({ url: `/pages/settle-detail/index?start=${encodeURIComponent(startISO)}&end=${encodeURIComponent(endISO)}` })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx 24rpx;
}

.card {
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
  line-height: 1.7;
}

.range-toggle {
  margin-top: 14rpx;
  background: var(--chip);
  border-radius: 999rpx;
  display: flex;
  padding: 6rpx;
}

.seg {
  flex: 1;
  height: 72rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seg-active {
  background: var(--card);
}

.seg-text {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.block {
  margin-top: 14rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.k {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
}

.picker {
  height: 76rpx;
  padding: 0 16rpx;
  background: var(--surface);
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  border: 1px solid var(--border);
}

.picker-text {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 800;
}

.primary {
  margin-top: 16rpx;
  height: 90rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}
</style>
