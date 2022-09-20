<template>
  <div class="registerSuccessfulWrap">
    <div class="registerBox fontCenter">
      <!-- 注册成功背景图 -->
      <div class="registerSuccessfulBg mainCenter"></div>
      <p class="title1 fontSize24">注册成功</p>
      <p class="title2 fontSize18">赶紧去认证吧</p>
      <div class="registerSuccessfulBottom">
        <div class="bottomItem reset" @click="reset">取消</div>
        <div class="bottomItem toCertified" @click="toCertified">去认证</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 取消跳转到 登录
    reset() {
      this.$router.push({
        path: '/'
      });
    },
    // 去认证 页面
    toCertified() {
      this.$router.push({
        path: '/login'
      });
    }
  }
};
</script>

<style scoped>
.registerSuccessfulWrap {
  width: 100%;
  height: calc(100vh - 248px);
  background: #eff4f8;
  position: relative;
}
.registerBox {
  width: 360px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.registerSuccessfulBg {
  width: 226px;
  height: 114px;
  background: url('/img/login/registerSuccessfulBg.png');
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
.registerSuccessfulBottom {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.reset {
  width: 166px;
  height: 40px;
  line-height: 40px;
  background: #fafdff;
  border-radius: 4px;
  color: #cccccc;
  border: 1px solid #cccccc;
  cursor: pointer;
}
.toCertified {
  width: 166px;
  height: 40px;
  line-height: 40px;
  background: #fafdff;
  border-radius: 4px;
  color: #2f74ff;
  border: 1px solid #2f74ff;
  cursor: pointer;
}
</style>
