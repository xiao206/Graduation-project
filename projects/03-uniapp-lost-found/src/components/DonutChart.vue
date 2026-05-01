<template>
  <canvas :canvas-id="canvasId" :id="canvasId" class="canvas" />
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue"

export type DonutSegment = {
  value: number
  color: string
}

const props = defineProps<{
  canvasId: string
  segments: DonutSegment[]
  size?: number
  stroke?: number
}>()

function draw() {
  const size = props.size ?? 240
  const stroke = props.stroke ?? 18
  const total = props.segments.reduce((s, x) => s + x.value, 0)

  const ctx = uni.createCanvasContext(props.canvasId)
  ctx.clearRect(0, 0, size, size)

  ctx.setLineWidth(stroke)
  ctx.setLineCap("butt")

  const r = size / 2 - stroke / 2
  const cx = size / 2
  const cy = size / 2

  ctx.beginPath()
  ctx.setStrokeStyle("rgba(148,163,184,0.25)")
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  if (total <= 0) {
    ctx.draw()
    return
  }

  let start = -Math.PI / 2
  for (const seg of props.segments) {
    if (seg.value <= 0) continue
    const angle = (seg.value / total) * Math.PI * 2
    ctx.beginPath()
    ctx.setStrokeStyle(seg.color)
    ctx.arc(cx, cy, r, start, start + angle)
    ctx.stroke()
    start += angle
  }

  ctx.draw()
}

onMounted(() => draw())
watch(
  () => props.segments.map((s) => `${s.color}:${s.value}`).join("|"),
  () => draw(),
)
</script>

<style scoped>
.canvas {
  width: 240px;
  height: 240px;
}
</style>

