<template>
  <div>
    <el-dialog
     title="设置性别"
     :visible.sync="dialogVisible"
     width="600px"
     :before-close="handleClose"
     :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="60px" class="demo-ruleForm">
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" style="line-height: 50px;">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <!-- <el-radio :label="3">未知</el-radio> -->
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="submitBtn">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//
export default {
  props: {
    // 需要修改的昵称名称
    upDateSexs: {
      type: Number,
      default: null
    }
  },
  watch: {
    // 需要修改的昵称名称
    upDateSexs(data) {
      this.form.sex = data;
    }
  },
  data() {
    return {
      form: {
        sex: null
      },
      dialogVisible: false,
      rules: {
        sex: [{ required: true, message: '性别不能为空', trigger: 'change' }]
      }
    };
  },
  mounted() {
    console.log(this.form.sex, this.upDateSexs, 'upDateSexs')
  },
  methods: {
    // 提交修改 昵称
    submitBtn() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = this.form;
          this.$axios.post('/api/iam/v1/auth/user/editInfo', params).then((res) => {
            // 保存成功后 刷新个人信息
            this.$emit('upDataSuccess');
            this.$notify({
              title: '提示',
              message: '修改性别操作成功',
              type: 'success'
            });
            this.handleClose();
          });
        }
      })
    },
    handleClose() {
      this.$refs['form'].resetFields();
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped></style>
