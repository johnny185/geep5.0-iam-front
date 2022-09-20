<template>
  <div>
    <!-- 数据列表 -->
    <el-table :data="reviewData" style="width: 100%">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="versionCode" label="版本号" show-overflow-tooltip />
      <el-table-column prop="versionDescription" label="版本说明" show-overflow-tooltip />
      <el-table-column prop="userName" label="开发者" width="80" />
      <el-table-column prop="updateTime" label="更新时间" width="160" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.developStatus === 'I'">待发布</span>
          <span v-if="scope.row.developStatus === 'N'">发布失败</span>
          <span v-if="scope.row.developStatus === 'Y'">开发版审核通过</span>
        </template>
      </el-table-column>
      <el-table-column label="使用状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.pauseStatus === 0">暂停</span>
          <span v-if="scope.row.pauseStatus === 1">使用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="small" @click="createFlow(scope.row)">应用开发</el-button>
          <el-dropdown>
            <el-button size="small">
              更多操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- 暂停 和 取消暂停 只有在 developStatus === 'Y' 开发版审核通过 和 developStatus === 'N'发布失败 情况下存在-->
              <el-dropdown-item
                v-if="scope.row.developStatus === 'Y' || scope.row.developStatus === 'N'"
                @click.native="upgradeItem(scope.row)"
                :disabled="sceneStatus === '0' && scope.row.pauseStatus === 0"
                >升级</el-dropdown-item
              >
              <el-dropdown-item
                v-if="
                  (scope.row.developStatus === 'Y' || scope.row.developStatus === 'N') && scope.row.pauseStatus === 1
                "
                @click.native="suspendOrcancelBtn(scope.row, 0)"
                :disabled="sceneStatus === '0' && scope.row.pauseStatus === 0"
                >暂停</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.developStatus === 'Y' && scope.row.pauseStatus === 0"
                @click.native="suspendOrcancelBtn(scope.row, 1)"
                :disabled="sceneStatus === '0' && scope.row.pauseStatus === 0"
                >取消暂停</el-dropdown-item
              >
              <el-dropdown-item
                v-if="
                  (scope.row.developStatus === 'Y' || scope.row.developStatus === 'N') && scope.row.pauseStatus === 1
                "
                @click.native="submitIssue(scope.row)"
                :disabled="sceneStatus === '0' && scope.row.pauseStatus === 0"
                >提交发布</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.developStatus === 'I'"
                @click.native="cancelIssue(scope.row)"
                :disabled="sceneStatus === '0' && scope.row.pauseStatus === 0"
                >取消发布</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 升级 场景 -->
    <upgradeDialog ref="upgradeDialog" :upgradeData="upgradeData" @subitupgradeForm="subitupgradeForm"></upgradeDialog>
  </div>
</template>

<script>
import upgradeDialog from './upgradeDialog'; //升级版本
export default {
  components: {
    upgradeDialog
  },
  props: {
    // 审核版 数据
    reviewData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // 升级 当前行信息
      upgradeData: {},
      // 判断当前场景是 暂停0 还是 使用1 状态
      sceneStatus: this.$route.query.sceneStatus,
      //应用名称
      sceneName: this.$route.query.sceneName
    };
  },
  methods: {
    // 暂停 or 取消暂停
    suspendOrcancelBtn(item, data) {
      let message = '';
      message = data === 0 ? '暂停' : '取消暂停';
      this.$confirm(`确定要${message}该版本?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            consoleVersionId: item.consoleVersionId,
            pauseStatus: data
          };
          this.$axios.post('/api/controlpanel/panel/pauseDevelopState', params).then((res) => {
            this.$notify({
              title: '提示',
              message: data === 0 ? '暂停操作成功' : '取消暂停操作成功',
              type: 'success'
            });
            this.$emit('refresh');
          });
        })
        .catch(() => {});
    },
    //智能场景 创建流程
    createFlow(item) {
      this.$router.push({
        path: '/controlBoard/createFlow',
        query: {
          synthesisStatus: item.developStatus === 'I' ? 0 : 1,
          sceneStatus: this.sceneStatus,
          pauseStatus: item.pauseStatus,
          consoleVersionId: item.consoleVersionId,
          intelSceneId: item.intelSceneId,
          versionCode: item.versionCode,
          sceneName: this.sceneName
        }
      });
    },
    // 保存升级后的 数据
    subitupgradeForm(data) {
      let params = {
        consoleVersionId: data.consoleVersionId,
        versionCode: data.versionCode
      };
      this.$axios.post('/api/controlpanel/sceneOperation/upgradeVersion', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '升级操作成功',
          type: 'success'
        });
        this.$refs.upgradeDialog.handleClose();
        this.$emit('refresh');
      });
    },
    // 升级
    upgradeItem(item) {
      this.upgradeData = JSON.parse(JSON.stringify(item));
      this.upgradeData['versionCode'] = 'update' + this.upgradeData['versionCode'];
      this.$refs.upgradeDialog.dialogVisible = true;
    },
    // 取消发布
    cancelIssue(item) {
      let params = {
        consoleVersionId: item.consoleVersionId,
        versionStatus: item.versionStatus,
        auditId: item.auditId,
        auditStatus: 'Q' //取消申请 传q
      };
      this.$axios.post('/api/controlpanel/panel/submitSystemTest', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '取消发布操作成功',
          type: 'success'
        });
        this.$emit('refresh');
      });
    },
    // 提交发布
    submitIssue(item) {
      let params = {
        consoleVersionId: item.consoleVersionId,
        versionStatus: item.versionStatus,
        auditId: item.auditId,
        auditStatus: 'W' //审核状态，传W
      };
      this.$axios.post('/api/controlpanel/panel/submitSystemTest', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '提交发布操作成功',
          type: 'success'
        });
        this.$emit('refresh');
      });
    }
  }
};
</script>

<style scoped></style>
