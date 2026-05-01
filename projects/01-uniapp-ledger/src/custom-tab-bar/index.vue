<template>
  <view class="wrap" :style="{ paddingBottom: safeBottom + 'px' }">
    <view class="bar">
      <view v-for="item in items" :key="item.pagePath" class="item" @click="onTap(item.pagePath)">
        <view class="icon" :class="selectedPath === item.pagePath ? 'icon-active' : ''">
          <uni-icons :type="selectedPath === item.pagePath ? item.iconActive : item.icon" size="22" :color="selectedPath === item.pagePath ? '#111827' : '#64748B'" />
        </view>
        <text class="text" :class="selectedPath === item.pagePath ? 'text-active' : ''">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { onShow } from "@dcloudio/uni-app"

type TabItem = {
  pagePath: string
  text: string
  icon: string
  iconActive: string
}

const items: TabItem[] = [
  { pagePath: "pages/home/index", text: "首页", icon: "home", iconActive: "home-filled" },
  { pagePath: "pages/bills/index", text: "账单", icon: "list", iconActive: "list" },
  { pagePath: "pages/add/index", text: "记账", icon: "compose", iconActive: "compose" },
  { pagePath: "pages/stats/index", text: "统计", icon: "staff", iconActive: "staff-filled" },
  { pagePath: "pages/settings/index", text: "设置", icon: "gear", iconActive: "gear-filled" },
]

const selectedPath = ref(items[0].pagePath)

const safeBottom = computed(() => {
  try {
    const sys = uni.getSystemInfoSync()
    return sys.safeAreaInsets?.bottom ?? 0
  } catch {
    return 0
  }
})

function updateSelected() {
  const pages = getCurrentPages()
  const last = pages[pages.length - 1] as any
  const route = String(last?.route || "")
  if (!route) return
  selectedPath.value = route
}

function onTap(pagePath: string) {
  if (selectedPath.value === pagePath) return
  uni.switchTab({
    url: "/" + pagePath,
    success() {
      setTimeout(() => updateSelected(), 50)
    },
  })
}

onShow(() => updateSelected())
</script>

<style scoped>
.wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.bar {
  height: 56px;
  padding: 6px 10px 8px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item {
  flex: 1;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.icon {
  width: 34px;
  height: 30px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-active {
  background: rgba(17, 24, 39, 0.06);
}

.text {
  font-size: 11px;
  color: #64748b;
  line-height: 14px;
}

.text-active {
  color: #111827;
  font-weight: 700;
}
</style>

