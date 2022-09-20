<template>
  <!-- 第三方平台授权登记 -->
  <div class="container">
    <el-button size="small" type="primary" style="float: right" @click="handleAdd">新增</el-button>
    <!-- 数据列表 -->
    <el-table ref="singleTable" class="marginTop20" :data="dataList" style="width: 100%">
      <el-table-column type="index" label="序号" width="55" fixed align="center" />
      <el-table-column prop="name" label="应用名称" align="center" show-overflow-tooltip />
      <el-table-column prop="websiteUrl" label="首页URL" align="center" show-overflow-tooltip />
      <el-table-column prop="callBackUrl" label="返回URL" align="center" show-overflow-tooltip />
      <el-table-column prop="appId" label="客户端ID" align="center" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="280"
            :visible-arrow="false"
            trigger="hover"
            :content="scope.row.appId"
          >
            <p slot="reference" class="appId">{{scope.row.appId}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="clientKey" label="客户端密钥" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.status !== '2'">---</p>
          <!-- 密钥 只获取一次 请妥善保存。如忘记 需重置密钥 -->
          <el-button type="text" v-else @click="getSecret(scope.row)">获取密钥</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="160" align="center" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.status | statusFilter }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :pageData="pageData" @currentPage="currentPage" @sizeChange="sizeChange"></pagination>
    <!-- 新增 编辑表单弹窗 -->
    <thirdpartyRegisterDialog
      ref="thirdpartyRegisterDialog"
      :row-data="rowData"
      :add-or-edit-status="addOrEditStatus"
      @submitForm="submitForm"
    />
    <checkDealDialog
      ref="checkDealDialog"
      :dealData="dealData"
      :agreementType="agreementType"
      @agreement="agreement"
    ></checkDealDialog>
  </div>
</template>

<script>
import checkDealDialog from './checkDealDialog';
import thirdpartyRegisterDialog from './thirdpartyRegisterDialog';
export default {
  components: {
    checkDealDialog,
    thirdpartyRegisterDialog
  },
  data() {
    return {
      dealData: {}, //论坛服务协议
      agreementType: 1, //区分三种协议： 1服务协议2隐私保护政策3论坛协议
      dialogFormVisible: false, // 新增 弹窗的 显示与否
      dataList: [], // 列表 数据
      //分页器数据
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      rowData: {}, // 父组件 向 编辑弹窗组件 传值  当前行数据
      addOrEditStatus: '' // 新增还是编辑 add 新增 edit 编辑
    };
  },
  filters: {
    statusFilter(arg) {
      // 审核状态过滤
      if (arg === '1') {
        return '待审核';
      } else if (arg === '2') {
        return '已通过';
      } else if (arg === '3') {
        return '未通过';
      }
    }
  },
  methods: {
    /***
     * @param   Geep5.0开发者平台服务协议,catalogId:352
       Geep5.0开发者平台隐私保护政策,catalogId:353
       Geep5.0开发者平台论坛服务协议,catalogId:354
     * **/
    checkAgreement(catalogId) {
      //帮助文档协议
      // Geep5.0开发者平台服务协议,catalogId:352
      // Geep5.0开发者平台隐私保护政策,catalogId:353
      // Geep5.0开发者平台论坛服务协议,catalogId:354
      const params = { catalogId: catalogId };
      this.$axios.post('/api/document/doc/getDocumentContent', params).then((res) => {
        this.$refs.checkDealDialog.dialogVisible = true;
        this.$refs.checkDealDialog.countDown();
        this.dealData = res.body;
      });
    },
    //协议，同意后进行发表
    agreement() {
      let params = { catalogId: 352 };
      this.$axios.post('/api/document/agreementTips/confirm', params).then((res) => {
        this.$refs.checkDealDialog.dialogVisible = false;
      });
    },
    // 列表初始化
    queryList(curPage) {
      const params = {
        pageSize: this.pageData.pageSize,
        pageNum: typeof curPage === 'number' ? curPage : 1
      };
      this.$axios.post('/api/auth/user/authapi/front/oauth2/app/list', params).then((res) => {
        // console.log(res);
        const { body } = res;
        this.dataList = body.list;
        this.pageData.total = body.total;
        // 当数据量超过5条，整体页面内容高度调整
        // if (body.list.length > 5) {
        this.$emit('defineExceedHeight', body.list.length > 5 ? true : false);
        // }
      });
    },
    // 新增
    handleAdd() {
      this.addOrEditStatus = 'add';
      this.rowData = null;
      this.$refs.thirdpartyRegisterDialog.dialogVisible = true;
    },
    // 当前行编辑
    handleEdit(data) {
      this.addOrEditStatus = 'edit';
      this.rowData = JSON.parse(JSON.stringify(data));
      this.$refs.thirdpartyRegisterDialog.dialogVisible = true;
    },
    // 分页器事件
    sizeChange(val) {
      this.pageData.pageSize = val;
      this.queryList();
    },
    currentPage(val) {
      this.pageData.pageNum = val;
      this.queryList(val);
    },

    // 确定按钮 提交表单
    submitForm(data) {
      // 调用接口
      const params = data;
      // console.log(params);
      if (this.addOrEditStatus === 'add') {
        //新增
        this.$axios.post('/api/auth/user/authapi/front/oauth2/app/add', params).then((res) => {
          if (res.status === 290) {
            this.checkAgreement(352);
          } else {
            this.operation();
            this.queryList();
          }
        });
      } else {
        // 编辑
        this.$axios.post('/api/auth/user/authapi/front/oauth2/app/edit', params).then((res) => {
          this.operation();
          this.queryList(this.pageData.pageNum);
        });
      }
    },
    // 新增 和 编辑完后的操作
    operation() {
      let message = '';
      if (this.addOrEditStatus === 'add') {
        message = '新增操作成功';
      } else {
        message = '编辑操作成功';
      }
      this.$notify({
        title: '提示',
        message: message,
        type: 'success'
      });
      this.$refs.thirdpartyRegisterDialog.handleClose();
    },
    // 获取密钥
    getSecret(data) {
      this.$axios
        .get(`/api/auth/user/authapi/front/oauth2/app/secret/get?appId=${data.appId}`)
        .then((res) => {
          this.$msgbox({
            title: '请牢记并妥善保管密钥：',
            message: `${res.body}`
          });
        })
        .catch((err) => {
          // 密钥 只获取一次 请妥善保存。如忘记 需重置密钥
          if (err.indexOf('请重置') > -1) {
            this.$confirm('此操作将重置该应用密钥, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 重置密钥
              this.$axios
                .get(`/api/auth/user/authapi/front/oauth2/app/secret/reset?appId=${data.appId}`)
                .then((res) => {
                  this.$msgbox({
                    title: '密钥已重置,请妥善保管',
                    message: `密钥：${res.body}`
                  });
                });
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0px 30px 30px 30px;
}
.appId {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
}
</style>>