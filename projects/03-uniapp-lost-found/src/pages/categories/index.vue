<template>
  <view class="page">
    <view class="card">
      <text class="title">新增分类</text>
      <view class="form">
        <input v-model="name" class="wx-input" placeholder="分类名称" placeholder-class="ph" />
        <view class="colors">
          <view v-for="c in colors" :key="c" class="color" :class="color === c ? 'color-active' : ''" :style="{ backgroundColor: c }" @click="color = c" />
        </view>
        <button class="wx-btn-primary" @click="add">添加分类</button>
      </view>
    </view>

    <view class="card">
      <text class="title">现有分类</text>
      <view class="wx-group list">
        <view v-for="c in list" :key="c.id" class="wx-cell">
          <view class="wx-cell-left">
            <view class="icon" :style="{ backgroundColor: c.color || '#E5E7EB' }">
              <uni-icons type="tag-filled" size="18" color="#FFFFFF" />
            </view>
            <view class="wx-cell-meta">
              <text class="wx-cell-title">{{ c.name }}</text>
              <text class="wx-cell-sub">{{ c.id }}</text>
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
import type { LFCategory } from "@/domain/types"
import { useLostFoundStore } from "@/store/useLostFoundStore"
import { createId } from "@/utils/id"

const store = useLostFoundStore()

const list = computed(() => store.state.data.categories.slice().sort((a, b) => a.order - b.order))

const name = ref("")
const colors = ["#2F6BFF", "#7C3AED", "#F97316", "#DB2777", "#0EA5E9", "#64748B"]
const color = ref(colors[0])

function add() {
  const n = name.value.trim()
  if (!n) return uni.showToast({ title: "请输入名称", icon: "none" })
  const maxOrder = list.value.reduce((m, x) => Math.max(m, x.order), 0)
  const c: LFCategory = {
    id: createId("cat"),
    name: n,
    color: color.value,
    order: maxOrder + 10,
    enabled: true,
  }
  store.upsertCategory(c)
  name.value = ""
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
  padding: 18rpx 24rpx calc(24rpx + var(--safe-bottom));
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
  margin-bottom: 14rpx;
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

.ph {
  color: rgba(100, 116, 139, 0.78);
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

.list {
  margin-top: 14rpx;
}

.icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(15, 23, 42, 0.08);
}
</style>
