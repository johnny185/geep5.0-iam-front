<template>
  <el-dialog :visible.sync="dialogVisible" width="60%" :before-close="handleClose" :modal-append-to-body="false">
    <div class="agreementStyle" v-if="agreementType === 1">
      服务协议 
    </div>
    <div class="agreementStyle" v-if="agreementType === 2">
      隐私保护政策
    </div>
    <!-- <h1>{{ dealData.catalogTitle }}</h1> -->
    <!-- <div v-html="dealData.content" class="marginTop20 articleContent"></div> -->
  </el-dialog>
</template>

<script>
export default {
  props: {
    //服务协议 隐私保护政策 论坛服务协议
    // dealData: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   }
    // },
    //区分三种协议： 1服务协议2隐私保护政策3论坛协议
    agreementType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
.agreementStyle {
  text-align: center;
}
</style>
