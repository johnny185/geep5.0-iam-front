<template>
  <!-- 我的能力 -->
  <div>
    <el-row :gutter="20">
      <el-form ref="form" :model="form">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-form-item label="项目" prop="intelSceneId">
            <el-select v-model="form.intelSceneId" style="width: 100%" placeholder="请选择项目" @change="handleQuery">
              <el-option
                v-for="item in sceneTypeOptions"
                :key="item.intelSceneId"
                :label="item.sceneName"
                :value="item.intelSceneId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="float: right; margin-top: 40px">
          <el-button
            size="small"
            type="primary"
            class="margin-left10"
            style="float: right"
            @click="handleStop('all')"
          >一键停用</el-button>
        </el-col>
      </el-form>
    </el-row>
    <!-- 数据列表 -->
    <el-table
      :data="dataList"
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="selectableFn"></el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center" fixed />
      <el-table-column prop="abilityName" label="能力名称" show-overflow-tooltip align="center" />
      <el-table-column prop="abilityDescription" label="能力介绍" show-overflow-tooltip />
      <!-- <el-table-column prop="userName" label="品牌&车型" align="center" />
      <el-table-column prop="userName" label="订阅" align="center" />-->
      <el-table-column prop="approveTime" label="申请时间" align="center" width="160" />
      <el-table-column prop="approveStatus" label="状态" fixed="right" align="center" width="100">
        <!-- I-审批中 Y-生效 W-未生效 -->
        <template slot-scope="scope">
          <span v-if="scope.row.approveStatus === 'N'" class="fontRed">未通过</span>
          <span v-if="scope.row.approveStatus === 'Y'" class="fontSpringGreen">审批通过</span>
          <span v-if="scope.row.approveStatus === 'W'" class="fontMoccasin">审批中</span>
          <span v-if="scope.row.approveStatus === 'S'" class="fontMoccasin">已停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleView(scope.row)">查看</el-button>
          <el-button size="small" @click="handleStop(scope.row)" v-if="scope.row.approveStatus === 'Y'">停用</el-button>
          <el-button
            size="small"
            @click="handleApply(scope.row)"
            v-if="scope.row.approveStatus === 'N' || scope.row.approveStatus ==='S'"
          >重新申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :pageData="pageData" @currentPage="currentPage" @sizeChange="sizeChange"></pagination>
    <!-- 申请弹窗 -->
    <applyForAbilityDialog
      ref="applyForAbilityDialog"
      :abilityIds="abilityIds"
      :sceneTypeOptions="sceneTypeOptions"
      :intelSceneId="form.intelSceneId"
      @submitForm="submitForm"
    />
    <!-- 申请能力记录 查看 -->
    <!-- <checkAbilityApplyRecord ref="checkAbilityApplyRecord" :checkAbilityApplyRecorData="checkAbilityApplyRecorData"></checkAbilityApplyRecord> -->
  </div>
</template>

<script>
// import checkAbilityApplyRecord from './checkAbilityApplyRecord';
// import applyForAbilityDialog from './applyForAbilityDialog.vue';
export default {
  components: {
    // applyForAbilityDialog
    // checkAbilityApplyRecord
  },
  data() {
    return {
      pageData: {
        pageNum: 1, // 页码 默认 1
        pageSize: 10, // 每页数据条数 默认10
        total: 0 // 总数据条数 默认 0
      },
      // 头部查询表单
      form: {
        intelSceneId: ''
      },
      sceneTypeOptions: [],
      dataList: [], // 数据列表list
      abilityIds: [], // 父组件 向 编辑弹窗组件 传值 ids
      multipleSelection: [],//选中数据 集合
      checkAbilityApplyRecorData: {},//查看数据
    };
  },
  created() {
    this.getIntelScene()
  },
  methods: {
    // 当前行 复选框 是否禁用  只有 审批通过才可勾选
    selectableFn(row) {
      return row.approveStatus === 'Y'
    },
    //表格选中事件  
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields();
      this.handleQuery();
    },
    // 筛选查询
    handleQuery() {
      this.pageData.pageNum = 1;
      this.pageData.pageSize = 10;
      this.queryList();
    },
    //查询 项目ID
    getIntelScene() {
      const params = {
        sceneName: ''
      };
      this.$axios.post('/api/controlpanel/panel/getIntelScene', params).then((res) => {
        // console.log(res);
        if (res.status === 200) {
          this.sceneTypeOptions = res.body;
          this.form.intelSceneId = this.sceneTypeOptions.length ? this.sceneTypeOptions[0].intelSceneId : ''
          this.queryList();
        }
      });
    },
    // 获取数据list
    queryList(curPage) {
      const params = Object.assign(
        {
          pageSize: this.pageData.pageSize,
          pageNum: typeof curPage === 'number' ? curPage : 1
        },
        this.form
      );
      if (!this.form.intelSceneId) {
        this.$notify({
          type: 'warning',
          message: '对不起,您还没创建场景！',
          duration: 1000
        });
        return false
      }
      this.$axios.post('/api/controlpanel/panel/myAbilityApplyDetail', params).then(res => {
        // console.log(res);
        const { body } = res;
        this.dataList = body.list;
        this.pageData.total = body.total;
      });
    },
    // 分页器选择页码 触发方法
    currentPage(val) {
      // console.log('页码', val)
      this.pageData.pageNum = val;
      this.queryList(val);
    },
    // 分页器 pageSize 改变时触发方法
    sizeChange(val) {
      // console.log('pagesize', val)
      this.pageData.pageSize = val;
      this.queryList(this.pageData.pageNum);
    },
    // 重新申请
    handleApply(data) {
      this.abilityIds = []
      this.abilityIds.push(data.abilityId);
      this.$refs.applyForAbilityDialog.dialogVisible = true;
    },
    // 当前停用（当前行数据）  一键停用 ('all')
    handleStop(data) {
      // console.log('dangqianhang', data);
      let params = {
        abilityIds: [],
        intelSceneId: this.form.intelSceneId
      };
      if (data !== 'all') {
        params.abilityIds.push(data.abilityId)
      } else {
        if (!this.multipleSelection.length) {
          this.$notify({
            type: 'warning',
            message: '请选择后再操作！',
            duration: 1000
          });
          return false
        } else {
          params.abilityIds = this.multipleSelection.map(item => {
            return item.abilityId
          })
        }
      }

      // console.log(params);
      this.$confirm('此操作将停用该能力, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/controlpanel/panel/stopAbility', params).then(res => {
          this.$notify({
            title: '提示',
            message: res.message,
            type: 'success'
          });
          this.queryList(this.pageData.pageNum);
        });
      })
    },
    // 提交表单信息
    submitForm(data) {
      const params = data;
      this.$axios.post('/api/controlpanel/panel/abilityApply', params).then((res) => {
        this.operation();
        this.queryList(this.pageData.pageNum);
      });
    },
    // 重新申请 完后的操作
    operation() {
      this.$notify({
        title: '提示',
        message: '重新申请操作成功',
        type: 'success'
      });
      this.$refs.applyForAbilityDialog.handleClose();
    },
    // 查看
    handleView(item) {
      let param = {
        approveRecordsId: item.approveRecordsId
      };
      this.$axios.post('/api/controlpanel/panel/checkAbilityApplyDetail', param).then((res) => {
        this.checkAbilityApplyRecorData = res.body;
        this.$refs.checkAbilityApplyRecord.dialogVisible = true;
      });
    }
  }
}
</script>

<style>
</style>