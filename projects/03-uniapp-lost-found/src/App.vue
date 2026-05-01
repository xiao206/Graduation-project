<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app"
import "@/store/useLostFoundStore"

onLaunch(() => {})
</script>
<style lang="scss">
page {
  --bg: #f5f6fa;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(15, 23, 42, 0.08);
  --border-soft: rgba(15, 23, 42, 0.06);
  --shadow-sm: 0 8rpx 18rpx rgba(15, 23, 42, 0.06);
  --shadow: 0 16rpx 44rpx rgba(15, 23, 42, 0.08);
  --radius: 18rpx;
  --radius-lg: 26rpx;
  --primary: #2f6bff;
  --primary-ghost: rgba(47, 107, 255, 0.12);
  --danger: #ef4444;
  --success: #16a34a;
  --surface: #f8fafc;
  --chip: rgba(15, 23, 42, 0.05);
  --focus: rgba(47, 107, 255, 0.22);
  --tabbar: 120rpx;
  --safe-bottom: env(safe-area-inset-bottom);
  --pad: 24rpx;
  --gap: 14rpx;
  --btn-h: 88rpx;
  --input-h: 80rpx;

  background: var(--bg);
  color: var(--text);
  font-size: 28rpx;
  line-height: 1.5;
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
}

view,
text,
button,
input,
textarea {
  box-sizing: border-box;
}

button {
  border-radius: var(--radius);
}

button::after {
  border: none;
}

input,
textarea {
  caret-color: var(--primary);
}

.ui-card {
  background: var(--card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.ui-title {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--text);
}

.ui-sub {
  font-size: 24rpx;
  color: var(--muted);
}

.ui-btn-primary {
  height: 90rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(47, 107, 255, 0.28);
}

.ui-btn-ghost {
  height: 90rpx;
  border-radius: 999rpx;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  font-weight: 900;
}

.wx-group {
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.wx-cell {
  padding: 18rpx 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  border-bottom: 1px solid var(--border-soft);
}

.wx-cell:last-child {
  border-bottom: none;
}

.wx-cell-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.wx-cell-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  background: rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wx-cell-meta {
  display: flex;
  flex-direction: column;
}

.wx-cell-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
}

.wx-cell-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--muted);
}

.wx-input {
  height: var(--input-h);
  padding: 0 16rpx;
  background: var(--surface);
  border-radius: 18rpx;
  border: 1px solid var(--border-soft);
  font-size: 26rpx;
  color: var(--text);
}

.wx-textarea {
  min-height: 160rpx;
  padding: 16rpx 16rpx;
  background: var(--surface);
  border-radius: 18rpx;
  border: 1px solid var(--border-soft);
  font-size: 26rpx;
  color: var(--text);
}

.wx-btn-primary {
  height: var(--btn-h);
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 18rpx 44rpx rgba(47, 107, 255, 0.22);
}

.wx-btn-ghost {
  height: var(--btn-h);
  border-radius: 999rpx;
  background: var(--surface);
  color: var(--text);
  border: 1px solid rgba(15, 23, 42, 0.08);
  font-weight: 900;
}

.wx-btn-danger {
  height: var(--btn-h);
  border-radius: 999rpx;
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.22);
  font-weight: 900;
}

.wx-seg {
  background: var(--chip);
  border: 1px solid var(--border-soft);
  border-radius: 999rpx;
  display: flex;
  padding: 6rpx;
}

.wx-seg-item {
  flex: 1;
  height: 72rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wx-seg-item-active {
  background: var(--card);
  box-shadow: var(--shadow-sm);
}

.wx-seg-text {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
}

@media screen and (min-width: 520px) {
  body {
    background: #e9eef7;
  }

  #app {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 24px 0;
  }

  uni-app {
    width: 430px;
    max-width: 92vw;
    min-height: calc(100vh - 48px);
    background: var(--bg);
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.16);
  }
}
</style>
