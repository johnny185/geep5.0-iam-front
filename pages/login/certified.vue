<template>
  <div>
    <!-- 导航 -->
    <navContent></navContent>
    <!--注册住页面 -->
    <!-- 注册 头部  注册、认证开发者、审核通过 -->
    <registerNav :registerData="registerData"></registerNav>
    <!-- 认证为 个人 或者 商业伙伴 -->
    <div class="certifiedWrap" :class="{ certifiedWrap1: role === 'company' }">
      <div class="certifiedContent mainCenter">
        <div class="certifiedRole">
          <div class="certifiedRoleLeft"></div>
          <div class="certifiedRoleRight fontSize14">
            <p>
              <span class="roleStyle" v-if="$store.state.user.userInfo.registerType === '1'">个人开发</span>
              <span class="roleStyle" v-if="$store.state.user.userInfo.registerType === '2'">商业伙伴</span>
              <span class="remarksStyle">(完成身份认证后，将无法修改身份类)</span>
            </p>
            <el-select
              v-model="$store.state.user.userInfo.registerType"
              placeholder="请选择身份信息"
              style="width: 520px"
            >
              <el-option label="个人开发者" value="1"> </el-option>
              <el-option label="商业伙伴" value="2"> </el-option>
            </el-select>
          </div>
        </div>
        <!-- 认证 个人 -->
        <certifiedPerson v-if="$store.state.user.userInfo.registerType === '1'" :initInfo="initInfo"></certifiedPerson>
        <!-- 认证 商业伙伴 -->
        <certifiedCompany
          v-if="$store.state.user.userInfo.registerType === '2'"
          :initInfo="initInfo"
        ></certifiedCompany>
      </div>
    </div>
  </div>
</template>

<script>
// 头部
import registerNav from './components/registerNav.vue';
// 认证个人
import certifiedPerson from './components/certifiedPerson';
//  认证公司
import certifiedCompany from './components/certifiedCompany';
export default {
  components: {
    registerNav,
    certifiedPerson,
    certifiedCompany
  },
  mounted() {
    this.getInit();
  },
  data() {
    return {
      initInfo: {},
      //注册角色 默认从个人开发者开始
      role: 'person',
      // 头部样式
      registerData: [
        {
          bg: '/img/login/registerSuccessful.png',
          title: '注册',
          lineBg: '/img/login/line1.png',
          arrowShow: true
        },
        {
          bg: '/img/login/notCertified.png',
          title: '认证开发者',
          lineBg: '/img/login/line2.png',
          arrowShow: true
        },
        {
          bg: '/img/login/notApproved.png',
          title: '审核通过',
          lineBg: '',
          arrowShow: false
        }
      ]
    };
  },
  methods: {
    //
    getInit() {
      this.$axios.get('/api/auth/user/authapi/front/information/submit/init').then((res) => {
        // registerStatus用户状态  "0", "只注册还未提交认证"    "1", "已提交认证-待审核"    "2", "审核通过"    "3", "审核被拒"
        if (res.body.registerStatus === '1') {
          // 跳转 审核中 页面
          this.$router.push({
            path: '/login/inReview'
          });
          return false;
        }
        // 审核被拒 重新提交
        if (res.body.registerStatus === '3') {
          // 当 注册 为 个人时
          if (res.body.registerType === '1') {
            this.role = 'person';
          } else {
            // // 当 注册 为 商业伙伴时
            this.role = 'company';
            // this.$router.push({
            //   path: '/login/reviewFail'
            // });
          }
          this.initInfo = JSON.parse(JSON.stringify(res.body));
          console.log(this.initInfo);

          return false;
          // this.initInfo = res.body;
        }
      });
    }
  }
};
</script>

<style scoped>
.certifiedWrap {
  width: 100%;
  height: calc(100vh - 287px);
  background: #eff4f8;
  padding-top: 40px;
}
.certifiedWrap1 {
  width: 100%;
  height: auto;
  background: #eff4f8;
  padding: 40px 0px;
}
.certifiedContent {
  width: 660px;
  height: auto;
}
.certifiedRole {
  display: flex;
  padding-left: 40px;
  margin-bottom: 20px;
}
.certifiedRoleLeft {
  width: 60px;
  height: 60px;
  background: url('/img/login/avatar.png');
  background-size: 100%;
}
.remarksStyle {
  color: #999990;
}
.certifiedRoleRight {
  margin-left: 40px;
}
</style>
