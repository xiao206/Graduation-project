<template>
  <view class="page">
    <view class="card">
      <text class="title">新增账户</text>
      <view class="form">
        <input v-model="name" class="input" placeholder="账户名称（例如 现金/银行卡）" placeholder-class="ph" />
        <picker mode="selector" :range="typeNames" :value="typeIndex" @change="onPickType">
          <view class="picker">
            <text class="picker-text">类型：{{ typeName }}</text>
          </view>
        </picker>
        <button class="primary" size="mini" @click="add">添加</button>
      </view>
    </view>

    <view class="card">
      <text class="title">现有账户</text>
      <view class="list">
        <view v-for="a in list" :key="a.id" class="row">
          <view class="left">
            <view class="meta">
              <text class="row-name">{{ a.name }}</text>
              <text class="row-sub">{{ a.type }} · ¥{{ formatCents(a.balanceCents) }}</text>
            </view>
          </view>
          <switch :checked="a.enabled" @change="(e) => onSwitch(a.id, e)" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { Account } from "@/domain/types"
import { useLedgerStore } from "@/store/useLedgerStore"
import { createId } from "@/utils/id"
import { formatCents } from "@/utils/money"

const store = useLedgerStore()

const list = computed(() => store.state.data.accounts.slice().sort((a, b) => a.order - b.order))

const name = ref("")
const types: Account["type"][] = ["cash", "bank", "ecard", "other"]
const typeNames = ["现金", "银行卡", "电子账户", "其他"]
const typeValue = ref<Account["type"]>("cash")

const typeIndex = computed(() => Math.max(0, types.indexOf(typeValue.value)))
const typeName = computed(() => typeNames[typeIndex.value] || "现金")

function onPickType(e: any) {
  const idx = Number(e?.detail?.value ?? 0)
  typeValue.value = types[idx] || "cash"
}

function add() {
  const n = name.value.trim()
  if (!n) return uni.showToast({ title: "请输入名称", icon: "none" })
  const maxOrder = list.value.reduce((m, x) => Math.max(m, x.order), 0)
  const a: Account = {
    id: createId("acc"),
    name: n,
    type: typeValue.value,
    balanceCents: 0,
    order: maxOrder + 10,
    enabled: true,
  }
  store.upsertAccount(a)
  name.value = ""
  typeValue.value = "cash"
  uni.showToast({ title: "已添加", icon: "success" })
}

function toggle(id: string, enabled: boolean) {
  store.setAccountEnabled(id, enabled)
}

function onSwitch(id: string, e: any) {
  toggle(id, !!e?.detail?.value)
}
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

.form {
  margin-top: 14rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.input {
  height: 76rpx;
  padding: 0 16rpx;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 18rpx;
  font-size: 26rpx;
  color: #0f172a;
}

.ph {
  color: #94a3b8;
}

.picker {
  height: 76rpx;
  padding: 0 16rpx;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 18rpx;
  display: flex;
  align-items: center;
}

.picker-text {
  font-size: 26rpx;
  color: #0f172a;
  font-weight: 800;
}

.primary {
  background: #111827;
  color: #ffffff;
  border-radius: 16rpx;
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

.meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.row-name {
  font-size: 28rpx;
  font-weight: 800;
  color: #0f172a;
}

.row-sub {
  font-size: 22rpx;
  color: #64748b;
}
</style>
