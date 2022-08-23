<template>
  <div>
    <!-- 控制台首页 -->
    <controlNav></controlNav>
    <!-- 个人中心 -->
    <div class="personalWrap">
      <div class="personBox mainCenter">
        <div class="personBoxLeft">
          <!-- 用户-其他关注或粉丝用户 -->
          <articleUserContent></articleUserContent>
          <!-- 菜单 我的资料 我的消息 我的关注 我的收藏等等 -->
          <!-- <controlMenu @toMenu="toMenu"></controlMenu> -->
        </div>
        <div class="personBoxRight">
          <!-- 用户的资料 -->
          <articlePersonArea v-if="menu === '1'"></articlePersonArea>
          <!-- 我的关注 -->
          <myFollow v-if="menu === '4'"></myFollow>
          <!-- 我的粉丝 -->
          <myFans v-if="menu === '5'"></myFans>
          <!-- 我的收藏 -->
          <myCollection v-if="menu === '6'"></myCollection>
          <!-- 我的发布-->
          <myRelease v-if="menu === '7'"></myRelease>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import articleUserContent from './components/articleUserContent.vue'; //用户
// import controlMenu from '../../components/controlMenu.vue'; // 导航
import articlePersonArea from './components/articlePersonArea.vue'; // 我的资料 --- 个人信息 认证信息 登录信息
import myMessage from '../../components/myMessage.vue'; // 我的互动
import myInteract from './components/myInteract.vue'; // 我的互动
import myRelease from './components/myRelease.vue'; // 我的发布
import myFollow from './components/myFollow.vue'; // 我的关注
import myDraft from './components/myDraft.vue'; // 我的草稿箱
import myFans from './components/myFans.vue'; // 我的粉丝
import myCollection from './components/myCollection.vue'; // 我的收藏
export default {
  components: {
    articleUserContent,
    // controlMenu,
    articlePersonArea,
    myInteract,
    myMessage,
    myRelease,
    myDraft,
    myFollow,
    myFans,
    myCollection
  },
  data() {
    return {
      menu: this.$route.query.menu
    };
  },
  methods: {
    // 切换 我的资料 我的消息 我的关注
    toMenu(data) {
      let queryParams = {};
      // 切换路由 地址栏参数发生修改 保证刷新后还停留在当前页面
      queryParams = { menu: data, userId: this.$route.query.userId, userName: this.$route.query.userName };
      // this.$router.push({
      //   path: '/controlBoard/articlePersonalCentre',
      //   query: queryParams
      // });
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
