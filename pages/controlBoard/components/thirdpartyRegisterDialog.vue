<template>
  <!-- 新增 编辑 第三方应用 弹窗 -->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="660px"
    @open="openDialog"
  >
    <!-- 表单信息 -->
    <el-form :model="form" label-width="120px" :rules="rules" ref="form">
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入应用名称" maxlength="50" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item label="首页URL" prop="websiteUrl">
        <el-input
          v-model="form.websiteUrl"
          placeholder="请输入首页URL,例:http://"
          maxlength="500"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="返回授权的URL" prop="callBackUrl">
        <el-input
          v-model="form.callBackUrl"
          placeholder="请输入返回授权URL,例:http://"
          maxlength="500"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="注意" prop="status" v-if="form.status === '2'">
        <p style="color: red">应用已经通过审核，修改后需要重新审核才能使用!</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { urlReg } from '@/utils/validate';

export default {
  props: {
    // 当前行数据
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 新增 编辑 字段区分
    addOrEditStatus: {
      type: String,
      default: 'add'
    }
  },
  data() {
    // url 校验
    const validateUrl = (rule, value, callback) => {
      if (!urlReg(value)) {
        callback(new Error('URL格式不正确,例：http://或https://开头'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false, // 本弹窗的显示隐藏
      checked: true, //新增时候 先确认协议
      form: {
        name: '', //应用名称
        websiteUrl: '', //首页url
        callBackUrl: '' //返回授权url
      },
      // 表单的校验
      rules: {
        // 应用名称 校验
        name: [{ required: true, message: '请填写应用名称', trigger: 'blur' }],
        // 首页url 校验
        websiteUrl: [
          { required: true, message: '请填写首页URL', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ],
        callBackUrl: [
          { required: true, message: '请填写返回授权的URL', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    title() {
      return this.addOrEditStatus === 'add' ? '新增第三方平台授权登记' : '编辑第三方平台授权登记';
    }
  },
  watch: {
    rowData: {
      handler(data) {
        if (data) {
          this.form = JSON.parse(JSON.stringify(data));
        }
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
        // console.log(this.form);
      },
      deep: true
      //   immediate: true
    }
  },
  mounted() {},
  methods: {
    // 打开弹窗
    openDialog() {
      // console.log(this.rowData);
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    // 关闭弹窗 取消按键
    handleClose() {
      this.dialogVisible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.form = {};
      this.$refs['form'].resetFields();
    },
    submitForm() {
      // 确定按钮 提交表单
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('submitForm', this.form);
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
