<template>
  <view class="page">
    <view class="card">
      <view class="head">
        <view class="logo">
          <uni-icons type="list" size="22" color="#0F172A" />
        </view>
        <view class="meta">
          <text class="name">宿舍AA分摊助手</text>
          <text class="sub">纯本地 · 平均分摊 · 可导入导出</text>
        </view>
      </view>

      <view class="rows">
        <view class="row">
          <text class="k">版本</text>
          <text class="v">{{ version }}</text>
        </view>
        <view class="row">
          <text class="k">存储位置</text>
          <text class="v">本机 Storage</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import pkg from "../../../package.json"

const version = (pkg as any)?.version || "0.0.0"
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 24rpx;
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 24rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.head {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 18rpx;
}

.logo {
  width: 76rpx;
  height: 76rpx;
  border-radius: var(--radius-lg);
  background: var(--primary-ghost);
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--text);
}

.sub {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: var(--muted);
}

.rows {
  margin-top: 10rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 18rpx;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.row:last-child {
  border-bottom: none;
}

.k {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--text);
}

.v {
  font-size: 24rpx;
  color: var(--muted);
}

.ghost {
  margin-top: 8rpx;
  height: 76rpx;
  border-radius: var(--radius);
  background: var(--primary-ghost);
  color: var(--text);
  font-weight: 800;
}
</style>
