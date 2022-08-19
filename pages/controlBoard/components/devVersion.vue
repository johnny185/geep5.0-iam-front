<template>
  <div>
    <el-button size="small" @click="createDev" :disabled="sceneStatus === '0'">+新建开发版本</el-button>
    <!-- 数据列表 -->
    <el-table :data="devData" ref="devDataTable" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="versionCode" label="版本号" show-overflow-tooltip />
      <el-table-column prop="versionDescription" label="版本说明" show-overflow-tooltip />
      <el-table-column prop="userName" label="开发者" />
      <el-table-column prop="updateTime" label="更新时间" width="160" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.developStatus === 'I'">开发中</span>
          <span v-if="scope.row.developStatus === 'F'">开发完成</span>
          <span v-if="scope.row.developStatus === 'T'">测试中</span>
          <span v-if="scope.row.developStatus === 'N'">测试未通过</span>
          <span v-if="scope.row.developStatus === 'Y'">审核通过</span>
        </template>
      </el-table-column>
      <el-table-column label="使用状态">
        <template slot-scope="scope">
          <span v-if="scope.row.pauseStatus === 0">暂停</span>
          <span v-if="scope.row.pauseStatus === 1">使用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <div style="display: flex">
            <el-button size="small" @click="createFlow(scope.row)" style="margin-right: 10px">应用开发</el-button>
            <el-dropdown>
              <el-button size="small">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- 只有看开发中 或者 测试未通过 才能删除  -->
                <!-- disabled 条件 当 场景 sceneStatus 为0 暂停时 或者 版本 pauseStatus 为0 暂停时-->
                <el-dropdown-item
                  v-if="scope.row.developStatus === 'I' || scope.row.developStatus === 'N'"
                  :disabled="sceneStatus === '0' || scope.row.pauseStatus === 0"
                  @click.native="delectItem(scope.row)"
                  >删除</el-dropdown-item
                >
                <!-- disabled 条件 当 场景 sceneStatus 为0 暂停时 同时 版本 pauseStatus 为1 使用时-->
                <el-dropdown-item
                  v-if="scope.row.pauseStatus === 1"
                  @click.native="suspendOrcancelBtn(scope.row, 0)"
                  :disabled="sceneStatus === '0' && scope.row.pauseStatus === 1"
                  >暂停</el-dropdown-item
                >
                <!-- disabled 条件 当 场景 sceneStatus 为0 暂停时 同时 版本 pauseStatus 为0 暂停时-->
                <el-dropdown-item
                  v-if="scope.row.pauseStatus === 0"
                  @click.native="suspendOrcancelBtn(scope.row, 1)"
                  :disabled="sceneStatus === '0' && scope.row.pauseStatus === 0"
                  >取消暂停</el-dropdown-item
                >
                <!-- disabled 条件 当 场景 sceneStatus 为0 暂停时 或者 版本 pauseStatus 为0 暂停时-->
                <el-dropdown-item
                  @click.native="upgradeItem(scope.row)"
                  :disabled="sceneStatus === '0' || scope.row.pauseStatus === 0"
                  >升级</el-dropdown-item
                >
                <!-- disabled 条件 当 场景 sceneStatus 为0 暂停时 或者 版本 pauseStatus 为0 暂停时-->
                <el-dropdown-item
                  v-if="scope.row.developStatus === 'I' || scope.row.developStatus === 'N'"
                  :disabled="sceneStatus === '0' || scope.row.pauseStatus === 0"
                  @click.native="submitUploadCloud(scope.row)"
                  >开发完成</el-dropdown-item
                >
                <!-- disabled 条件 当 场景 sceneStatus 为0 暂停时 或者 版本 pauseStatus 为0 暂停时-->
                <el-dropdown-item
                  v-if="scope.row.developStatus === 'F'"
                  @click.native="submitTest(scope.row)"
                  :disabled="sceneStatus === '0' || scope.row.pauseStatus === 0"
                  >提交测试</el-dropdown-item
                >
                <!-- disabled 条件 当 场景 sceneStatus 为0 暂停时 或者 版本 pauseStatus 为0 暂停时-->
                <el-dropdown-item
                  v-if="scope.row.developStatus === 'T'"
                  @click.native="cancelTest(scope.row)"
                  :disabled="sceneStatus === '0' || scope.row.pauseStatus === 0"
                  >取消测试</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 创建场景 -->
    <!-- <createDevDialog ref="createDevDialog" @subitForm="subitForm"></createDevDialog> -->
    <!-- 升级 场景 -->
    <upgradeDialog ref="upgradeDialog" :upgradeData="upgradeData" @subitupgradeForm="subitupgradeForm"></upgradeDialog>
  </div>
</template>

<script>
// import createDevDialog from './createDevDialog'; //新建开发版本
import upgradeDialog from './upgradeDialog'; //升级版本
export default {
  components: {
    // createDevDialog,
    upgradeDialog
  },
  props: {
    // 开发版本 数据
    devData: {
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
    // 取消测试
    cancelTest(item) {
      let params = {
        consoleVersionId: item.consoleVersionId,
        versionStatus: item.versionStatus,
        auditId: item.auditId,
        developStatus: 'F', //传F，表示退回到开发完成状态
        auditStatus: 'Q' // 传Q，表示取消申请
      };
      this.$axios.post('/api/controlpanel/panel/submitSystemTest', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '取消操作成功',
          type: 'success'
        });
        this.$emit('refresh');
      });
    },
    // 提交测试
    submitTest(item) {
      let params = {
        consoleVersionId: item.consoleVersionId,
        versionStatus: item.versionStatus,
        auditStatus: 'W' //审核状态，传W
      };
      this.$axios.post('/api/controlpanel/panel/submitSystemTest', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '提交测试操作成功',
          type: 'success'
        });
        this.$emit('refresh');
      });
    },
    // 上传云端
    submitUploadCloud(item) {
      let params = {
        consoleVersionId: item.consoleVersionId,
        developStatus: 'F' //F-开发完成
      };
      this.$axios.post('/api/controlpanel/panel/saveUploadCloud', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '开发完成操作成功',
          type: 'success'
        });
        this.$emit('refresh');
      });
    },
    //智能场景 创建流程
    createFlow(item) {
      this.$router.push({
        path: '/controlBoard/createFlow',
        query: {
          synthesisStatus: item.developStatus === 'T' ? 0 : 1,
          sceneStatus: this.sceneStatus,
          pauseStatus: item.pauseStatus,
          consoleVersionId: item.consoleVersionId,
          intelSceneId: item.intelSceneId,
          versionCode: item.versionCode,
          sceneName: this.sceneName
        }
      });
    },
    // 新建开发版
    createDev() {
      // this.$refs.createDevDialog.dialogVisible = true;
    },
    /**
     *  @param item 开发版本每一项具体值
     *  删除啊智能场景
     */
    delectItem(item) {
      // 二次确认删除智能场景
      this.$confirm('此操作将永久删除该创建场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            consoleVersionId: item.consoleVersionId
          };
          this.$axios.post('/api/controlpanel/panel/deleteDevelopScene', params).then((res) => {
            if (res.status === 200) {
              this.$notify({
                title: '成功',
                message: '删除当前版本操作成功',
                type: 'success'
              });
              this.$emit('refresh');
            }
          });
        })
        .catch(() => {});
    },
    //提交 新建开发版本表单 操作
    subitForm(data) {
      let params = Object.assign(
        {
          intelSceneId: this.$route.query.intelSceneId
        },
        data
      );
      this.$axios.post('/api/controlpanel/panel/createDevelopVersion', params).then((res) => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '新建开发版本操作成功',
            type: 'success'
          });
          // this.$refs.createDevDialog.handleClose();
          this.$emit('refresh');
        }
      });
    }
  }
};
</script>

<style scoped></style>
