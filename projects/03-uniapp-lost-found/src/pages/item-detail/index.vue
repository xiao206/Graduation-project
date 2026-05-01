<template>
  <view class="page">
    <view v-if="!item" class="card">
      <text class="title">未找到信息</text>
      <text class="sub">可能已被删除</text>
      <button class="primary" @click="goBack">返回</button>
    </view>

    <view v-else class="card">
      <view class="head">
        <view class="badge" :class="item.type === 'lost' ? 'badge-lost' : 'badge-found'">
          <text class="badge-text">{{ item.type === "lost" ? "寻物" : "招领" }}</text>
        </view>
        <view class="status" :class="item.status !== 'open' ? 'status-done' : ''">{{ statusText(item.status) }}</view>
      </view>

      <text class="title">{{ item.title }}</text>
      <text class="meta">{{ metaText }}</text>

      <view v-if="item.description" class="block">
        <text class="k">描述</text>
        <text class="p">{{ item.description }}</text>
      </view>

      <view class="block">
        <text class="k">联系方式</text>
        <text class="p">{{ item.contact || "未填写" }}</text>
        <button v-if="item.contact" class="ghost" @click="copy(item.contact)">复制联系方式</button>
      </view>

      <view class="actions">
        <button class="primary" @click="goPublish">继续发布</button>
        <button class="ghost" @click="goItems">查看列表</button>
      </view>
    </view>

    <view v-if="item && isOwner" class="card">
      <text class="card-title">管理</text>
      <view class="manage">
        <button class="ghost" @click="setStatus('claimed')">标记已认领</button>
        <button class="ghost" @click="setStatus('closed')">标记已结束</button>
        <button class="danger" @click="remove">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import type { LFItemStatus } from "@/domain/types"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const id = ref("")

const item = computed(() => (id.value ? store.getItemById(id.value) : undefined))

const isOwner = computed(() => {
  const u = store.currentUser.value
  if (!u || !item.value) return false
  return item.value.ownerUserId === u.id
})

const metaText = computed(() => {
  if (!item.value) return ""
  const date = item.value.occurredAt.slice(0, 10)
  const loc = item.value.location?.trim()
  return loc ? `${date} · ${loc}` : date
})

function statusText(status: LFItemStatus) {
  if (status === "claimed") return "已认领"
  if (status === "closed") return "已结束"
  return "进行中"
}

function goBack() {
  uni.navigateBack()
}

function goItems() {
  uni.switchTab({ url: "/pages/items/index" })
}

function goPublish() {
  uni.switchTab({ url: "/pages/publish/index" })
}

function copy(text: string) {
  uni.setClipboardData({ data: text })
}

function setStatus(status: LFItemStatus) {
  if (!item.value) return
  const ok = store.setItemStatus(item.value.id, status)
  if (!ok) return uni.showToast({ title: "操作失败", icon: "none" })
  uni.showToast({ title: "已更新", icon: "success" })
}

function remove() {
  if (!item.value) return
  uni.showModal({
    title: "确认删除？",
    content: "删除后无法恢复",
    success(res) {
      if (!res.confirm) return
      const ok = store.deleteItem(item.value!.id)
      if (!ok) return uni.showToast({ title: "删除失败", icon: "none" })
      uni.showToast({ title: "已删除", icon: "success" })
      setTimeout(() => goItems(), 300)
    },
  })
}

onLoad((q: any) => {
  id.value = String(q?.id || "")
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx calc(24rpx + var(--safe-bottom));
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.badge {
  width: 90rpx;
  height: 44rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-lost {
  background: rgba(239, 68, 68, 0.14);
}

.badge-found {
  background: rgba(22, 163, 74, 0.14);
}

.badge-text {
  font-size: 22rpx;
  font-weight: 900;
  color: var(--text);
}

.status {
  font-size: 24rpx;
  font-weight: 900;
  color: var(--primary);
}

.status-done {
  color: var(--muted);
}

.title {
  font-size: 34rpx;
  font-weight: 900;
  color: var(--text);
}

.sub {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--muted);
}

.meta {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--muted);
}

.block {
  margin-top: 18rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.k {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
}

.p {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 800;
  line-height: 1.7;
}

.actions {
  margin-top: 18rpx;
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
}

.ghost {
  margin-top: 6rpx;
  height: 76rpx;
  border-radius: 999rpx;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  font-weight: 900;
}

.card-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 14rpx;
}

.manage {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.danger {
  height: 86rpx;
  border-radius: 999rpx;
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.22);
  font-weight: 900;
}
</style>

