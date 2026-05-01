<template>
  <view class="page">
    <view class="toolbar">
      <view class="toggle">
        <view class="seg" :class="status === 'all' ? 'seg-active' : ''" @click="status = 'all'">
          <text class="seg-text">全部</text>
        </view>
        <view class="seg" :class="status === 'open' ? 'seg-active' : ''" @click="status = 'open'">
          <text class="seg-text">进行中</text>
        </view>
        <view class="seg" :class="status === 'done' ? 'seg-active' : ''" @click="status = 'done'">
          <text class="seg-text">已完成</text>
        </view>
      </view>
      <view class="search-wrap">
        <uni-icons type="search" size="16" color="var(--muted)" />
        <input v-model="keyword" class="search" placeholder="搜索我的发布" placeholder-class="ph" />
      </view>
    </view>

    <view v-if="!isLoggedIn" class="card">
      <text class="title">未登录</text>
      <text class="sub">登录后才能查看和管理你的发布</text>
      <view class="actions">
        <button class="wx-btn-primary" @click="goLogin">去登录</button>
        <button class="wx-btn-ghost" @click="goRegister">去注册</button>
      </view>
    </view>

    <view v-else-if="filtered.length === 0" class="card">
      <text class="title">还没有发布</text>
      <text class="sub">发布一条寻物或招领信息，方便同学联系你</text>
      <button class="wx-btn-primary" @click="goPublish">
        <view class="btn-inner">
          <uni-icons type="plus" size="18" color="#ffffff" />
          <text>去发布</text>
        </view>
      </button>
    </view>

    <scroll-view v-else scroll-y class="scroll">
      <view v-for="x in filtered" :key="x.id" class="cell" @click="goDetail(x.id)">
        <view class="badge" :class="x.type === 'lost' ? 'badge-lost' : 'badge-found'">
          <text class="badge-text">{{ x.type === "lost" ? "寻物" : "招领" }}</text>
        </view>
        <view class="cell-main">
          <view class="cell-top">
            <text class="cell-title">{{ x.title }}</text>
            <view class="status" :class="x.status !== 'open' ? 'status-done' : ''">{{ statusText(x.status) }}</view>
          </view>
          <text class="cell-sub">{{ subText(x) }}</text>
        </view>
      </view>
      <view class="tail">
        <text class="tail-title">共 {{ filtered.length }} 条</text>
        <text class="tail-sub">需要更新状态？点进详情页操作</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { LFItem, LFItemStatus } from "@/domain/types"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const keyword = ref("")
const status = ref<"all" | "open" | "done">("all")

const isLoggedIn = computed(() => store.isLoggedIn.value)

const mine = computed(() => {
  const u = store.currentUser.value
  if (!u) return []
  return store.state.data.items.filter((x) => x.ownerUserId === u.id)
})

const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  const base = q
    ? mine.value.filter((x) => `${x.title} ${x.description || ""} ${x.location || ""}`.toLowerCase().includes(q))
    : mine.value
  if (status.value === "open") return base.filter((x) => x.status === "open")
  if (status.value === "done") return base.filter((x) => x.status !== "open")
  return base
})

function statusText(s: LFItemStatus) {
  if (s === "claimed") return "已认领"
  if (s === "closed") return "已结束"
  return "进行中"
}

function subText(x: LFItem) {
  const date = x.occurredAt.slice(0, 10)
  const loc = x.location?.trim()
  return loc ? `${date} · ${loc}` : date
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/item-detail/index?id=${encodeURIComponent(id)}` })
}

function goPublish() {
  uni.switchTab({ url: "/pages/publish/index" })
}

function goLogin() {
  uni.navigateTo({ url: "/pages/login/index" })
}

function goRegister() {
  uni.navigateTo({ url: "/pages/register/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  padding: 18rpx 24rpx calc(24rpx + var(--safe-bottom));
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.toggle {
  background: var(--chip);
  border: 1px solid var(--border-soft);
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
  box-shadow: var(--shadow-sm);
}

.seg-text {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
}

.search-wrap {
  height: var(--input-h);
  padding: 0 16rpx;
  background: var(--card);
  border-radius: 999rpx;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.search {
  flex: 1;
  height: var(--input-h);
  padding: 0;
  background: transparent;
  font-size: 26rpx;
  color: var(--text);
}

.ph {
  color: rgba(100, 116, 139, 0.78);
}

.card {
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-sm);
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

.actions {
  margin-top: 16rpx;
  display: flex;
  gap: 12rpx;
}

.btn-inner {
  height: var(--btn-h);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 30rpx;
}

.scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(12rpx + var(--safe-bottom));
}

.cell {
  margin-top: 12rpx;
  background: var(--card);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-lg);
  padding: 18rpx 18rpx;
  display: flex;
  gap: 14rpx;
}

.badge {
  width: 84rpx;
  height: 44rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6rpx;
}

.badge-lost {
  background: rgba(239, 68, 68, 0.14);
}

.badge-found {
  background: rgba(22, 163, 74, 0.14);
}

.badge-text {
  font-size: 22rpx;
  font-weight: 900;
  color: var(--text);
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

.status {
  font-size: 22rpx;
  color: var(--primary);
  font-weight: 900;
}

.status-done {
  color: var(--muted);
}

.cell-sub {
  font-size: 22rpx;
  color: var(--muted);
}

.tail {
  margin-top: 12rpx;
  background: rgba(15, 23, 42, 0.03);
  border: 1px dashed rgba(15, 23, 42, 0.18);
  border-radius: var(--radius-lg);
  padding: 22rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
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
</style>
