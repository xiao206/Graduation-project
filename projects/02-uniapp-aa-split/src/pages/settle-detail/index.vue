<template>
  <view class="page">
    <view class="card">
      <text class="title">结算结果</text>
      <text class="sub">{{ rangeText }}</text>
    </view>

    <view v-if="results.length === 0" class="card">
      <text class="title">暂无数据</text>
      <text class="sub">所选范围内没有可结算的账单</text>
    </view>

    <view v-else class="card">
      <view class="list">
        <view v-for="r in results" :key="r.memberId" class="row">
          <view class="left">
            <text class="name">{{ r.name }}</text>
            <text class="meta">已付 ¥{{ formatCents(r.paidCents) }} · 应摊 ¥{{ formatCents(r.shareCents) }}</text>
          </view>
          <view class="right">
            <text class="net" :class="r.netCents >= 0 ? 'pos' : 'neg'">
              {{ r.netCents >= 0 ? "应收" : "应付" }} ¥{{ formatCents(Math.abs(r.netCents)) }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useAASplitStore } from "@/store/useAASplitStore"
import { formatCents } from "@/utils/money"

const store = useAASplitStore()

const startISO = ref("")
const endISO = ref("")

const results = computed(() => {
  if (!startISO.value || !endISO.value) return []
  return store.settle({ startISO: startISO.value, endISO: endISO.value })
})

const rangeText = computed(() => {
  const s = startISO.value.slice(0, 10)
  const e = endISO.value.slice(0, 10)
  if (!s || !e) return ""
  return `${s} ~ ${e}`
})

onLoad((q: any) => {
  startISO.value = String(q?.start || "")
  endISO.value = String(q?.end || "")
})
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
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--muted);
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
  gap: 14rpx;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.row:last-child {
  border-bottom: none;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.name {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.meta {
  font-size: 22rpx;
  color: var(--muted);
}

.net {
  font-size: 24rpx;
  font-weight: 900;
}

.pos {
  color: #16a34a;
}

.neg {
  color: #ef4444;
}
</style>

