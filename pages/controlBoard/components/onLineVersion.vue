<template>
  <div>
    <!-- 数据列表 -->
    <el-table :data="onLineData" style="width: 100%">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="versionCode" label="版本号" show-overflow-tooltip />
      <el-table-column prop="versionDescription" label="版本说明" show-overflow-tooltip />
      <el-table-column prop="userName" label="开发者" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.developStatus === 'Y'">已发布</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="small" @click="createFlow(scope.row)">应用开发</el-button>
          <el-button
            size="small"
            @click="upgradeItem(scope.row)"
            :disabled="sceneStatus === '0' || scope.row.pauseStatus === 0"
            >升级</el-button
          >
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
  props: {
    // 线上版 数据
    onLineData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: {
    upgradeDialog
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
    //智能场景 创建流程
    createFlow(item) {
      this.$router.push({
        path: '/controlBoard/createFlow',
        query: {
          synthesisStatus: item.developStatus === 'Y' ? 0 : 1,
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
    }
  }
};
</script>

<style scoped></style>
