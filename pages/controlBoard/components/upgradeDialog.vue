<template>
  <el-dialog
    title="升级"
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="left">
      <el-form-item label="版本号" prop="versionCode">
        <el-input v-model="form.versionCode" placeholder="请输入版本号,例：abc_1.0.0" maxlength="30" show-word-limit clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button type="primary" @click="submit" size="small">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { versionCodeReg } from '../../../utils/validate';
export default {
  props: {
    // 升级 当前行数据
    upgradeData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    upgradeData: {
      handler: function (data) {
        this.form = data;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    // 版本描述 校验
    var validateVersionCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('版本号不能为空'));
      } else if (!versionCodeReg(value)) {
        callback(new Error('请输入正确格式，例：abcdefg_1(0-9999).0(0-99).0(0-99)'));
      } else {
        callback();
      }
    };
    return {
      form: {
        versionCode: '' //版本号
      },
      rules: {
        // 版本号 规则
        versionCode: [{ validator: validateVersionCode, required: true, trigger: 'change' }]
      },
      dialogVisible: false
    };
  },
  methods: {
    handleClose() {
      this.reset();
      this.dialogVisible = false;
    },
    // 取消 后 重置
    reset() {
      this.$refs['form'].resetFields();
    },
    // 确定 保存
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('subitupgradeForm', this.form);
        }
      });
    }
  }
};
</script>

<style scoped></style>
