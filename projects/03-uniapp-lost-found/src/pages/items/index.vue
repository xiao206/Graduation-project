<template>
  <view class="page">
    <view class="toolbar">
      <view class="toolbar-top">
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
      </view>
      <view class="search-wrap">
        <uni-icons type="search" size="16" color="var(--muted)" />
        <input v-model="keyword" class="search" placeholder="搜索标题/地点/联系方式" placeholder-class="ph" />
      </view>
    </view>

    <view class="summary">
      <view class="summary-card">
        <text class="summary-k">共</text>
        <text class="summary-v">{{ filtered.length }} 条</text>
      </view>
      <view class="summary-card">
        <text class="summary-k">进行中</text>
        <text class="summary-v">{{ openCount }} 条</text>
      </view>
    </view>

    <view v-if="filtered.length === 0" class="empty">
      <text class="empty-title">没有匹配信息</text>
      <text class="empty-sub">换个关键词试试，或者先发布一条</text>
      <button class="primary" @click="goPublish">去发布</button>
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
        <text class="tail-title">已到底</text>
        <text class="tail-sub">继续发布/更新，让信息更完整</text>
        <button class="tail-btn" @click="goPublish">发布信息</button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { LFItem, LFItemStatus, LFItemType } from "@/domain/types"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const keyword = ref("")
const filterType = ref<"all" | LFItemType>("all")

const base = computed(() => store.searchItems(keyword.value))

const filtered = computed(() => {
  const arr = filterType.value === "all" ? base.value : base.value.filter((x) => x.type === filterType.value)
  return arr
})

const openCount = computed(() => filtered.value.filter((x) => x.status === "open").length)

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

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/item-detail/index?id=${encodeURIComponent(id)}` })
}

function goPublish() {
  uni.switchTab({ url: "/pages/publish/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  padding-bottom: calc(18rpx + var(--tabbar) + var(--safe-bottom));
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

.toggle {
  flex: 1;
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
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
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

.empty {
  margin: 14rpx 24rpx 0;
  padding: 28rpx;
  background: var(--card);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.empty-title {
  font-size: 30rpx;
  font-weight: 900;
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
  height: 76rpx;
  font-weight: 900;
}

.scroll {
  flex: 1;
  min-height: 0;
  padding: 0 24rpx calc(18rpx + var(--safe-bottom));
}

.cell {
  margin-top: 12rpx;
  background: var(--card);
  border: 1px solid var(--border);
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
  background: rgba(17, 24, 39, 0.03);
  border: 1px dashed rgba(17, 24, 39, 0.18);
  border-radius: var(--radius-lg);
  padding: 22rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  align-items: flex-start;
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

.tail-btn {
  margin-top: 4rpx;
  height: 76rpx;
  padding: 0 26rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
}
</style>

