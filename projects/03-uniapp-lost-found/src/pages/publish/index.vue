<template>
  <view class="page">
    <view v-if="!isLoggedIn" class="gate">
      <text class="gate-title">先登录再发布</text>
      <text class="gate-sub">发布信息需要账号，用于管理你发布的内容</text>
      <view class="gate-actions">
        <button class="wx-btn-ghost" @click="goLogin">去登录</button>
        <button class="wx-btn-primary" @click="goRegister">去注册</button>
      </view>
    </view>

    <view v-else class="card">
      <text class="title">发布信息</text>

      <view class="type-toggle">
        <view class="seg" :class="type === 'lost' ? 'seg-active' : ''" @click="type = 'lost'">
          <text class="seg-text">寻物</text>
        </view>
        <view class="seg" :class="type === 'found' ? 'seg-active' : ''" @click="type = 'found'">
          <text class="seg-text">招领</text>
        </view>
      </view>

      <view class="block">
        <text class="k">标题</text>
        <input v-model="title" class="wx-input" placeholder="例如：丢失校园卡 / 捡到钥匙串" placeholder-class="ph" />
      </view>

      <view class="block">
        <text class="k">分类</text>
        <picker mode="selector" :range="categoryNames" :value="categoryIndex" @change="onPickCategory">
          <view class="picker">
            <text class="picker-text">{{ categoryName }}</text>
            <uni-icons type="forward" size="16" color="#94A3B8" />
          </view>
        </picker>
      </view>

      <view class="block">
        <text class="k">地点</text>
        <input v-model="location" class="wx-input" placeholder="例如：一食堂 / 图书馆 / 操场" placeholder-class="ph" />
      </view>

      <view class="block">
        <text class="k">日期</text>
        <picker mode="date" :value="dateKey" @change="onPickDate">
          <view class="picker">
            <text class="picker-text">{{ dateKey }}</text>
            <uni-icons type="forward" size="16" color="#94A3B8" />
          </view>
        </picker>
      </view>

      <view class="block">
        <text class="k">联系方式</text>
        <input v-model="contact" class="wx-input" placeholder="微信/QQ/手机号（可选）" placeholder-class="ph" />
      </view>

      <view class="block">
        <text class="k">描述</text>
        <textarea v-model="description" class="wx-textarea" placeholder="补充特征、颜色、备注（可选）" placeholder-class="ph" />
      </view>

      <button class="wx-btn-primary" @click="save">
        <view class="btn-inner">
          <uni-icons type="paperplane-filled" size="18" color="#ffffff" />
          <text>发布</text>
        </view>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onShow } from "@dcloudio/uni-app"
import type { LFItemType } from "@/domain/types"
import { useLostFoundStore } from "@/store/useLostFoundStore"

const store = useLostFoundStore()
const isLoggedIn = computed(() => store.isLoggedIn.value)

const type = ref<LFItemType>("lost")
const title = ref("")
const location = ref("")
const dateKey = ref(new Date().toISOString().slice(0, 10))
const contact = ref("")
const description = ref("")

const categories = computed(() => store.categoriesEnabled.value)
const categoryId = ref(categories.value[0]?.id || "other")
const categoryNames = computed(() => categories.value.map((c) => c.name))
const categoryIndex = computed(() => Math.max(0, categories.value.findIndex((c) => c.id === categoryId.value)))
const categoryName = computed(() => categories.value.find((c) => c.id === categoryId.value)?.name || "其他")

function onPickCategory(e: any) {
  const idx = Number(e?.detail?.value ?? 0)
  categoryId.value = categories.value[idx]?.id || categoryId.value
}

function onPickDate(e: any) {
  const v = String(e?.detail?.value || "")
  if (v) dateKey.value = v
}

function goLogin() {
  uni.navigateTo({ url: "/pages/login/index" })
}

function goRegister() {
  uni.navigateTo({ url: "/pages/register/index" })
}

function clearForm() {
  type.value = "lost"
  title.value = ""
  location.value = ""
  dateKey.value = new Date().toISOString().slice(0, 10)
  contact.value = ""
  description.value = ""
  categoryId.value = categories.value[0]?.id || "other"
}

function save() {
  const t = title.value.trim()
  if (!t) return uni.showToast({ title: "请输入标题", icon: "none" })
  if (!categoryId.value) return uni.showToast({ title: "请选择分类", icon: "none" })

  const id = store.createItem({
    type: type.value,
    title: t,
    categoryId: categoryId.value,
    location: location.value,
    occurredAt: `${dateKey.value}T12:00:00.000Z`,
    contact: contact.value,
    description: description.value,
  })
  if (!id) return uni.showToast({ title: "发布失败", icon: "none" })
  uni.showToast({ title: "已发布", icon: "success" })
  clearForm()
  uni.navigateTo({ url: `/pages/item-detail/index?id=${encodeURIComponent(id)}` })
}

onShow(() => {})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx calc(24rpx + var(--tabbar) + var(--safe-bottom));
}

.gate {
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.gate-title {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--text);
}

.gate-sub {
  font-size: 24rpx;
  color: var(--muted);
}

.gate-actions {
  margin-top: 6rpx;
  display: flex;
  gap: 12rpx;
}

.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
}

.title {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--text);
}

.type-toggle {
  margin-top: 14rpx;
  background: var(--chip);
  border: 1px solid var(--border-soft);
  border-radius: 999rpx;
  display: flex;
  padding: 6rpx;
}

.seg {
  flex: 1;
  height: 72rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seg-active {
  background: var(--card);
  box-shadow: var(--shadow-sm);
}

.seg-text {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.block {
  margin-top: 14rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.k {
  font-size: 24rpx;
  color: var(--muted);
  font-weight: 800;
}

.ph {
  color: rgba(100, 116, 139, 0.78);
}

.picker {
  height: var(--input-h);
  padding: 0 16rpx;
  background: var(--surface);
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  border: 1px solid var(--border-soft);
}

.picker-text {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 800;
}

.btn-inner {
  height: var(--btn-h);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 30rpx;
}
</style>
