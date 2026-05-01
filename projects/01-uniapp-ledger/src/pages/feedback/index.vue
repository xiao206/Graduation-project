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
}

.tip {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #64748b;
}

.textarea {
  margin-top: 16rpx;
  width: 100%;
  height: 280rpx;
  padding: 18rpx 18rpx;
  border-radius: 18rpx;
  background: rgba(15, 23, 42, 0.04);
  font-size: 26rpx;
  box-sizing: border-box;
}

.primary {
  margin-top: 16rpx;
  height: 76rpx;
  border-radius: 18rpx;
  background: #0f172a;
  color: #ffffff;
  font-weight: 900;
}
</style>

