<template>
  <div>
    <!-- 侧边栏 -->
    <!-- <sidebar></sidebar> -->
    <!-- 导航 -->
    <!-- <navContent></navContent> -->
    <!-- 图片轮播 -->
    <!-- <banner :bannerData="bannerData"></banner> -->
    <!-- 产品服务 -->
    <!-- <productService :showMore="showMore"></productService> -->

    <!-- 开发工具 -->
    <!-- <developmentTool :toolImageData="toolImageData"></developmentTool> -->
    <!-- 生态伙伴 -->
    <!-- <ecologicalPartner></ecologicalPartner> -->
    <!-- 成功案例 -->
    <!-- <successfulCases></successfulCases> -->
    <!-- 弹窗广告 -->
    <!-- <costPerPopup :cPPData="cPPData"></costPerPopup> -->
    <!-- 成为开发者  + 公告 动态 -->
    <!-- <div class="comprehensive"> -->
      <!-- <div class="comprehensiveWrap mainWidth mainCenter"> -->
        <!-- 成为开发者 -->
        <!-- <developer></developer> -->
        <!-- 平台动态 -->
        <!-- <notice></notice> -->
      <!-- </div> -->
    <!-- </div> -->
    <!-- <footContent></footContent> -->
  </div>
  <!-- <Tutorial/> -->
</template>
<script>
export default {
  mounted() {
    console.log('测试自动部署1');
    this.getBannerList();
    this.getCPP()
    // this.bannerData = this.imageData;
    // console.log(this.$axios)
    // 请求示例
    // this.$axios.get('/api/forum/get1').then(res=>{
    //   console.log(res)
    // })
    // console.log(document.documentElement.scrollTop);
    // window.οnscrοll = function () {
    //   //鼠标滚轮滚动距离超过10像素时，回到顶部按钮才显示
    //   if (document.documentElement.scrollTop > 10) {
    //     this.toTopIsShow = true;
    //   } else {
    //     this.toTopIsShow = false;
    //   }
  },
  data() {
    return {
      showMore: true, // 产品服务 是否需要展示更多服务
      toTopIsShow: false,
      bannerData: [], //需要传入广告位的数据
      // imageData: [
      //   { imgUrl: require('../static/img/banner/bg1.png') },
      //   { imgUrl: require('../static/img/banner/bg2.png') },
      //   { imgUrl: require('../static/img/banner/bg3.png') },
      //   { imgUrl: require('../static/img/banner/bg4.png') },
      //   { imgUrl: require('../static/img/banner/bg5.png') }
      // ],
      toolImageData: [], // 需要传入的开发者工具 轮播数据
      // toolImageData: [
      //   { imgUrl: require('../static/img/developmentTool/digitalCar.png') },
      //   { imgUrl: require('../static/img/developmentTool/digitalCar.png') },
      //   { imgUrl: require('../static/img/developmentTool/digitalCar.png') }
      // ],
      cPPData: [] // 弹窗广告 数据
    };
  },
  methods: {
    // 获取 banner 列表
    getBannerList() {
      let params = {
        // 所属栏目 1.首页  2.产品服务  3.开发者论坛  4.生态伙伴  5.平台动态  6.关于我们
        navigation: '1'
      };
      this.$axios.post('/api/system/systemBanner/portalList', params).then((res) => {
        this.bannerData = res.body;
      });
    },
    // 获取 弹窗广告
    getCPP() {
      const params = {
        popupColumn: '1',
        status: 1
      }
      this.$axios.post('/api/document/doc/getPopupad', params).then((res) => {
        // console.log(res);
        if (res.status === 200) {
          const { body } = res
          this.cPPData = body.list
        }
      });
    }
  }
};
</script>
<style scoped>
.comprehensive {
  width: 100%;
  background: #eff4f8;
}
.comprehensiveWrap {
  padding-top: 40px;
  display: flex;
}
</style>
