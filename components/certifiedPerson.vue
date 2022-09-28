<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-ruleForm" label-position="right">
      <el-form-item v-show="editType==='reset'||editType==='idCard'" label="真实姓名" prop="personFullName">
        <el-input v-show="editType==='reset'||editType==='idCard'" v-model="form.personFullName" placeholder="请输入真实姓名"
          maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item v-show="editType==='reset'||editType==='idCard'" label="身份证号" prop="personIdCardNum">
        <el-input v-model="form.personIdCardNum" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-row v-show="editType==='reset'||editType==='idCard'">
        <el-col :span="8">
          <el-form-item label="身份证有效期" prop="personIdCardPeriodStartDate">
            <el-date-picker v-model="form.personIdCardPeriodStartDate" type="date" placeholder="选择开始日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.personIdCardIsLongEffective === false">
          <el-form-item prop="personIdCardPeriodEndDate">
            <el-date-picker v-model="form.personIdCardPeriodEndDate" type="date" placeholder="选择结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style=" margin-left: 10px;">
            <el-radio-group v-model="form.personIdCardIsLongEffective" style="display: contents;">
              <el-radio :label="true" @click.native.prevent="radioClisk(false)">长期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="上传证件" prop="personIdCardNum" class="updataImg"> -->
      <el-form-item label="上传身份证" v-show="editType==='reset'||editType==='idCard'">
        <div>
          <p class="remarksStyle">图片格式JPG、JPEG、PNG，尺寸不大于3M</p>
          <ul class="IDImgWrap">
            <!-- 身份证正面 -->
            <li class="IDImgItem">
              <!-- <div class="IDImgBox"> -->
              <el-form-item prop="personIdCardPhotoFrontId">
                <el-input v-if="false" v-model="form.personIdCardPhotoFrontId" />
                <upload :isPublic="isPublic" :isTmp="isTmp" :fileType="fileType" :fileSize="fileSize"
                  @handleSuccess="handleSuccess(arguments)" :imgUrl="form.personIdCardPhotoFrontUrl" :bgImg="bgImg1"
                  :uploadType="uploadType1"></upload>
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
              <el-form-item prop="personIdCardPhotoNegativeId">
                <el-input v-if="false" v-model="form.personIdCardPhotoNegativeId" />
                <upload :isPublic="isPublic" :isTmp="isTmp" :fileType="fileType" :fileSize="fileSize"
                  @handleSuccess="handleSuccess(arguments)" :uploadType="uploadType2"
                  :imgUrl="form.personIdCardPhotoNegativeUrl" :bgImg="bgImg2"></upload>
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
              <el-form-item prop="personIdCardPhotoHandId">
                <el-input v-if="false" v-model="form.personIdCardPhotoHandId" />
                <upload :isPublic="isPublic" :isTmp="isTmp" :fileType="fileType" :fileSize="fileSize"
                  @handleSuccess="handleSuccess(arguments)" :bgImg="bgImg3" :imgUrl="form.personIdCardPhotoHandUrl"
                  :uploadType="uploadType3"></upload>
              </el-form-item>
              <p class="IDtitle">
                上传手持
                <span class="bold">身份证</span>照片
              </p>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item label="通讯地址" v-show="editType==='reset'||editType==='address'">
        <div class="IDImgWrap">
          <el-form-item prop="addressLeve1Id">
            <el-select ref="provinceLabel" v-model="form.addressLeve1Id" placeholder="请选择省" @focus="provinceSelect(1)"
              @change="provinceChange()">
              <el-option v-for="item in provinceList" :key="item.code" :label="item.shortName"
                :value="Number(item.code)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="addressLeve2Id">
            <el-select ref="cityLabel" v-model="form.addressLeve2Id" placeholder="请选择市" @focus="provinceSelect(2)"
              @change="cityChange()">
              <el-option v-for="item in cityList" :key="item.code" :label="item.shortName" :value="Number(item.code)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="addressLeve3Id">
            <el-select ref="areaLabel" v-model="form.addressLeve3Id" placeholder="请选择区" @focus="provinceSelect(3)">
              <el-option v-for="item in areaList" :key="item.code" :label="item.shortName" :value="Number(item.code)">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item prop="address" v-show="editType==='reset'||editType==='address'">
        <el-input style="margin-top: 8px;" type="textarea" placeholder="详细地址（街道/门牌号）" v-model="form.address"
          maxlength="200" show-word-limit :rows="4" />
      </el-form-item>
      <el-form-item>
        <div class="personBottom fontCenter">
          <div v-show="resetCertified" class="submit cancel" @click="cancel">取消</div>
          <div class="submit" @click="submitBtn">提交</div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regId } from '../utils/validate';
import bgImg1 from '../static/img/login/positiveImg.png';
import bgImg2 from '../static/img/login/backImg.png';
import bgImg3 from '../static/img/login/holdImg.png';
import costPerPopupVue from './costPerPopup.vue';
import { timingSafeEqual } from 'crypto';
export default {
  props: {
    resetCertified: Boolean,
    editType: String | undefined,
    // 表单参数
    formParams: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  mounted() {
    if (this.$props.formParams.personFullName) {
      const json = JSON.parse(JSON.stringify(this.$props.formParams));
      this.form = json;
      this.provinceList = [{
        shortName: json.addressLeve1,
        code: json.addressLeve1Id
      }]
      this.cityList = [{
        shortName: json.addressLeve2,
        code: json.addressLeve2Id
      }]
      this.areaList = [{
        shortName: json.addressLeve3,
        code: json.addressLeve3Id
      }]
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
      form: {
        personIdCardNum: '', //身份证号
        personIdCardPeriodStartDate: '', // 身份证有效期开始日期
        personIdCardPeriodEndDate: '', // 身份证有效期截止日期
        personIdCardIsLongEffective: false, // 身份证是否长期有效
        personIdCardPhotoFrontId: '', //身份证 正面
        personIdCardPhotoNegativeId: '', //身份证 反面
        personIdCardPhotoHandId: '', //手持身份证
        addressLeve1Id: null, // 省
        addressLeve2Id: null, // 市
        addressLeve3Id: null, // 区
        address: '' //地址
      },
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
      provinceList: [], // 省数组
      cityList: [], // 市数组
      areaList: [], // 区数组
      parentCode: '0', // 0为省份
      rules: {
        // 真实姓名 校验
        personFullName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }],
        // 身份证号 校验
        personIdCardNum: [{ validator: validatepersonIdCardNum, required: true, trigger: 'change' }],
        // 身份证有效开始日期 校验
        personIdCardPeriodStartDate: [{ required: true, message: '身份证有效开始不能为空', trigger: 'change' }],
        // 身份证有效截止日期 校验
        personIdCardPeriodEndDate: [{ required: true, message: '身份证有效截止不能为空', trigger: 'change' }],
        // 省
        addressLeve1Id: [{ required: true, message: '省不能为空', trigger: 'change' }],
        // 市
        addressLeve2Id: [{ required: true, message: '市不能为空', trigger: 'change' }],
        // 区
        addressLeve3Id: [{ required: true, message: '区不能为空', trigger: 'change' }],
        // 地址 校验
        address: [{ required: true, message: '详细地址不能为空', trigger: 'change' }],
        // 身份证正面  校验
        personIdCardPhotoFrontId: [{ required: true, message: '身份证正面不能为空', trigger: 'change' }],
        //  身份证反面 校验
        personIdCardPhotoNegativeId: [{ required: true, message: '身份证反面不能为空', trigger: 'change' }],
        // 手持身份证 校验
        personIdCardPhotoHandId: [{ required: true, message: '手持身份证不能为空', trigger: 'change' }]
      }
    };
  },
  methods: {
    // 省份选择
    provinceSelect(value) {
      let parentCode = '';
      let addressLeve1Id = this.form.addressLeve1Id;
      let addressLeve2Id = this.form.addressLeve2Id;
      if (value === 1) {
        parentCode = '0'
        if (this.provinceList.length > 1) {
          return false;
        }
      } else if (value === 2) {
        parentCode = addressLeve1Id;
      } else if (value === 3) {
        parentCode = addressLeve2Id;
      }
      let params = {
        parentCode: parentCode,
        pageSize: 10000
      }
      this.$axios.post('api/iam/v1/open/region/page', params).then((res) => {
        if (value === 1) {
          this.provinceList = res.body.list;
        } else if (value === 2) {
          this.cityList = res.body.list;
        } else if (value === 3) {
          this.areaList = res.body.list;
        }
      })
    },
    provinceChange() {
      if (this.form.addressLeve1Id) {
        this.parentCode = this.form.addressLeve1Id;
      }
    },
    cityChange() {
      if (this.form.addressLeve2Id) {
        this.parentCode = this.form.addressLeve2Id;
      }
    },
    radioClisk(e) {
      this.form.personIdCardIsLongEffective = e === this.form.personIdCardIsLongEffective ? true : e
    },
    // 图片上传成功
    handleSuccess(data) {
      // 身份证 正面
      if (data[1] === 'positive') {
        this.$set(this.form, 'personIdCardPhotoFrontId', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoFrontId');
      } else if (data[1] === 'back') {
        this.$set(this.form, 'personIdCardPhotoNegativeId', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoNegativeId');
      } else {
        this.$set(this.form, 'personIdCardPhotoHandId', data[0].body.fileUid);
        this.$refs.form.clearValidate('personIdCardPhotoHandId');
      }
    },
    // 取消提交
    cancel() {
      this.$emit('cancel')
    },
    // 提交
    submitBtn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = Object.assign(this.form, {
            addressLeve1: this.$refs.provinceLabel.selected.label,
            addressLeve2: this.$refs.cityLabel.selected.label,
            addressLeve3: this.$refs.areaLabel.selected.label
          });
          if (this.editType === 'address') {
            this.$axios.post('api/iam/v1/auth/certification/update/address', params).then((res) => {
              if (res.status === 200 && res.body === true) {
                this.$notify({
                  title: '成功',
                  message: '提交认证操作成功',
                  type: 'success'
                });
                this.$emit('queryInfo', '2', 'sumitExamine');
                this.$store.commit('user/addRegisterType', 1);
              }
            });
            return;
          }
          this.$axios.post('api/iam/v1/auth/certification/person/apply', params).then((res) => {
            if (res.status === 200 && res.body === true) {
              this.$notify({
                title: '成功',
                message: '提交认证操作成功',
                type: 'success'
              });
              this.$emit('queryInfo', '2', 'sumitExamine');
              this.$store.commit('user/addRegisterType', 1);
            }
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

.IDtitle {
  margin-top: 6px;
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
  justify-content: center;
}

/* .reset {
  flex: 1;
  background: #fafdff;
  border-radius: 4px;
  line-height: 40px;
  color: #cccccc;
  border: 1px solid #cccccc;
  margin-right: 50px;
  cursor: pointer;
} */
.cancel,
.submit {
  width: 300px;
  margin: 0 20px;
  /* flex: 1; */
  height: 40px;
  line-height: 40px;
  color: #2f74ff;
  border-radius: 4px;
  background: #fafdff;
  border: 1px solid #2f74ff;
  cursor: pointer;
}

.cancel {
  background-color: #fff;
  color: #999990;
  border-color: #999990;
}
</style>
