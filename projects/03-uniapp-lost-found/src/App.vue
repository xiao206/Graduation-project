<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app"
import "@/store/useLostFoundStore"

onLaunch(() => {})
</script>
<style lang="scss">
page {
  --bg: #f2f4f7;
  --card: #ffffff;
  --text: #111827;
  --muted: #6b7280;
  --border: rgba(17, 24, 39, 0.08);
  --shadow: 0 10rpx 30rpx rgba(17, 24, 39, 0.08);
  --radius: 20rpx;
  --radius-lg: 28rpx;
  --primary: #2563eb;
  --primary-ghost: rgba(37, 99, 235, 0.12);
  --danger: #ef4444;
  --success: #16a34a;
  --surface: #f8fafc;
  --chip: rgba(17, 24, 39, 0.06);
  --focus: rgba(37, 99, 235, 0.22);
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

input,
textarea {
  caret-color: var(--primary);
}
</style>
