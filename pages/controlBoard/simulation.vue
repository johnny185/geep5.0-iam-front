<template>
  <!-- 仿真测验 -->
  <client-only>
    <div class="wrap">
      <div style="display: flex;">
        <el-button type="text" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
        <p style=" line-height: 40px; text-align: center;margin-left:20px">仿真测验</p>
      </div>

      <el-row :gutter="10">
        <!-- 控制区 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <testControl ref="testControl" @getCarStatus="getCarStatus" @handleEnd="handleEnd" />
        </el-col>
        <!-- 车辆状态 左 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <!-- <carState ref="carState" :carStatusData="carStatusData" /> -->
        </el-col>
      </el-row>

      <!-- 车辆效果图 -->
      <!-- <div class="carPic">
        <img src="../../static/img/vehicleSimulator/fenwei1.gif" altcarState width="320px" @click="showSimulator('1')" />
        <img src="../../static/img/vehicleSimulator/fenwei2.gif" alt width="320px" @click="showSimulator('2')" />
        <img src="../../static/img/vehicleSimulator/fenwei3.jpg" alt width="320px" @click="showSimulator('3')" />
      </div>-->

      <!--车辆效果  -->
      <!-- <vehicleSimulatorDialog ref="vehicleSimulatorDialog"></vehicleSimulatorDialog> -->
    </div>
  </client-only>
</template>

<script>
// import carState from "./components/carState.vue";

import testControl from "./components/testControl.vue";
// import vehicleSimulatorDialog from './components/vehicleSimulatorDialog'

export default {
  components: {
    // carState,
    testControl,
    // vehicleSimulatorDialog
  },
  data() {
    return {
      timer: null,//定时器
      carStatusData: {},
    };
  },
  computed: {

  },
  mounted() {

  },
  watch: {

  },
  methods: {
    //返回键
    goBack() {
      this.$router.back()
    },
    // //  车辆模拟
    // showSimulator(val) {
    //   this.$refs.vehicleSimulatorDialog.dialogVisible = true
    //   this.$refs.vehicleSimulatorDialog.activeFlag = val
    // },
    //车辆状态的 定时器 因为 数据一次性全返 定时器更新
    getCarStatus(data) {
      // console.log('hui', data);
      const n = data.length
      let m = 0
      this.timer = setInterval(() => {
        this.carStatusData = null
        this.carStatusData = Object.assign({}, data[m])
        this.$refs.carState.linkState = 1
        if (m === n - 1) {
          this.$refs.testControl.startFlag = true
          this.$refs.carState.linkState = 0
          clearInterval(this.timer)
        }
        m++

      }, 1000)
    },
    handleEnd() {
      this.$refs.testControl.startFlag = true
      this.$refs.carState.linkState = 0
      clearInterval(this.timer)
      // console.log('结束');
    }
  }
}
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  color: #fff;
  background: #003366;
  box-sizing: border-box;
  padding: 0 20px 20px;
}
.carPic {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}
</style>
