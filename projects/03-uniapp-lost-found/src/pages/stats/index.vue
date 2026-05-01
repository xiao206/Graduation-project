<template>
  <view class="page">
    <view class="summary">
      <view class="sum-item">
        <text class="k">总数</text>
        <text class="v">{{ total }}</text>
      </view>
      <view class="sum-item">
        <text class="k">进行中</text>
        <text class="v">{{ open }}</text>
      </view>
      <view class="sum-item">
        <text class="k">寻物</text>
        <text class="v">{{ lost }}</text>
      </view>
      <view class="sum-item">
        <text class="k">招领</text>
        <text class="v">{{ found }}</text>
      </view>
    </view>

    <view class="card">
      <view class="head">
        <text class="title">我的发布</text>
        <text class="sub">登录后可管理自己的信息</text>
      </view>
      <view class="row">
        <view class="pill">
          <text class="pill-k">我发布的</text>
          <text class="pill-v">{{ myTotal }}</text>
        </view>
        <view class="pill">
          <text class="pill-k">进行中</text>
          <text class="pill-v">{{ myOpen }}</text>
        </view>
      </view>
      <button class="primary" @click="goPublish">
        <view class="btn-inner">
          <uni-icons type="plus" size="18" color="#ffffff" />
          <text>发布一条</text>
        </view>
      </button>
    </view>

    <view class="card">
      <view class="head">
        <text class="title">分类分布</text>
        <text class="sub">按分类统计（前 6）</text>
      </view>
      <view v-if="topCats.length === 0" class="empty">
        <text class="empty-text">暂无数据</text>
      </view>
      <view v-else class="cat">
        <view v-for="x in topCats" :key="x.id" class="cat-row">
          <view class="dot" :style="{ backgroundColor: x.color || '#D1D5DB' }" />
          <text class="name">{{ x.name }}</text>
          <text class="val">{{ x.count }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()

const total = computed(() => store.state.data.items.length)
const open = computed(() => store.state.data.items.filter((x) => x.status === "open").length)
const lost = computed(() => store.state.data.items.filter((x) => x.type === "lost").length)
const found = computed(() => store.state.data.items.filter((x) => x.type === "found").length)

const myTotal = computed(() => {
  const u = store.currentUser.value
  if (!u) return 0
  return store.state.data.items.filter((x) => x.ownerUserId === u.id).length
})

const myOpen = computed(() => {
  const u = store.currentUser.value
  if (!u) return 0
  return store.state.data.items.filter((x) => x.ownerUserId === u.id && x.status === "open").length
})

const topCats = computed(() => {
  const map = new Map<string, number>()
  for (const x of store.state.data.items) map.set(x.categoryId, (map.get(x.categoryId) ?? 0) + 1)
  const catMap = new Map(store.state.data.categories.map((c) => [c.id, c] as const))
  return Array.from(map.entries())
    .map(([id, count]) => ({ id, count, name: catMap.get(id)?.name || "未分类", color: catMap.get(id)?.color }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})

function goPublish() {
  uni.switchTab({ url: "/pages/publish/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx calc(24rpx + var(--tabbar) + var(--safe-bottom));
}

.summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.sum-item {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 16rpx;
  border: 1px solid var(--border);
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
  font-size: 32rpx;
  font-weight: 900;
  color: var(--text);
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 14rpx;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 14rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
}

.sub {
  font-size: 24rpx;
  color: var(--muted);
}

.row {
  display: flex;
  gap: 12rpx;
}

.pill {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18rpx;
  padding: 14rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.pill-k {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.pill-v {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.primary {
  margin-top: 14rpx;
  height: 90rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
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

.empty {
  padding: 10rpx 0;
}

.empty-text {
  font-size: 24rpx;
  color: var(--muted);
}

.cat {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.cat-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 999rpx;
}

.name {
  flex: 1;
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
}

.val {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--muted);
}
</style>

