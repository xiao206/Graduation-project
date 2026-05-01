<template>
  <view class="page">
    <view class="card">
      <text class="title">使用说明</text>
      <text class="sub">这是一款纯本地的校园失物招领工具，适合演示与答辩展示。</text>
    </view>

    <view class="card">
      <text class="card-title">快速上手</text>
      <view class="steps">
        <view class="step">
          <view class="dot" />
          <text class="txt">登录或注册（体验账号：demo / 1234）</text>
        </view>
        <view class="step">
          <view class="dot" />
          <text class="txt">在“发布”页新增寻物/招领信息</text>
        </view>
        <view class="step">
          <view class="dot" />
          <text class="txt">在“信息”页搜索并查看详情</text>
        </view>
        <view class="step">
          <view class="dot" />
          <text class="txt">发布者可在详情页标记已认领/已结束</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">常见问题</text>
      <view class="faq">
        <view class="q">
          <text class="q-title">为什么要登录？</text>
          <text class="q-sub">用于区分“我的发布”，并限制只有发布者能修改状态/删除。</text>
        </view>
        <view class="q">
          <text class="q-title">数据存在哪里？</text>
          <text class="q-sub">仅保存在本机 Storage 中，卸载或清理浏览器缓存可能丢失。</text>
        </view>
        <view class="q">
          <text class="q-title">如何演示更真实？</text>
          <text class="q-sub">项目已内置模拟数据，可直接在“信息”页查看。</text>
        </view>
      </view>
    </view>

    <view class="card">
      <text class="card-title">隐私说明</text>
      <text class="sub">本项目不上传任何数据到服务器，联系方式仅用于演示（请勿填写真实隐私信息）。</text>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
  padding: 18rpx 24rpx calc(24rpx + var(--safe-bottom));
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.card {
  background: var(--card);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: var(--radius-lg);
  padding: 24rpx;
  box-shadow: var(--shadow);
}

.title {
  font-size: 32rpx;
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

.card-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 14rpx;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.step {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 999rpx;
  background: var(--primary);
  box-shadow: 0 8rpx 18rpx rgba(47, 107, 255, 0.22);
}

.txt {
  font-size: 24rpx;
  color: rgba(15, 23, 42, 0.84);
  font-weight: 800;
  line-height: 1.7;
}

.faq {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.q-title {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--text);
}

.q-sub {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--muted);
  line-height: 1.7;
}
</style>

