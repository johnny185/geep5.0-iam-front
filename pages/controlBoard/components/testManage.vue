<template>
  <div>
    <el-table :data="testData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="sceneName" label="名称" width="160" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="versionCode" label="版本号" width="120"> </el-table-column>
      <el-table-column prop="submitDate" label="提交时间" width="160"> </el-table-column>
      <el-table-column prop="testType" label="版本类型">
        <template slot-scope="scope">
          <span v-if="scope.row.versionType === 'I'">智能场景</span>
          <span v-if="scope.row.versionType === 'L'">轻应用</span>
        </template>
      </el-table-column>
      <el-table-column prop="testType" label="测试类型">
        <template slot-scope="scope">
          <span v-if="scope.row.testType === 'S'">系统测试</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitDate" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.submitStatus === 'I'">测试中</span>
          <span v-if="scope.row.submitStatus === 'F'">完成</span>
          <span v-if="scope.row.submitStatus === 'Q'">已取消</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitDate" label="操作" width="80">
        <template slot-scope="scope">
          <!-- submitStatus I 测试中可以取消测试   Q已取消 可以重新提预约 -->
          <!--当场景 sceneStatus 为0 暂停时 取消测试不能操作  -->
          <el-button
            v-if="scope.row.submitStatus === 'I'"
            :disabled="sceneStatus === '0'"
            type="text"
            @click="updateTbSubmitTes(scope.row)"
            >取消测试</el-button
          >
          <!--当场景 sceneStatus 为0 暂停时 重新预约不能操作  -->
          <el-button
            v-if="scope.row.submitStatus === 'Q'"
            :disabled="sceneStatus === '0'"
            type="text"
            @click="updateTbSubmitTes(scope.row)"
            >重新预约</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :pager-count="5"
      :current-page="testPageData.pageNum"
      :page-size="testPageData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50]"
      :total="testPageData.total"
      @current-change="testCurrentChange"
      @size-change="testSizeChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 测试数据
    testData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // 分页
      testPageData: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      // 判断当前场景是 暂停0 还是 使用1 状态
      sceneStatus: this.$route.query.sceneStatus
    };
  },
  methods: {
    // 条数修改
    testSizeChange(data) {
      this.testPageData.pageSize = data;
      this.$parent.queryTestData();
    },
    // 页数修改
    testCurrentChange(data) {
      this.testPageData.pageNum = data;
      this.$parent.queryTestData();
    },
    // 取消 重新预约  测试
    updateTbSubmitTes(row) {
      this.$parent.menuIndex = '1-1';
      // let params = {
      //   submitId: row.submitId,
      //   submitStatus: row.submitStatus === 'I' ? 'Q' : 'I',
      //   consoleVersionId: row.consoleVersionId
      // };
      // this.$axios.post('/api/controlpanel/panel/updateTbSubmitTestManage', params).then((res) => {
      //   this.$notify({
      //     title: '提示',
      //     message: row.submitStatus === 'I' ? '取消测试操作成功' : '重新预约操作成功',
      //     type: 'success'
      //   });
      //   this.$emit('refreshTest');
      // });
    }
  }
};
</script>

<style scoped>
.el-pagination {
  text-align: right;
  padding: 20px;
  min-width: 500px;
}
</style>
