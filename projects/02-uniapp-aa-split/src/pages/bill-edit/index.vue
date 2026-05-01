<template>
  <view class="page">
    <view class="card">
      <text class="title">{{ isEdit ? "编辑账单" : "新增账单" }}</text>

      <view class="form">
        <view class="field">
          <text class="k">金额</text>
          <input v-model="amountYuan" class="input" type="digit" placeholder="例如 12.5" placeholder-class="ph" />
        </view>

        <view class="field">
          <text class="k">分类</text>
          <picker :range="categoryNames" :value="categoryIndex" @change="onPickCategory">
            <view class="picker">
              <text class="picker-text">{{ currentCategoryName }}</text>
              <uni-icons type="forward" size="16" color="#94A3B8" />
            </view>
          </picker>
        </view>

        <view class="field">
          <text class="k">付款人</text>
          <picker :range="memberNames" :value="payerIndex" @change="onPickPayer">
            <view class="picker">
              <text class="picker-text">{{ currentPayerName }}</text>
              <uni-icons type="forward" size="16" color="#94A3B8" />
            </view>
          </picker>
        </view>

        <view class="field">
          <text class="k">参与人</text>
          <view class="participants">
            <view class="actions">
              <button class="ghost" size="mini" @click="selectAll">全选</button>
              <button class="ghost" size="mini" @click="selectNone">清空</button>
            </view>
            <checkbox-group @change="onPickParticipants">
              <view class="grid">
                <label v-for="m in members" :key="m.id" class="check">
                  <checkbox :value="m.id" :checked="participantIds.includes(m.id)" />
                  <text class="check-text">{{ m.name }}</text>
                </label>
              </view>
            </checkbox-group>
          </view>
        </view>

        <view class="field">
          <text class="k">发生日期</text>
          <picker mode="date" :value="dateValue" @change="onPickDate">
            <view class="picker">
              <text class="picker-text">{{ dateValue }}</text>
              <uni-icons type="forward" size="16" color="#94A3B8" />
            </view>
          </picker>
        </view>

        <view class="field">
          <text class="k">备注</text>
          <input v-model="note" class="input" placeholder="可选：例如 水费/聚餐" placeholder-class="ph" />
        </view>

        <view class="btns">
          <button class="primary" @click="save">{{ isEdit ? "保存修改" : "保存" }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useAASplitStore } from "@/store/useAASplitStore"

const store = useAASplitStore()

const id = ref("")
const isEdit = computed(() => !!id.value)

const amountYuan = ref("")
const categoryId = ref("")
const payerId = ref("")
const participantIds = ref<string[]>([])
const dateValue = ref(new Date().toISOString().slice(0, 10))
const note = ref("")

const categories = computed(() => store.categoriesEnabled.value)
const members = computed(() => store.membersEnabled.value)

const categoryNames = computed(() => categories.value.map((c) => c.name))
const memberNames = computed(() => members.value.map((m) => m.name))

const categoryIndex = computed(() => Math.max(0, categories.value.findIndex((c) => c.id === categoryId.value)))
const payerIndex = computed(() => Math.max(0, members.value.findIndex((m) => m.id === payerId.value)))

const currentCategoryName = computed(() => categories.value[categoryIndex.value]?.name || "请选择")
const currentPayerName = computed(() => members.value[payerIndex.value]?.name || "请选择")

function onPickCategory(e: any) {
  const i = Number(e?.detail?.value || 0)
  categoryId.value = categories.value[i]?.id || ""
}

function onPickPayer(e: any) {
  const i = Number(e?.detail?.value || 0)
  payerId.value = members.value[i]?.id || ""
}

function onPickParticipants(e: any) {
  const arr = Array.isArray(e?.detail?.value) ? e.detail.value.map(String) : []
  participantIds.value = arr
}

function onPickDate(e: any) {
  dateValue.value = String(e?.detail?.value || dateValue.value)
}

function selectAll() {
  participantIds.value = members.value.map((m) => m.id)
}

function selectNone() {
  participantIds.value = []
}

function toCents(input: string) {
  const s = input.trim()
  if (!s) return 0
  const n = Number(s)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100)
}

function toISODate(d: string) {
  return new Date(`${d}T00:00:00`).toISOString()
}

function save() {
  const amountCents = toCents(amountYuan.value)
  if (!amountCents) return uni.showToast({ title: "请输入金额", icon: "none" })
  if (!categoryId.value) return uni.showToast({ title: "请选择分类", icon: "none" })
  if (!payerId.value) return uni.showToast({ title: "请选择付款人", icon: "none" })
  if (!participantIds.value.length) return uni.showToast({ title: "请选择参与人", icon: "none" })

  const payload = {
    amountCents,
    payerId: payerId.value,
    participantIds: participantIds.value,
    categoryId: categoryId.value,
    occurredAt: toISODate(dateValue.value),
    note: note.value.trim() || undefined,
  }

  if (isEdit.value) {
    const ok = store.updateBill(id.value, payload)
    if (!ok) return uni.showToast({ title: "保存失败", icon: "none" })
    uni.showToast({ title: "已保存", icon: "success" })
    setTimeout(() => uni.navigateBack(), 300)
    return
  }

  const newId = store.createBill(payload)
  if (!newId) return uni.showToast({ title: "保存失败", icon: "none" })
  uni.showToast({ title: "已保存", icon: "success" })
  setTimeout(() => uni.navigateBack(), 300)
}

onLoad((q: any) => {
  id.value = String(q?.id || "")
  if (!categoryId.value) categoryId.value = categories.value[0]?.id || ""
  if (!payerId.value) payerId.value = members.value[0]?.id || ""
  if (!participantIds.value.length) participantIds.value = store.state.data.settings.defaultParticipantIds.slice()

  if (!id.value) return
  const b = store.getBillById(id.value)
  if (!b) return
  amountYuan.value = (b.amountCents / 100).toFixed(2).replace(/\.00$/, "")
  categoryId.value = b.categoryId
  payerId.value = b.payerId
  participantIds.value = b.participantIds.slice()
  dateValue.value = String(b.occurredAt || "").slice(0, 10) || dateValue.value
  note.value = b.note || ""
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

.field {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.k {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
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

.picker {
  height: 76rpx;
  padding: 0 16rpx;
  background: var(--primary-ghost);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  border: 1px solid var(--border);
}

.picker-text {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 800;
}

.participants {
  padding: 14rpx 16rpx;
  background: var(--primary-ghost);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.actions {
  display: flex;
  gap: 12rpx;
  margin-bottom: 10rpx;
}

.ghost {
  background: var(--card);
  color: var(--text);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx 20rpx;
}

.check {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.check-text {
  font-size: 24rpx;
  color: var(--text);
  font-weight: 800;
}

.btns {
  margin-top: 10rpx;
}

.primary {
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
  height: 84rpx;
  font-weight: 900;
}

.ph {
  color: #94a3b8;
}
</style>

