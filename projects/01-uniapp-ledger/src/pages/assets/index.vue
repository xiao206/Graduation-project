<template>
  <view class="page">
    <view class="card">
      <view class="head">
        <text class="title">月预算</text>
        <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
          <view class="pill">
            <text class="pill-text">{{ monthKey }}</text>
          </view>
        </picker>
      </view>

      <view class="budget-row">
        <view class="budget-left">
          <text class="label">预算</text>
          <view class="budget-input-row">
            <text class="currency">¥</text>
            <input v-model="budgetInput" class="budget-input" type="digit" placeholder="未设置" placeholder-class="ph" />
          </view>
        </view>
        <button class="primary" size="mini" @click="saveBudget">保存</button>
      </view>

      <view class="progress">
        <view class="progress-bar">
          <view class="progress-inner" :style="{ width: progressWidth }" />
        </view>
        <view class="progress-meta">
          <text class="meta-text">已用 -{{ formatCents(monthExpense) }}</text>
          <text class="meta-text">剩余 {{ budgetRemainText }}</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="head">
        <text class="title">账户</text>
        <button class="ghost" size="mini" @click="goAccounts">管理</button>
      </view>

      <view class="accounts">
        <view v-for="a in accounts" :key="a.id" class="acc">
          <view class="acc-left">
            <text class="acc-name">{{ a.name }}</text>
            <text class="acc-sub">{{ a.type }}</text>
          </view>
          <text class="acc-val">¥{{ formatCents(a.balanceCents) }}</text>
        </view>
      </view>

      <view class="total">
        <text class="label">总资产</text>
        <text class="total-val">¥{{ formatCents(totalBalance) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { useLedgerStore } from "@/store/useLedgerStore"
import { toMonthKey } from "@/utils/date"
import { formatCents, normalizeMoneyInput, parseMoneyToCents } from "@/utils/money"

const store = useLedgerStore()
const monthKey = ref(toMonthKey(new Date()))

const monthTxns = computed(() => store.listTxnsByMonth(monthKey.value))
const monthExpense = computed(() => monthTxns.value.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0))

const accounts = computed(() => store.accountsEnabled.value)
const totalBalance = computed(() => accounts.value.reduce((s, a) => s + a.balanceCents, 0))

const budgetInput = ref("")

watchEffect(() => {
  const b = store.getBudget(monthKey.value)
  budgetInput.value = b?.totalCents ? normalizeMoneyInput(String(b.totalCents / 100)) : ""
})

const budgetRemainText = computed(() => {
  const b = store.getBudget(monthKey.value)
  if (!b || typeof b.totalCents !== "number") return "未设置"
  return formatCents(b.totalCents - monthExpense.value)
})

const progressWidth = computed(() => {
  const b = store.getBudget(monthKey.value)
  if (!b || typeof b.totalCents !== "number" || b.totalCents <= 0) return "0%"
  const p = Math.min(1, monthExpense.value / b.totalCents)
  return `${Math.round(p * 100)}%`
})

function saveBudget() {
  if (!budgetInput.value.trim()) {
    store.setMonthlyBudget(monthKey.value, undefined)
    uni.showToast({ title: "已清除", icon: "success" })
    return
  }
  const cents = parseMoneyToCents(budgetInput.value)
  store.setMonthlyBudget(monthKey.value, cents)
  uni.showToast({ title: "已保存", icon: "success" })
}

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}

function goAccounts() {
  uni.navigateTo({ url: "/pages/accounts/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f7fb;
  padding: 18rpx 24rpx 24rpx;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  padding: 28rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.08);
  margin-bottom: 14rpx;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: #0f172a;
}

.pill {
  padding: 10rpx 14rpx;
  border-radius: 16rpx;
  background: rgba(15, 23, 42, 0.04);
}

.pill-text {
  font-size: 22rpx;
  color: #0f172a;
  font-weight: 800;
}

.budget-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12rpx;
}

.budget-left {
  flex: 1;
}

.label {
  font-size: 22rpx;
  color: #64748b;
}

.budget-input-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-top: 8rpx;
  padding: 12rpx 14rpx;
  border-radius: 18rpx;
  background: rgba(15, 23, 42, 0.03);
}

.currency {
  font-size: 26rpx;
  font-weight: 900;
  color: #0f172a;
}

.budget-input {
  flex: 1;
  height: 48rpx;
  font-size: 32rpx;
  font-weight: 900;
  color: #0f172a;
}

.ph {
  color: #94a3b8;
}

.primary {
  background: #111827;
  color: #ffffff;
  border-radius: 16rpx;
}

.progress {
  margin-top: 14rpx;
}

.progress-bar {
  height: 20rpx;
  background: rgba(148, 163, 184, 0.18);
  border-radius: 999rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(90deg, rgba(17, 24, 39, 0.25), rgba(17, 24, 39, 0.9));
  border-radius: 999rpx;
}

.progress-meta {
  margin-top: 10rpx;
  display: flex;
  justify-content: space-between;
}

.meta-text {
  font-size: 22rpx;
  color: #64748b;
}

.ghost {
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  border-radius: 16rpx;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.accounts {
  display: flex;
  flex-direction: column;
}

.acc {
  padding: 16rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.acc:last-child {
  border-bottom: none;
}

.acc-left {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.acc-name {
  font-size: 28rpx;
  font-weight: 800;
  color: #0f172a;
}

.acc-sub {
  font-size: 22rpx;
  color: #64748b;
}

.acc-val {
  font-size: 28rpx;
  font-weight: 900;
  color: #0f172a;
}

.total {
  margin-top: 14rpx;
  padding-top: 14rpx;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.total-val {
  font-size: 34rpx;
  font-weight: 900;
  color: #0f172a;
}
</style>
