<template>
  <view class="page">
    <view class="card">
      <text class="title">设置</text>
      <view class="list">
        <view class="row" @click="go('/pages/assets/index')">
          <text class="row-text">预算与资产</text>
          <text class="row-sub">余额、预算</text>
        </view>
        <view class="row" @click="go('/pages/categories/index')">
          <text class="row-text">分类管理</text>
          <text class="row-sub">收入/支出分类</text>
        </view>
        <view class="row" @click="go('/pages/accounts/index')">
          <text class="row-text">账户管理</text>
          <text class="row-sub">现金/银行卡等</text>
        </view>
        <view class="row" @click="go('/pages/data/index')">
          <text class="row-text">数据</text>
          <text class="row-sub">导出/导入</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
function go(url: string) {
  uni.navigateTo({ url })
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

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 14rpx;
}

.list {
  display: flex;
  flex-direction: column;
}

.row {
  padding: 18rpx 4rpx;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.row:last-child {
  border-bottom: none;
}

.row-text {
  font-size: 28rpx;
  font-weight: 800;
  color: #0f172a;
}

.row-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #64748b;
}
</style>

