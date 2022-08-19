<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-ruleForm" label-position="right">
      <el-form-item label="真实姓名" prop="personFullName">
        <el-input v-model="form.personFullName" placeholder="请输入真实姓名" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="personIdCardNum">
        <el-input v-model="form.personIdCardNum" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="上传证件" prop="personIdCardNum" class="updataImg"> -->
      <el-form-item label="上传身份证">
        <div>
          <p class="remarksStyle">图片格式JPG、JPEG、PNG，尺寸不大于3M</p>
          <ul class="IDImgWrap">
            <!-- 身份证正面 -->
            <li class="IDImgItem">
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
                  :uploadType="uploadType1"
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
  props: {
    // 用户初始化信息
    initInfo: {
      type: Object,
      default: () => {
        return {
          personFullName: '', //真实姓名
          personIdCardNum: '', //身份证号
          address: '', //地址
          personIdCardPhotoFront: '', //身份证 正面 图片id
          personIdCardPhotoFrontUrl: '', //身份证 正面 文件图片回显url
          personIdCardPhotoNegative: '', //身份证 反面 图片id
          personIdCardPhotoNegativeUrl: '', //身份证 反面 文件图片回显url
          personIdCardPhotoHand: '', //手持身份证 图片id
          personIdCardPhotoHandUrl: '' //手持身份证 文件图片回显url
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
      bgImg1: bgImg1, //身份证 正面 背景图
      bgImg2: bgImg2, //身份 背面 背景图
      bgImg3: bgImg3, //手持身份证 背景图
      uploadType1: 'positive', //标识 上传的图片 是 身份正面
      uploadType2: 'back', //标识 上传的图片 是 身份证反面
      uploadType3: 'hold', //标识 上传的图片 是 手持身份图片
      fileType: 'jpg,jpeg,png',
      fileSize: 5,
      form: {
        personFullName: '', //真实姓名
        personIdCardNum: '', //身份证号
        address: '', //地址
        personIdCardPhotoFront: '', //身份证 正面
        personIdCardPhotoNegative: '', //身份证 反面
        personIdCardPhotoHand: '' //手持身份证
      },
      rules: {
        personFullName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }],
        personIdCardNum: [{ validator: validatepersonIdCardNum, required: true, trigger: 'change' }],
        address: [{ required: true, message: '详细地址不能为空', trigger: 'change' }],
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
    // 取消
    reset() {
      this.$router.push({
        path: '/'
      });
    },
    // 图片上传成功
    handleSuccess(data) {
      // 身份证 正面
      if (data[1] === 'positive') {
        // this.form.personIdCardPhotoFront = data[0].body.fileUid;
        this.$set(this.form, 'personIdCardPhotoFront', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoFront');
      } else if (data[1] === 'back') {
        // this.form.personIdCardPhotoNegative = data[0].body.fileUid;
        this.$set(this.form, 'personIdCardPhotoNegative', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoNegative');
      } else {
        // this.form.personIdCardPhotoHand = data[0].body.fileUid;
        this.$set(this.form, 'personIdCardPhotoHand', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoHand');
      }
    },
    // 提交
    submitBtn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = Object.assign(this.form, {
            registerType: '1'
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
/* .updataImg {
  position: relative;
} */
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
  cursor: pointer;
}
.submit {
  flex: 1;
  height: 40px;
  line-height: 40px;
  color: #2f74ff;
  border-radius: 4px;
  background: #fafdff;
  border: 1px solid #2f74ff;
  cursor: pointer;
}
</style>
