<template>
  <view class="page">
    <view class="toolbar">
      <picker mode="date" fields="month" :value="monthKey + '-01'" @change="onPickMonth">
        <view class="pill">
          <text class="pill-text">{{ monthKey }}</text>
          <text class="pill-sub">月份</text>
        </view>
      </picker>
      <input v-model="keyword" class="search" placeholder="搜索备注/分类/成员" placeholder-class="ph" />
    </view>

    <view v-if="groups.length === 0" class="empty">
      <text class="empty-title">本月还没有账单</text>
      <text class="empty-sub">新增一笔后，这里会按发生日期整理</text>
      <button class="primary" @click="goAdd">新增账单</button>
    </view>

    <scroll-view v-else scroll-y class="scroll">
      <view v-for="g in groups" :key="g.date" class="group">
        <view class="group-head">
          <text class="group-date">{{ g.date }}</text>
          <text class="group-sum">合计 ¥{{ formatCents(g.total) }}</text>
        </view>
        <view class="list">
          <view v-for="b in g.items" :key="b.id" class="item" @click="goDetail(b.id)">
            <view class="left">
              <view class="icon" :style="{ backgroundColor: categoryMap.get(b.categoryId)?.color || '#E5E7EB' }">
                <uni-icons :type="categoryMap.get(b.categoryId)?.icon || 'more-filled'" size="24" color="#FFFFFF" />
              </view>
              <view class="meta">
                <text class="name">{{ categoryMap.get(b.categoryId)?.name || "未分类" }}</text>
                <text class="sub">{{ itemSub(b) }}</text>
              </view>
            </view>
            <text class="amt">¥{{ formatCents(b.amountCents) }}</text>
          </view>
        </view>
      </view>
      <view style="height: 60rpx" />
    </scroll-view>

    <view class="floating">
      <button class="fab" @click="goAdd">新增账单</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { AABill } from "@/domain/types"
import { useAASplitStore } from "@/store/useAASplitStore"
import { parseISOToDateKey, toMonthKey } from "@/utils/date"
import { formatCents } from "@/utils/money"

const store = useAASplitStore()

const monthKey = ref(toMonthKey(new Date()))
const keyword = ref("")

const categoryMap = computed(() => {
  const m = new Map<string, { name: string; icon?: string; color?: string }>()
  for (const c of store.state.data.categories) m.set(c.id, { name: c.name, icon: c.icon, color: c.color })
  return m
})

const memberNameMap = computed(() => {
  const m = new Map<string, string>()
  for (const x of store.state.data.members) m.set(x.id, x.name)
  return m
})

const filtered = computed(() => {
  const bills = store.listBillsByMonth(monthKey.value)
  const q = keyword.value.trim().toLowerCase()
  if (!q) return bills
  return bills.filter((b) => {
    const c = categoryMap.value.get(b.categoryId)?.name || ""
    const note = b.note || ""
    const payer = memberNameMap.value.get(b.payerId) || ""
    const parts = b.participantIds.map((id) => memberNameMap.value.get(id) || id).join(" ")
    return `${c} ${note} ${payer} ${parts}`.toLowerCase().includes(q)
  })
})

const groups = computed(() => {
  const raw = store.groupBillsByDate(filtered.value)
  return raw.map((g) => ({ ...g, total: g.items.reduce((s, x) => s + x.amountCents, 0) }))
})

function itemSub(b: AABill) {
  const payer = memberNameMap.value.get(b.payerId) || "付款人"
  const note = b.note?.trim()
  const base = `${payer} · ${b.participantIds.length}人`
  return note ? `${base} · ${note}` : base
}

function onPickMonth(e: any) {
  const v = String(e?.detail?.value || "")
  monthKey.value = v.slice(0, 7)
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/bill-detail/index?id=${encodeURIComponent(id)}` })
}

function goAdd() {
  uni.navigateTo({ url: "/pages/bill-edit/index" })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
}

.toolbar {
  padding: 18rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.pill {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  padding: 12rpx 16rpx;
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.pill-text {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--text);
}

.pill-sub {
  font-size: 22rpx;
  color: var(--muted);
}

.search {
  flex: 1;
  height: 72rpx;
  padding: 0 16rpx;
  background: var(--card);
  border-radius: var(--radius);
  font-size: 26rpx;
  color: var(--text);
  border: 1px solid var(--border);
}

.ph {
  color: #94a3b8;
}

.scroll {
  height: calc(100vh - 108rpx);
}

.group {
  padding: 0 24rpx 18rpx;
}

.group-head {
  padding: 8rpx 6rpx 12rpx;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14rpx;
}

.group-date {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--text);
}

.group-sum {
  font-size: 22rpx;
  color: var(--muted);
}

.list {
  background: var(--card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 18rpx;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.item:last-child {
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
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.icon::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(0, 0, 0, 0.12));
}

.icon > * {
  position: relative;
  z-index: 1;
}

.icon-text {
  font-size: 34rpx;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.name {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text);
}

.sub {
  font-size: 22rpx;
  color: var(--muted);
}

.amt {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--text);
}

.empty {
  margin: 24rpx;
  padding: 28rpx;
  background: var(--card);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.empty-title {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--text);
}

.empty-sub {
  font-size: 24rpx;
  color: var(--muted);
}

.primary {
  margin-top: 6rpx;
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}

.floating {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 30rpx;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.fab {
  pointer-events: auto;
  width: 340rpx;
  background: var(--primary);
  color: #ffffff;
  border-radius: 999rpx;
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  box-shadow: var(--shadow);
}
</style>
