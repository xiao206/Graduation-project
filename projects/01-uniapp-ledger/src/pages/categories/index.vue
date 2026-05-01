<template>
  <view class="page">
    <view class="type-toggle">
      <view class="seg" :class="type === 'expense' ? 'active-exp' : ''" @click="type = 'expense'">
        <text class="seg-text">支出</text>
      </view>
      <view class="seg" :class="type === 'income' ? 'active-inc' : ''" @click="type = 'income'">
        <text class="seg-text">收入</text>
      </view>
    </view>

    <view class="card">
      <text class="title">新增分类</text>
      <view class="form">
        <input v-model="name" class="input" placeholder="分类名称" placeholder-class="ph" />
        <input v-model="icon" class="input" placeholder="图标 type（例如 wallet-filled）" placeholder-class="ph" />
        <view class="colors">
          <view v-for="c in colors" :key="c" class="color" :class="color === c ? 'color-active' : ''" :style="{ backgroundColor: c }" @click="color = c" />
        </view>
        <button class="primary" size="mini" @click="add">添加</button>
      </view>
    </view>

    <view class="card">
      <text class="title">现有分类</text>
      <view class="list">
        <view v-for="c in list" :key="c.id" class="row">
          <view class="left">
            <view class="icon" :style="{ backgroundColor: c.color || '#E5E7EB' }">
              <uni-icons :type="c.icon || 'more-filled'" size="20" color="#FFFFFF" />
            </view>
            <view class="meta">
              <text class="row-name">{{ c.name }}</text>
              <text class="row-sub">{{ c.id }}</text>
            </view>
          </view>
          <switch :checked="c.enabled" @change="(e) => onSwitch(c.id, e)" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { Category } from "@/domain/types"
import { useLedgerStore } from "@/store/useLedgerStore"
import { createId } from "@/utils/id"

const store = useLedgerStore()
const type = ref<"expense" | "income">("expense")

const list = computed(() => store.state.data.categories.filter((c) => c.type === type.value).sort((a, b) => a.order - b.order))

const name = ref("")
const icon = ref("")
const colors = ["#F97316", "#EC4899", "#3B82F6", "#10B981", "#8B5CF6", "#64748B"]
const color = ref(colors[0])

function add() {
  const n = name.value.trim()
  if (!n) return uni.showToast({ title: "请输入名称", icon: "none" })
  const maxOrder = list.value.reduce((m, x) => Math.max(m, x.order), 0)
  const c: Category = {
    id: createId("cat"),
    type: type.value,
    name: n,
    icon: icon.value.trim() || undefined,
    color: color.value,
    order: maxOrder + 10,
    enabled: true,
  }
  store.upsertCategory(c)
  name.value = ""
  icon.value = ""
  uni.showToast({ title: "已添加", icon: "success" })
}

function toggle(id: string, enabled: boolean) {
  store.setCategoryEnabled(id, enabled)
}

function onSwitch(id: string, e: any) {
  toggle(id, !!e?.detail?.value)
}
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

.type-toggle {
  background: var(--card);
  border-radius: 999rpx;
  display: flex;
  padding: 6rpx;
  border: 1px solid var(--border);
  margin-bottom: 14rpx;
}

.seg {
  flex: 1;
  height: 72rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seg-text {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--muted);
}

.active-exp {
  background: rgba(239, 68, 68, 0.1);
}

.active-exp .seg-text {
  color: #ef4444;
}

.active-inc {
  background: rgba(34, 197, 94, 0.12);
}

.active-inc .seg-text {
  color: #16a34a;
}

.title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--text);
}

.form {
  margin-top: 14rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.input {
  height: 76rpx;
  padding: 0 16rpx;
  background: var(--primary-ghost);
  border-radius: var(--radius);
  font-size: 26rpx;
  color: var(--text);
  border: 1px solid var(--border);
}

.ph {
  color: #94a3b8;
}

.colors {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.color {
  width: 36rpx;
  height: 36rpx;
  border-radius: 999rpx;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 10rpx 22rpx rgba(15, 23, 42, 0.12);
}

.color-active {
  transform: scale(1.12);
}

.primary {
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}

.list {
  margin-top: 14rpx;
  display: flex;
  flex-direction: column;
}

.row {
  padding: 16rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.row:last-child {
  border-bottom: none;
}

.left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 34rpx;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.row-name {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--text);
}

.row-sub {
  font-size: 20rpx;
  color: var(--muted);
}
</style>
