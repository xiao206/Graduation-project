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
