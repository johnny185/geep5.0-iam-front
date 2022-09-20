<template>
  <div class="inReviewWrap">
    <div class="inReviewBox fontCenter">
      <!-- 认证成功 背景图 -->
      <div class="inReviewBg mainCenter"></div>
      <p class="title1 fontSize24">审核中</p>
      <p class="title2 fontSize18">您的申请正在审核中,请稍后...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.inReviewWrap {
  width: 100%;
  height: calc(100vh - 248px);
  background: #eff4f8;
  position: relative;
}
.inReviewBox {
  width: 360px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.inReviewBg {
  width: 226px;
  height: 114px;
  background: url('/img/login/inCertifiedBg.png');
  background-size: 100%;
}
.title1 {
  margin-top: 20px;
  margin-bottom: 10px;
  height: 33px;
  line-height: 33px;
  font-weight: 400;
  color: #666666;
}
.title2 {
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: #999999;
  line-height: 25px;
}
</style>
