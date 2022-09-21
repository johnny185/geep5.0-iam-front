<template>
  <div>
    <controlNav></controlNav>
    <!-- 个人中心 -->
    <client-only>
      <div class="personalWrap">
        <div class="personBox mainCenter">
          <div class="personBoxLeft">
            <!-- 用户 -->
            <userContent></userContent>
            <!-- 菜单 我的资料 我的消息  -->
            <controlMenu @toMenu="toMenu"></controlMenu>
          </div>
          <div class="personBoxRight">
            <!-- 我的资料 -->
            <personArea v-if="menu === '1'"></personArea>
            <!-- 我的消息 -->
            <myMessage v-if="menu === '2'"></myMessage>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menu: this.$route.query.menu,
      name:'1234'
    };
  },
  mounted() {
   
  },
  methods: {
   // 切换 我的资料 我的消息 我的关注
    toMenu(data) {
      let queryParams = {};
      // 切换路由 地址栏参数发生修改 保证刷新后还停留在当前页面
      if (data === '1') {
        queryParams = {
          menu: data,
          tab: 1
        };
      } else {
        queryParams = {
          menu: data
        };
      }
      this.$router.push({
        path: '/',
        query: queryParams
      });
      this.menu = data;
    }
  }
};
</script>
<style scoped>
.personalWrap {
  width: 100%;
  height: auto;
  padding-top: 58px;
  background: #eff4f8;
}
.personBox {
  display: flex;
  width: fit-content;
}
.personBoxLeft {
  width: auto;
  height: auto;
}
.personBoxRight {
  width: auto;
  height: auto;
}
</style>
