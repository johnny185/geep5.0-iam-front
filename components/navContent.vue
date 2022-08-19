<template>
  <div class="nav">
    <ul class="navContent">
      <li class="navleft">
        <div class="navLogo"></div>
        <!-- <nuxt-link to="/">
          <div class="navItem fontSize20 fontWhite">首页</div>
        </nuxt-link>
        <nuxt-link to="/productService">
          <div class="navItem fontSize20 fontWhite">产品服务</div>
        </nuxt-link>
        <nuxt-link to="/developerPlatform">
          <div class="navItem fontSize20 fontWhite">开发者论坛</div>
        </nuxt-link>
        <nuxt-link to="/ecologicalPartner">
          <div class="navItem fontSize20 fontWhite">生态伙伴</div>
        </nuxt-link>
        <nuxt-link to="/platformDynamics">
          <div class="navItem fontSize20 fontWhite">平台动态</div>
        </nuxt-link>
        <nuxt-link to="/aboutUs">
          <div class="navItem fontSize20 fontWhite">关于我们</div>
        </nuxt-link> -->
        <!-- <nuxt-link to="/controlBoard" v-if="$store.state.user.userInfo.registerStatus === '2'">
          <div class="navItem fontSize20 fontWhite">控制台</div>
        </nuxt-link> -->
      </li>
      <li class="navRight">
        <!-- 没有用户时 -->
        <!-- <nuxt-link to="/login" v-if="$store.state.user.userInfo.username === ''">
          <div class="navItem hoverStyle fontWhite">登录</div>
        </nuxt-link> -->
        <!-- 有用户时 -->
        <el-dropdown size="medium" v-if="$store.state.user.userInfo.nickName !== ''">
          <span class="navItem fontWhite">
            {{ $store.state.user.userInfo.nickName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <!-- <p>极客开发者</p> -->
              <!-- registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒" -->
              <span
                v-if="$store.state.user.userInfo.registerStatus !== '2'"
                class="notCertified fontCenter"
                @click="toCertified($store.state.user.userInfo)"
              >未认证</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="toPersonalCentre('1', '1')">个人资料</el-dropdown-item>
            <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div
          class="navItem borderLeft hoverStyle fontWhite"
          v-if="$store.state.user.userInfo.role == ''"
        >成为开发者</div>
        <!-- <nuxt-link to="/helpDoc">
          <div class="navItem borderLeft hoverStyle fontWhite">帮助文档</div>
        </nuxt-link>
        <nuxt-link to="/notice">
          <div class="navItem borderLeft hoverStyle fontWhite">公告</div>
        </nuxt-link> -->
        <nuxt-link to="/controlBoard/personalCentre?menu=2">
          <messages
            class="navItem borderLeft hoverStyle fontWhite"
            v-if="$store.state.user.userInfo.username !== '' && $route.name  !== 'login'"
          />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import messages from './messages.vue'
import { removeToken } from '../utils/auth';
export default {
  components: {
    messages
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.$route.name);
  },
  methods: {
    // 判断 是否去认证
    toCertified(data) {
      // registerStatus //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
      if (data.registerStatus === '0' || data.registerStatus === '3') {
        this.$router.push({
          path: '/login/certified'
        });
      }
      if (data.registerStatus === '1') {
        // 跳转 审核中 页面
        this.$router.push({
          path: '/login/inReview'
        });
      }
    },
    // 跳转页面去 控制台 个人中心
    toPersonalCentre(menuData, tabData) {
      this.$router.push({
        path: '/controlBoard/personalCentre',
        query: {
          menu: menuData,
          tab: tabData
        }
      });
    },
    // 退出登录
    logOut() {
      this.$nextTick(() => {
        let params = {
          username: '', //用户名称
          registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
          avatarUrl: '', //账户头像
          nickName: '', //昵称
          account: '',
          token: ''
        };
        this.$axios.delete('/api/auth/user/openapi/common/token/logout').then((res) => {
          // 删除token
          removeToken();
          this.$store.commit('user/resetUserd', params);
          this.$router.push({
            path: '/login'
          });
        });
      });
    }
  }
};
</script>

<style scoped>
.nav {
  display: flex;
  background: #000e24;
  height: 88px;
}
.navLogo {
  width: 196px;
  background-size: 100%;
  background: url('/img/nav/logo.png');
  background-size: 100%;
  height: 88px;
  background-position-y: -4px;
}
.navContent {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navleft {
  display: flex;
  cursor: pointer;
}
.navleft div:hover {
  color: #2f74ff;
  /* border-bottom:1px solid #2F74FF; */
}
.navRight div:hover {
  color: #2f74ff;
}
.navRight {
  display: flex;
  cursor: pointer;
}
.navItem {
  padding: 0px 20px;
  line-height: 88px;
}
.notCertified {
  display: inline-block;
  font-size: 14px;
  line-height: 16px;
  width: 60px;
  background: 20px;
  background: aquamarine;
  border-radius: 40px;
}
</style>
