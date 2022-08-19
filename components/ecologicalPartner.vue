<template>
  <div class="ecologicalPartner">
    <div class="ecologicalPartnerTitle mainCenter"></div>
    <p class="fontSize18 fontWhite mainWidth mainCenter marginTop20">
      积极探索开放的商业合作模式,在研发、生产、销售服务等全产业领域展开合作
    </p>
    <p class="fontSize18 fontWhite mainWidth mainCenter">
      开发生态的基因,实现移动互联网生活方式向汽车智慧产业的延伸
    </p>
    <ul class="ecologicalCarousel">
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.ecologicalPartner {
  background: #000e24;
  text-align: center;
  padding-top: 40px;
}
.ecologicalPartnerTitle {
  width: 244px;
  height: 55px;
  background: aqua;
  background: url("/img/ecologicalPartner/title.png");
  background-size: 100%;
}
.ecologicalCarousel {
  width: 100%;
  height: 400px;
}
</style>
