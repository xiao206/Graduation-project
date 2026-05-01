<template>
  <view class="page">
    <view class="card">
      <text class="title">设置</text>
      <view class="list">
        <view class="row" @click="go('/pages/members/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="person-filled" size="18" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">成员管理</text>
              <text class="row-sub">默认6人，可改名</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
        <view class="row" @click="go('/pages/categories/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="list" size="18" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">分类管理</text>
              <text class="row-sub">水费/电费等</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
        <view class="row" @click="go('/pages/data/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="download" size="18" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">数据</text>
              <text class="row-sub">导出/导入</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
        <view class="row" @click="go('/pages/about/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="info-filled" size="18" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">关于</text>
              <text class="row-sub">项目说明</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
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

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 14rpx;
}

.list {
  display: flex;
  flex-direction: column;
}

.row {
  padding: 18rpx 4rpx;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row:last-child {
  border-bottom: none;
}

.row-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.row-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-meta {
  display: flex;
  flex-direction: column;
}

.row-text {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--text);
}

.row-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--muted);
}
</style>
