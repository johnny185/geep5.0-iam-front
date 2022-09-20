<template>
  <div>
    <!-- 导航 -->
    <controlNav></controlNav>
    <!-- <navContent></navContent> -->
    <!-- 申诉 -->
    <div class="appealWrap">
      <el-button type="text" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
      <div class="appealContent mainCenter">
        <p class="fontSize20 blod" style="text-align:center">自助申诉</p>
        <svg-icon icon-class="read" style="width:100%;height:36px" class="marginTop20" />
        <p>申诉须知：</p>
        <ul style="margin-left:20px">
          <li>
            <p>
              审核时间为
              <span>3个工作日</span>，我们将利用这段时间审核您提交的信息。审核结果将第一时间通知您，人工无法帮助您加快审核进度。
            </p>
          </li>
          <li>
            <p>提交申诉后，请妥善保管申诉单号，以便随时查询申诉进度。</p>
          </li>
        </ul>
        <p>在经常使用的设备上发起申诉，有利于申诉成功</p>
        <div style="text-align:center" class="marginTop20">
          <el-button type="primary" @click="goTo">开始申诉</el-button>
          <br />
          <el-button type="text">查询申诉进度</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    // 返回键
    goBack() {
      this.$router.push({
        path: '/login/forget'
      });
    },
    goTo() {
      this.$router.push({
        path: '/login/appealForm'
      });
    }
  },
}
</script>

<style scoped>
.appealWrap {
  width: 100%;
  height: calc(100vh - 98px);
  background: #eff4f8;
  position: relative;
  padding-top: 10px;
}
.appealContent {
  width: 536px;
  height: auto;
  line-height: 30px;
}
ul li {
  list-style-type: disc;
  list-style-position: initial;
}
</style>