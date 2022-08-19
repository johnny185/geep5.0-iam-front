<template>
  <div class="toolBg">
    <div class="developmentToolTitle marginTop20"></div>
    <p class="developmentIntroduce fontSize18">产品服务介绍文案</p>
    <el-carousel
      type="card"
      indicator-position="none"
      class="mainWidth mainCenter"
      height="400px"
    >
      <el-carousel-item v-for="(item, index) in toolImageData" :key="index">
        <img :src="item.imgUrl" alt="" width="100%" height="100%" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: {
    toolImageData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
/* .el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */
.toolBg {
  background: hsl(217, 100%, 7%);
  padding-top: 5px;
}
.developmentIntroduce {
  margin: 40px auto;
  color: #666666;
  width: fit-content;
}
.developmentToolTitle {
  width: 244px;
  height: 55px;
  background: aqua;
  margin: 40px auto;
  background: url("/img/developmentTool/title.png");
  background-size: 100%;
}
</style>
