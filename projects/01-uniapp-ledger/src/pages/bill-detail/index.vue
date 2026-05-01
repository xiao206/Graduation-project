<template>
  <view class="page">
    <view v-if="!txn" class="empty">
      <text class="empty-title">账单不存在</text>
      <button class="primary" @click="back">返回</button>
    </view>

    <view v-else class="wrap">
      <view class="hero">
        <view class="top">
          <view class="icon" :style="{ backgroundColor: category?.color || '#E5E7EB' }">
            <uni-icons :type="category?.icon || 'more-filled'" size="28" color="#FFFFFF" />
          </view>
          <view class="meta">
            <text class="name">{{ category?.name || "未分类" }}</text>
            <text class="sub">{{ occurredAtText }} · {{ account?.name || "账户" }}</text>
          </view>
        </view>
        <view class="amount-box">
          <text class="amount" :class="txn.type === 'expense' ? 'expense' : 'income'">
            {{ txn.type === "expense" ? "-" : "+" }}{{ formatCents(txn.amountCents) }}
          </text>
          <text class="amount-sub">{{ typeText }}</text>
        </view>
      </view>

      <view class="detail">
        <view class="row">
          <text class="k">分类</text>
          <text class="v">{{ category?.name || "未分类" }}</text>
        </view>
        <view class="row">
          <text class="k">账户</text>
          <text class="v">{{ account?.name || "账户" }}</text>
        </view>
        <view class="row">
          <text class="k">日期</text>
          <text class="v">{{ occurredAtText }}</text>
        </view>
        <view class="row">
          <text class="k">备注</text>
          <text class="v" :class="txn.note ? '' : 'v-muted'">{{ txn.note || "无" }}</text>
        </view>
        <view class="row">
          <text class="k">创建</text>
          <text class="v">{{ createdAtText }}</text>
        </view>
        <view class="row">
          <text class="k">更新</text>
          <text class="v">{{ updatedAtText }}</text>
        </view>
        <view class="row row-last" @click="copyId">
          <text class="k">ID</text>
          <text class="v v-mono">{{ txn.id }}</text>
        </view>
      </view>

      <view class="bottom">
        <button class="btn ghost" @click="edit">编辑</button>
        <button class="btn danger" @click="remove">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useLedgerStore } from "@/store/useLedgerStore"
import { formatCents } from "@/utils/money"

const store = useLedgerStore()
const id = ref("")
const PENDING_EDIT_KEY = "gp:pendingEditTxnId"

const txn = computed(() => (id.value ? store.getTxnById(id.value) : undefined))

function parseIdFromLocation() {
  try {
    if (typeof location === "undefined") return ""
    const u = new URL(location.href)
    const fromSearch = u.searchParams.get("id") || ""
    if (fromSearch) return fromSearch
    const h = u.hash || ""
    const qi = h.indexOf("?")
    if (qi < 0) return ""
    const qs = h.slice(qi + 1)
    return new URLSearchParams(qs).get("id") || ""
  } catch {
    return ""
  }
}

function normalizeId(raw: unknown) {
  const s = String(raw || "")
  if (!s) return ""
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

const category = computed(() => {
  const t = txn.value
  if (!t) return undefined
  return store.state.data.categories.find((c) => c.id === t.categoryId)
})

const account = computed(() => {
  const t = txn.value
  if (!t) return undefined
  return store.state.data.accounts.find((a) => a.id === t.accountId)
})

function formatDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${y}-${m}-${day} ${hh}:${mm}`
}

const occurredAtText = computed(() => {
  const t = txn.value
  if (!t) return ""
  return formatDateTime(t.occurredAt)
})

const createdAtText = computed(() => {
  const t = txn.value
  if (!t) return ""
  return formatDateTime(t.createdAt)
})

const updatedAtText = computed(() => {
  const t = txn.value
  if (!t) return ""
  return formatDateTime(t.updatedAt)
})

const typeText = computed(() => (txn.value?.type === "income" ? "收入" : "支出"))

function back() {
  uni.navigateBack()
}

function edit() {
  if (!id.value) return
  uni.setStorageSync(PENDING_EDIT_KEY, id.value)
  uni.switchTab({ url: "/pages/add/index" })
}

function remove() {
  if (!id.value) return
  uni.showModal({
    title: "确认删除",
    content: "删除后无法恢复，是否继续？",
    success(res) {
      if (!res.confirm) return
      const ok = store.deleteTransaction(id.value)
      if (!ok) return uni.showToast({ title: "删除失败", icon: "none" })
      uni.showToast({ title: "已删除", icon: "success" })
      setTimeout(() => uni.navigateBack(), 300)
    },
  })
}

function copyId() {
  if (!txn.value) return
  uni.setClipboardData({ data: txn.value.id })
}

onLoad((q: any) => {
  id.value = normalizeId(q?.id || parseIdFromLocation())
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 24rpx;
}

.wrap {
  padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}

.hero {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 20rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.top {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.icon {
  width: 92rpx;
  height: 92rpx;
  border-radius: 26rpx;
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
  gap: 8rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--text);
}

.sub {
  font-size: 24rpx;
  color: var(--muted);
}

.amount-box {
  margin-top: 18rpx;
  padding: 18rpx 18rpx;
  background: var(--primary-ghost);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12rpx;
}

.amount {
  font-size: 54rpx;
  font-weight: 900;
}

.amount-sub {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.expense {
  color: #ef4444;
}

.income {
  color: #22c55e;
}

.detail {
  margin-top: 14rpx;
  background: var(--card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.row {
  padding: 18rpx 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
  border-bottom: 1px solid var(--border);
}

.row-last {
  border-bottom: none;
}

.k {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
}

.v {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 800;
  max-width: 440rpx;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-muted {
  color: var(--muted);
  font-weight: 700;
}

.v-mono {
  font-size: 22rpx;
  letter-spacing: 0.2px;
}

.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12rpx 24rpx calc(12rpx + env(safe-area-inset-bottom));
  background: rgba(247, 248, 250, 0.92);
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12rpx;
}

.btn {
  flex: 1;
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.ghost {
  background: var(--card);
  border-radius: var(--radius);
  color: var(--text);
  border: 1px solid var(--border);
}

.danger {
  background: rgba(239, 68, 68, 0.12);
  border-radius: var(--radius);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.empty {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: flex-start;
  border: 1px solid var(--border);
}

.empty-title {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--text);
}

.primary {
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}
</style>
