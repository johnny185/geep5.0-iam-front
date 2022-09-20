<template>
  <div v-show="isShow">
    <!-- 回到顶部 -->
    <!-- <el-backtop :visibility-height="400" :right="80" :bottom="52">
      <div class="toTop"></div>
    </el-backtop>-->
    <div class="sidebarWrap">
      <div class="toForum" @click="toForum" v-if="formShow"></div>
      <div class="toHome marginTop20" @click="toHome"></div>
      <div class="toTop marginTop20" @click="toTop"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    point: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      formShow: false
    };
  },
  mounted() {
    if (this.$route.name === 'developerPlatform') {
      this.formShow = true;
    } else {
      this.formShow = false;
    }
    this.$nextTick(function () {
      window.addEventListener('scroll', this.handleScroll, true);
    });
  },
  destroyed() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  methods: {
    // 去编辑
    toForum() {
      if (!this.$store.state.user.userInfo.token) {
        !$nuxt.$router.push({
          path: '/login'
        });
        return false;
      }
      this.$router.push({
        path: '/developerPlatform/forum',
        query: {
          addOrEditStatus: 'add'
        }
      });
    },
    // 回到首页
    toHome() {
      this.$router.push({
        path: '/'
      });
    },
    // 回到顶部
    toTop() {
      let timer = null;
      timer = setInterval(() => {
        document.documentElement.scrollTop =
          document.documentElement.scrollTop - Math.ceil(document.documentElement.scrollTop / 10);
        if (document.documentElement.scrollTop <= 0) {
          clearInterval(timer);
        }
      }, 10);
    },
    // 滚动事件
    handleScroll() {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      // 设定 滚动条距离顶部 多少  右下导航显示与否
      this.isShow = scrollPos > 400;
    }
  }
};
</script>

<style scoped>
.sidebarWrap {
  position: fixed;
  right: 82px;
  bottom: 100px;
  z-index: 99999;
}
.toForum {
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: url('/img/publicImg/toForum.png') no-repeat;
  background-size: 100%;
}
.toHome {
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: url('/img/publicImg/toHome.png') no-repeat;
  background-size: 100%;
}
.toTop {
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: url('/img/publicImg/toTop.png') no-repeat;
  background-size: 100%;
}
</style>
