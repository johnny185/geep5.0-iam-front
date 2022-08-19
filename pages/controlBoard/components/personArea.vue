<template>
  <div :class="isExceedHeight ? 'ExceedHeightWrap' : 'wrap'">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 个人信息 -->
      <el-tab-pane :label="$store.state.user.userInfo.registerType === '1' ? '个人信息' : '管理员信息'" name="1">
        <el-form label-width="100px">
          <el-form-item label="昵称">
            <span>{{ $store.state.user.userInfo.nickName }}</span>
            <el-button
              size="small"
              @click="upDateNickName"
              style="display: inline-block; margin-left: 10px"
              type="primary"
              >修改昵称</el-button
            >
          </el-form-item>
          <el-form-item label="认证状态">
            <!-- registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒" -->
            <p v-if="$store.state.user.userInfo.registerStatus === '0'">已注册未认证</p>
            <p v-if="$store.state.user.userInfo.registerStatus === '1'">已认证未审核</p>
            <p v-if="$store.state.user.userInfo.registerStatus === '2'">已认证</p>
            <p v-if="$store.state.user.userInfo.registerStatus === '3'">已认证未通过</p>
          </el-form-item>
          <el-form-item label="微信号">
            <p>{{ $store.state.user.userInfo.wechatNum }}</p>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <span>{{ $store.state.user.userInfo.email }}</span>
            <el-button size="small" @click="upDateEmail" type="primary" style="display: inline-block; margin-left: 10px"
              >修改电子邮箱</el-button
            >
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{ $store.state.user.userInfo.phoneNum | replacestar }}</span>
            <el-button
              size="small"
              @click="upDatePhoneNum"
              type="primary"
              style="display: inline-block; margin-left: 10px"
              >修改手机号</el-button
            >
          </el-form-item>
          <el-form-item label="注册时间">
            <p>{{ $store.state.user.userInfo.createTime }}</p>
          </el-form-item>
          <!-- <el-form-item> -->
          <el-button
            class="alterStyle"
            size="small"
            type="primary"
            @click="alterAdmin"
            v-if="$store.state.user.userInfo.registerType === '2' && $store.state.user.userInfo.registerStatus === '2'"
            >变更管理员</el-button
          >
          <!-- </el-form-item> -->
        </el-form>
      </el-tab-pane>
      <!-- 认证信息  -->
      <el-tab-pane label="认证信息" name="2">
        <div class="padding20">
          <p class="title fontSize24">认证记录</p>
          <p class="fontSize24 fontCenter" v-if="tableData.length === 0">暂无记录</p>
          <el-table v-else :data="tableData" style="width: 100%">
            <el-table-column prop="logContent"></el-table-column>
            <el-table-column prop="createTime"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="登录信息" name="3">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="logType" label="登录方式">
            <template slot-scope="scope">
              <p>{{ scope.row.logTypeName }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="登录时间"></el-table-column>
        </el-table>
      </el-tab-pane>
      <!--第三方平台授权登记  认证通过才回显  -->
      <el-tab-pane label="第三方平台授权登记" name="4" v-if="$store.state.user.userInfo.registerStatus === '2'">
        <thirdpartyRegister ref="thirdpartyRegister" @defineExceedHeight="defineExceedHeight" />
      </el-tab-pane>
    </el-tabs>
    <!-- 修改手机号 -->
    <el-dialog
      title="修改手机号"
      width="40%"
      top="15vh"
      :visible.sync="phoneNumVisible"
      :before-close="phoneNumhandleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="旧手机号码" prop="oldPhoneNumber">
          <el-input v-model.trim="form.oldPhoneNumber" placeholder="请输入旧手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="新手机号码" prop="phoneNumber">
          <el-input v-model.trim="form.phoneNumber" placeholder="请输入新手机号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="code" label="图形验证码">
          <div class="codeContent">
            <el-input v-model="form.code" placeholder="请输入图形验证码" clearable></el-input>
            <div class="codeBg">
              <img :src="img" alt @click="captcha(1)" width="100%" height="100%" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="短信验证码" prop="phoneCode">
          <div class="smsContent">
            <el-input v-model="form.phoneCode" placeholder="请输入短信验证码"></el-input>
            <div v-if="isShowGetCode" class="sendSms hoverStyle fontCenter" @click="getCode">获取验证码</div>
            <div v-else class="smsBtn fontCenter">{{ countdown }}s后可重试</div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="phoneNumhandleClose">取消</el-button>
        <el-button size="small" type="primary" @click="submitBtn">提交</el-button>
      </span>
    </el-dialog>
    <!-- 修改邮箱 -->
    <el-dialog title="修改邮箱" width="40%" top="15vh" :visible.sync="emailVisible" :before-close="emailhandleClose">
      <el-form ref="form2" :model="form2" :rules="rules2" label-width="100px">
        <el-form-item label="新邮箱" prop="email">
          <el-input
            v-model.trim="form2.email"
            placeholder="请输入新邮箱"
            clearable
            maxlength="40"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" label="图形验证码">
          <div class="codeContent">
            <el-input v-model="form2.code" placeholder="请输入图形验证码" clearable></el-input>
            <div class="codeBg">
              <img :src="img" alt @click="captcha(2)" width="100%" height="100%" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div class="smsContent">
            <el-input v-model="form2.emailCode" placeholder="请输入邮箱验证码"></el-input>
            <div v-if="isShowGetCodeEmail" class="sendSms hoverStyle fontCenter" @click="getCodeEmail">获取验证码</div>
            <div v-else class="smsBtn fontCenter">{{ countdownEmail }}s后可重试</div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="emailhandleClose">取消</el-button>
        <el-button size="small" type="primary" @click="emailSubmitBtn">提交</el-button>
      </span>
    </el-dialog>
    <!-- 修改昵称 -->
    <upDateNickNameDialog
      ref="upDateNickNameDialog"
      :upDataNickNam="upDataNickNam"
      @upDataSuccess="upDataSuccess"
    ></upDateNickNameDialog>
    <!-- 变更管理员信息 -->
    <upDateAdminInfoDialog ref="upDateAdminInfoDialog"></upDateAdminInfoDialog>
  </div>
</template>

<script>
import { telReg, emailReg } from '@/utils/validate';
import { removeToken } from '@/utils/auth';
import thirdpartyRegister from './thirdpartyRegister';
import upDateNickNameDialog from './upDateNickNameDialog'; // 修改 个人昵称
import upDateAdminInfoDialog from './upDateAdminInfoDialog'; // 修改

export default {
  components: {
    thirdpartyRegister,
    upDateNickNameDialog,
    upDateAdminInfoDialog
  },
  data() {
    // 手机号 校验
    var validatePhoneNumber = (rule, value, callback) => {
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
      if (value === '' || !emailReg(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    };
    return {
      isExceedHeight: false, //判断高度是否超过 默认高度，
      // 需要修改的昵称名称
      upDataNickNam: '',
      //默认展示
      activeName: this.$route.query.tab,
      tableData: [],
      //手机号部分：
      phoneNumVisible: false,
      img: '', //动态验证码
      isShowGetCode: true, //区别 获取短信验证码/倒计时 默认true 获取短信验证码
      countdown: 60, //倒计时60
      form: {
        phoneNumber: '', //电话
        code: '', //图形验证码
        phoneCode: '', //短信验证码
        uuid: '', //后台需要验证的
        oldPhoneNumber: '' //旧手机号
      },
      rules: {
        // 电话号码 校验
        phoneNumber: [{ required: true, validator: validatePhoneNumber, trigger: 'change' }],
        // 电话号码 校验
        oldPhoneNumber: [{ required: true, validator: validatePhoneNumber, trigger: 'change' }],
        // 图形验证码 校验
        code: [{ required: true, message: '图形验证码不能为空', trigger: 'change' }],
        // 短信验证码 校验
        phoneCode: [{ required: true, message: '短信验证码不能为空', trigger: 'change' }]
      },

      //修改邮箱部分
      emailVisible: false,
      isShowGetCodeEmail: true,
      countdownEmail: 60,
      form2: {
        email: '', //邮件
        code: '', //图形验证码
        emailCode: '', //邮箱验证码
        uuid: '' //后台需要验证的
      },
      rules2: {
        // 邮箱 校验
        email: [{ required: true, validator: validateEmail, trigger: 'change' }],
        // 图形验证码 校验
        code: [{ required: true, message: '图形验证码不能为空', trigger: 'change' }],
        // 短信验证码 校验
        emailCode: [{ required: true, message: '邮箱验证码不能为空', trigger: 'change' }]
      }
    };
  },
  watch: {
    $route() {
      this.activeName = this.$route.query.tab;
    }
  },

  mounted() {
    this.queryInfo(this.activeName);
  },
  methods: {
    alterAdmin() {
      this.$refs.upDateAdminInfoDialog.captcha();
      this.$refs.upDateAdminInfoDialog.dialogVisible = true;
    },
    // 确定高度过程 需要调整页面高度
    defineExceedHeight(data) {
      this.isExceedHeight = data;
    },
    // 保存成功后 重新刷新用户信息
    upDataSuccess() {
      this.queryInfo(this.activeName);
    },
    // 修改昵称
    upDateNickName() {
      this.upDataNickNam = this.$store.state.user.userInfo.nickName;
      this.$refs.upDateNickNameDialog.dialogVisible = true;
    },
    // 点击 个人信息 认证信息 登录信息 模块
    queryInfo(data) {
      let params = {};
      // 当为 个人信息、管理员信息
      if (data === '1') {
        this.$axios.get('/api/auth/user/authapi/common/user/info').then((res) => {
          this.$store.commit('user/addUserInfo', res.body);
        });
        this.isExceedHeight = false;
        return false;
      }
      // 当为 认证信息
      if (data === '2') {
        this.$axios.post('api/auth/user/authapi/common/user/log/list/register', params).then((res) => {
          this.tableData = res.body.list;
        });
        this.isExceedHeight = false;
        return false;
      }
      //当为 登录信息
      if (data === '3') {
        this.$axios.post('api/auth/user/authapi/common/user/log/list/login', { pageSize: 5 }).then((res) => {
          this.tableData = res.body.list;
        });
        this.isExceedHeight = false;
        return false;
      }
      // 当为 第三方平台授权登记
      if (data === '4') {
        this.$refs.thirdpartyRegister.queryList();
      }
    },
    // 切换标签
    handleClick(tab) {
      this.queryInfo(tab.name);
    },

    //修改手机号
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
    captcha(n) {
      this.$axios.get('/api/openapi/common/captcha').then((res) => {
        this.img = 'data:image/png;base64,' + res.img;
        if (n === 1) {
          this.form.uuid = res.uuid;
        } else if (n === 2) {
          this.form2.uuid = res.uuid;
        }
      });
    },
    // 获取短信验证码
    getCode() {
      const { phoneNumber, code } = this.form;
      if (phoneNumber && code) {
        let params = {
          target: this.form.phoneNumber,
          uuid: this.form.uuid,
          code: this.form.code,
          // templateCode: 'VERIFY_REGISTER',
          verifyType: 3 //verifyType 验证类型 1:注册时手机验证码 2:重置密码验证码 3:用户修改手机号时手机短信验证码 4:用户修改邮箱号时邮箱验证码"
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
        this.$refs['form'].validateField(['phoneNumber', 'code']);
      }
    },
    submitBtn() {
      const { oldPhoneNumber, phoneNumber } = this.form;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = {
            phoneNumber: this.form.phoneNumber,
            uuid: this.form.uuid,
            code: this.form.phoneCode,
            oldPhoneNumber: this.form.oldPhoneNumber
          };
          if (oldPhoneNumber !== this.$store.state.user.userInfo.phoneNum) {
            this.$notify({
              title: '提示',
              message: '旧手机号不正确，请重新输入。',
              type: 'info'
            });
            return;
          }
          if (phoneNumber === this.$store.state.user.userInfo.phoneNum) {
            this.$notify({
              title: '提示',
              message: '新手机号和旧手机号一致，请重新输入。',
              type: 'info'
            });
            return;
          }
          this.$axios.post('/api/auth/user/authapi/common/user/info/change/phoneNum', params).then((res) => {
            if (res.status === 200) {
              this.$notify({
                title: '提示',
                message: '操作成功,请重新登录。',
                type: 'success'
              });
              this.phoneNumhandleClose();
              this.logOut();
            }
          });
        } else {
          return false;
        }
      });
    },
    phoneNumhandleClose() {
      this.phoneNumVisible = false;
      this.$refs['form'].resetFields();
      clearInterval(this.timer);
      this.countdown = 60;
      this.isShowGetCode = true;
    },
    upDatePhoneNum() {
      this.phoneNumVisible = true;
      this.captcha(1);
    },
    // 重新登录
    logOut() {
      this.$nextTick(() => {
        let params = {
          username: '', //用户名称
          registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
          avatarUrl: '', //账户头像
          nickName: '', //昵称
          account: ''
        };
        // 删除token
        removeToken();
        this.$store.commit('user/resetUserd', params);
        this.$router.push({
          path: '/login'
        });
      });
    },
    //修改邮箱
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
    getCodeEmail() {
      const { email, code } = this.form2;
      if (email && code) {
        let params = {
          target: this.form2.email,
          uuid: this.form2.uuid,
          code: this.form2.code,
          verifyType: 4
        };
        this.$axios.post('/api/message/openapi/common/sms/verificationCode/send', params).then((res) => {
          if (res.status === 200) {
            this.form2.uuid = res.body.uuid;
            this.getIdentifyCodeEmail();
            this.$notify({
              title: '提示',
              message: '发送邮箱验证码操作成功',
              type: 'success'
            });
          }
        });
      } else {
        this.$refs['form2'].validateField(['email', 'code']);
      }
    },
    emailSubmitBtn() {
      const { email, code, emailCode } = this.form2;
      this.$refs['form2'].validate(async (valid) => {
        if (valid) {
          // if (email && emailCode && code) {
          let params = {
            email: this.form2.email,
            uuid: this.form2.uuid,
            code: this.form2.emailCode
          };
          await this.$axios.post('/api/auth/user/authapi/common/user/info/change/email', params).then((res) => {
            if (res.status === 200) {
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success'
              });
              // 保存成功后 刷新个人信息
              this.queryInfo(this.activeName);
              this.emailhandleClose();
            }
          });
          // 获取用户信息
          await this.$axios.get('/api/auth/user/authapi/common/user/info').then((res) => {
            this.$store.commit('user/addUserInfo', res.body);
          });
        } else {
          return false;
        }
      });
    },
    upDateEmail() {
      this.emailVisible = true;
      this.captcha(2);
    },
    emailhandleClose() {
      this.emailVisible = false;
      this.$refs['form2'].resetFields();
      clearInterval(this.timer2);
      this.countdownEmail = 60;
      this.isShowGetCodeEmail = true;
    }
  }
};
</script>

<style scoped>
.alterStyle {
  margin-left: 30px;
}
.ExceedHeightWrap {
  width: 1020px;
  height: 862px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  margin-left: 20px;
}
.wrap {
  width: 1020px;
  height: 589px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  margin-left: 20px;
}
.notCertified {
  width: 100px;
  height: 30px;
  line-height: 30px;
  line-height: 30px;
  background: #2f74ff;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.title {
  color: #333333;
}
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
