<template>
  <el-dialog
    :title="addOrEditStatus === 'add' ? '创建流程' : '编辑流程'"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="left" @submit.native.prevent>
      <el-form-item label="流程名称" prop="flowName">
        <el-input v-model.trim="form.flowName" placeholder="请输入流程名称" maxlength="20" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button type="primary" @click="submit" size="small">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addOrEditStatus: {
      type: String,
      default: 'add'
    },
    // 编辑回显的信息
    editRowInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    editRowInfo(data) {
      if (data) {
        this.form = data;
      }
    }
  },
  data() {
    const validFlowName = (rule, value, callback) => {
      const nameReg = /^(?![a-zA-Z]+$)(?![0-9]+$)[A-Za-z0-9\u4e00-\u9fa5]+$/;
      // 名称校验规则
      if (value !== '' && !nameReg.test(value)) {
        callback(new Error('命名规则:仅包括汉字、英文、数字,但不能纯英文、纯数字以及特殊符号'));
      } else {
        callback();
      }
    };
    return {
      form: {
        //流程名称
        flowName: ''
      },
      rules: {
        flowName: [
          { required: true, message: '流程名称不能为空', trigger: 'blur' },
          { required: true, validator: validFlowName, trigger: 'blur' }
        ]
      },
      dialogVisible: false
    };
  },
  methods: {
    handleClose() {
      this.$nextTick(() => {
        this.reset();
      });
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
          this.$emit('subitForm', this.form);
          // this.reset();
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
::v-deep .el-input__inner {
  padding: 0 55px 0 15px;
}
::v-deep .el-form-item__error {
  width: 100%;
  line-height: 18px;
}
</style>
