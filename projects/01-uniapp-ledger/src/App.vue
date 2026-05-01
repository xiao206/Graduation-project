<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app"
import "@/store/useLedgerStore"

onLaunch(() => {})
</script>
<style lang="scss">
page {
  --bg: #f7f8fa;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(226, 232, 240, 0.9);
  --shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.06);
  --radius: 18rpx;
  --radius-lg: 22rpx;
  --primary: #111827;
  --primary-ghost: rgba(15, 23, 42, 0.06);
  --tabbar: 120rpx;
  --safe-bottom: env(safe-area-inset-bottom);

  background: var(--bg);
  color: var(--text);
  font-size: 28rpx;
  line-height: 1.5;
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
