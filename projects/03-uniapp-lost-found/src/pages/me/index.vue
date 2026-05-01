<template>
  <view class="page">
    <view class="hero">
      <view class="hero-top">
        <view class="hero-icon">
          <uni-icons type="person-filled" size="22" color="#ffffff" />
        </view>
        <view class="hero-meta">
          <text class="hero-title">{{ userTitle }}</text>
          <text class="hero-sub">{{ campusName }}</text>
        </view>
      </view>
      <view class="hero-actions">
        <button v-if="!isLoggedIn" class="primary" @click="goLogin">登录</button>
        <button v-if="!isLoggedIn" class="ghost" @click="goRegister">注册</button>
        <button v-if="isLoggedIn" class="ghost" @click="logout">退出登录</button>
      </view>
    </view>

    <view class="card">
      <text class="card-title">设置</text>
      <view class="row">
        <text class="k">校区名称</text>
        <input v-model="campusInput" class="input" placeholder="例如：湖南汽车工程职院" placeholder-class="ph" />
      </view>
      <button class="primary full" @click="saveCampus">保存</button>
    </view>

    <view class="card">
      <text class="card-title">管理</text>
      <view class="list">
        <view class="cell" @click="goCategories">
          <view class="cell-left">
            <view class="cell-icon">
              <uni-icons type="list" size="20" color="var(--text)" />
            </view>
            <view class="cell-meta">
              <text class="cell-title">分类管理</text>
              <text class="cell-sub">证件/电子产品等</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
        <view class="cell" @click="goAbout">
          <view class="cell-left">
            <view class="cell-icon">
              <uni-icons type="info-filled" size="20" color="var(--text)" />
            </view>
            <view class="cell-meta">
              <text class="cell-title">关于</text>
              <text class="cell-sub">项目说明</text>
            </view>
          </view>
          <uni-icons type="forward" size="16" color="#94A3B8" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onShow } from "@dcloudio/uni-app"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const isLoggedIn = computed(() => store.isLoggedIn.value)
const campusName = computed(() => store.state.data.settings.campusName)
const userTitle = computed(() => (store.currentUser.value ? store.currentUser.value.username : "未登录"))

const campusInput = ref(campusName.value)

function saveCampus() {
  store.updateSettings({ campusName: campusInput.value })
  uni.showToast({ title: "已保存", icon: "success" })
}

function goLogin() {
  uni.navigateTo({ url: "/pages/login/index" })
}

function goRegister() {
  uni.navigateTo({ url: "/pages/register/index" })
}

function logout() {
  store.logout()
  uni.showToast({ title: "已退出", icon: "none" })
}

function goCategories() {
  uni.navigateTo({ url: "/pages/categories/index" })
}

function goAbout() {
  uni.navigateTo({ url: "/pages/about/index" })
}

onShow(() => {
  campusInput.value = campusName.value
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx calc(24rpx + var(--tabbar) + var(--safe-bottom));
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.hero {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(37, 99, 235, 0.06));
  border: 1px solid rgba(37, 99, 235, 0.16);
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
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}

.hero-meta {
  flex: 1;
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
  color: rgba(17, 24, 39, 0.7);
  font-weight: 800;
}

.hero-actions {
  margin-top: 16rpx;
  display: flex;
  gap: 12rpx;
}

.primary {
  flex: 1;
  height: 86rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}

.ghost {
  flex: 1;
  height: 86rpx;
  border-radius: 999rpx;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  font-weight: 900;
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

.row {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.k {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
}

.input {
  height: 76rpx;
  padding: 0 16rpx;
  background: var(--surface);
  border-radius: 18rpx;
  border: 1px solid var(--border);
  font-size: 26rpx;
  color: var(--text);
}

.ph {
  color: rgba(17, 24, 39, 0.45);
}

.full {
  width: 100%;
  margin-top: 14rpx;
}

.list {
  display: flex;
  flex-direction: column;
}

.cell {
  padding: 18rpx 4rpx;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cell:last-child {
  border-bottom: none;
}

.cell-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.cell-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--radius);
  background: rgba(17, 24, 39, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell-meta {
  display: flex;
  flex-direction: column;
}

.cell-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.cell-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--muted);
}
</style>
