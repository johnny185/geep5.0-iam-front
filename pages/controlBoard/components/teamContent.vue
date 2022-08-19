<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="手机号" prop="phoneNumber" v-if="activeName === 'first' || activeName === 'second'">
        <el-input v-model="form.phoneNumber" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="短信验证码" prop="phoneCode" v-if="activeName === 'second'">
        <div class="smsContent">
          <el-input v-model="form.phoneCode" placeholder="请输入短信验证码"></el-input>
          <div v-if="isShowGetCode" class="sendSms hoverStyle fontCenter" @click="getCode">获取验证码</div>
          <div v-else class="smsBtn fontCenter">{{ countdown }}s后可重试</div>
        </div>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" v-if="activeName === 'first' || activeName === 'third'">
        <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="personFullName" v-if="activeName === 'first'">
        <el-input v-model="form.personFullName" placeholder="请输入真实姓名" maxlength="50" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <el-button size="small" type="primary" @click="submit">确定</el-button>
  </div>
</template>

<script>
import { telReg, emailReg } from '../../../utils/validate';
export default {
  props: {
    activeName: {
      type: String,
      default: 'first'
    }
  },
  data() {
    // 联系方式 校验
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系方式'));
      }
      if (!telReg(value)) {
        callback(new Error('手机格式不正确'));
      } else {
        callback();
      }
    };
    // 邮箱 校验
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'));
      } else if (!emailReg(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    };
    return {
      isShowGetCode: true, //区别 获取短信验证码/倒计时 默认true 获取短信验证码
      countdown: 60, //倒计时60
      form: {
        phoneNumber: '', //手机号
        email: '', //邮箱
        phoneCode: '', //短信验证码
        personFullName: '' //真实姓名
      },
      rules: {
        //联系方式 校验
        phoneNumber: [{ required: true, trigger: 'change', validator: validatePhone }],
        phoneCode: [{ required: true, message: '短信验证码不能为空', trigger: 'change' }],
        // 邮箱 校验
        email: [{ required: true, validator: validateEmail, trigger: 'change' }],
        // 姓名校验
        personFullName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }]
      }
    };
  },
  methods: {
    validateForm() {
      let flag = false;
      this.$refs['form'].validate((valid) => {
        flag = valid;
      });
      return flag;
    },
    submit() {
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     alert('submit!');
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });
      var flag = false;
      this.$refs['form'].validate((valid) => {
        flag = valid;
      });
      return flag;
    },
    // 校验
    validForm() {
      this.$nextTick(() => {
        var flag = false;
        this.$refs['form'].validate((valid) => {
          flag = valid;
        });
        return flag;
      });
      // this.$refs['form'].validate((valid) => {
      //   console.log(valid);
      // });
    },
    // 获取短信验证码
    getCode() {
      this.getIdentifyCode();
      // const { phoneNumber, code } = this.form;
      // if (phoneNumber && code) {
      //   let params = {
      //     target: this.form.phoneNumber,
      //     uuid: this.form.uuid,
      //     code: this.form.code,
      //     // templateCode: 'VERIFY_REGISTER',
      //     verifyType: 3 //verifyType 验证类型 1:注册时手机验证码 2:重置密码验证码 3:用户修改手机号时手机短信验证码 4:用户修改邮箱号时邮箱验证码"
      //   };
      //   this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
      //     if (res.status === 200) {
      //       this.form.uuid = res.body.uuid;
      //       this.getIdentifyCode();
      //       this.$notify({
      //         title: '提示',
      //         message: '发送短信验证码操作成功',
      //         type: 'success'
      //       });
      //     }
      //   });
      // } else {
      //   this.$refs['form'].validateField(['phoneNumber', 'code']);
      // }
    },
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
    }
  }
};
</script>

<style scoped>
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
