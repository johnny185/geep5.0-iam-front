<template>
  <div>
    <el-dialog
      title="变更管理员信息"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model.trim="form.phoneNumber" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="picCode" label="图形验证码">
          <div class="codeContent">
            <el-input v-model="form.picCode" placeholder="请输入图形验证码" clearable></el-input>
            <img :src="img" class="codeBg hoverStyle" alt @click="captcha" />
          </div>
        </el-form-item>
        <el-form-item label="短信验证码" prop="phoneCode">
          <div class="smsContent">
            <el-input v-model.trim="form.phoneCode" placeholder="请输入短信验证码"></el-input>
            <div v-if="isShowGetCode" class="sendSms hoverStyle fontCenter" @click="getCode">获取验证码</div>
            <div v-else class="smsBtn fontCenter">{{ countdown }}s后可重试</div>
          </div>
        </el-form-item>
        <el-form-item label="设置新密码" prop="password">
          <el-input
            clearable
            :type="passwordType"
            v-model.trim="form.password"
            inline-message
            placeholder="请输入不少于6位密码，必须包含数字、大小写字母、特殊字符任意两种"
          ></el-input>
          <span class="showPwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="重复新密码" prop="password2">
          <el-input
            :type="passwordType2"
            v-model.trim="form.password2"
            clearable
            inline-message
            placeholder="请输入不少于6位密码，必须包含数字、大小写字母、特殊字符任意两种"
          ></el-input>
          <span class="showPwd" @click="showPwd2">
            <svg-icon :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="微信号" prop="wechatNum">
          <el-input v-model.trim="form.wechatNum" placeholder="请输入微信号" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入邮箱帐号" maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="personFullName">
          <el-input
            v-model="form.personFullName"
            placeholder="请输入真实姓名"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="personIdCardNum">
          <el-input v-model="form.personIdCardNum" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="上传身份证">
          <div>
            <p class="remarksStyle">图片格式JPG、JPEG、PNG，尺寸不大于3M</p>
            <ul class="IDImgWrap">
              <!-- 身份证正面 -->
              <li class="IDImgItem">
                <el-form-item prop="personIdCardPhotoFront">
                  <el-input v-if="false" v-model="form.personIdCardPhotoFront" />
                  <upload
                    :isPublic="isPublic"
                    :isTmp="isTmp"
                    :fileType="fileType"
                    :fileSize="fileSize"
                    @handleSuccess="handleSuccess(arguments)"
                    :imgUrl="form.personIdCardPhotoFrontUrl"
                    :bgImg="bgImg3"
                    :uploadType="uploadType1"
                  ></upload>
                </el-form-item>
                <p class="IDtitle">
                  上传身份证
                  <span class="bold">姓名面</span>照片
                </p>
              </li>
              <!-- 身份证 反面 -->
              <li class="IDImgItem">
                <el-form-item prop="personIdCardPhotoNegative">
                  <el-input v-if="false" v-model="form.personIdCardPhotoNegative" />
                  <upload
                    :isPublic="isPublic"
                    :isTmp="isTmp"
                    :fileType="fileType"
                    :fileSize="fileSize"
                    @handleSuccess="handleSuccess(arguments)"
                    :uploadType="uploadType2"
                    :imgUrl="form.personIdCardPhotoNegativeUrl"
                    :bgImg="bgImg2"
                  ></upload>
                </el-form-item>
                <p class="IDtitle">
                  上传身份证
                  <span class="bold">国徽面</span>照片
                </p>
              </li>
              <!-- 手持身份证 -->
              <li class="IDImgItem hold">
                <el-form-item prop="personIdCardPhotoHand">
                  <el-input v-if="false" v-model="form.personIdCardPhotoHand" />
                  <upload
                    :isPublic="isPublic"
                    :isTmp="isTmp"
                    :fileType="fileType"
                    :fileSize="fileSize"
                    @handleSuccess="handleSuccess(arguments)"
                    :bgImg="bgImg3"
                    :imgUrl="form.personIdCardPhotoHandUrl"
                    :uploadType="uploadType3"
                  ></upload>
                </el-form-item>
                <p class="IDtitle">
                  上传手持
                  <span class="bold">身份证</span>照片
                </p>
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input
            type="textarea"
            placeholder="请输入详细地址（省/市/街道/门牌号）"
            v-model="form.address"
            maxlength="200"
            show-word-limit
            :rows="8"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { passwordReg, telReg, emailReg, regId } from '../../../utils/validate';
import bgImg1 from '../../../static/img/login/positiveImg.png';
import bgImg2 from '../../../static/img/login/backImg.png';
import bgImg3 from '../../../static/img/login/holdImg.png';
export default {
  data() {
    // 手机号 校验
    var validatephoneNumberber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'));
      } else if (!telReg(value)) {
        callback(new Error('请输入正确的手机号'));
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
      } else if (value !== this.form.password) {
        return callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    // 身份证号 校验
    var validatepersonIdCardNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('身份证号不能为空'));
      }
      if (!regId(value)) {
        callback(new Error('身份证号格式不正确'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      isShowGetCode: true, //区别 获取短信验证码/倒计时 默认true 获取短信验证码
      uploadType1: 'positive', //标识 上传的图片 是 身份正面
      uploadType2: 'back', //标识 上传的图片 是 身份证反面
      uploadType3: 'hold', //标识 上传的图片 是 手持身份图片
      fileType: 'jpg,jpeg,png',
      fileSize: 2,
      form: {
        phoneNumber: '', // 手机号
        picCode: '', //图形验证码
        phoneCode: '', //短信验证码
        password: '', //密码
        password2: '', //二次密码
        email: '', //邮件
        wechatNum: '', //微信号
        personFullName: '', //真实姓名
        personIdCardNum: '', //身份证号
        address: '', //地址
        personIdCardPhotoFront: '', //身份证 正面 图片id
        personIdCardPhotoFrontUrl: '', //身份证 正面 文件图片回显url
        personIdCardPhotoNegative: '', //身份证 反面 图片id
        personIdCardPhotoNegativeUrl: '', //身份证 反面 文件图片回显url
        personIdCardPhotoHand: '', //手持身份证 图片id
        personIdCardPhotoHandUrl: '' //手持身份证 文件图片回显url
      },
      isPublic: false,
      isTmp: true, // 可选参数，默认是false. 身份证 true  true代表临时文件，临时文件7天之后文件系统会自动删除
      img: '', //动态验证码
      uuid: '', //后台需要验证的
      passwordType: 'password', //区别 显示隐藏密码
      passwordType2: 'password', //区别 显示隐藏密码
      bgImg1: bgImg1, //身份证 正面 背景图
      bgImg2: bgImg2, //身份 背面 背景图
      bgImg3: bgImg3, //手持身份证 背景图
      rules: {
        // 电话号码 校验
        phoneNumber: [{ required: true, validator: validatephoneNumberber, trigger: 'change' }],
        // 图形验证码 校验
        picCode: [{ required: true, message: '图形验证码不能为空', trigger: 'change' }],
        // 短信验证码 校验
        phoneCode: [{ required: true, message: '短信验证码不能为空', trigger: 'change' }],
        // 短信验证码 校验
        phoneCode: [{ required: true, message: '短信验证码不能为空', trigger: 'change' }],
        email: [{ required: true, validator: validateEmail, trigger: 'change' }],
        wechatNum: [{ message: '微信号不能为空', trigger: 'change' }],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ],
        password2: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass2
          }
        ],
        // 地址 校验
        address: [{ required: true, message: '详细地址不能为空', trigger: 'change' }],
        // 姓名校验
        personFullName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }],
        //
        personIdCardNum: [{ validator: validatepersonIdCardNum, required: true, trigger: 'change' }],
        // 身份证正面  校验
        personIdCardPhotoFront: [{ required: true, message: '身份证正面不能为空', trigger: 'change' }],
        //  身份证反面 校验
        personIdCardPhotoNegative: [{ required: true, message: '身份证反面不能为空', trigger: 'change' }],
        // 手持身份证 校验
        personIdCardPhotoHand: [{ required: true, message: '手持身份证不能为空', trigger: 'change' }]
      },
      countdown: 60 //倒计时60
    };
  },
  methods: {
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
    // 获取短信验证码
    getCode() {
      const { phoneNumber, picCode } = this.form;
      if (phoneNumber && picCode) {
        let params = {
          target: this.form.phoneNumber,
          uuid: this.uuid,
          code: this.form.picCode,
          verifyType: 3 //verifyType 验证类型 1:注册时手机验证码 2:重置密码验证码 3:用户修改手机号时手机短信验证码 4:用户修改邮箱号时邮箱验证码"  5:短信通用验证码
        };
        this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
          if (res.status === 200) {
            this.form.uuid = res.body.uuid;
            this.getIdentifyCode();
            this.$notify({
              title: '提示',
              message: '发送短信验证码操作成功',
              type: 'success'
            });
          }
        });
      } else {
        this.$refs['form'].validateField(['phoneNumber', 'picCode']);
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
      this.$axios.get('/api/openapi/common/captcha').then((res) => {
        this.img = 'data:image/png;base64,' + res.img;
        this.uuid = res.uuid;
      });
    },
    handleClose() {
      this.reset();
      this.dialogVisible = false;
    },
    reset() {
      this.$refs['form'].resetFields();
      //身份证正面照url清空
      this.form.personIdCardPhotoFrontUrl = '';
      //身份证反面照url清空
      this.form.personIdCardPhotoNegativeUrl = '';
      //身份证手持url清空
      this.form.personIdCardPhotoHandUrl = '';
    },
    // 图片上传成功
    handleSuccess(data) {
      // 身份证 正面
      if (data[1] === 'positive') {
        this.$set(this.form, 'personIdCardPhotoFront', data[0].body.fileUid);
        this.$set(this.form, 'personIdCardPhotoFrontUrl', data[0].body.downloadUrl);
        this.$refs.form.clearValidate('personIdCardPhotoFront');
      } else if (data[1] === 'back') {
        this.$set(this.form, 'personIdCardPhotoNegative', data[0].body.fileUid);
        this.$set(this.form, 'personIdCardPhotoNegativeUrl', data[0].body.downloadUrl);
        this.$refs.form.clearValidate('personIdCardPhotoNegative');
      } else {
        this.$set(this.form, 'personIdCardPhotoHand', data[0].body.fileUid);
        this.$set(this.form, 'personIdCardPhotoHandUrl', data[0].body.downloadUrl);
        this.$refs.form.clearValidate('personIdCardPhotoHand');
      }
    },
    // 提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = Object.assign(this.form, { code: this.form.phoneCode });
          this.$axios.post('/api/auth/user/authapi/front/companyAdminChangeApply/submit', params).then((res) => {
            this.$notify({
              title: '提示',
              message: '变更管理员信息操作成功',
              type: 'success'
            });
            this.handleClose();
          });
        }
      });
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
.smsContent {
  display: flex;
}
.IDImgWrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.IDImgItem {
  width: 166px;
  height: auto;
}
.IDImgBox {
  width: 166px;
  height: 132px;
  background: #fafdff;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  position: relative;
}
</style>
