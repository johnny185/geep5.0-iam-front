<template>
  <div>
    <!-- 导航 -->
    <controlNav></controlNav>
    <!-- <navContent></navContent> -->
    <div class="loginWrap">
      <div class="loginLeft"></div>
      <div class="loginRight">
        <ul class="loginMthod fontSize16">
          <i class="line" :style="{left: slideLeft}"></i>
          <li v-for="(item, index) in tabList" :key="index"
            class="loginMthodItem hoverStyle"
            :class="{ fontBlue: currentIndex === index }"
            @click="changeName(index)">{{item}}</li>
        </ul>
        <el-form ref="form" :model="form" :rules="rules" class="login-form">
          <!-- 用户名登录，密码验证 --支持手机号/邮箱/昵称作为用户名-->
          <div v-if="currentIndex === 0">
            <el-form-item prop="userphone">
              <el-input
                class="inputStyle"
                style="heigth: 60px"
                v-model.trim="form.userphone"
                clearable
                placeholder="手机号/邮箱"
                maxlength="40"
              ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                :type="passwordType"
                class="inputStyle"
                v-model.trim="form.password"
                placeholder="请输入密码"
                maxlength="20"
                clearable
                @keyup.enter.native="handleLogin"
              ></el-input>
              <span class="showPwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
              <el-link>密码规则说明</el-link>
          </div>
          <!-- 手机号登录，短信验证 -->
          <div v-if="currentIndex === 1">
            <el-form-item prop="username">
              <el-input
                class="inputStyle"
                style="heigth: 60px"
                v-model.trim="form.username"
                clearable
                placeholder="请输入手机号/邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item prop="imgcode">
              <div class="codeContent">
                <el-input v-model="form.imgcode" placeholder="请输入图片验证码" @keyup.enter.native="handleLogin" clearable></el-input>
                <img :src="img" class="codeBg" alt @click="captcha" />
              </div>
            </el-form-item>
            <el-form-item prop="dynamicCode">
              <div class="smsContent">
                <el-input v-model="form.dynamicCode" placeholder="请输入验证码"></el-input>
                <div v-if="isShowGetCode" class="sendSms hoverStyle fontCenter" @click="getCode">获取验证码</div>
                <div v-else class="smsBtn fontCenter">{{ countdown }}s后可重试</div>
              </div>
            </el-form-item>
          </div>
          <!-- 密码验证和短信验证登录方式切换 -->
          <el-form-item align="right" style="cursor: pointer;">
            <div class="fontSize14 fontBlue" @click="forgetBtn">忘记密码</div>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <div class="submitBtn fontCenter fontSize18" @click="handleLogin" :loading="loading">登录</div>
          </el-form-item>
        </el-form>
        <div class="loginBottom">
          <div class="fontSize14 fontBlue" @click="newUserBtn">注册帐户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setToken } from '../../utils/auth';
import { passwordReg, telReg, emailReg } from '../../utils/validate';
export default {
  data() {
    // 输入密码 校验
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'));
      } else if (!passwordReg(value)) {
        // callback(new Error('密码 6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'));
        callback(new Error('密码为6-20位，英文字母、数字或符号至少包含两种'));
      } else {
        callback();
      }
    };
    // 手机号校验
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'));
      }
      if (!telReg(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback(this.phoneNumberBlur());
      }
    };
    return {
      passwordType: 'password', //区别 显示隐藏密码
      uuid: '', //后台需要验证的
      img: '', //动态验证码
      form: {
        userphone: '', // 手机号
        password: '', // 密码
        username: '', // 帐号
        imgcode: '', // 图片验证码
        dynamicCode: '', // 动态验证码 
        uuid: null 
      },
      tabList: ['密码登录', '验证码登录'],
      currentIndex: 0, // 切换短信验证码登录 帐号帐登录
      slideLeft: '', // 下划线位置
      tabLen: '', // tab数组长度
      loading: false,
      rules: {
        // 手机号校验
        userphone: [{ required: true, validator: validatePhone, trigger: 'change' }],
        // 密码校验
        password: [{ required: true, validator: validatePass, trigger: 'change' }],
        // 帐号校验
        username: [{ required: true, message: '帐号不能为空', trigger: 'blur' }],
        // 图片验证码校验
        imgcode: [{ required: true, message: '图片验证码不能为空', trigger: 'change' }],
        // 动态验证码校验
        dynamicCode: [{ required: true, message: '验证码不能为空', trigger: 'change' }]
      },
      phoneCodeLogin: false, //如果是手机号登录
      countdown: 60, //倒计时60
      isShowGetCode: true //显示获取短信验证码
    };
  },
  mounted() {
    this.captcha();
    this.getConfig();
    this.slideLineLeft()
  },
  methods: {
    // 切换tab
    changeName(index) {
      this.currentIndex = index;
      const left = 100 / this.tabLen / 2;
      this.slideLeft = left * (index * 2 + 1) + '%';
    },
    slideLineLeft() {
      this.tabLen = this.tabList.length;
      const left = 100 / this.tabLen / 2;
      this.slideLeft = left * (this.currentIndex * 2 + 1) + '%';
    },
    // 切换新密码 明文、暗文
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    // 获取 动态验证
    captcha() {
      this.$axios.get('/api/open/common/captcha/image').then((res) => {
        this.img = 'data:image/png;base64,' + res.img;
        this.uuid = res.uuid;
      });
    },
    // 短信倒计时
    getPhoneCode() {
      this.countDown();
      this.isShowGetCode = false;
    },
    // 倒计时
    countDown() {
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(this.timer);
          this.countdown = 60;
          this.isShowGetCode = true;
        }
      }, 1000);
    },
    // 输入手机号校验手机号是否存在
    phoneNumberBlur() {
      this.$axios.get(`/api/iam/v1/open/user/find?ak=${this.form.userphone}&akType=${1}&appId=8134005370347520`).then((res) => {
        if (!res.body) {
          this.$notify({
            title: '提示',
            message: '手机号未注册',
            type: 'error'
          });
        }
      });
    },
    // 获取公共应用配置
    getConfig() {
      this.$axios.get('/api/iam/v1/open/application/config').then((res) => {
        // console.log(res, 'res') 
        // this.$store.commit('user/addUserInfo', res.body);
        // this.$router.push({
        //   path: '/'
        // });
      });
    },
    // 获取短信验证码
    getCode() {
      let verifyTypeNub = 0;
      const { username, imgcode } = this.form;
      if (username && imgcode) {
        if (telReg(this.form.username)) {
          verifyTypeNub = 1
        } else if (emailReg(this.form.username)) {
          verifyTypeNub = 6
        }
        let params = {
          target: this.form.username,
          uuid: this.uuid,
          code: this.form.imgcode,
          verifyType: verifyTypeNub //verifyType 验证类型 1:注册时手机验证码 2:重置密码验证码
        };
        this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
          if (res.status === 200) {
            this.form.uuid = res.body.uuid;
            this.getPhoneCode();
            this.$notify({
              title: '提示',
              message: '发送短信验证码操作成功',
              type: 'success'
            });
          }
        });
      } else {
        this.$refs['form'].validateField(['username', 'imgcode']);
      }
    },
    // 登录
    handleLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.currentIndex === 0) { // 当currentIndex为0时为密码登录
            let params = {
              ak: this.form.userphone,
              sk: this.$md5(this.form.password),
              appId: 8134005370347520
            }
            this.$axios.post('/api/iam/v1/open/login/account', params).then((res) => {
              if (res.status === 200) {
                setToken(res.body.access_token);
                this.$store.commit('user/addToken', res.body.access_token);
                this.getUserInfo();
                this.certificationInfo();
              }
            })
          } else if (this.currentIndex === 1) { // 当currentIndex为0时为验证码登录
            if (this.form.uuid === null) {
              this.$notify({
                title: '提示',
                message: '请获取短信验证码',
                type: 'error'
              });
              return;
            }
            if (telReg(this.form.username)) { // 输入帐号为手机号时
              let params = {
                ak: this.form.username,
                code: this.form.dynamicCode,
                uuid: this.form.uuid,
                appId: 8134005370347520
              }
              this.$axios.post('/api/iam/v1/open/login/phone-code', params).then((res) => {
                if (res.status === 200) {
                  setToken(res.body.access_token);
                  this.$store.commit('user/addToken', res.body.access_token);
                  this.getUserInfo();
                }
              }).catch((err) => {
                // 图形验证码错误 重新获取验证码
                if (err === '图形验证码错误') {
                  this.captcha();
                  this.form.dynamicCode = '';
                }
              })
            } else if (emailReg(this.form.username)) { // 输入帐号为邮箱时
              let params = {
                ak: this.form.username,
                code: this.form.dynamicCode,
                uuid: this.form.uuid,
                appId: 8134005370347520
              }
               this.$axios.post('/api/iam/v1/open/login/email-code', params).then((res) => {
                if (res.status === 200) {
                  setToken(res.body.access_token);
                  this.$store.commit('user/addToken', res.body.access_token);
                  this.getUserInfo();
                }
              }).catch((err) => {
                // 图形验证码错误 重新获取验证码
                if (err === '图形验证码错误') {
                  this.captcha();
                  this.form.dynamicCode = '';
                }
              })
            }
          } else {
            return false;
          }
        }
      });
    },
    // 获取用户信息
    getUserInfo() {
      this.$axios.get('/api/iam/v1/auth/user/get').then((res) => {
        this.$store.commit('user/addUserInfo', res.body);
        this.$router.push({
          path: '/',
          query: {
            menu: 1,
            tab: 1,
            appId: 8134005370347520
          }
        });
      });
    },
    // 认证详情
    certificationInfo() {
      let isCertification = null;
      this.$axios.get('/api/iam/v1/auth/certification/apply/info').then((res) => {
        if (res.body === null) {
          isCertification = 0 ;
        } else {
          isCertification = 1;
          console.log(isCertification, 'isCertification')
        }
        this.$store.commit('user/addRegisterType', isCertification);
      })

    },
    // 新用户注册
    newUserBtn() {
      console.log('chufa')
      this.$router.push({
        path: '/login/register',
        query: {
          appId: 8134005370347520
        }
      });
    },
    // 忘记密码 注册
    forgetBtn() {
      this.$router.push({
        path: '/login/forget',
        query: {
          type: 0,
          appId: 8134005370347520
        }
      });
    }
  }
};
</script>

<style scoped>
.showPwd {
  position: absolute;
  right: 18px;
  top: 0px;
  font-size: 16px;
  user-select: none;
  width: 30px;
  height: 30px;
}
.loginWrap {
  width: 100%;
  height: calc(100vh - 88px);
  background: #2f74ff;
  position: relative;
}
.loginLeft {
  position: absolute;
  top: 10vh;
  /* left: calc(100vm-283px); */
  left: 20.2em;
  width: 742px;
  height: 572px;
  background: url('/img/login/loginBg.png') no-repeat;
  background-size: 100%;
}
.loginRight {
  position: absolute;
  top: 28%;
  left: 75.57em;
  height: auto;
  width: auto;
  padding: 40px 40px 40px 40px;
  background: #ffffff;
}
.loginMthod {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  line-height: 36px;
  position: relative;
}
.line {
  position: absolute;
  left: 25%;
  bottom: 0;
  width: 100px;
  margin-left: -52px;
  transition: all 0.3s;
  height: 2px;
  border-radius: 4px;
  background: #2f74ff;
}
.login-form {
  position: relative;
  width: 340px;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  user-select: none;
}
.codeContent {
  display: inline-flex;
}
.codeBg {
  width: 132px;
  /* flex: 1; */
  height: 40px;
  background: #2f74ff;
  border-radius: 4px;
  margin-left: 20px;
  cursor: pointer;
}
.submitBtn {
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  background: #2f74ff;
  /* border: 1px solid #2f74ff; */
  color: #fff;
  cursor: pointer;
}
.loginBottom {
  text-align: right;
  /* display: flex; */
  /* justify-content: space-between; */
  cursor: pointer;
}
.smsContent {
  display: flex;
}
.sendSms {
  width: 168px;
  height: 40px;
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  margin-left: 20px;
}
.smsBtn {
  width: 168px;
  height: 40px;
  background: #dfdfdf;
  border-radius: 4px;
  margin-left: 20px;
}
</style>
