<template>
  <div class="nav">
    <ul class="navContent">
      <li class="navleft">
        <div class="navLogo"></div>
        <!-- <nuxt-link to="/">
          <div class="navItem fontSize20 fontWhite">平台首页</div>
        </nuxt-link> -->
        <!-- 控制台首页暂时不要 -->
        <!-- <nuxt-link to="/controlBoardHome">
          <div class="navItem fontSize20 fontWhite">控制台首页</div>
        </nuxt-link>-->
        <!-- <nuxt-link to="/controlBoard" v-if="$store.state.user.userInfo.registerStatus === '2'">
          <div class="navItem fontSize20 fontWhite">控制台</div>
        </nuxt-link> -->
      </li>
      <li class="navRight">
        <!-- 有用户时 -->
        <el-dropdown size="medium" v-if="$store.state.user.userInfo.nickName !== ''">
          <span class="navItem borderLeft navBoderRight hoverStyle fontWhite">
            <!-- {{ $store.state.user.userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i> -->
            {{ $store.state.user.userInfo.nickName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>
              <span
                class="notCertified fontCenter"
                v-if="$store.state.user.userInfo.registerStatus !== '2'"
                @click="toCertified('1', '2')"
              >未认证</span>
            </el-dropdown-item> -->
            <el-dropdown-item @click.native="toPersonalCentre">个人资料</el-dropdown-item>
            <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div class="navItem borderLeft navBoderRight hoverStyle fontWhite" @click="toCertified('1', '1')">个人中心</div> -->
        <!-- <div class="navItem borderLeft hoverStyle fontWhite" @click="toMessages">消息</div> -->
        <!-- <nuxt-link to="/controlBoard/personalCentre?menu=2"> -->
          <!-- <span>消息</span> -->
          <!-- <messages
            class="navItem borderLeft hoverStyle fontWhite"
            v-if="$store.state.user.userInfo.username !== '' && $route.path.indexOf('personalCentre') === -1"
          /> -->
        <!-- </nuxt-link> -->
      </li>
    </ul>
    <!-- <div class="navNone"></div> -->
  </div>
</template>

<script>
// import messages from './messages.vue'
import { removeToken } from '../utils/auth';
export default {
  // components: {
  //   messages
  // },
  data() {
    return {};
  },
  created() {
    // console.log(this.$route.path.indexOf('personalCentre'));
  },
  methods: {
    // 判断 是否去认证
    toCertified(data) {
      // registerStatus //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
      if (data.registerStatus === '0') {
        this.$router.push({
          path: '/login/certified'
        });
      }
    },
    // 跳转页面去 个人中心信息页
    toPersonalCentre(menuData, tabData) {
      this.$router.push({
        path: '/',
        query: {
          menu: 1,
          tab: 1
        }
      });
    },
    // 跳转页面到 消息页面
    // toMessages() {
    //   this.$router.push({
    //     path: '/',
    //     query: {
    //       menu: 2,
    //       tab: 2
    //     }
    //   });
    // },
    // 退出登录
    logOut() {
      this.$nextTick(() => {
        let params = {
          username: '', //用户名称
          registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
          avatarUrl: '', //账户头像
          nickName: '', //昵称
          account: ''
        };
        this.$axios.delete('/api/iam/v1/open/login/out').then((res) => {
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
  height: 88px;
  background: #000e24;
}
.navLogo {
  width: 196px;
  background-size: 100%;
  background: url('/img/nav/logo.png');
  background-size: 100%;
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
  height: 88px;
}
.navleft div:hover {
  color: #2f74ff;
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
  font-size: 12px;
  line-height: 16px;
  width: 60px;
  background: 20px;
  background: aquamarine;
  border-radius: 40px;
}
</style>
