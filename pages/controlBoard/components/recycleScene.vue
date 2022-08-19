<template>
  <div>
    <!-- 页面头部 -->
    <el-row :gutter="20">
      <el-form ref="form" :model="form" label-width="70px">
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="应用类型" prop="sceneType">
            <el-select v-model="form.sceneType" style="width: 100%" placeholder="请选择应用类型" clearable>
              <el-option v-for="item in sceneTypeOptions" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="9" :xl="9">
          <el-form-item label="关键字" prop="sceneName">
            <el-autocomplete
              style="width: 100%"
              v-model.trim="form.sceneName"
              :fetch-suggestions="querySearch"
              placeholder="请输入应用名称或者车型关键字"
              clearable
              :maxlength="30"
              show-word-limit
              @select="handleSelect"
              @keyup.enter.native="queryList"
              @change="queryList"
            >
              <template slot-scope="{ item }">
                <span class="key key-value">{{ item.searchTerm }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="float: right">
          <el-button size="small" type="primary" class="margin-left10" @click="queryList">查询</el-button>
          <el-button size="small" class="margin-left10" @click="resetForm">重置</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" fixed />
      <el-table-column label="应用类型" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sceneType === 'I'"> 智能场景 </span>
          <span v-if="scope.row.sceneType === 'L'">轻应用 </span>
        </template>
      </el-table-column>
      <el-table-column prop="sceneName" label="应用名称" align="center" />
      <el-table-column prop="carInfo" label="车型" align="center">
        <template slot-scope="scope">
          <el-tabs>
            <el-tab-pane
              :name="item.id"
              v-for="(item, index) in scope.row.brandModelVO.brands"
              :key="index"
              :label="item.brand"
            >
              <el-tooltip class="carTypeItem" effect="dark" :content="item.carType" placement="bottom">
                <p class="carType">
                  车型：
                  <span v-for="(it, i) in item.models" :key="i" style="margin-right: 10px; color: #aaa">{{
                    it.model
                  }}</span>
                </p></el-tooltip
              >
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="操作人员" align="center" width="100" />
      <el-table-column prop="deleteTime" label="删除时间" align="center" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="restoreBtn(scope.row)">还原</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">彻底删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 还原 弹窗 -->
    <recycleSceneDialog ref="recycleSceneDialog" :rowData="rowData" @saveRecycle="saveRecycle"></recycleSceneDialog>
  </div>
</template>

<script>
import recycleSceneDialog from './recycleSceneDialog';
export default {
  components: {
    recycleSceneDialog
  },
  data() {
    return {
      navigationOptions: [],
      tableData: [],
      form: {
        sceneName: '',
        sceneType: ''
      },
      sceneTypeOptions: [
        { value: 'I', label: '智能场景' },
        { value: 'L', label: '轻应用' }
      ],
      // 还原弹窗
      rowData: {}
    };
  },

  mounted() {
    this.queryList();
  },

  methods: {
    // 模糊搜素
    querySearch(queryString, cb) {
      let params = { sceneStatus: -1 };
      this.$axios.post('/api/controlpanel/panel/searchTerms', params).then((res) => {
        this.restaurants = res.body;
        cb(this.restaurants);
      });
    },
    // 选中 历史搜索数据
    handleSelect(item) {
      this.form.sceneName = item.searchTerm;
      this.queryList();
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            delType: -2, // -2:彻底删除
            intelSceneId: row.intelSceneId
          };
          this.$axios.post('/api/controlpanel/sceneOperation/delScene', params).then((res) => {
            this.$notify({
              title: '提示',
              message: '删除操作成功',
              type: 'success'
            });
            this.queryList();
          });
        })
        .catch(() => {});
    },
    // 保存 还原数据
    saveRecycle(data) {
      let params = data;
      this.$axios.post('/api/controlpanel/sceneOperation/restoreScene', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '还原操作成功',
          type: 'success'
        });
        this.$refs.recycleSceneDialog.handleClose();
        this.queryList();
      });
    },
    // 还原
    restoreBtn(row) {
      this.rowData = JSON.parse(JSON.stringify(row));
      this.$refs.recycleSceneDialog.dialogVisible = true;
    },
    // 重置
    resetForm() {
      this.$refs['form'].resetFields();
      this.queryList();
    },
    // 查询
    queryList() {
      let params = this.form;
      this.$axios.post('/api/controlpanel/panel/getRecycleIntelScene', params).then((res) => {
        res.body.forEach((item) => {
          item.carBrand = '0';
          item.brandModelVO.brands.forEach((ele, i) => {
            ele.carType = ele.models.map((it) => it.model).join(',');
            ele.id = i + '';
            if (this.form.brandName === ele.brand) item.carBrand = i + '';
          });
        });
        this.tableData = res.body;
      });
    }
  }
};
</script>

<style scoped>
.carTypeItem {
  margin: 4px;
}
</style>
