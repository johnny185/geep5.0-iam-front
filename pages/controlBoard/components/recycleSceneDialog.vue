<template>
  <div>
    <el-dialog title="还原" :visible.sync="dialogVisible" width="640px" :before-close="handleClose">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="应用名称" prop="sceneName">
          <el-input v-model="form.sceneName" :maxlength="30" show-word-limit></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="submitBtn">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    rowData: {
      handler(data) {
        this.form = data;
      },
      immediate: true
    }
  },
  data() {
    return {
      form: {
        sceneName: ''
      },
      rules: {
        sceneName: [{ required: true, message: '应用名称不能为空', trigger: 'change' }]
      },
      dialogVisible: false
    };
  },
  methods: {
    // 取消
    handleClose() {
      this.$refs['form'].resetFields();
      this.dialogVisible = false;
    },
    // 保存
    submitBtn() {
      this.$emit('saveRecycle', this.form);
    }
  }
};
</script>

<style scoped></style>
