<template>
  <div>
    <el-dialog
      title="修改基本信息"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" class="setForm" ref="form" label-width="120px" label-position="right">
        <el-form-item label="宿主" prop="sceneHost">
          <el-radio-group v-model="form.sceneHost">
            <el-radio label="C">车机</el-radio>
            <el-radio label="M">手机</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="场景名称" prop="sceneName">
          <el-input v-model="form.sceneName" placeholder="请输入场景名称" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="上传场景图标" prop="sceneLogo">
          <el-input v-if="false" v-model="form.sceneLogo" />
          <upload
            :fileType="fileType"
            :fileSize="fileSize"
            :imgUrl="form.sceneLogo"
            @handleSuccess="handleSuccess(arguments)"
          ></upload>
        </el-form-item>
        <el-form-item label="场景介绍" prop="sceneDescription">
          <el-input
            v-model="form.sceneDescription"
            placeholder="请输入场景名称"
            maxlength="200"
            type="textarea"
            :rows="8"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 车型信息 -->
        <el-form-item label="车型信息" prop="carInfo">
          <el-cascader
            style="width: 100%"
            :options="carBrandOption"
            :props="{
              multiple: true,
              expandTrigger: 'hover',
              value: 'carId',
              label: 'currentName',
              children: 'model'
            }"
            v-model="form.carInfo"
            clearable
          ></el-cascader>
        </el-form-item>
        <!-- 服务类型 -->
        <el-form-item label="服务类型" prop="serviceCategory">
          <el-select
            v-model="form.serviceCategory"
            placeholder="请选择服务类型"
            filterable
            clearable
            @change="checkServiceCategory"
          >
            <el-option
              v-for="(item, index) in serviceCategoryOption"
              :key="index"
              :value="item.itemValue"
              :label="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服电话" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入客服电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="40" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="submitBtn">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { emailReg, customerPhone } from '../../../utils/validate';
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          sceneHost: 'C', //宿主
          sceneName: '', //场景名称
          sceneLogo: '', //场景图标
          sceneDescription: '', //场景介绍
          carInfo: [], //车型 信息
          serviceCategory: '', //服务类型
          phoneNumber: '', //客服电话
          email: '' //邮箱
        };
      }
    }
  },
  data() {
    // 邮箱 校验
    var validateEmail = (rule, value, callback) => {
      if (value !== '' && !emailReg(value)) {
        callback(new Error('请输入正确邮箱号'));
      } else {
        callback();
      }
    };
    // 邮箱 校验
    var validatePhoneNumber = (rule, value, callback) => {
      if (value !== '' && !customerPhone(value)) {
        callback(new Error('请输入正确客服电话'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      fileType: 'jpg,jpeg,png,bmp',
      fileSize: 5,
      form: {
        sceneHost: 'C', //宿主
        sceneName: '', //场景名称
        sceneLogo: '', //场景名称
        sceneDescription: '', //场景介绍
        carInfo: [], //车型 信息
        serviceCategory: '', //服务类型
        phoneNumber: '', //客服电话
        email: '' //邮箱
      },
      checkedCar: false, //车型全选
      carArr: [], // 全选 选中前存储下已选车型
      carInfoList: [], //车型信息 最终回传回去格式
      carBrandOption: [], //车型信息 下拉框
      serviceCategoryList: [], //服务类型 最终回传回去格式
      serviceCategoryOption: [], //服务类型 下拉框
      rules: {
        // 宿主 规则
        sceneHost: [{ required: true, message: '宿主不能为空', trigger: 'change' }],
        // 场景名称 规则
        sceneName: [{ required: true, message: '场景名称不能为空', trigger: 'change' }],
        // 上传场景 规则
        sceneLogo: [{ required: true, message: '上传场景图标不能为空', trigger: 'change' }],
        // 场景介绍 规则
        sceneDescription: [{ required: true, message: '场景介绍不能为空', trigger: 'change' }],
        // 车型信息 规则
        carInfo: [{ required: true, message: '车型不能为空', trigger: 'change' }],
        // 服务类型 规则
        serviceCategory: [{ required: true, message: '服务类型不能为空', trigger: 'change' }],
        // 客服电话 规则
        phoneNumber: [{ validator: validatePhoneNumber, trigger: 'change' }],
        //邮箱 规则
        email: [{ validator: validateEmail, trigger: 'change' }]
      }
    };
  },
  mounted() {
    this.getbrandModel();
    this.getDicData();
  },
  watch: {
    // 回显信息
    formData: {
      handler(data) {
        this.form = data;
        // 存储 停用的品牌id
        let tempArr1 = [];
        // 存储 停用的品牌id
        let tempArr2 = [];
        if (data.brandModelVO.brands.length !== 0) {
          data.brandModelVO.brands.forEach((item) => {
            // 1.当品牌发生变化情况下 变化
            if (item.brandStatus === 2) {
              tempArr1.push(item.brandId);
              return false;
            } else {
              //  2.当车型发生变化情况下 变化
              item.models.forEach((it) => {
                if (it.modelStatus === 2) {
                  tempArr2.push(it.modelId);
                }
              });
            }
          });
          // 1.通过 停用品牌id，从carInfo里过滤出不需要的数据
          if (tempArr1.length !== 0) {
            data.carInfo.forEach((item, index) => {
              tempArr1.forEach((it) => {
                if (item[0] === it) {
                  data.carInfo.splice(index, 1);
                }
              });
            });
          }
          // 2.通过 停用车型id，从carInfo里过滤出不需要的数据
          if (tempArr2.length !== 0) {
            data.carInfo.forEach((item, index) => {
              tempArr2.forEach((it) => {
                if (item[1] === it) {
                  data.carInfo.splice(index, 1);
                }
              });
            });
          }
        }
        // 处理 服务类型 回显
        if (this.form.hasOwnProperty('serviceCategoryList')) {
          this.$set(this.form, 'serviceCategory', this.form.serviceCategoryList[0]['typeValue']);
        }
        // }
      },
      immediate: true
    }
  },
  methods: {
    // 关闭 弹窗
    handleClose() {
      this.reset();
      this.dialogVisible = false;
    },
    // 重置
    reset() {
      this.$refs['form'].resetFields();
    },
    // 处理 服务和服务类型
    checkServiceCategory() {
      this.serviceCategoryList = [];
      if (this.form.serviceCategory) {
        this.serviceCategoryOption.forEach((item) => {
          if (item.itemValue === this.form.serviceCategory) {
            this.serviceCategoryList.push({
              typeName: item.itemName, //服务
              typeValue: item.itemValue //服务类型
            });
          }
        });
      }
    },
    // 获取品牌+车型
    getbrandModel() {
      this.$axios.get('/api/controlpanel/panel/brandModel').then((res) => {
        this.carBrandOption = res.body;
      });
    },
    // 字典
    getDicData() {
      this.$axios.get('/api/controlpanel/panel/queryItem').then((res) => {
        this.serviceCategoryOption = res.body.itemMap.ServiceCategory; // 服务类型
      });
    },
    // 上传
    handleSuccess(data) {
      this.form.sceneLogo = data[0].body.downloadUrl;
    },
    //提交
    submitBtn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = Object.assign(
            this.form,
            { carInfoList: this.carInfoList },
            { serviceCategoryList: this.serviceCategoryList }
          );
          this.$axios.post('/api/controlpanel/panel/updateCarIntelligentSceneDT', params).then((res) => {
            if (res.status === 200) {
              this.$notify({
                title: '成功',
                message: '修改基本信息操作成功',
                type: 'success'
              });
              this.$emit('refreshInfo');
              // this.handleClose();
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.el-radio {
  line-height: 30px !important;
}
.carBox {
  text-align: center;
  position: absolute;
  top: 0;
  left: 55%;
  box-sizing: border-box;
  z-index: 999;
  width: 27%;
}
</style>
