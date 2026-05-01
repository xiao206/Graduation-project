<template>
  <view class="page">
    <view class="card">
      <text class="title">结算分享</text>
      <text class="sub">{{ rangeText }}</text>
    </view>

    <view class="card">
      <view class="actions">
        <button class="ghost" @click="refresh">
          <view class="btn-inner">
            <uni-icons type="refresh" size="18" color="var(--text)" />
            <text>刷新</text>
          </view>
        </button>
        <button class="primary" @click="copy">
          <view class="btn-inner">
            <uni-icons type="paperclip" size="18" color="#ffffff" />
            <text>复制文本</text>
          </view>
        </button>
      </view>
      <view class="preview">
        <text class="preview-text" selectable>{{ text }}</text>
      </view>
    </view>

    <view class="card">
      <text class="title">说明</text>
      <text class="sub">“转账建议”按应付→应收生成一组转账指令，便于直接发群里。</text>
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
const text = ref("")

const rangeText = computed(() => {
  const s = startISO.value.slice(0, 10)
  const e = endISO.value.slice(0, 10)
  if (!s || !e) return ""
  return `${s} ~ ${e}`
})

const results = computed(() => {
  if (!startISO.value || !endISO.value) return []
  return store.settle({ startISO: startISO.value, endISO: endISO.value })
})

function buildText() {
  const s = rangeText.value
  const billsCount = store.state.data.bills.filter((b) => {
    const t = new Date(b.occurredAt).getTime()
    const ss = new Date(startISO.value).getTime()
    const ee = new Date(endISO.value).getTime()
    if (Number.isNaN(t) || Number.isNaN(ss) || Number.isNaN(ee)) return false
    return t >= ss && t <= ee
  }).length

  const receive = results.value.filter((x) => x.receiveCents > 0)
  const pay = results.value.filter((x) => x.payCents > 0)
  const transfers = store.planTransfers(results.value)

  const lines: string[] = []
  lines.push(`【宿舍AA结算】${store.state.data.settings.defaultDormName}`)
  if (s) lines.push(`范围：${s}`)
  lines.push(`账单数：${billsCount}`)
  lines.push("")

  if (receive.length) {
    lines.push("应收：")
    for (const r of receive) lines.push(`- ${r.name} 应收 ¥${formatCents(r.receiveCents)}`)
    lines.push("")
  }

  if (pay.length) {
    lines.push("应付：")
    for (const r of pay) lines.push(`- ${r.name} 应付 ¥${formatCents(r.payCents)}`)
    lines.push("")
  }

  if (!receive.length && !pay.length) lines.push("本次结算无人应收/应付（已平）")
  else if (transfers.length) {
    lines.push("")
    lines.push("转账建议：")
    for (const t of transfers) lines.push(`- ${t.fromName} → ${t.toName} ¥${formatCents(t.amountCents)}`)
  }

  return lines.join("\n")
}

function refresh() {
  text.value = buildText()
}

function copy() {
  if (!text.value) refresh()
  uni.setClipboardData({
    data: text.value,
    success() {
      uni.showToast({ title: "已复制", icon: "success" })
    },
  })
}

onLoad((q: any) => {
  startISO.value = String(q?.start || "")
  endISO.value = String(q?.end || "")
  refresh()
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
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.actions button {
  flex: 1;
}

.btn-inner {
  height: 84rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-weight: 900;
}

.primary {
  background: var(--primary);
  color: #ffffff;
  border-radius: 999rpx;
  height: 84rpx;
  box-shadow: 0 18rpx 44rpx rgba(37, 99, 235, 0.28);
}

.ghost {
  background: var(--surface);
  color: var(--text);
  border-radius: 999rpx;
  height: 84rpx;
  border: 1px solid var(--border);
}

.preview {
  width: 100%;
  min-height: 260rpx;
  padding: 14rpx 16rpx;
  background: var(--surface);
  border-radius: 18rpx;
  border: 1px solid var(--border);
}

.preview-text {
  font-size: 24rpx;
  color: var(--text);
  font-weight: 800;
  line-height: 1.8;
  white-space: pre-wrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
