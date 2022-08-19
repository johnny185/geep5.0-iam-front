<template>
  <div>
    <!-- 导航 -->
    <navContent></navContent>
    <!--注册住页面 -->
    <!-- 注册 头部  注册、认证开发者、审核通过 -->
    <registerNav :registerData="registerData"></registerNav>
    <reviewFailContent></reviewFailContent>
  </div>
</template>

<script>
// 头部
import registerNav from './components/registerNav.vue';
import reviewFailContent from './components/reviewFailContent.vue';
export default {
  components: {
    registerNav,
    reviewFailContent
  },
  data() {
    return {
      // 头部样式
      registerData: [
        {
          bg: '/img/login/registerSuccessful.png',
          title: '注册',
          lineBg: '/img/login/line1.png',
          arrowShow: true
        },
        {
          bg: '/img/login/certifiedSuccess.png',
          title: '认证开发者',
          lineBg: '/img/login/line1.png',
          arrowShow: true
        },
        {
          bg: '/img/login/notApproved.png',
          title: '审核未通过',
          lineBg: '',
          arrowShow: false
        }
      ]
    };
  },
  methods: {}
};
</script>

<style scoped></style>
