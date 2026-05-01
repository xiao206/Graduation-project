<template>
  <view class="page">
    <view class="card">
      <view class="head">
        <view class="logo">
          <uni-icons type="wallet-filled" size="22" color="#0F172A" />
        </view>
        <view class="meta">
          <text class="name">记账小程序</text>
          <text class="sub">本地离线 · 数据可导出</text>
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

      <button class="ghost" @click="goFeedback">问题反馈</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import pkg from "../../../package.json"

const version = (pkg as any)?.version || "0.0.0"

function goFeedback() {
  uni.navigateTo({ url: "/pages/feedback/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f7fb;
  padding: 24rpx;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  padding: 24rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.08);
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
  border-radius: 22rpx;
  background: rgba(15, 23, 42, 0.04);
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
  color: #0f172a;
}

.sub {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #64748b;
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
  color: #0f172a;
}

.v {
  font-size: 24rpx;
  color: #64748b;
}

.ghost {
  margin-top: 8rpx;
  height: 76rpx;
  border-radius: 18rpx;
  background: rgba(15, 23, 42, 0.05);
  color: #0f172a;
  font-weight: 800;
}
</style>

