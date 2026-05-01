<template>
  <view class="page">
    <view class="top">
      <view class="top-row">
        <view class="title-wrap">
          <text class="title">失物招领</text>
          <view class="chip">
            <uni-icons type="location-filled" size="14" color="var(--muted)" />
            <text class="chip-text">{{ campusName }}</text>
          </view>
        </view>
        <view class="icon-btn" @click="goItems">
          <uni-icons type="search" size="18" color="var(--text)" />
        </view>
      </view>

      <view class="toggle">
        <view class="seg" :class="filterType === 'all' ? 'seg-active' : ''" @click="filterType = 'all'">
          <text class="seg-text">全部</text>
        </view>
        <view class="seg" :class="filterType === 'lost' ? 'seg-active' : ''" @click="filterType = 'lost'">
          <text class="seg-text">寻物</text>
        </view>
        <view class="seg" :class="filterType === 'found' ? 'seg-active' : ''" @click="filterType = 'found'">
          <text class="seg-text">招领</text>
        </view>
      </view>

      <view class="kpi">
        <view class="kpi-item">
          <text class="k">本周发布</text>
          <text class="v">{{ weekCount }}</text>
        </view>
        <view class="kpi-item">
          <text class="k">进行中</text>
          <text class="v">{{ openCount }}</text>
        </view>
        <view class="kpi-item">
          <text class="k">我的</text>
          <text class="v">{{ myCount }}</text>
        </view>
      </view>

      <button class="btn-primary" @click="goPublish">
        <view class="btn-inner">
          <uni-icons type="plus" size="18" color="#ffffff" />
          <text>发布信息</text>
        </view>
      </button>
    </view>

    <view class="section">
      <view class="section-head">
        <text class="section-title">最新动态</text>
        <view class="section-link" @click="goItems">
          <text class="section-link-text">查看全部</text>
          <uni-icons type="forward" size="14" color="var(--muted)" />
        </view>
      </view>

      <view v-if="filtered.length === 0" class="empty">
        <text class="empty-title">还没有信息</text>
        <text class="empty-sub">先发布一条寻物或招领，大家才能看到</text>
        <button class="btn-primary wide" @click="goPublish">发布信息</button>
      </view>

      <view v-else class="list">
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
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { LFItem, LFItemStatus, LFItemType } from "@/domain/types"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const filterType = ref<"all" | LFItemType>("all")

const campusName = computed(() => store.state.data.settings.campusName)

const all = computed(() => store.recentItems.value)

const filtered = computed(() => {
  const base = filterType.value === "all" ? all.value : all.value.filter((x) => x.type === filterType.value)
  return base.slice(0, 8)
})

const openCount = computed(() => store.state.data.items.filter((x) => x.status === "open").length)

const myCount = computed(() => {
  const u = store.currentUser.value
  if (!u) return 0
  return store.state.data.items.filter((x) => x.ownerUserId === u.id).length
})

const weekCount = computed(() => {
  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  return store.state.data.items.filter((x) => now - new Date(x.createdAt).getTime() <= weekMs).length
})

function statusText(status: LFItemStatus) {
  if (status === "claimed") return "已认领"
  if (status === "closed") return "已结束"
  return "进行中"
}

function subText(x: LFItem) {
  const date = x.occurredAt.slice(0, 10)
  const loc = x.location?.trim()
  return loc ? `${date} · ${loc}` : date
}

function goItems() {
  uni.switchTab({ url: "/pages/items/index" })
}

function goPublish() {
  uni.switchTab({ url: "/pages/publish/index" })
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/item-detail/index?id=${encodeURIComponent(id)}` })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: calc(24rpx + var(--tabbar) + var(--safe-bottom));
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
  gap: 12rpx;
}

.title {
  font-size: 44rpx;
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
  font-weight: 900;
}

.icon-btn {
  width: 76rpx;
  height: 76rpx;
  border-radius: 999rpx;
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle {
  margin-top: 16rpx;
  background: var(--chip);
  border: 1px solid rgba(15, 23, 42, 0.06);
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

.kpi {
  margin-top: 16rpx;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12rpx;
}

.kpi-item {
  background: var(--card);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: var(--radius-lg);
  padding: 16rpx;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.k {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.v {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
}

.btn-primary {
  margin-top: 14rpx;
  height: 90rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(47, 107, 255, 0.28);
}

.btn-inner {
  height: 90rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 30rpx;
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
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-sm);
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

.wide {
  width: 100%;
}

.list {
  background: var(--card);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.cell {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  padding: 18rpx 18rpx;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.cell:last-child {
  border-bottom: none;
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
</style>
