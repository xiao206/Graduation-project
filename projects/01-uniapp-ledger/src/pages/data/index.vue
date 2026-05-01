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
import { useLedgerStore } from "@/store/useLedgerStore"

const store = useLedgerStore()
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
  background: #f6f7fb;
  padding: 18rpx 24rpx 24rpx;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22rpx;
  padding: 28rpx;
  box-shadow: 0 18rpx 44rpx rgba(15, 23, 42, 0.08);
  margin-bottom: 14rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: #0f172a;
}

.sub {
  font-size: 24rpx;
  color: #64748b;
}

.actions {
  margin-top: 12rpx;
  display: flex;
  gap: 12rpx;
}

.primary {
  background: #111827;
  color: #ffffff;
  border-radius: 16rpx;
}

.ghost {
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  border-radius: 16rpx;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.danger {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border-radius: 16rpx;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.textarea {
  margin-top: 12rpx;
  width: 100%;
  min-height: 200rpx;
  padding: 14rpx 16rpx;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 18rpx;
  font-size: 22rpx;
  color: #0f172a;
}

.ph {
  color: #94a3b8;
}
</style>
