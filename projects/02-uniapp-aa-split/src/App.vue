<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app"
import "@/store/useAASplitStore"

onLaunch(() => {})
</script>
<style lang="scss">
page {
  --bg: radial-gradient(1200rpx 820rpx at 10% 0%, rgba(15, 118, 110, 0.16), transparent 58%),
    radial-gradient(980rpx 720rpx at 95% 18%, rgba(245, 158, 11, 0.16), transparent 62%), #faf6ed;
  --card: rgba(255, 253, 247, 0.94);
  --text: #2b1d0e;
  --muted: #7a6756;
  --border: rgba(231, 220, 203, 0.95);
  --shadow: 0 14rpx 38rpx rgba(43, 29, 14, 0.11);
  --radius: 22rpx;
  --radius-lg: 26rpx;
  --primary: #0f766e;
  --primary-ghost: rgba(15, 118, 110, 0.13);

  background: var(--bg);
  color: var(--text);
  font-size: 28rpx;
  line-height: 1.55;
  letter-spacing: 0.2px;
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
</style>
