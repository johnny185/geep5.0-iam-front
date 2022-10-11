<template>
  <div>
    <el-dialog 
      :title="emailStatus+'邮箱'" 
      width="40%" 
      top="15vh" 
      :visible.sync="dialogVisible" 
      :before-close="handleClose" 
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="新邮箱" prop="email">
          <el-input
            v-model.trim="form.email"
            placeholder="请输入新邮箱"
            clearable
            maxlength="40"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" label="图形验证码">
          <div class="codeContent">
            <el-input v-model="form.code" placeholder="请输入图形验证码" clearable></el-input>
            <div class="codeBg">
              <img :src="img" alt @click="captcha()" width="100%" height="100%" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div class="smsContent">
            <el-input v-model="form.emailCode" maxlength="6" placeholder="请输入邮箱验证码"></el-input>
            <div v-if="isShowGetCodeEmail" class="sendSms hoverStyle fontCenter" @click="getCodeEmail">获取验证码</div>
            <div v-else class="smsBtn fontCenter">{{ countdownEmail }}s后可重试</div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="submitBtn">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { emailReg } from '@/utils/validate';
export default {
  props: {
    // appId
    appId: {
      type: String,
      default: null
    },
    emailStatus: {
      type: String,
      default: null
    }
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === '' || !emailReg(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback(this.userNameBlur());
      }
    };
    return {
      form: {
        email: '', //邮件
        code: '', //图形验证码
        emailCode: '', //邮箱验证码
        uuid: '' //后台需要验证的
      },
      img: '', //动态验证码
      dialogVisible: false,
      isShowGetCodeEmail: true,
      countdownEmail: 60, // 邮箱验证码倒计时
      rules: {
        // 邮箱 校验
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        // 图形验证码 校验
        code: [{ required: true, message: '图形验证码不能为空', trigger: 'change' }],
        // 短信验证码 校验
        emailCode: [{ required: true, message: '邮箱验证码不能为空', trigger: 'change' }]
      },
    };
  },
  mounted() {
    this.captcha();
  },
  methods: {
    // 输入邮箱校验是否存在
    userNameBlur() {
      let params = {
            ak:this.form.email,
            akType:3,
            appId:Number(this.appId)
          }
      this.$axios.post('/api/iam/v1/open/user/find',params).then((res) => {
        if (res.body) {
          this.$notify({
            title: '提示',
            message: '邮箱已存在',
            type: 'error'
          });
        }
      });
    },
    // 获取 动态验证
    captcha() {
      this.$axios.get('/api/open/common/captcha/image').then((res) => {
        this.img = 'data:image/png;base64,' + res.img;
          this.form.uuid = res.uuid;
      });
    },
    getCodeEmail() {
      const { email, code } = this.form;
      if (email && code) {
        let params = {
          target: this.form.email,
          uuid: this.form.uuid,
          code: this.form.code,
          verifyType: 4
        };
        this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
          if (res.status === 200) {
            this.form.uuid = res.body.uuid;
            this.getIdentifyCodeEmail();
            this.$notify({
              title: '提示',
              message: '发送邮箱验证码操作成功',
              type: 'success'
            });
          }
        });
      } else {
        this.$refs['form'].validateField(['email', 'code']);
      }
    },
    // 邮箱倒计时
    getIdentifyCodeEmail() {
      this.countDownEmail();
      this.isShowGetCodeEmail = false;
    },
    // 倒计时
    countDownEmail() {
      this.timer2 = setInterval(() => {
        this.countdownEmail--;
        if (this.countdownEmail === 0) {
          clearInterval(this.timer2);
          this.countdownEmail = 60;
          this.isShowGetCodeEmail = true;
        }
      }, 1000);
    },
    // 提交修改 昵称
    submitBtn() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          // if (email && emailCode && code) {
          let params = {
            ak: this.form.email,
            uuid: this.form.uuid,
            code: this.form.emailCode
          };
          this.$axios.post('/api/iam/v1/auth/user/info/change/email', params).then((res) => {
            if (res.status === 200) {
               this.$emit('upDataSuccess');
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success'
              });
              this.handleClose();
            }
          });
        }
      });
    },
    handleClose() {
      clearInterval(this.timer2);
      this.countdownEmail = 60;
      this.isShowGetCodeEmail = true;
      this.$refs['form'].resetFields();
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
.codeContent {
  display: flex;
}
.codeBg {
  width: 204px;
  height: 40px;
  background: #eee;
  border-radius: 4px;
  margin-left: 20px;
}
.smsContent {
  display: flex;
}
.sendSms {
  width: 204px;
  height: 40px;
  background: #409eff;
  color: #fff;
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
</style>