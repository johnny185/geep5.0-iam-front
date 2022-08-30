<template>
  <div>
    <!-- 导航 -->
    <controlNav></controlNav>
    <!-- <navContent></navContent> -->
    <!-- 找回密码 -->
    <div class="forgetWrap">
      <div class="forgetContent mainCenter">
        <div class="forgetTitle fontSize24">重置密码</div>
        <ul class="loginMthod fontSize16">
          <i class="line" :style="{left: slideLeft}"></i>
          <li v-for="(item, index) in tabList" :key="index"
            class="loginMthodItem hoverStyle"
            :class="{ fontBlue: currentIndex === index }"
            @click="changeName(index)">{{item}}</li>
        </ul>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <!-- 通过邮箱账户找回 -->
          <div v-if="currentIndex === 0">
            <el-form-item label="邮箱" prop="emailNumber">
              <el-input v-model="form.emailNumber" placeholder="请输入邮箱地址" maxlength="40" clearable></el-input>
            </el-form-item>
            <el-form-item prop="picCode" label="图形验证码">
              <div class="codeContent">
                <el-input v-model="form.picCode" placeholder="请输入图形验证码" clearable></el-input>
                <img :src="img" class="codeBg hoverStyle" alt @click="captcha" />
              </div>
            </el-form-item>
            <el-form-item prop="emailPicCode" label="邮箱验证码">
              <div class="smsContent">
                <el-input v-model="form.emailPicCode" placeholder="请输入邮箱验证码" maxlength="6" clearable></el-input>
                <!-- <el-button type="primary" style="margin-left:20px" @click="sendOutEmail">发送邮箱验证码</el-button> -->
                <div v-if="isShowGeteEmailCode" class="sendSms hoverStyle fontCenter" @click="sendOutEmail">发送邮箱验证码</div>
                <div v-else class="smsBtn fontCenter">{{ countdown }}s后可重试</div>
              </div>
            </el-form-item>
            <el-form-item label="设置新密码" prop="newPassword">
              <el-input
                :type="passwordType"
                v-model="form.newPassword"
                 maxlength="20"
                clearable
                placeholder="不少于6位密码，包含数字、大小写字母、特殊字符任两种"
              ></el-input>
              <span class="showPwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item label="重复新密码" prop="newPassword2">
              <el-input
                :type="passwordType2"
                v-model="form.newPassword2"
                 maxlength="20"
                clearable
                placeholder="不少于6位密码，包含数字、大小写字母、特殊字符任两种"
              ></el-input>
              <span class="showPwd" @click="showPwd2">
                <svg-icon :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </div>
          <!-- 通过手机号找回 -->
          <div v-if="currentIndex === 1">
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号" maxlength="11" clearable>
                <template slot="prepend">+86(中国)</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="picCode" label="图形验证码">
              <div class="codeContent">
                <el-input v-model="form.picCode" placeholder="请输入图形验证码" clearable></el-input>
                <img :src="img" class="codeBg hoverStyle" alt @click="captcha" />
              </div>
            </el-form-item>
            <el-form-item label="短信验证码" prop="phoneCode">
              <div class="smsContent">
                <el-input v-model="form.phoneCode" placeholder="请输入短信验证码" maxlength="6" clearable></el-input>
                <div v-if="isShowGetCode" class="sendSms hoverStyle fontCenter" @click="getCode">获取验证码</div>
                <div v-else class="smsBtn fontCenter">{{ countdown }}s后可重试</div>
              </div>
            </el-form-item>
            <el-form-item label="设置新密码" prop="newPassword">
              <el-input
                :type="passwordType"
                v-model="form.newPassword"
                clearable
                maxlength="20"
                placeholder="不少于6位密码，包含数字、大小写字母、特殊字符任两种"
              ></el-input>
              <span class="showPwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item label="重复新密码" prop="newPassword2">
              <el-input
                :type="passwordType2"
                v-model="form.newPassword2"
                clearable
                maxlength="20"
                placeholder="不少于6位密码，包含数字、大小写字母、特殊字符任两种"
              ></el-input>
              <span class="showPwd" @click="showPwd2">
                <svg-icon :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </div>
          <el-form-item align="center">
            <el-button type="primary" @click="submitBtn">提交</el-button>
            <el-button @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-button type="text" @click="goToAppeal">账号申诉</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth';
import { passwordReg, telReg, emailReg } from '../../utils/validate';
export default {
  data() {
    // 手机号 校验
    var validatePhoneNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'));
      } else if (!telReg(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback(this.userNameBlur(1));
      }
    };
    // 邮箱 校验
    var validateEmailNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'));
      } else if (!emailReg(value)) {
        callback(new Error('请输入正确邮箱地址'));
      } else {
        callback(this.userNameBlur(3));
      }
    };
    // 输入密码 校验
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('设置新密码不能为空'));
      } else if (!passwordReg(value)) {
        callback(new Error('密码 6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'));
      } else {
        callback();
      }
    };
    // 二次输入密码 校验
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('重复密码不能为空'));
      } else if (!passwordReg(value)) {
        callback(new Error('密码 6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'));
      } else if (value !== this.form.newPassword) {
        return callback(new Error('两次输入密码不一致，请重新输入'));
      } else {
        callback();
      }
    };
    return {
      isShowGetCode: true, //区别 获取短信验证码/倒计时 默认true 获取短信验证码
      isShowGeteEmailCode: true, // 区别 获取邮箱验证码/倒计时 默认true 获取邮箱验证码
      countdown: 60, //倒计时60
      passwordType: 'password', //区别 显示隐藏密码
      passwordType2: 'password', //区别 显示隐藏密码
      uuid: '', //后台需要验证的
      img: '', //动态验证码
      form: {
        emailNumber: '', // 邮箱
        phoneNumber: '', //手机号
        emailPicCode: '', // 邮箱验证码
        phoneCode: '', //短信验证码
        picCode: '', //图形验证码
        newPassword: '', //设置新密码
        newPassword2: '', //重复新密码
        uuid: null, // 短信验证码返回
        appId: '', // 应用id(从哪个应用进入到注册)
      },
      tabList: ['通过邮箱找回', '通过手机找回'],
      currentIndex: 0, //切换短信验证码登录 账号登录
      slideLeft: '', // 下划线位置
      tabLen: '', // tab数组长度
      rules: {
        // 邮箱校验
        emailNumber: [{ required: true, trigger: 'blur', validator: validateEmailNumber }],
        // 手机号校验
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        // 邮箱验证码校验
        emailPicCode: [{ required: true, message: '邮箱验证码不能为空' , trigger: 'change' }],
        // 图形验证码校验
        picCode: [{ required: true, message: '图形验证码不能为空', trigger: 'change' }],
        // 短信验证码校验
        phoneCode: [{ required: true, message: '短信验证码不能为空', trigger: 'change' }],
        newPassword: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ],
        newPassword2: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass2
          }
        ]
      }
    };
  },
  mounted() {
    this.form.appId = this.getQueryVariable('appId');
    this.captcha();
    this.slideLineLeft();
  },
  methods: {
    // 切换tab
    changeName(index) {
      this.$refs['form'].resetFields();
      this.$refs['form'].clearValidate()
      this.currentIndex = index;
      const left = 100 / this.tabLen / 2;
      this.slideLeft = left * (index * 2 + 1) + '%';
    },
    slideLineLeft() {
      this.tabLen = this.tabList.length;
      const left = 100 / this.tabLen / 2;
      this.slideLeft = left * (this.currentIndex * 2 + 1) + '%';
    },
    // 短信倒计时
    getIdentifyCode(type) {
      this.countDown(type);
      if (type === 'email') {
        this.isShowGeteEmailCode = false;
      } else if (type === 'phone') {
        this.isShowGetCode = false;
      }
    },
    // 倒计时
    countDown(type) {
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(this.timer);
          this.countdown = 60;
          if (type === 'email') {
            this.isShowGeteEmailCode = false;
          } else if (type === 'phone') {
            this.isShowGetCode = false;
          }
        }
      }, 1000);
    },
    // 切换新密码 明文、暗文
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    //  切换重复密码 明文、暗文
    showPwd2() {
      if (this.passwordType2 === 'password') {
        this.passwordType2 = '';
      } else {
        this.passwordType2 = 'password';
      }
    },
    // 输入手机号或者邮箱校验是否存在
    userNameBlur(value) {
      let userName = '';
      let message = '';
      if (value === 1) { // 手机号校验
        userName = this.form.phoneNumber;
      } else if (value === 3) { // 邮箱校验
        userName = this.form.emailNumber;
      }
      this.$axios.get(`/api/iam/v1/open/user/find?ak=${userName}&akType=${value}&appId=${this.form.appId}`).then((res) => {
        if (!res.body) {
          if (value === 1) {
            message = '手机号不存在';
          } else if (value === 3) {
            message = '邮箱不存在';
          }
          this.$notify({
            title: '提示',
            message: message,
            type: 'error'
          });
        }
      });
    },
    // 获取邮箱验证码
    sendOutEmail() {
      const { emailNumber, picCode } = this.form;
      if (emailNumber && picCode) {
        let params = {
          target: this.form.emailNumber,
          uuid: this.uuid,
          code: this.form.picCode,
          verifyType: 6 //verifyType 验证类型 6:邮箱验证码类型
        };
        this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
          if (res.status === 200) {
            this.form.uuid = res.body.uuid;
            this.getIdentifyCode('email');
            this.$notify({
              title: '提示',
              message: '发送邮箱验证码操作成功',
              type: 'success'
            });
          }
        });
      } else {
        this.$refs['form'].validateField(['emailNumber', 'picCode']);
      }
    },
    // 获取手机短信验证码
    getCode() {
      const { phoneNumber, picCode } = this.form;
      if (phoneNumber && picCode) {
        let params = {
          target: this.form.phoneNumber,
          uuid: this.uuid,
          code: this.form.picCode,
          // templateCode: 'VERIFY_REGISTER',
          verifyType: 2 //verifyType 验证类型 1:注册时手机验证码 2:重置密码验证码
        };
        this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
          if (res.status === 200) {
            this.form.uuid = res.body.uuid;
            this.getIdentifyCode('phone');
            this.$notify({
              title: '提示',
              message: '验证码已发送至手机，请查收',
              type: 'success'
            });
          }
        });
      } else {
        this.$refs['form'].validateField(['phoneNumber', 'picCode']);
      }
    },
    // 获取 动态验证
    captcha() {
      this.$axios.get('/api/open/common/captcha/image').then((res) => {
        this.img = 'data:image/png;base64,' + res.img;
        this.uuid = res.uuid;
      });
    },
    // 提交
    submitBtn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.currentIndex === 0) { // 当currentIndex为0时为邮箱找回
            let params = {
              code: this.form.emailPicCode, // 邮箱验证码
              passWord: this.$md5(this.form.newPassword),
              target: this.form.emailNumber, // 邮箱
              type: 2, // 1-手机号，2-邮箱
              uuid: this.form.uuid,
              appId: 8134005370347520
            }
            this.$axios.post('/api/iam/v1/open/user/resetPassWord', params).then((res) =>{
              if (res.status === 200) {
                this.$notify({
                  title: '提示',
                  message: '密码重置成功',
                  type: 'success'
                });
                this.goBackLogin();
              }
            })
          } else if (this.currentIndex === 1) { // 当currentIndex为1时为手机号找回
            let params = {
              code: this.form.phoneCode, // 短信验证码
              passWord: this.$md5(this.form.newPassword),
              target: this.form.phoneNumber, // 手机号
              type: 1, // 1-手机号，2-邮箱
              uuid: this.form.uuid,
              appId: 8134005370347520
            }
            this.$axios.post('/api/iam/v1/open/user/resetPassWord', params).then((res) =>{
              if (res.status === 200) {
                this.$notify({
                  title: '提示',
                  message: '密码重置成功',
                  type: 'success'
                });
                this.goBackLogin();
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    goBackLogin() {
      let params = {
        username: '', //用户名称
        registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
        avatarUrl: '', //账户头像
        nickName: '', //昵称
        account: ''
      };
      if (this.getQueryVariable('type') === '1') { // 类型为1 从个人中心安全信息重置密码跳转过来，类型为0从登录页跳转过来
        removeToken();
        this.$store.commit('user/resetUserd', params);
      }
      this.$router.push({
        path: '/login'
      });
    },
    handleClose() {
      if (this.getQueryVariable('type') === '1') {
        this.$router.back()
      } else {
        this.$router.push({
          path: '/login'
        });
      }
    },
    // 获取地址栏中的appId
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){
          return pair[1];
          }
       }
       return(false);
    }
  }
};
</script>

<style scoped>
.showPwd {
  position: absolute;
  right: 20px;
  top: 0px;
  font-size: 16px;
  user-select: none;
  width: 30px;
  height: 30px;
}
.codeContent {
  display: flex;
}
.codeBg {
  width: 204px;
  height: 40px;
  background: #2f74ff;
  border-radius: 4px;
  margin-left: 20px;
}
.forgetWrap {
  width: 100%;
  height: calc(100vh - 98px);
  background: #eff4f8;
  position: relative;
  padding-top: 10px;
}
.forgetContent {
  width: 536px;
  height: auto;
}
.forgetTitle {
  line-height: 80px;
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
  width: 110px;
  margin-left: -56px;
  transition: all 0.3s;
  height: 2px;
  border-radius: 4px;
  background: #2f74ff;
}
.smsContent {
  display: flex;
}
.sendSms {
  width: 204px;
  height: 40px;
  background: #2f74ff;
  border-radius: 4px;
  margin-left: 20px;
}
.smsBtn {
  width: 204px;
  height: 40px;
  background: #cccccc;
  border-radius: 4px;
  margin-left: 20px;
}
.submitBtn {
  height: 40px;
  background: #fafdff;
  border-radius: 4px;
  border: 1px solid #2f74ff;
  line-height: 40px;
}
</style>
