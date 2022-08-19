<template>
  <div>
    <el-dialog
      title="修改昵称"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="60px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称"></el-input>
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
//
export default {
  props: {
    // 需要修改的昵称名称
    upDataNickNam: {
      type: String,
      default: ''
    }
  },
  watch: {
    // 需要修改的昵称名称
    upDataNickNam(data) {
      this.form.nickName = data;
    }
  },
  data() {
    return {
      form: {
        nickName: ''
      },
      dialogVisible: false,
      rules: {
        nickName: [{ required: true, message: '昵称不能为空', trigger: 'change' }]
      }
    };
  },
  methods: {
    // 提交修改 昵称
    submitBtn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = this.form;
          this.$axios.post('/api/auth/user/authapi/common/user/info/change/nickName', params).then((res) => {
            this.$emit('upDataSuccess');
            this.$notify({
              title: '提示',
              message: '修改昵称操作成功',
              type: 'success'
            });
            this.handleClose();
          });
        }
      });
    },
    handleClose() {
      this.$refs['form'].resetFields();
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped></style>
