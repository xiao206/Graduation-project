<template>
  <view class="page">
    <view class="card">
      <text class="title">{{ isEdit ? "编辑账单" : "新增账单" }}</text>

      <view class="amount">
        <text class="amount-prefix">¥</text>
        <input v-model="amountYuan" class="amount-input" type="digit" placeholder="0.00" placeholder-class="ph-amount" />
      </view>

      <view class="group">
        <picker :range="categoryNames" :value="categoryIndex" @change="onPickCategory">
          <view class="cell">
            <text class="cell-k">分类</text>
            <view class="cell-v">
              <text class="cell-v-text">{{ currentCategoryName }}</text>
              <uni-icons type="forward" size="16" color="var(--muted)" />
            </view>
          </view>
        </picker>

        <picker :range="memberNames" :value="payerIndex" @change="onPickPayer">
          <view class="cell">
            <text class="cell-k">付款人</text>
            <view class="cell-v">
              <text class="cell-v-text">{{ currentPayerName }}</text>
              <uni-icons type="forward" size="16" color="var(--muted)" />
            </view>
          </view>
        </picker>

        <picker mode="date" :value="dateValue" @change="onPickDate">
          <view class="cell cell-last">
            <text class="cell-k">发生日期</text>
            <view class="cell-v">
              <text class="cell-v-text">{{ dateValue }}</text>
              <uni-icons type="forward" size="16" color="var(--muted)" />
            </view>
          </view>
        </picker>
      </view>

      <view class="group">
        <view class="cell">
          <text class="cell-k">参与人</text>
          <view class="cell-v">
            <view class="mini-actions">
              <view class="mini" @click="selectAll">全选</view>
              <view class="mini" @click="selectNone">清空</view>
            </view>
          </view>
        </view>
        <checkbox-group @change="onPickParticipants">
          <view class="chips">
            <label v-for="m in members" :key="m.id" class="chip">
              <checkbox :value="m.id" :checked="participantIds.includes(m.id)" />
              <text class="chip-t">{{ m.name }}</text>
            </label>
          </view>
        </checkbox-group>
      </view>

      <view class="group">
        <view class="cell cell-last">
          <text class="cell-k">备注</text>
          <input v-model="note" class="note" placeholder="可选：例如 水费/聚餐" placeholder-class="ph" />
        </view>
      </view>
    </view>

    <view class="bottom">
      <button class="primary" @click="save">{{ isEdit ? "保存修改" : "保存" }}</button>
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
  padding: 18rpx 24rpx calc(28rpx + 120rpx + env(safe-area-inset-bottom));
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

.amount {
  margin-top: 14rpx;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18rpx 18rpx;
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}

.amount-prefix {
  font-size: 30rpx;
  color: var(--muted);
  font-weight: 900;
}

.amount-input {
  flex: 1;
  font-size: 56rpx;
  font-weight: 900;
  color: var(--text);
  height: 74rpx;
  line-height: 74rpx;
}

.ph-amount {
  color: rgba(107, 114, 128, 0.55);
}

.group {
  margin-top: 14rpx;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.cell {
  padding: 18rpx 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  border-bottom: 1px solid var(--border);
}

.cell-last {
  border-bottom: none;
}

.cell-k {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
}

.cell-v {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
}

.cell-v-text {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 900;
}

.mini-actions {
  display: flex;
  gap: 10rpx;
}

.mini {
  padding: 8rpx 12rpx;
  border-radius: 999rpx;
  background: var(--chip);
  font-size: 22rpx;
  color: var(--muted);
  font-weight: 800;
}

.chips {
  padding: 12rpx 18rpx 18rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx 14rpx;
}

.chip {
  padding: 10rpx 12rpx;
  border-radius: 999rpx;
  background: var(--chip);
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.chip-t {
  font-size: 24rpx;
  color: var(--text);
  font-weight: 800;
}

.note {
  flex: 1;
  text-align: right;
  font-size: 26rpx;
  color: var(--text);
  font-weight: 900;
}

.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14rpx 24rpx calc(14rpx + env(safe-area-inset-bottom));
  background: rgba(242, 244, 247, 0.92);
  border-top: 1px solid var(--border);
}

.primary {
  height: 90rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}

.ph {
  color: rgba(107, 114, 128, 0.7);
}
</style>
