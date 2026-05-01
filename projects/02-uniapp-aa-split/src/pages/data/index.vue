<template>
  <view class="page">
    <view class="card">
      <text class="title">数据</text>
      <text class="sub">导出/导入会覆盖本机数据，请谨慎操作</text>
    </view>

    <view class="card">
      <text class="title">导出</text>
      <view class="actions">
        <button class="ghost" size="mini" @click="refreshExport">刷新</button>
        <button class="primary" size="mini" @click="copyExport">复制</button>
      </view>
      <textarea v-model="exportText" class="textarea" auto-height />
    </view>

    <view class="card">
      <text class="title">导入</text>
      <view class="actions">
        <button class="danger" size="mini" @click="importData">导入并覆盖</button>
      </view>
      <textarea v-model="importText" class="textarea" auto-height placeholder="粘贴导出的 JSON 文本" placeholder-class="ph" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAASplitStore } from "@/store/useAASplitStore"

const store = useAASplitStore()
const exportText = ref("")
const importText = ref("")

function refreshExport() {
  exportText.value = store.exportJSON()
  uni.showToast({ title: "已刷新", icon: "success" })
}

function copyExport() {
  if (!exportText.value) exportText.value = store.exportJSON()
  uni.setClipboardData({
    data: exportText.value,
    success() {
      uni.showToast({ title: "已复制", icon: "success" })
    },
  })
}

function importData() {
  const raw = importText.value.trim()
  if (!raw) return uni.showToast({ title: "请输入内容", icon: "none" })
  uni.showModal({
    title: "确认导入",
    content: "导入会覆盖本机现有数据，是否继续？",
    success(res) {
      if (!res.confirm) return
      const ok = store.importJSON(raw)
      if (!ok) return uni.showToast({ title: "导入失败", icon: "none" })
      importText.value = ""
      exportText.value = store.exportJSON()
      uni.showToast({ title: "导入成功", icon: "success" })
    },
  })
}

refreshExport()
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx 24rpx;
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  margin-bottom: 14rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
}

.sub {
  font-size: 24rpx;
  color: var(--muted);
}

.actions {
  margin-top: 12rpx;
  display: flex;
  gap: 12rpx;
}

.primary {
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}

.ghost {
  background: var(--card);
  color: var(--text);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.danger {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border-radius: var(--radius);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.textarea {
  margin-top: 12rpx;
  width: 100%;
  min-height: 200rpx;
  padding: 14rpx 16rpx;
  background: var(--primary-ghost);
  border-radius: var(--radius);
  font-size: 22rpx;
  color: var(--text);
  border: 1px solid var(--border);
}

.ph {
  color: #94a3b8;
}
</style>
