<template>
  <div>
    <!-- 导航 -->
    <navContent></navContent>
    <!-- 申诉 -->
    <div class="appealWrap">
      <div class="appealContent mainCenter">
        <div class="stepBox">
          <el-steps :active="active" finish-status="success" align-center style="width:100%;">
            <el-step v-for="item in stepData" :key="item.title" :title="item.title"></el-step>
          </el-steps>
        </div>
        <el-row>
          <el-col :span="12" :offset="6" v-if="active==0">
            <p class="marginTop20">输入登录账号</p>
            <el-input v-model="input1" placeholder="请输入手机号/邮箱地址/主体名称" class="marginTop20"></el-input>
          </el-col>
          <el-col :span="12" :offset="6" v-if="active==1">
            <p class="marginTop20">请留下您的手机号和邮箱</p>
            <el-input v-model="input2" placeholder="请输入手机号" class="marginTop20"></el-input>
            <el-input v-model="input3" placeholder="请输入邮箱" class="marginTop20"></el-input>
          </el-col>
          <el-col :span="12" :offset="6" v-if="active==2">步骤条3</el-col>
          <el-col :span="12" :offset="6" v-if="active==3">步骤条4</el-col>
          <el-col :span="12" :offset="6" v-if="active==4">步骤条5</el-col>
        </el-row>
        <div style="text-align:center" class="marginTop20">
          <el-button @click="goBack" v-if="!active">返回</el-button>
          <el-button @click="back" v-else>上一步</el-button>
          <el-button @click="next">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      stepData: [
        { title: "步骤一" },
        { title: "步骤二" },
        { title: "步骤三" },
      ],
      input1: '',
      input2: '',
      input3: '',
    }
  },
  methods: {
    // 返回键
    goBack() {
      this.$router.push({
        path: '/login/appeal'
      });
    },
    // 上一步
    back() {
      if (this.active !== 0) {
        this.active--
      }
    },
    // 下一步
    next() {
      if (this.active++ >= this.stepData.length - 1) this.active = 0;
    },
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
}
</style>