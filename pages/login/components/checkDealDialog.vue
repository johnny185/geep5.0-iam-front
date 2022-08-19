<template>
  <el-dialog :visible.sync="dialogVisible" width="60%" :before-close="handleClose" :modal-append-to-body="false">
    <!-- <h1>{{ dealData.catalogTitle }}</h1> -->
    <div v-html="dealData.content" class="marginTop20 articleContent"></div>
    <!-- 论坛服务协议需要确认按钮 -->
    <div style="text-align: center; margin: 10px 0">
      <el-button
        v-if="agreementType === 3 && isShowAgreement"
        size="small"
        type="primary"
        class="btn fontSize18"
        @click="agreement"
      >
        同意
      </el-button>
      <el-button v-if="agreementType === 3 && !isShowAgreement" size="small" type="plain" class="btn fontSize18">
        {{ countdown }}s后同意
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    //服务协议 隐私保护政策 论坛服务协议
    dealData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    //区分三种协议： 1服务协议2隐私保护政策3论坛协议
    agreementType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      countdown: 10, //倒计时10
      isShowAgreement: false
    };
  },
  methods: {
    handleClose() {
      //console.log('countDown',this.countdown);
      this.dialogVisible = false;
      clearInterval(this.timer);
      this.countdown = 10;
    },
    agreement() {
      this.$emit('agreement');
    },
    // 同意协议的倒计时方法
    countDown() {
      this.timer = setInterval(() => {
        // console.log(this.countdown)
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(this.timer);
          this.countdown = 10;
          this.isShowAgreement = true;
        }
      }, 1000);
    }
  }
};
</script>

<style scoped></style>
