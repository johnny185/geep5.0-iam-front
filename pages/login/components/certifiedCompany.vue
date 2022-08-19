<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-ruleForm" label-position="right">
      <!-- 企业信息 -->
      <p class="fontSize24 bold">企业信息</p>
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="form.companyName" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="companyCreditCode">
        <el-input v-model="form.companyCreditCode" placeholder="请输入统一社会信用代码"></el-input>
      </el-form-item>
      <el-form-item label="上传营业执照">
        <p class="remarksStyle">图片格式JPG、JPEG、PNG，尺寸不大于3M</p>
        <ul class="IDImgWrap">
          <!-- 上传营业执照 -->
          <li class="IDImgItem">
            <el-form-item prop="companyLicensePhoto">
              <el-input v-if="false" v-model="form.companyLicensePhoto" />
              <upload
                :isPublic="isPublic"
                :isTmp="isTmp"
                :fileType="fileType"
                :fileSize="fileSize"
                @handleSuccess="handleSuccess(arguments)"
                :bgImg="bgImg1"
                :imgUrl="form.companyLicensePhotoUrl"
                :uploadType="uploadType1"
              ></upload>
            </el-form-item>
            <p class="IDtitle">
              上传营业执照
              <span class="bold">副本</span>照片
            </p>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="法人姓名" prop="companyLegalPersonFullName">
        <el-input v-model="form.companyLegalPersonFullName" placeholder="请输入法人姓名"></el-input>
      </el-form-item>

      <el-form-item label="上传法人身份证照片" prop="updataLegalPersonImg">
        <div>
          <p class="remarksStyle">图片格式JPG、JPEG、PNG，尺寸不大于3M</p>
          <ul class="IDImgWrap">
            <!-- 企业法人 身份证正面 -->
            <li class="IDImgItem marginRight20">
              <el-form-item prop="companyLegalPersonIdCardPhotoFront">
                <el-input v-if="false" v-model="form.companyLegalPersonIdCardPhotoFront" />
                <upload
                  :isPublic="isPublic"
                  :isTmp="isTmp"
                  :fileType="fileType"
                  :fileSize="fileSize"
                  @handleSuccess="handleSuccess(arguments)"
                  :imgUrl="form.companyLegalPersonIdCardPhotoFrontUrl"
                  :bgImg="bgImg1"
                  :uploadType="uploadType2"
                ></upload>
                <!-- <div class="IDImg positive">
                </div>-->
                <!-- </div> -->
              </el-form-item>
              <p class="IDtitle">
                上传身份证
                <span class="bold">姓名面</span>照片
              </p>
            </li>
            <!-- 身份证 反面 -->
            <li class="IDImgItem">
              <el-form-item prop="companyLegalPersonIdCardPhotoNegative">
                <el-input v-if="false" v-model="form.companyLegalPersonIdCardPhotoNegative" />
                <upload
                  :isPublic="isPublic"
                  :isTmp="isTmp"
                  :fileType="fileType"
                  :fileSize="fileSize"
                  @handleSuccess="handleSuccess(arguments)"
                  :uploadType="uploadType3"
                  :imgUrl="form.companyLegalPersonIdCardPhotoNegativeUrl"
                  :bgImg="bgImg2"
                ></upload>
                <!-- <div class="IDImgBox">
                <div class="IDImg back"></div>
                </div>-->
              </el-form-item>
              <p class="IDtitle">
                上传身份证
                <span class="bold">国徽面</span>照片
              </p>
            </li>
          </ul>
        </div>
      </el-form-item>
      <!-- 管理员 信息 -->
      <p class="fontSize24 bold">管理员信息</p>
      <el-form-item label="真实姓名" prop="personFullName">
        <el-input v-model="form.personFullName" placeholder="请输入真实姓名" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="personIdCardNum">
        <el-input v-model="form.personIdCardNum" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="上传身份证">
        <div>
          <p class="remarksStyle">图片格式JPG、JPEG、PNG，尺寸不大于3M</p>
          <ul class="IDImgWrap">
            <!-- 身份证正面 -->
            <li class="IDImgItem marginRight20">
              <!-- <div class="IDImgBox"> -->
              <el-form-item prop="personIdCardPhotoFront">
                <el-input v-if="false" v-model="form.personIdCardPhotoFront" />
                <upload
                  :isPublic="isPublic"
                  :isTmp="isTmp"
                  :fileType="fileType"
                  :fileSize="fileSize"
                  @handleSuccess="handleSuccess(arguments)"
                  :imgUrl="form.personIdCardPhotoFrontUrl"
                  :bgImg="bgImg1"
                  :uploadType="uploadType4"
                ></upload>
                <!-- <div class="IDImg positive">
                </div>-->
                <!-- </div> -->
              </el-form-item>
              <p class="IDtitle">
                上传身份证
                <span class="bold">姓名面</span>照片
              </p>
            </li>
            <!-- 身份证 反面 -->
            <li class="IDImgItem marginRight20">
              <el-form-item prop="personIdCardPhotoNegative">
                <el-input v-if="false" v-model="form.personIdCardPhotoNegative" />
                <upload
                  :isPublic="isPublic"
                  :isTmp="isTmp"
                  :fileType="fileType"
                  :fileSize="fileSize"
                  @handleSuccess="handleSuccess(arguments)"
                  :uploadType="uploadType5"
                  :imgUrl="form.personIdCardPhotoNegativeUrl"
                  :bgImg="bgImg2"
                ></upload>
                <!-- <div class="IDImgBox">
                <div class="IDImg back"></div>
                </div>-->
              </el-form-item>
              <p class="IDtitle">
                上传身份证
                <span class="bold">国徽面</span>照片
              </p>
            </li>
            <!-- 手持身份证 -->
            <li class="IDImgItem hold">
              <!-- <div class="IDImgBox">
                <div class="IDImg hold"></div>
              </div>-->
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
                  :uploadType="uploadType6"
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
      <el-form-item>
        <div class="personBottom fontCenter">
          <div class="reset" @click="reset">取消</div>
          <div class="submit" @click="submitBtn">提交</div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regId } from '../../../utils/validate';
import bgImg1 from '../../../static/img/login/positiveImg.png';
import bgImg2 from '../../../static/img/login/backImg.png';
import bgImg3 from '../../../static/img/login/holdImg.png';
export default {
  // 用户初始化信息
  props: {
    initInfo: {
      type: Object,
      default: () => {
        return {
          companyName: '', //企业名称
          companyCreditCode: '', //统一社会信用代码
          companyLicensePhoto: '', //营业执照
          companyLegalPersonFullName: '', //法人姓名
          companyLegalPersonIdCardPhotoFront: '', //  上传 法人身份证 正面照片
          companyLegalPersonIdCardPhotoNegative: '', //  上传 法人身份证 反面照片
          personFullName: '', //真实姓名
          personIdCardNum: '', //身份证号
          personIdCardPhotoFront: '', //身份证 正面
          personIdCardPhotoNegative: '', //身份证 反面
          personIdCardPhotoHand: '', //手持身份证
          address: '' //地址
        };
      }
    }
  },
  watch: {
    initInfo: {
      handler: function (data) {
        this.form = data;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
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
      isPublic: false,
      isTmp: true,
      bgImg1: bgImg1, //上传营业执照 的 背景图
      bgImg2: bgImg2, //身份 背面 背景图
      bgImg3: bgImg3, //手持身份证 背景图
      uploadType1: 'licensePhoto', // 标识  上传的图片 是营业执照
      uploadType2: 'companyPhotoFront', //标识  上传的图片 是 法人身份证正面
      uploadType3: 'companyPhotoNegative', //标识  上传的图片 是 法人身份证反面
      uploadType4: 'positive', //标识 上传的图片 是 身份正面
      uploadType5: 'back', //标识 上传的图片 是 身份证反面
      uploadType6: 'hold', //标识 上传的图片 是 手持身份图片
      fileType: 'jpg,jpeg,png',
      fileSize: 5,
      form: {
        companyName: '', //企业名称
        companyCreditCode: '', //统一社会信用代码
        companyLicensePhoto: '', //营业执照
        companyLegalPersonFullName: '', //法人姓名
        companyLegalPersonIdCardPhotoFront: '', //  上传 法人身份证 正面照片
        companyLegalPersonIdCardPhotoNegative: '', //  上传 法人身份证 反面照片
        personFullName: '', //真实姓名
        personIdCardNum: '', //身份证号
        personIdCardPhotoFront: '', //身份证 正面
        personIdCardPhotoNegative: '', //身份证 反面
        personIdCardPhotoHand: '', //手持身份证
        address: '' //地址
      },
      rules: {
        // 企业名称 校验
        companyName: [{ required: true, message: '企业名称不能为空', trigger: 'change' }],
        // 统一社会信用代码 校验
        companyCreditCode: [
          {
            required: true,
            message: '统一社会信用代码不能为空',
            trigger: 'change'
          }
        ],
        // 详细地址 校验
        address: [{ required: true, message: '详细地址不能为空', trigger: 'change' }],
        //  营业执照 校验
        companyLicensePhoto: [{ required: true, message: '营业执照不能为空', trigger: 'change' }],
        // 法人姓名 校验
        companyLegalPersonFullName: [{ required: true, message: '法人姓名不能为空', trigger: 'change' }],
        // 法人 身份证正面 校验
        companyLegalPersonIdCardPhotoFront: [{ required: true, message: '身份证正面不能为空', trigger: 'change' }],
        // 法人 身份证反面 校验
        companyLegalPersonIdCardPhotoNegative: [{ required: true, message: '身份证反面不能为空', trigger: 'change' }],
        // 真实姓名 校验
        personFullName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }],
        //  身份证号 校验
        personIdCardNum: [{ validator: validatepersonIdCardNum, required: true, trigger: 'change' }],
        // 身份证正面  校验
        personIdCardPhotoFront: [{ required: true, message: '身份证正面不能为空', trigger: 'change' }],
        //  身份证反面 校验
        personIdCardPhotoNegative: [{ required: true, message: '身份证反面不能为空', trigger: 'change' }],
        // 手持身份证 校验
        personIdCardPhotoHand: [{ required: true, message: '手持身份证不能为空', trigger: 'change' }]
      }
    };
  },
  methods: {
    // 图片上传成功
    handleSuccess(data) {
      // 身份证 正面
      if (data[1] === 'positive') {
        // this.form.personIdCardPhotoFront = data[0].body.fileUid;
        this.$set(this.form, 'personIdCardPhotoFront', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoFront');
        // 身份证 反面
      } else if (data[1] === 'back') {
        // this.form.personIdCardPhotoNegative = data[0].body.fileUid;
        this.$set(this.form, 'personIdCardPhotoNegative', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoNegative');
        // 身份证 手持面
      } else if (data[1] === 'hold') {
        // this.form.personIdCardPhotoHand = data[0].body.fileUid;
        this.$set(this.form, 'personIdCardPhotoHand', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoHand');
        //上传的是 营业执照
      } else if (data[1] === 'licensePhoto') {
        // this.form.companyLicensePhoto = data[0].body.fileUid;
        this.$set(this.form, 'companyLicensePhoto', data[0].body.fileUid);
        this.$refs.form.clearValidate('companyLicensePhoto');
        // 上传的是 法人 身份证正面
      } else if (data[1] === 'companyPhotoFront') {
        // this.form.companyLegalPersonIdCardPhotoFront = data[0].body.fileUid;
        this.$set(this.form, 'companyLegalPersonIdCardPhotoFront', data[0].body.fileUid);
        this.$refs.form.clearValidate('companyLegalPersonIdCardPhotoFront');
        // 上传的是 法人 身份证反面面
      } else {
        // this.form.companyLegalPersonIdCardPhotoNegative = data[0].body.fileUid;
        this.$set(this.form, 'companyLegalPersonIdCardPhotoNegative', data[0].body.fileUid);
        this.$refs.form.clearValidate('companyLegalPersonIdCardPhotoNegative');
      }
    },
    // 取消
    reset() {
      this.$router.push({
        path: '/'
      });
    },
    // 提交
    submitBtn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = Object.assign(this.form, {
            registerType: '2'
          });
          this.$axios.post('api/auth/user/authapi/front/information/submit', params).then((res) => {
            // this.$notify({
            //   title: '成功',
            //   message: '提交认证操作成功',
            //   type: 'success'
            // });
            // console.log(11111111);
            // 跳转 审核中 页面
            this.$router.push({
              path: '/login/inReview'
            });
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.remarksStyle {
  color: #999990;
}

.IDImgWrap {
  display: flex;
  /* flex-wrap: wrap;
  justify-content: space-between; */
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
.IDImg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 138px;
  height: 104px;
  border: 1px dotted #999990;
}
.positive {
  background: url('/img/login/positiveImg.png') no-repeat;
  background-size: 100%;
}
.back {
  background: url('/img/login/backImg.png') no-repeat;
  background-size: 100%;
}
.hold {
  background: url('/img/login/holdImg.png') no-repeat;
  background-size: 100%;
}
.personBottom {
  display: flex;
}
.reset {
  flex: 1;
  background: #fafdff;
  border-radius: 4px;
  line-height: 40px;
  color: #cccccc;
  border: 1px solid #cccccc;
  margin-right: 50px;
}
.submit {
  flex: 1;
  height: 40px;
  line-height: 40px;
  color: #2f74ff;
  border-radius: 4px;
  background: #fafdff;
  border: 1px solid #2f74ff;
}
</style>
