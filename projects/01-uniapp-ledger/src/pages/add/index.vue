<template>
  <view class="page">
    <view class="top">
      <view class="type-toggle">
        <view class="seg" :class="type === 'expense' ? 'active-exp' : ''" @click="setType('expense')">
          <text class="seg-text">支出</text>
        </view>
        <view class="seg" :class="type === 'income' ? 'active-inc' : ''" @click="setType('income')">
          <text class="seg-text">收入</text>
        </view>
      </view>

      <view class="amount-card">
        <text class="amount-label">{{ mode === 'edit' ? '编辑金额' : '金额' }}</text>
        <view class="amount-row">
          <text class="currency">¥</text>
          <text class="amount">{{ amountInput || "0" }}</text>
        </view>
        <view class="meta-row">
          <picker mode="selector" :range="accountNames" :value="accountIndex" @change="onPickAccount">
            <view class="meta-pill">
              <text class="meta-text">{{ accountName }}</text>
            </view>
          </picker>
          <picker mode="date" :value="dateKey" @change="onPickDate">
            <view class="meta-pill">
              <text class="meta-text">{{ dateKey }}</text>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">分类</text>
      <view class="cat-grid">
        <view
          v-for="c in categories"
          :key="c.id"
          class="cat"
          :class="categoryId === c.id ? 'cat-active' : ''"
          @click="categoryId = c.id"
        >
          <view class="cat-icon" :style="{ backgroundColor: c.color || '#E5E7EB' }">
            <uni-icons :type="c.icon || 'more-filled'" size="22" color="#FFFFFF" />
          </view>
          <text class="cat-name">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">备注</text>
      <input v-model="note" class="note" placeholder="可选：例如 午饭/地铁/工资" placeholder-class="ph" />
    </view>

    <view class="kbd">
      <view class="kbd-grid">
        <view v-for="k in keys" :key="k" class="key" :class="kClass(k)" @click="press(k)">
          <text class="key-text">{{ kLabel(k) }}</text>
        </view>
      </view>
      <view class="actions">
        <button v-if="mode === 'edit'" class="ghost" @click="cancelEdit">取消编辑</button>
        <button class="primary" @click="save">{{ mode === 'edit' ? '更新' : '保存' }}</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onShow, onLoad } from "@dcloudio/uni-app"
import type { TxnType } from "@/domain/types"
import { useLedgerStore } from "@/store/useLedgerStore"
import { toDateKey } from "@/utils/date"
import { normalizeMoneyInput, parseMoneyToCents } from "@/utils/money"

const store = useLedgerStore()
const PENDING_EDIT_KEY = "gp:pendingEditTxnId"

const mode = ref<"create" | "edit">("create")
const editingId = ref<string>("")

const type = ref<TxnType>("expense")
const amountInput = ref("")
const categoryId = ref("")
const dateKey = ref(toDateKey(new Date()))
const note = ref("")

const accounts = computed(() => store.accountsEnabled.value)
const accountId = ref(accounts.value[0]?.id || store.state.data.settings.defaultAccountId || "")

const categories = computed(() => (type.value === "income" ? store.categoriesByType.value.income : store.categoriesByType.value.expense))

const accountNames = computed(() => accounts.value.map((a) => a.name))
const accountIndex = computed(() => Math.max(0, accounts.value.findIndex((a) => a.id === accountId.value)))
const accountName = computed(() => accounts.value.find((a) => a.id === accountId.value)?.name || "账户")

const keys = ["7", "8", "9", "del", "4", "5", "6", "clear", "1", "2", "3", ".", "0", "00", "ok"]

function kLabel(k: string) {
  if (k === "del") return "⌫"
  if (k === "clear") return "清空"
  if (k === "ok") return "完成"
  return k
}

function kClass(k: string) {
  if (k === "ok") return "key-ok"
  if (k === "del" || k === "clear") return "key-fn"
  return ""
}

function press(k: string) {
  if (k === "ok") return save()
  if (k === "del") {
    amountInput.value = amountInput.value.slice(0, -1)
    return
  }
  if (k === "clear") {
    amountInput.value = ""
    return
  }
  const next = normalizeMoneyInput(amountInput.value + k)
  amountInput.value = next
}

function setType(t: TxnType) {
  if (t === "transfer") return
  type.value = t
  if (!categories.value.some((c) => c.id === categoryId.value)) categoryId.value = ""
}

function onPickAccount(e: any) {
  const idx = Number(e?.detail?.value ?? 0)
  accountId.value = accounts.value[idx]?.id || accountId.value
}

function onPickDate(e: any) {
  const v = String(e?.detail?.value || "")
  if (v) dateKey.value = v
}

function dateKeyToISO(k: string) {
  const [y, m, d] = k.split("-").map((x) => Number.parseInt(x, 10))
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0)
  return dt.toISOString()
}

function clearForm() {
  mode.value = "create"
  editingId.value = ""
  type.value = "expense"
  amountInput.value = ""
  categoryId.value = ""
  dateKey.value = toDateKey(new Date())
  note.value = ""
  accountId.value = accounts.value[0]?.id || store.state.data.settings.defaultAccountId || ""
}

function loadForEdit(id: string) {
  const t = store.getTxnById(id)
  if (!t) return false
  mode.value = "edit"
  editingId.value = t.id
  type.value = t.type === "income" ? "income" : "expense"
  amountInput.value = normalizeMoneyInput(String(t.amountCents / 100))
  categoryId.value = t.categoryId
  accountId.value = t.accountId
  dateKey.value = toDateKey(new Date(t.occurredAt))
  note.value = t.note || ""
  return true
}

function cancelEdit() {
  uni.removeStorageSync(PENDING_EDIT_KEY)
  clearForm()
  uni.showToast({ title: "已取消", icon: "none" })
}

function save() {
  const cents = parseMoneyToCents(amountInput.value)
  if (cents <= 0) return uni.showToast({ title: "请输入金额", icon: "none" })
  if (!categoryId.value) return uni.showToast({ title: "请选择分类", icon: "none" })
  if (!accountId.value) return uni.showToast({ title: "请选择账户", icon: "none" })

  const payload: {
    type: TxnType
    amountCents: number
    categoryId: string
    accountId: string
    occurredAt: string
    note?: string
  } = {
    type: type.value === "income" ? "income" : "expense",
    amountCents: cents,
    categoryId: categoryId.value,
    accountId: accountId.value,
    occurredAt: dateKeyToISO(dateKey.value),
    note: note.value.trim() || undefined,
  }

  if (mode.value === "edit" && editingId.value) {
    const ok = store.updateTransaction(editingId.value, payload)
    if (!ok) return uni.showToast({ title: "更新失败", icon: "none" })
    uni.removeStorageSync(PENDING_EDIT_KEY)
    uni.showToast({ title: "已更新", icon: "success" })
    clearForm()
    uni.switchTab({ url: "/pages/bills/index" })
    return
  }

  store.createTransaction(payload)
  uni.showToast({ title: "已保存", icon: "success" })
  clearForm()
  uni.switchTab({ url: "/pages/home/index" })
}

onLoad((q: any) => {
  const id = String(q?.id || "")
  if (id) loadForEdit(id)
})

onShow(() => {
  const id = String(uni.getStorageSync(PENDING_EDIT_KEY) || "")
  if (id) loadForEdit(id)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 24rpx;
}

.top {
  padding: 20rpx 24rpx 12rpx;
}

.type-toggle {
  background: var(--card);
  border-radius: 999rpx;
  display: flex;
  padding: 6rpx;
  border: 1px solid var(--border);
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

.amount-card {
  margin-top: 14rpx;
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 18rpx;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.amount-label {
  font-size: 22rpx;
  color: var(--muted);
}

.amount-row {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  margin-top: 10rpx;
}

.currency {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--text);
}

.amount {
  font-size: 54rpx;
  font-weight: 900;
  color: var(--text);
}

.meta-row {
  margin-top: 14rpx;
  display: flex;
  gap: 12rpx;
}

.meta-pill {
  padding: 10rpx 14rpx;
  border-radius: 16rpx;
  background: var(--primary-ghost);
}

.meta-text {
  font-size: 24rpx;
  color: var(--text);
}

.section {
  padding: 12rpx 24rpx;
}

.section-title {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--text);
}

.cat-grid {
  margin-top: 12rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.cat {
  background: var(--card);
  border-radius: 20rpx;
  padding: 14rpx 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  border: 1px solid var(--border);
}

.cat-active {
  border-color: rgba(17, 24, 39, 0.5);
  box-shadow: var(--shadow);
}

.cat-icon {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-icon-text {
  font-size: 34rpx;
}

.cat-name {
  font-size: 22rpx;
  color: var(--text);
  font-weight: 700;
}

.note {
  margin-top: 12rpx;
  height: 76rpx;
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

.kbd {
  padding: 12rpx 24rpx;
}

.kbd-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.key {
  height: 86rpx;
  border-radius: var(--radius);
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
}

.key-fn {
  background: var(--primary-ghost);
}

.key-ok {
  grid-column: span 4;
  height: 94rpx;
  background: var(--primary);
  border: none;
  box-shadow: var(--shadow);
}

.key-text {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--text);
}

.key-ok .key-text {
  color: #ffffff;
}

.actions {
  margin-top: 12rpx;
  display: flex;
  gap: 12rpx;
}

.ghost {
  flex: 1;
  background: var(--card);
  border-radius: var(--radius);
  color: var(--text);
  border: 1px solid var(--border);
}

.primary {
  flex: 1;
  background: var(--primary);
  color: #ffffff;
  border-radius: var(--radius);
}
</style>
