<template>
  <view class="page">
    <view class="card">
      <text class="title">成员管理</text>
      <text class="sub">默认 6 人，可修改名称或停用成员</text>
    </view>

    <view class="card">
      <view class="actions">
        <input v-model="newName" class="new-input" placeholder="新增成员名称" placeholder-class="ph" />
        <button class="primary" size="mini" @click="add">添加</button>
      </view>
      <view class="list">
        <view v-for="m in members" :key="m.id" class="row">
          <view class="left">
            <view class="icon">
              <uni-icons type="person-filled" size="18" color="#0F172A" />
            </view>
            <view class="meta">
              <input
                :value="nameDraft[m.id] ?? m.name"
                class="name-input"
                placeholder="成员名称"
                placeholder-class="ph"
                @input="(e) => onNameInput(m.id, e)"
                @blur="() => saveName(m.id)"
              />
              <text class="row-sub">{{ m.id }}</text>
            </view>
          </view>
          <switch :checked="m.enabled" @change="(e) => onSwitch(m.id, e)" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import { useAASplitStore } from "@/store/useAASplitStore"
import { createId } from "@/utils/id"

const store = useAASplitStore()

const members = computed(() => store.state.data.members.slice())

const nameDraft = reactive<Record<string, string>>({})
const newName = ref("")

function onNameInput(id: string, e: any) {
  nameDraft[id] = String(e?.detail?.value || "")
}

function saveName(id: string) {
  const m = store.state.data.members.find((x) => x.id === id)
  if (!m) return
  const nextName = (nameDraft[id] ?? m.name).trim()
  if (!nextName) {
    nameDraft[id] = m.name
    return
  }
  if (nextName === m.name) return
  store.upsertMember({ ...m, name: nextName })
}

function onSwitch(id: string, e: any) {
  store.setMemberEnabled(id, !!e?.detail?.value)
  const enabled = store.state.data.members.filter((m) => m.enabled).map((m) => m.id)
  store.state.data.settings.defaultParticipantIds = enabled
}

function add() {
  const n = newName.value.trim()
  if (!n) return uni.showToast({ title: "请输入名称", icon: "none" })
  const now = new Date().toISOString()
  store.upsertMember({ id: createId("m"), name: n, enabled: true, createdAt: now })
  store.state.data.settings.defaultParticipantIds = store.state.data.members.filter((m) => m.enabled).map((m) => m.id)
  newName.value = ""
  uni.showToast({ title: "已添加", icon: "success" })
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

.actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.new-input {
  flex: 1;
  height: 68rpx;
  padding: 0 14rpx;
  background: var(--primary-ghost);
  border-radius: var(--radius);
  font-size: 24rpx;
  color: var(--text);
  border: 1px solid var(--border);
}

.primary {
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}

.list {
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
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--radius);
  background: var(--primary-ghost);
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.name-input {
  height: 48rpx;
  min-width: 260rpx;
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.row-sub {
  font-size: 20rpx;
  color: var(--muted);
}

.ph {
  color: #94a3b8;
}
</style>
