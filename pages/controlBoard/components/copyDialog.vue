<template>
  <div>
    <el-dialog
      :title="isAllCopyAll === true ? '全部复制' : '部分复制'"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" class="createForm" ref="form" label-width="120px" label-position="right">
        <!-- <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm"> -->
        <el-form-item label="应用名称" prop="sceneName" v-if="isAllCopyAll && !isPartCopyAll">
          <el-input
            v-model="form.sceneName"
            placeholder="默认应用名称 + _copy"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="宿主" prop="sceneHost" v-if="!isAllCopyAll && isPartCopyAll">
          <el-radio-group v-model="form.sceneHost">
            <el-radio label="C">车机</el-radio>
            <el-radio label="M">手机</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传场景图标" prop="sceneLogo" v-if="!isAllCopyAll && isPartCopyAll">
          <el-input v-if="false" v-model="form.sceneLogo" />
          <upload
            :fileType="fileType"
            :fileSize="fileSize"
            :imgUrl="form.sceneLogo"
            @handleSuccess="handleSuccess(arguments)"
          ></upload>
        </el-form-item>
        <el-form-item label="场景介绍" prop="sceneDescription" v-if="!isAllCopyAll && isPartCopyAll">
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
        <el-form-item label="车型信息" prop="carInfo" v-if="!isAllCopyAll && isPartCopyAll">
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
        <el-form-item label="服务类型" prop="serviceCategory" v-if="!isAllCopyAll && isPartCopyAll">
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
        <el-form-item label="客服电话" prop="phoneNumber" v-if="!isAllCopyAll && isPartCopyAll">
          <el-input v-model.trim="form.phoneNumber" placeholder="请输入客服电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" v-if="!isAllCopyAll && isPartCopyAll">
          <el-input v-model.trim="form.email" placeholder="请输入邮箱" maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="consoleVersionIds" v-if="!isAllCopyAll && isPartCopyAll">
          <el-table
            ref="multipleTable"
            :data="versionTableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="versionCode" label="版本号" width="120"> </el-table-column>
            <el-table-column label="版本说明" width="100" prop="versionDescription" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <span v-if="scope.row.developStatus === 'I'">开发中</span>
                <span v-if="scope.row.developStatus === 'F'">开发完成</span>
                <span v-if="scope.row.developStatus === 'T'">测试中</span>
                <span v-if="scope.row.developStatus === 'N'">测试未通过</span>
                <span v-if="scope.row.developStatus === 'Y'">审核通过</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm"> </el-form>
        <!-- <el-button size="small" type="primary" @click="copyAll">全部复制</el-button> -->
        <el-button size="small" type="primary" @click="copyPart" v-if="isAllCopyAll && !isPartCopyAll"
          >部分复制</el-button
        >
        <el-button size="small" type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { emailReg, customerPhone } from '../../../utils/validate';
export default {
  props: {
    // 基本信息
    basicInfoData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 版本信息
    versionTableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    // 基本信息
    basicInfoData: {
      handler: function (data) {
        this.form = data;
        if (this.form.hasOwnProperty('serviceCategoryList')) {
          this.$set(this.form, 'serviceCategory', this.form.serviceCategoryList[0]['typeValue']);
        }
      },
      deep: true,
      immediate: true
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
        sceneHost: '', //宿主
        sceneName: '', //场景名称
        sceneLogo: '', //场景名称
        sceneDescription: '', //场景介绍
        carInfo: [], //车型 信息
        serviceCategory: '', //服务类型
        phoneNumber: '', //客服电话
        email: '', //邮箱
        consoleVersionIds: []
      },
      carBrandOption: [], //车型信息 下拉框
      serviceCategoryOption: [], //服务类型 下拉框
      rules: {
        // 应用名称 规则
        sceneName: [{ required: true, message: '应用名称不能为空', trigger: 'change' }],
        // 宿主 规则
        sceneHost: [{ required: true, message: '宿主不能为空', trigger: 'change' }],
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
      },
      // 切换 复制全部 部分复制 默认true 全部复制
      isAllCopyAll: true,
      // 切换 复制全部 部分复制 默认true 全部复制
      isPartCopyAll: false
    };
  },
  mounted() {
    this.getbrandModel();
    this.getDicData();
  },
  methods: {
    // 勾选
    handleSelectionChange(data) {
      this.form['consoleVersionIds'] = [];
      if (data.length !== 0) {
        data.forEach((item) => {
          this.form['consoleVersionIds'].push(item.consoleVersionId);
        });
      } else {
        this.form['consoleVersionIds'] = [];
      }
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
    // 服务类型
    getDicData() {
      this.$axios.get('/api/controlpanel/panel/queryItem').then((res) => {
        this.serviceCategoryOption = res.body.itemMap.ServiceCategory; // 服务类型
      });
    },
    // 上传
    handleSuccess(data) {
      this.form.sceneLogo = data[0].body.downloadUrl;
    },
    // // 复制全部
    // copyAll() {
    //   this.isCopyAll = true;
    // },
    // 部分复制
    copyPart() {
      this.isAllCopyAll = false;
      this.isPartCopyAll = true;
      // this.isCopyAll = false;
    },
    // 取消
    handleClose() {
      this.$refs['form'].resetFields();
      this.isAllCopyAll = true;
      this.isPartCopyAll = false;
      this.dialogVisible = false;
    },
    // 确定
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 当为 全部复制时 且版本号 列表里有数据时，版本号全部勾选
          if (this.isCopyAll && this.versionTableData.length !== 0) {
            this.form['consoleVersionIds'] = [];
            this.versionTableData.forEach((item) => {
              this.form['consoleVersionIds'].push(item.consoleVersionId);
            });
          }
          this.$emit('submitCopyData', this.form);
        }
      });
    }
  }
};
</script>

<style scoped></style>
