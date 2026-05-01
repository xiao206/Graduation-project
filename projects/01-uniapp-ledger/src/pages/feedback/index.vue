<template>
  <view class="page">
    <view class="card">
      <text class="title">问题反馈</text>
      <text class="tip">请描述你遇到的问题，建议附上复现步骤。</text>

      <textarea v-model="content" class="textarea" placeholder="例如：账单列表某条数据显示异常..." />

      <button class="primary" @click="copy">复制反馈内容</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"

const content = ref("")

function copy() {
  const text = content.value.trim()
  if (!text) return uni.showToast({ title: "请输入内容", icon: "none" })
  uni.setClipboardData({ data: text })
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
}

.tip {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: var(--muted);
}

.textarea {
  margin-top: 16rpx;
  width: 100%;
  height: 280rpx;
  padding: 18rpx 18rpx;
  border-radius: var(--radius);
  background: var(--primary-ghost);
  font-size: 26rpx;
  color: var(--text);
  border: 1px solid var(--border);
}

.primary {
  margin-top: 16rpx;
  height: 76rpx;
  border-radius: var(--radius);
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
}
</style>
