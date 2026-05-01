<template>
  <view class="page">
    <view class="card">
      <text class="title">登录</text>
      <text class="sub">本地账号，仅用于本机管理你发布的信息</text>
      <view class="hint">
        <text class="hint-text">体验账号：demo</text>
        <text class="hint-text">密码：1234</text>
      </view>

      <view class="block">
        <text class="k">用户名</text>
        <input v-model="username" class="input" placeholder="请输入用户名" placeholder-class="ph" />
      </view>

      <view class="block">
        <text class="k">密码</text>
        <input v-model="password" class="input" password placeholder="请输入密码" placeholder-class="ph" />
      </view>

      <button class="primary" @click="submit">
        <view class="btn-inner">
          <uni-icons type="checkbox-filled" size="18" color="#ffffff" />
          <text>登录</text>
        </view>
      </button>

      <view class="footer">
        <text class="link" @click="goRegister">没有账号？去注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const username = ref("")
const password = ref("")

function submit() {
  const res = store.login({ username: username.value, password: password.value })
  if (!res.ok) return uni.showToast({ title: res.message, icon: "none" })
  uni.showToast({ title: "登录成功", icon: "success" })
  setTimeout(() => uni.switchTab({ url: "/pages/home/index" }), 200)
}

function goRegister() {
  uni.navigateTo({ url: "/pages/register/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx calc(24rpx + var(--safe-bottom));
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border);
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

.hint {
  margin-top: 12rpx;
  padding: 12rpx 14rpx;
  border-radius: 18rpx;
  background: rgba(47, 107, 255, 0.08);
  border: 1px solid rgba(47, 107, 255, 0.14);
  display: flex;
  gap: 14rpx;
  flex-wrap: wrap;
}

.hint-text {
  font-size: 22rpx;
  color: rgba(15, 23, 42, 0.76);
  font-weight: 900;
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
  color: rgba(17, 24, 39, 0.45);
}

.primary {
  margin-top: 18rpx;
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
</style>
