<template>
  <div>
    <el-button size="small" type="primary" @click="handleAdd" v-if="$route.query.myOrTeam === 'myApp'"
      >添加团队成员</el-button
    >
    <el-button size="small" type="primary" @click="handleDelet" v-if="$route.query.myOrTeam === 'myApp'"
      >移除</el-button
    >
    <!--当 myOrTeam 为 myApp 可以操作勾选数据, 为 teamApp 时 不能能操作-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="$route.query.myOrTeam === 'myApp'"> </el-table-column>
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="phoneNumber" label="手机号"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="personFullName" label="真实姓名"> </el-table-column>
      <el-table-column prop="state" label="帐号状态">
        <template slot-scope="scope">
          <span>{{ scope.row.state === 0 ? '不可用' : '可用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="邀请时间"> </el-table-column>
    </el-table>
    <addTeamMemberDialog ref="addTeamMemberDialog" @refresh="refresh"></addTeamMemberDialog>
  </div>
</template>

<script>
// import addTeamMemberDialog from './addTeamMemberDialog';
export default {
  components: {
    addTeamMemberDialog
  },
  data() {
    return {
      tableData: [],
      selectData: []
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    // 移除
    handleDelet() {
      // 先判断是否有勾选成员 没有提示勾选成员
      if (this.selectData.length === 0) {
        this.$notify({
          title: '提示',
          message: '请先选择团队成员再移除',
          type: 'warning'
        });
        return false;
      }
      // 有秀轩数据后移除成员
      this.$confirm('此操作将永久移除成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = this.selectData;
          this.$axios.post('/api/controlpanel/teamMember/delTeamMenbers', params).then((res) => {
            this.$notify({
              title: '提示',
              message: '移除操作成功',
              type: 'success'
            });
            this.queryList();
          });
        })
        .catch(() => {});
    },
    // 添加完成员 刷新列表
    refresh() {
      this.queryList();
    },
    //查询
    queryList() {
      let params = { intelSceneId: this.$route.query.intelSceneId };
      this.$axios.post('/api/controlpanel/teamMember/getTeamMenberInfos', params).then((res) => {
        this.tableData = res.body;
      });
    },
    handleSelectionChange(data) {
      this.selectData = data;
    },
    // 添加成员
    handleAdd() {
      this.$refs.addTeamMemberDialog.dialogVisible = true;
    }
  }
};
</script>

<style scoped></style>
