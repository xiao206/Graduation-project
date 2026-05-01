<template>
  <view class="page">
    <view class="bg" />
    <scroll-view scroll-y class="scroll">
      <view class="content">
        <view class="brand">
          <view class="brand-icon">
            <uni-icons type="list" size="20" color="#ffffff" />
          </view>
          <view class="brand-meta">
            <text class="brand-title">校园失物招领助手</text>
            <text class="brand-sub">注册后可发布与管理你的信息</text>
          </view>
        </view>

        <view class="card">
          <text class="title">注册</text>
          <text class="sub">创建一个本地账号，用于区分“我的发布”</text>

          <view class="block">
            <text class="k">用户名</text>
            <input v-model="username" class="wx-input" placeholder="2~20 个字符" placeholder-class="ph" />
          </view>

          <view class="block">
            <text class="k">密码</text>
            <input v-model="password" class="wx-input" password placeholder="至少 4 位" placeholder-class="ph" />
          </view>

          <button class="wx-btn-primary" @click="submit">
            <view class="btn-inner">
              <uni-icons type="plus" size="18" color="#ffffff" />
              <text>注册并登录</text>
            </view>
          </button>

          <view class="footer">
            <text class="link" @click="goLogin">已有账号？去登录</text>
          </view>
        </view>

        <view class="legal">
          <text class="legal-text">本项目为毕业设计演示，数据仅保存在本机，请勿填写真实隐私信息。</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const username = ref("")
const password = ref("")

function submit() {
  const res = store.register({ username: username.value, password: password.value })
  if (!res.ok) return uni.showToast({ title: res.message, icon: "none" })
  uni.showToast({ title: "注册成功", icon: "success" })
  setTimeout(() => uni.switchTab({ url: "/pages/home/index" }), 200)
}

function goLogin() {
  uni.navigateBack()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  padding: 18rpx var(--pad) calc(24rpx + var(--safe-bottom));
}

.bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1200rpx 820rpx at 16% 0%, rgba(47, 107, 255, 0.16), transparent 58%),
    radial-gradient(920rpx 740rpx at 96% 18%, rgba(124, 58, 237, 0.12), transparent 62%),
    linear-gradient(180deg, #f7f8ff, #f5f6fa 52%, #f5f6fa);
}

.scroll {
  position: relative;
  height: 100vh;
}

.content {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18rpx;
  padding: 18rpx 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 0 6rpx;
}

.brand-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18rpx 44rpx rgba(47, 107, 255, 0.22);
}

.brand-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.brand-title {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--text);
}

.brand-sub {
  font-size: 22rpx;
  color: rgba(100, 116, 139, 0.92);
  font-weight: 800;
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow);
}

.title {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--text);
}

.sub {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--muted);
  line-height: 1.7;
}

.block {
  margin-top: 14rpx;
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
  color: rgba(100, 116, 139, 0.78);
}

.btn-inner {
  height: var(--btn-h);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 30rpx;
}

.footer {
  margin-top: 18rpx;
  display: flex;
  justify-content: center;
}

.link {
  font-size: 24rpx;
  color: var(--primary);
  font-weight: 900;
}

.legal {
  padding: 0 6rpx;
  display: flex;
  justify-content: center;
}

.legal-text {
  text-align: center;
  font-size: 20rpx;
  color: rgba(100, 116, 139, 0.86);
  line-height: 1.7;
}
</style>
