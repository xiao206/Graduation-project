<template>
  <view class="page">
    <view class="card">
      <text class="title">注册</text>
      <text class="sub">注册后可发布与管理你的信息</text>

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
  padding: 18rpx 24rpx calc(24rpx + var(--safe-bottom));
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
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
</style>
