<template>
  <view class="page">
    <view class="hero">
      <view class="hero-top">
        <view class="hero-icon">
          <uni-icons type="gear-filled" size="22" color="#ffffff" />
        </view>
        <view class="hero-meta">
          <text class="hero-title">设置</text>
          <text class="hero-sub">数据与管理</text>
        </view>
      </view>
      <view class="stats">
        <view class="stat">
          <text class="stat-k">账单</text>
          <text class="stat-v">{{ txnsCount }}</text>
        </view>
        <view class="stat">
          <text class="stat-k">分类</text>
          <text class="stat-v">{{ categoriesCount }}</text>
        </view>
        <view class="stat">
          <text class="stat-k">账户</text>
          <text class="stat-v">{{ accountsCount }}</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">快捷入口</text>
      <view class="quick">
        <view class="quick-btn primary" @click="go('/pages/assets/index')">
          <view class="quick-ico primary-ico">
            <uni-icons type="wallet-filled" size="24" color="#ffffff" />
          </view>
          <text class="quick-text">预算与资产</text>
        </view>
        <view class="quick-btn" @click="go('/pages/categories/index')">
          <view class="quick-ico">
            <uni-icons type="list" size="24" color="#111827" />
          </view>
          <text class="quick-text">分类管理</text>
        </view>
        <view class="quick-btn" @click="go('/pages/accounts/index')">
          <view class="quick-ico">
            <uni-icons type="bars" size="24" color="#111827" />
          </view>
          <text class="quick-text">账户管理</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">工具</text>
      <view class="list">
        <view class="row" @click="go('/pages/data/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="download" size="22" color="var(--text)" />
            </view>
            <view class="row-meta">
              <text class="row-text">数据</text>
              <text class="row-sub">导出 / 导入</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
        <view class="row" @click="go('/pages/feedback/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="chatboxes-filled" size="22" color="var(--text)" />
            </view>
            <view class="row-meta">
              <text class="row-text">问题反馈</text>
              <text class="row-sub">一键复制反馈内容</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">关于</text>
      <view class="list">
        <view class="row" @click="go('/pages/about/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="info-filled" size="22" color="var(--text)" />
            </view>
            <view class="row-meta">
              <text class="row-text">关于</text>
              <text class="row-sub">版本信息</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useLedgerStore } from "@/store/useLedgerStore"

const store = useLedgerStore()

const txnsCount = computed(() => store.state.data.transactions.length)
const categoriesCount = computed(() => store.state.data.categories.filter((c) => c.enabled).length)
const accountsCount = computed(() => store.state.data.accounts.filter((a) => a.enabled).length)

function go(url: string) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 24rpx 24rpx calc(24rpx + var(--tabbar) + var(--safe-bottom));
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.hero {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.14), rgba(17, 24, 39, 0.04));
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: var(--radius-lg);
  padding: 22rpx;
  box-shadow: var(--shadow);
}

.hero-top {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.hero-icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18rpx 44rpx rgba(17, 24, 39, 0.25);
}

.hero-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hero-title {
  font-size: 34rpx;
  font-weight: 900;
  color: var(--text);
}

.hero-sub {
  font-size: 24rpx;
  color: rgba(100, 116, 139, 0.9);
}

.stats {
  margin-top: 16rpx;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18rpx;
  padding: 14rpx;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12rpx;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.stat-k {
  font-size: 22rpx;
  color: rgba(100, 116, 139, 0.9);
  font-weight: 800;
}

.stat-v {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 24rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.card-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 14rpx;
}

.quick {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12rpx;
}

.quick-btn {
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18rpx;
  padding: 18rpx 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.quick-btn.primary {
  background: var(--primary);
  border-color: rgba(17, 24, 39, 0.6);
}

.quick-ico {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  background: rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-ico {
  background: rgba(255, 255, 255, 0.14);
}

.quick-text {
  font-size: 22rpx;
  font-weight: 900;
  color: var(--text);
}

.quick-btn.primary .quick-text {
  color: #ffffff;
}

.list {
  display: flex;
  flex-direction: column;
}

.row {
  padding: 18rpx 4rpx;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
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
  border-radius: var(--radius);
  background: rgba(15, 23, 42, 0.06);
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
  font-weight: 900;
  color: var(--text);
}

.row-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--muted);
}
</style>
