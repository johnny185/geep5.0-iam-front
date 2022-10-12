<template>
  <div :class="isExceedHeight ? 'ExceedHeightWrap' : 'wrap'">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-box">
      <!-- 个人信息 -->
      <el-tab-pane label="个人信息" name="1">
        <el-form label-width="100px">
          <el-form-item label="昵称">
            <span>{{ $store.state.user.userInfo.nickName }}</span>
            <el-button size="small" @click="upDateNickName" style="display: inline-block; margin-left: 10px"
              type="primary">修改昵称</el-button>
          </el-form-item>
          <el-form-item label="性别">
            <span>{{ sexFilter(userInfo.sex || $store.state.user.userInfo.sex) }}</span>
            <!-- <span v-if="$store.state.user.userInfo.sex === 0">未知</span>
            <span v-else-if="$store.state.user.userInfo.sex === 1">男</span>
            <span v-else-if="$store.state.user.userInfo.sex === 2">女</span>
            <span v-else-if="$store.state.user.userInfo.sex === 3">保密</span> -->
            <!-- <span>{{ $store.state.user.userInfo.sex === 0 ? '未知': $store.state.user.userInfo.sex === 1 ? '男': $store.state.user.userInfo.sex === 1 ? '女' : '保密' }}</span> -->
            <el-button size="small" @click="upDateSex" type="primary" style="display: inline-block; margin-left: 10px">
              设置</el-button>
          </el-form-item>
          <el-form-item label="三方登录">
            <span>{{ '暂未开通' }}</span>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <span>{{ userInfo.email|| $store.state.user.userInfo.email  }}</span>
            <el-button size="small" @click="upDateEmail" type="primary"
              style="display: inline-block; margin-left: 10px">{{ $store.state.user.userInfo.email === null ? '绑定' :
              '修改' }}电子邮箱</el-button>
          </el-form-item>
          <el-form-item label="手机号">
            <span v-if="$store.state.user.userInfo.phoneNum === null">无</span>
            <span v-else>{{userInfo.phoneNum  || $store.state.user.userInfo.phoneNum || replacestar}}</span>
            <el-button size="small" @click="upDatePhoneNum" type="primary"
              style="display: inline-block; margin-left: 10px">{{ $store.state.user.userInfo.phoneNum === null ? '绑定' :
              '修改' }}手机号</el-button>
          </el-form-item>
          <el-form-item label="注册时间">
            <p>{{ $store.state.user.userInfo.createTime || userInfo.createTime }}</p>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 认证信息  -->
      <el-tab-pane label="认证信息" name="2">
        <div class="padding20">
          <div v-if="$store.state.user.userInfo.registerType  !== 0">
            <el-form label-width="100px">
              <el-form-item label="认证类型" label-width="150px">
                <span>{{authenticationInfo.applyType === 1 ? '个人' : '企业'}}</span>
              </el-form-item>
              <div v-if="authenticationInfo.applyType === 1">
                <el-form-item label="认证主体" label-width="150px">
                  <span>{{ authenticationInfo.personFullName }}</span>
                </el-form-item>
                <el-form-item label="身份证有效期" label-width="150px" v-show="auditPassed===1||(auditPassed===0&&applyType===3)">
                  <span>{{authenticationInfo.personIdCardPeriodStartDate? authenticationInfo.personIdCardPeriodStartDate.substring(0,10):'' }} 至
                  {{authenticationInfo.personIdCardPeriodEndDate? authenticationInfo.personIdCardPeriodEndDate.substring(0,10):'' }}</span>
                  <span v-if="authenticationInfo.personIdCardIsLongEffective">长期</span>
                  <el-button type="primary" class="marginLeft10" size="mini" v-show="auditPassed===1||(auditPassed===2&&applyType===3)"
                    @click="resetSubmit('idCard')">更换身份证</el-button>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item label="认证主体" label-width="150px">
                  <span>{{ authenticationInfo.companyName }}</span>
                  <el-button v-show="auditPassed===1||(auditPassed===2&&applyType===4)" type="primary" class="marginLeft10" size="mini"
                    @click="resetSubmit('license')">变更营业执照</el-button>
                </el-form-item>
                <el-form-item label="营业执照有效期" label-width="150px" v-show="auditPassed===1">
                  <!-- <span v-if="authenticationInfo.personIdCardIsLongEffective">长期</span> -->
                  <span>{{ authenticationInfo.licenseStartDate?authenticationInfo.licenseStartDate.substring(0,10):'' }} 至 {{ authenticationInfo.licenseEndDate?authenticationInfo.licenseEndDate.substring(0,10):'' }}</span>
                </el-form-item>
                <!-- <el-form-item label="管理员" label-width="150px" v-show="auditPassed===1">
                  {{ authenticationInfo.personFullName }}
                  <el-button type="primary" class="marginLeft10" size="mini"
                    @click="resetSubmit('name')">变更管理员</el-button>
                </el-form-item>
                <el-form-item label="管理员身份证有效期" label-width="150px" v-show="auditPassed===1">
                  <span>{{ authenticationInfo.personIdCardPeriodStartDate }} 至 {{
                  authenticationInfo.personIdCardPeriodEndDate }}</span>
                </el-form-item> -->
              </div>
              <el-form-item label="通讯地址" label-width="150px" v-show="auditPassed===1">
                <span>{{ addressDetails }}</span>
                <el-button type="primary" class="marginLeft10" size="mini"
                  @click="resetSubmit('address')">修改地址</el-button>
              </el-form-item>
              <!-- <el-form-item label="认证类型">
                <span>个人</span>
              </el-form-item> -->
            </el-form>
            <p class="title fontSize16">认证记录</p>
            <p class="fontSize16 fontCenter" v-if="tableData.length === 0">暂无记录</p>
            <el-table v-else :data="tableData" style="width: 100%">
              <el-table-column prop="applyType" label="申请类型" align="center">
                <template slot-scope="scope">
                  {{ scope.row.applyType === 1 ? '个人实名认证' : scope.row.applyType === 2 ? '企业认证' : scope.row.applyType === 3 ? '更换身份证':'变更营业执照' }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="提交时间" align="center"></el-table-column>
              <el-table-column prop="auditTime" label="审核时间" align="center"></el-table-column>
              <el-table-column prop="auditPassed" label="审核结果" align="center">
                <template slot-scope="scope">
                  {{ scope.row.auditPassed === 0 ? '审核中' : scope.row.auditPassed === 1 ? '审核通过' : '审核不通过' }}
                </template>
              </el-table-column>
              <el-table-column prop="auditPassed">
                <template slot-scope="scope" v-if="scope.$index==tableData.length-1">
                  <el-button size="small" v-if="scope.row.auditPassed === 2 && (scope.row.applyType===1||scope.row.applyType===2)" @click="resetSubmit('reset')">重新提交
                  </el-button>
                  <!-- <el-button size="small" @click="applyPost">审核</el-button> -->
                  <!-- {{ scope.row.auditPassed === 2 ? '审核中' : scope.row.auditPassed === 1 ? '审核通过' : '审核不通过' }} -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else>
            <el-radio-group v-model="registerType" @change="replaceRegisterType"
              style="display:block; text-align:center" v-show="$store.state.user.userInfo.registerType!== 0&&(editType==='reset'||!editType)">
              <el-radio :label="1">个人</el-radio>
              <el-radio :label="2">企业</el-radio>
            </el-radio-group>
            <div v-if="registerType === 1" style="width: 760px; margin: 0 auto;">
              <certifiedPerson @queryInfo="queryInfo" @cancel="cancelResetSubmit" :resetCertified="resetCertified"
                :formParams="authenticationInfoPerson" :editType="editType"></certifiedPerson>
            </div>
            <div v-if="registerType === 2" style="width:90%">
              <certifiedCompany @queryInfo="queryInfo" @cancel="cancelResetSubmit" :resetCertified="resetCertified"
                :formParams="authenticationInfoCompany" :editType="editType"></certifiedCompany>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="登录信息" name="3">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="eventContent" label="登录方式">
            <template slot-scope="scope">
              <p>{{ loginMode(scope.row.eventType) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="登录时间"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="安全信息" name="4">
        <div class="padding20">
          <p class="title fontSize24">安全信息</p>
          <div class="padding20">
            <dl style="width: 46%">
              <dt class="dtStyle">
                <div class="">密码重置：</div>
                <div class="btnStyle" @click="resetPassword">重置</div>
              </dt>
              <dd class="ddStyle">上次重置密码时间{{resetTime}}</dd>
            </dl>
          </div>
          <div class="padding20">
            <dl style="width: 46%">
              <dt class="dtStyle">
                <div class="">帐户注销：</div>
                <div class="btnStyle" @click="accountNubLogOff">注销</div>
              </dt>
              <dd class="ddStyle">帐号注销后将彻底清除您的帐号和相关数据</dd>
            </dl>
          </div>
          <div class="padding20">
            <dl style="width: 46%">
              <dt class="dtStyle">
                <div class="">帐户退出：</div>
                <div class="btnStyle" @click="accountOut">退出</div>
              </dt>
              <dd class="ddStyle">退出当前帐号在所有浏览器的登录，并清除浏览器的信任状态</dd>
            </dl>
          </div>
          <div class="padding20">
            <dl style="width: 46%">
              <dt class="dtStyle">
                <div class="">隐私政策</div>
                <div class="btnStyle" @click="dutyView">查看</div>
              </dt>
              <!-- <dd class="ddStyle">上次重置密码时间：2022-08-08  10：00：00</dd> -->
            </dl>
          </div>
        </div>
      </el-tab-pane>
      <!--第三方平台授权登记  认证通过才回显  -->
      <!-- <el-tab-pane label="第三方平台授权登记" name="5" v-if="$store.state.user.userInfo.registerStatus === '2'">
        <thirdpartyRegister ref="thirdpartyRegister" @defineExceedHeight="defineExceedHeight" />
      </el-tab-pane> -->
    </el-tabs>
    <!-- 修改手机号 -->
    <el-dialog :title="titleStatus+'手机号'" width="40%" top="15vh" :visible.sync="phoneNumVisible"
      :before-close="phoneNumhandleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item v-if="$store.state.user.userInfo.phoneNum !== null" label="旧手机号码" prop="oldPhoneNumber">
          <el-input v-model.trim="form.oldPhoneNumber" maxlength="11" placeholder="请输入旧手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="新手机号码" prop="phoneNumber">
          <el-input v-model.trim="form.phoneNumber" maxlength="11" placeholder="请输入新手机号" clearable></el-input>
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
            <el-input v-model="form.phoneCode" maxlength="6" placeholder="请输入短信验证码"></el-input>
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
    <!-- 帐户注销 -->
    <el-dialog title="帐号注销" width="40%" top="15vh" :visible.sync="accountVisible" :before-close="accounthandleClose">
      <span>请联系管理员400-000-000!</span>
    </el-dialog>
    <!-- 修改昵称 -->
    <upDateNickNameDialog ref="upDateNickNameDialog" :upDataNickNam="upDataNickNam" @upDataSuccess="upDataSuccess">
    </upDateNickNameDialog>
    <!-- 修改性别 :upDateSexs="upDateSexs"-->
    <upDateSexDialog ref="upDateSexDialog" :upDateSexs="upDateSexs" @upDataSuccess="upDataSuccess"></upDateSexDialog>
    <!-- 修改邮箱 -->
    <upDateEmailDialog ref="upDateEmailDialog" :appId="appId" :emailStatus="emailStatus" @upDataSuccess="upDataSuccess">
    </upDateEmailDialog>
  </div>
</template>

<script>
import { telReg, emailReg } from '@/utils/validate';
import { removeToken } from '@/utils/auth';
import upDateNickNameDialog from './upDateNickNameDialog'; // 修改 个人昵称
import upDateSexDialog from './upDateSexDialog'; // 修改 性别
import upDateEmailDialog from './upDateEmailDialog'; // 修改 邮箱
import certifiedPerson from './certifiedPerson';
import certifiedCompany from './certifiedCompany';


export default {
  components: {
    upDateNickNameDialog,
    upDateSexDialog,
    upDateEmailDialog,
    certifiedPerson,
    certifiedCompany
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

    var validateCode = (rule, value, callback) => {
      if (!value || !value.trim()) {
        callback(new Error('图形验证码不能为空'));
      }else {
        callback();
      }
    };
    return {
      appId: this.$route.query.appId,
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
      resetTime: '', // 重置时间
      rules: {
        // 电话号码 校验
        phoneNumber: [{ required: true, validator: validatePhoneNumber, trigger: ['change','blur'] }],
        // 电话号码 校验
        oldPhoneNumber: [{ required: true, validator: validatePhoneNumber, trigger: ['change','blur'] }],
        // 图形验证码 校验
        code: [{ required: true, validator:validateCode, trigger:  ['change','blur'] }],
        // 短信验证码 校验
        phoneCode: [{ required: true, message: '短信验证码不能为空', trigger:  ['change','blur'] }]
      },
      accountVisible: false,
      // 认证信息
      registerType: 1,
      titleStatus: '', // 手机号绑定状态
      emailStatus: '', // 邮箱绑定状态
      upDateSexs: null, // 性别更新
      authenticationInfo: {}, // 认证详情
      authenticationInfoPerson:{},
      authenticationInfoCompany:{},
      addressDetails: '', // 认证详情地址
      // registerHeight: false
      resetCertified: false,// 重新认证显示取消按钮
      editType: 'reset',//修改字段类型
      auditPassed: 0,//审核状态
      applyType:0, //审核类型
      userInfo:{}
    };
  },
  watch: {
    $route() {
      this.activeName = this.$route.query.tab;
      this.appId = this.$route.query.appId;
    }
  },
  mounted() {
    // console.log(this.$store.state.user.userInfo, 'info')
    this.queryInfo(this.activeName);
    if(!!this.$store.state.user.userInfo.token)this.cancelResetSubmit()
  },
  methods: {
    dutyView(){
      let routeUrl = this.$router.resolve({
        path: "/duty",
      });
      window.open(routeUrl.href, '_blank');
    },
    applyPost() {
      const params = {
        "applyId": '1580088468740591618',
        "applyType": 2,
        "auditOpinion": "测试通过",
        "auditPassed": 2
      }
      this.$axios.post('/api/iam/v1/auth/manage/certification/apply/audit', params).then((res) => {
        this.$store.commit('user/addRegisterType', 1);
      });

    },
    // 重新提交
    resetSubmit(e) {
      this.$store.commit('user/addRegisterType', 0);
      this.resetCertified = true
      this.editType = e;
    },
    cancelResetSubmit() {
      this.$store.commit('user/addRegisterType', 1);
      this.resetCertified = false
      this.editType = 'reset';
      if(this.tableData.length > 0){
        const type = this.tableData[this.tableData.length - 1].applyType;
        if(type === 2 || type === 4){
          this.registerType =2;
        }else{
          this.registerType =1;
        }
      }
    },
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
     queryInfo(data, type) {
      let params = {};
      // 当为 个人信息、管理员信息
      if (data == '1') {
         this.$axios.get('/api/iam/v1/auth/user/get').then((res) => {
          this.$store.commit('user/addUserInfo', res.body);
          this.userInfo = res.body
        });
        this.isExceedHeight = false;
        return false;
      }
      // 当为 认证信息
      if (data === '2') {
        this.registerType = 1;
        if (this.$store.state.user.userInfo.authenticationStatus  !== 0 || type === 'sumitExamine') {
          this.$axios.get('api/iam/v1/auth/certification/apply/info').then((res) => {
            this.authenticationInfo = res.body;
            if(this.authenticationInfo.applyType===1)this.authenticationInfoPerson=this.authenticationInfo;
            if(this.authenticationInfo.applyType===2)this.authenticationInfoCompany=this.authenticationInfo;
            this.addressDetails = `${res.body.addressLeve1}${res.body.addressLeve2}${res.body.addressLeve3}${res.body.address}`
          })
          this.$axios.post('api/iam/v1/auth/certification/list/log', params).then((res) => {
            this.tableData = res.body;

            if (this.tableData.length > 0) {
              this.auditPassed = this.tableData[this.tableData.length - 1].auditPassed;

              const type = this.tableData[this.tableData.length - 1].applyType;
              this.applyType = type;
              if(type === 2 || type === 4){
                this.registerType =2;
              }else{
                this.registerType =1;
              }
            }
          });
        }
        this.isExceedHeight = true;
        return false;
      }
      //当为 登录信息
      if (data === '3') {
        let params = {
          eventType: [1, 2, 3, 4, 5, 6],
          pageNum: 1,
          pageSize: 5
        }
        this.$axios.post('/api/iam/v1/auth/user/getUserLog', params).then((res) => {
          this.tableData = res.body.list;
        });
        this.isExceedHeight = false;
        return false;
      }
      if (data === '4') {
        let params = {
          eventType: [7],
          pageNum: 1,
          pageSize: 0
        }
        this.$axios.post('/api/iam/v1/auth/user/getUserLog', params).then((res) => {
          this.resetTime = res.body.list.length>0?res.body.list[0].createTime:''
        });
        this.isExceedHeight = false;
        return false;
      }
    },
    // 切换标签
    handleClick(tab) {
      this.queryInfo(tab.name);
      if(this.resetCertified)this.cancelResetSubmit()
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
    captcha(n) {
      this.$axios.get('/api/open/common/captcha/image').then((res) => {
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
            akOld: this.form.oldPhoneNumber, // 旧手机号
            ak: this.form.phoneNumber, // 新手机号
            uuid: this.form.uuid,
            code: this.form.phoneCode
          };
          // if (oldPhoneNumber !== this.$store.state.user.userInfo.phoneNum) {
          //   this.$notify({
          //     title: '提示',
          //     message: '旧手机号不正确，请重新输入。',
          //     type: 'info'
          //   });
          //   return;
          // }
          if (phoneNumber === oldPhoneNumber) {
            this.$notify({
              title: '提示',
              message: '新手机号和旧手机号一致，请重新输入。',
              type: 'info'
            });
            return;
          }
          this.$axios.post('/api/iam/v1/auth/user/info/change/phone', params).then((res) => {
            if (res.status === 200) {
              this.queryInfo(this.activeName);
              this.phoneNumhandleClose();
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
      this.titleStatus = this.$store.state.user.userInfo.phoneNum === null ? '绑定' : '修改';
      this.phoneNumVisible = true;
      this.captcha(1);
    },
    // 重新登录
    logOut() {
      this.$nextTick(() => {
        let params = {
          username: '', //用户名称
          registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
          avatarUrl: '', //帐户头像
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
        })
      });
    },
    // 切换认证类型
    replaceRegisterType(e) {
    },
    upDateEmail() {
      this.emailStatus = this.$store.state.user.userInfo.email === null ? '绑定' : '修改'
      this.$refs.upDateEmailDialog.dialogVisible = true;

    },
    // 修改性别
    upDateSex() {
      this.upDateSexs = this.$store.state.user.userInfo.sex;
      this.$refs.upDateSexDialog.dialogVisible = true;
    },
    // 帐号注销弹框
    accountNubLogOff() {
      this.accountVisible = true;
    },
    accounthandleClose() {
      this.accountVisible = false;
    },
    // 帐户密码重置
    resetPassword() {
      this.$router.push({
        path: '/login/forget',
        query: {
          type: 1,
          appId: this.appId
        }
      });
    },
    accountOut() {
      this.$confirm('是否确定退出个人中心', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          username: '', //用户名称
          registerStatus: '', //用户状态  "0", "只注册还未提交认证"  "1", "已提交认证-待审核" "2", "审核通过" "3", "审核被拒"
          avatarUrl: '', //帐户头像
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
      }).catch(() => {
      });
    },
    loginMode(type) {
      switch (type) {
        case 1:
          return '登录 用户名密码';
        case 2:
          return '登录 手机号密码';
        case 3:
          return '登录 手机号验证码';
        case 4:
          return '登录 邮箱密码';
        case 5:
          return '登录 邮箱验证码';
        case 6:
          return '登录 微信扫码';
      }
    },
    sexFilter(value) {
      switch (value) {
        case 0:
          return '未知';
        case 1:
          return '男';
        case 2:
          return '女';
        case 3:
          return '未知';
      }
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
  /* height: 1040px; */
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

.dtStyle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.btnStyle {
  width: 80px;
  line-height: 22px;
  text-align: center;
  border: 1px solid #000000;
  border-radius: 6px;
  cursor: pointer;
}

.ddStyle {
  color: #AAAAAA;
}

.tab-box {
  padding: 0 15px !important;
}
</style>
