<template>
  <div class="footWrap">
    <div class="mainWidth mainCenter">
      <div class="footTop fontSize14">
        <p class="marginLeft20">联系电话：{{ footInfo.contactPhone }}</p>
        <p>商务合作邮箱：{{ footInfo.businessCooperationMail }}</p>
        <p class="marginLeft20">{{ footInfo.recordNumber }}</p>
        <p
          class="qrCodePicture"
          v-for="(item, index) in footInfo.qrCodeList"
          :key="index"
          :style="{
            backgroundImage: 'url(' + item.qrCodePictureUrl + ')',
            backgroundSize: '100% 100%'
          }"
        ></p>
        <!-- backgroundPositionY: '20px' -->
      </div>
      <div class="footBottom fontSize18 fontWhite fontCenter">{{ footInfo.copyright }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      footInfo: {}
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$axios.get('/api/system/systemSite/detail').then((res) => {
        this.footInfo = res.body;
      });
    }
  }
};
</script>

<style scoped>
.footTop {
  color: #666666;
  display: flex;
  padding-top: 50px;
  padding-top: 30px;
}
.footTop p {
  line-height: 70px;
  float: left;
  margin-left: 40px;
}
.qrCodePicture {
  width: 50px;
  height: 50px;
}
/* .footTop p:nth-child(1) {
  flex: 1;
}
.footTop p:nth-child(2) {
  flex: 1;
}
.footTop p:nth-child(3) {
  flex: 1;
}
.footTop p:nth-child(4) {
  flex: 1;
}
.footTop p:nth-child(5) {
  flex: 1;
} */
.footWrap {
  width: 100%;
  height: 200px;
  background: #282828;
}
.wxbg {
  background: url('/img/footContent/wx.png') no-repeat;
  background-size: 10%;
  background-position-y: 20px;
}
.wbbg {
  background: url('/img/footContent/wb.png') no-repeat;
  background-size: 10%;
  background-position-y: 20px;
}
</style>
