<template>
  <div>
    <!-- 导航 -->
    <controlNav></controlNav>
    <!-- <navContent></navContent> -->
    <!-- 注册表单 -->
    <div class="registerContentWrap">
      <div class="registerContent mainCenter">
        <div class="userRegister fontSize24">用户注册</div>
        <!-- 用户身份 -->
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <!-- <el-form-item label="用户身份" prop="registerType">
            <el-radio v-model="form.registerType" label="1" border>个人开发者</el-radio>
            <el-radio v-model="form.registerType" label="2" border>商业伙伴</el-radio>
          </el-form-item> -->
          <el-form-item label="手机号码" prop="ak">
            <el-input v-model.trim="form.ak" maxlength="11" placeholder="请输入手机号" clearable>
             <template slot="prepend">+86(中国)</template>
             </el-input>
          </el-form-item>
          <el-form-item prop="picCode" label="图形验证码">
            <div class="codeContent">
              <el-input v-model="form.picCode" placeholder="请输入图形验证码" clearable></el-input>
              <img :src="img" class="codeBg hoverStyle" alt @click="captcha" />
            </div>
          </el-form-item>
          <el-form-item label="短信验证码" prop="code">
            <div class="smsContent">
              <el-input v-model="form.code" maxlength="6" placeholder="请输入短信验证码"></el-input>
              <div v-if="isShowGetCode" class="sendSms hoverStyle fontCenter" @click="getCode">发送验证码</div>
              <div v-else class="smsBtn fontCenter">{{ countdown }}s后可重试</div>
              <!-- <el-button v-if="isShowGetCode" type="primary" @click="getCode" :disabled="isClickable" style="margin-left: 20px;">发送验证码</el-button> -->
              <!-- <el-button v-else  type="info">{{ countdown }}s后可重试</el-button> -->
            </div>
          </el-form-item>
          <el-form-item label="设置新密码" prop="sk">
            <el-input
              clearable
              :type="skType"
              v-model.trim="form.sk"
              inline-message
              placeholder="不少于6位密码，包含数字、大小写字母、特殊字符任两种"
            ></el-input>
            <span class="showPwd" @click="showPwd">
              <svg-icon :icon-class="skType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item label="重复新密码" prop="sk2">
            <el-input
              :type="skType2"
              v-model.trim="form.sk2"
              clearable
              inline-message
              placeholder="不少于6位密码，包含数字、大小写字母、特殊字符任两种"
            ></el-input>
            <span class="showPwd" @click="showPwd2">
              <svg-icon :icon-class="skType2 === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <!-- <el-form-item label="微信号" prop="wechatNum">
            <el-input
              v-model.trim="form.wechatNum"
              placeholder="请输入微信号"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="电子邮箱" prop="email">
            <el-input v-model.trim="form.email" placeholder="请输入邮箱账号" maxlength="40" show-word-limit></el-input>
          </el-form-item> -->
          <el-form-item align="center">
            <el-button type="primary" @click="submitBtn">提交</el-button>
            <el-button @click="handleClose">取消</el-button>
            <!-- <div class="submitBtn fontCenter fontBlue" @click="submitBtn">提交</div> -->
          </el-form-item>
          <el-form-item class="fontCenter agreementFont">
            <el-checkbox v-model="form.checked"></el-checkbox>同意并遵守
            <span class="hoverStyle fontBlue" @click="checkAgreement(1, 352)">《服务协议》</span>和
            <span class="hoverStyle fontBlue" @click="checkAgreement(2, 353)">《隐私保护政策》</span>
          </el-form-item>
          <!-- <el-form-item class="fontCenter">
            <div class="registerBottom agreementFont">
              <p>
                已注册
                <u class="loginFont" @click="loginBtn">立即登录</u>
              </p>
            </div>
          </el-form-item> -->
        </el-form>
      </div>
    </div>
    <!-- 查看协议 -->
    <checkDealDialog ref="checkDealDialog" :dealData="dealData" :agreementType="agreementType"></checkDealDialog>
  </div>
</template>

<script>
import checkDealDialog from './components/checkDealDialog'; //协议 详情查看
import registerNav from './components/registerNav.vue'; // 注册共用 头部样式组件
import { passwordReg, telReg, emailReg } from '../../utils/validate';
export default {
  components: {
    registerNav,
    checkDealDialog
  },
  data() {
    // 手机号 校验
    var validatephoneNumberber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'));
      } else if (!telReg(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback(this.phoneNumberBlur());
      }
    };
    // 邮箱 校验
    // var validateEmail = (rule, value, callback) => {
    //   if (value !== '' && !emailReg(value)) {
    //     callback(new Error('请输入正确的邮箱'));
    //   } else {
    //     callback();
    //   }
    // };
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
      } else if (value !== this.form.sk) {
        return callback(new Error('与设置登录密码一致'));
      } else {
        callback();
      }
    };
    return {
      dealData: {}, //服务协议和隐私保护政策
      agreementType: null, //区分三种协议： 1服务协议2隐私保护政策3论坛协议
      isShowGetCode: true, //区别 获取短信验证码/倒计时 默认true 获取短信验证码
      countdown: 60, //倒计时60
      skType: 'password', //区别 显示隐藏密码
      skType2: 'password', //区别 显示隐藏密码
      uuid: '', //后台需要验证的
      img: '', //动态验证码
      // isClickable: true,
      form: {
        // registerType: '', //用户身份
        ak: '', // 用户的用户名或者手机号或者邮箱号
        appId: '', // 应用id(从哪个应用进入到注册)
        code: '', // 用户收到的短信验证码 或 邮箱验证码
        sk: '', //密码
        sk2: '', //二次密码
        registerType: 1, // ,1-手机号加短信验证码加密码|2-手机号加短信验证码|3-邮箱号加邮箱验证码加密码|4-邮箱号加邮箱验证码|5-用户名加密码
        // email: '', //邮件
        // wechatNum: '', //微信号
        checked: false, //是否勾选上 默认false 没勾选上
        uuid: null // 短信验证码返回
      },
      rules: {
        // 用户身份 校验
        // registerType: [{ required: true, message: '用户身份不能为空', trigger: 'change' }],
        // 电话号码 校验
        ak: [{ required: true, validator: validatephoneNumberber, trigger: 'blur' }],
        // 图形验证码 校验
        picCode: [{ required: true, message: '图形验证码不能为空', trigger: 'change' }],
        // 短信验证码 校验
        code: [{ required: true, message: '短信验证码不能为空', trigger: 'change' }],
        // email: [{ validator: validateEmail, trigger: 'change' }],
        // wechatNum: [{ message: '微信号不能为空', trigger: 'change' }],
        sk: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ],
        sk2: [
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
  },
  methods: {
    // 输入手机号校验手机号是否存在
    phoneNumberBlur() {
      this.$axios.get(`/api/iam/v1/open/user/find?ak=${this.form.ak}&akType=${1}&appId=${this.form.appId}`).then((res) => {
        if (res.body) {
          this.$notify({
            title: '提示',
            message: '手机号已注册，可以直接登录',
            type: 'error'
          });
        } 
        // else {
        //   this.isClickable = false;
        // }
      });
    },
    /***
     * @param data 协议类型 1:平台服务协议 2:用户保密协议 3:论坛服务协议
     * **/
    checkAgreement(agreementType, catalogId) {
      //帮助文档协议
      // Geep5.0开发者平台服务协议,catalogId:352
      // Geep5.0开发者平台隐私保护政策,catalogId:353
      // Geep5.0开发者平台论坛服务协议,catalogId:354
      const params = {
        catalogId: catalogId
      };
      this.$axios.post('/api/document/doc/getDocumentContent', params).then((res) => {
        this.$refs.checkDealDialog.dialogVisible = true;
        this.dealData = res.body;
        this.agreementType = agreementType;
      });
      // let params = { agreementType: data };
      // this.$axios.post('/api/system/systemAgreement/detail', params).then((res) => {
      //   this.$refs.checkDealDialog.dialogVisible = true;
      //   this.dealData = res.body;
      // });
    },
    // 切换新密码 明文、暗文
    showPwd() {
      if (this.skType === 'password') {
        this.skType = '';
      } else {
        this.skType = 'password';
      }
    },
    //  切换重复密码 明文、暗文
    showPwd2() {
      if (this.skType2 === 'password') {
        this.skType2 = '';
      } else {
        this.skType2 = 'password';
      }
    },
    // 短信倒计时
    getIdentifyCode() {
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
    // 获取 动态验证
    captcha() {
      this.$axios.get('/api/open/common/captcha/image').then((res) => {
        this.img = 'data:image/png;base64,' + res.img;
        this.uuid = res.uuid;
      });
    },
    // 获取短信验证码
    getCode() {
      // this.getIdentifyCode();
      const { ak, picCode } = this.form;
      if (ak && picCode) {
        let params = {
          target: this.form.ak,
          uuid: this.uuid,
          code: this.form.picCode,
          verifyType: 1 //verifyType 验证类型 1:注册时手机验证码 2:重置密码验证码
        };
        this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
          if (res.status === 200) {
            this.form.uuid = res.body.uuid;
            this.getIdentifyCode();
            this.$notify({
              title: '提示',
              // message: '发送短信验证码操作成功',
              message: '验证码已发送到手机，请查收',
              type: 'success'
            });
          }
        });
      } else {
        this.$refs['form'].validateField(['ak', 'picCode']);
      }
    },
    // 注册信息 提交
    submitBtn() {
      if (!this.form.checked) {
        this.$notify({
          title: '提示',
          message: '请勾选协议',
          type: 'warning'
        });
        return false;
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const params = {
            ak: this.form.ak,
            appId: this.form.appId,
            code: this.form.code,
            registerType: 1,
            sk: this.$md5(this.form.sk),
            uuid: this.form.uuid
          }
          this.$axios.post('/api/iam/v1/open/user/register/submit', params).then((res) => {
            console.log(res, 'res')
            if (res.status === 200) {
            this.$notify({
              title: '提示',
              message: '用户注册成功',
              type: 'success'
            });
            this.$router.push({
              path: '/login'
            });
          }
            
          });
        } else {
          return false;
        }
      });
    },
    // 取消注册按钮返回登录页
    handleClose() {
      this.$router.push({
        path: '/login'
      });
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
.registerContentWrap {
  width: 100%;
  height: calc(100vh - 287px);
  background: #eff4f8;
  padding-top: 40px;
}
.registerContent {
  width: 540px;
  height: auto;
}
.userRegister {
  /* font-size: 16px; */
  /* font-weight: bolder; */
  /* margin-bottom: 12px; */
  line-height: 80px;
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
  cursor: pointer;
}
.agreementFont {
  color: #999990;
}
.registerBottom {
  display: inline-flex;
}
.loginFont {
  color: #2f74ff;
  cursor: pointer;
}
</style>
