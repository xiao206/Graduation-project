<template>
  <view class="page">
    <view class="hero">
      <view class="hero-top">
        <view class="hero-icon">
          <uni-icons type="home-filled" size="22" color="#ffffff" />
        </view>
        <view class="hero-meta">
          <text class="hero-title">宿舍</text>
          <input v-model="dormName" class="hero-input" placeholder="默认宿舍" placeholder-class="ph" @blur="saveDorm" />
        </view>
      </view>
      <view class="stats">
        <view class="stat">
          <text class="stat-k">成员</text>
          <text class="stat-v">{{ membersEnabledCount }}</text>
        </view>
        <view class="stat">
          <text class="stat-k">分类</text>
          <text class="stat-v">{{ categoriesCount }}</text>
        </view>
        <view class="stat">
          <text class="stat-k">账单</text>
          <text class="stat-v">{{ billsCount }}</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="title">快捷操作</text>
      <view class="quick">
        <view class="quick-btn primary" @click="goAdd">
          <uni-icons type="plus" size="18" color="#ffffff" />
          <text class="quick-text">新增账单</text>
        </view>
        <view class="quick-btn" @click="goSettle">
          <uni-icons type="chart" size="18" color="var(--primary)" />
          <text class="quick-text">生成结算</text>
        </view>
        <view class="quick-btn" @click="go('/pages/data/index')">
          <uni-icons type="download" size="18" color="var(--primary)" />
          <text class="quick-text">数据备份</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="title">管理</text>
      <view class="list">
        <view class="row" @click="go('/pages/members/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="person-filled" size="24" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">成员管理</text>
              <text class="row-sub">默认6人，可改名</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="var(--muted)" />
        </view>
        <view class="row" @click="go('/pages/categories/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="list" size="24" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">分类管理</text>
              <text class="row-sub">水费/电费等</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="var(--muted)" />
        </view>
      </view>
    </view>

    <view class="card">
      <text class="title">其他</text>
      <view class="list">
        <view class="row" @click="go('/pages/data/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="download" size="24" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">数据</text>
              <text class="row-sub">导出/导入</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="var(--muted)" />
        </view>
        <view class="row" @click="go('/pages/about/index')">
          <view class="row-left">
            <view class="row-icon">
              <uni-icons type="info-filled" size="24" color="var(--primary)" />
            </view>
            <view class="row-meta">
              <text class="row-text">关于</text>
              <text class="row-sub">项目说明</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="var(--muted)" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useAASplitStore } from "@/store/useAASplitStore"

const store = useAASplitStore()
const dormName = ref(store.state.data.settings.defaultDormName || "默认宿舍")

const membersEnabledCount = computed(() => store.membersEnabled.value.length)
const categoriesCount = computed(() => store.state.data.categories.filter((c) => c.enabled).length)
const billsCount = computed(() => store.state.data.bills.length)

function go(url: string) {
  uni.navigateTo({ url })
}

function goAdd() {
  uni.navigateTo({ url: "/pages/bill-edit/index" })
}

function goSettle() {
  uni.switchTab({ url: "/pages/settle/index" })
}

function saveDorm() {
  const v = dormName.value.trim()
  dormName.value = v || "默认宿舍"
  store.updateSettings({ defaultDormName: dormName.value })
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
  margin-bottom: 14rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 14rpx;
}

.hero {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(37, 99, 235, 0.06));
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: var(--radius-lg);
  padding: 22rpx 22rpx;
  margin-bottom: 14rpx;
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
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}

.hero-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hero-title {
  font-size: 24rpx;
  color: rgba(17, 24, 39, 0.7);
  font-weight: 800;
}

.hero-input {
  height: 56rpx;
  font-size: 34rpx;
  font-weight: 900;
  color: var(--text);
}

.ph {
  color: rgba(17, 24, 39, 0.45);
}

.stats {
  margin-top: 16rpx;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 18rpx;
  padding: 14rpx 14rpx;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12rpx;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.stat-k {
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.stat-v {
  font-size: 28rpx;
  color: var(--text);
  font-weight: 900;
}

.quick {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12rpx;
}

.quick-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18rpx;
  padding: 16rpx 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.quick-btn.primary {
  background: var(--primary);
  border-color: rgba(37, 99, 235, 0.6);
}

.quick-btn.primary .quick-text {
  color: #ffffff;
}

.quick-text {
  font-size: 22rpx;
  font-weight: 900;
  color: var(--text);
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
  width: 76rpx;
  height: 76rpx;
  border-radius: 22rpx;
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
