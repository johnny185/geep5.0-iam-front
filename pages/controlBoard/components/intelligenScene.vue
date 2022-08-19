<template>
  <client-only>
    <div class="sceneContent">
      <div class="sceneContentHeard">
        <!-- 只有在我的场景下才能有创建场景 -->
        <div class="createScene fontBlue fontCenter" @click="createBtn" v-if="activeName === 'myApp'">+ 创建场景</div>
        <el-autocomplete
          class="sceneInput"
          v-model.trim="sceneName"
          :fetch-suggestions="querySearch"
          placeholder="请输入应用名称"
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
      </div>
      <ul class="sceneWrap">
        <li class="sceneItem padding20" v-for="(item, index) in sceneData" :key="index">
          <!-- 场景icon -->
          <div class="sceneItemLeft">
            <img :src="item.sceneLogo" class="sceneBg" />
          </div>
          <!-- 场景内容 应用名称 创建时间 应用描述 -->
          <div class="sceneItemRight marginLeft20">
            <ul class="sceneItemRightContent">
              <li class="sceneItemRightContentItem lineHeight30">
                <div class="fontSize16 sceneItemRightContentItemTitle">应用名称：</div>
                <div class="fontSize16">{{ item.sceneName }}</div>
              </li>
              <li class="sceneItemRightContentItem lineHeight30">
                <div class="fontSize16 sceneItemRightContentItemTitle">创建时间：</div>
                <div class="fontSize16">{{ item.createTime }}</div>
              </li>
              <li class="sceneItemRightContentItem lineHeight30">
                <div class="fontSize16 sceneItemRightContentItemTitle">应用描述：</div>
                <div class="fontSize16">{{ item.sceneDescription }}</div>
              </li>
            </ul>
            <!-- 按钮操作 开发管理 暂停 删除 复制 -->
            <ul class="sceneItemRightBottom">
              <li class="sceneBottomItem" @click="projectItem(item, '1-1')">开发管理</li>
              <li class="sceneBottomItem" @click="suspendOrcancelBtn(item, 0)" v-if="item.sceneStatus === 1">暂停</li>
              <li class="sceneBottomItem" @click="suspendOrcancelBtn(item, 1)" v-if="item.sceneStatus === 0">
                取消暂停
              </li>
              <!-- <li class="sceneBottomItem" @click="projectItem(item, '1-2')">能力管理</li> -->
              <!-- <li class="sceneBottomItem" @click="projectItem(item, '1-4')">设置</li> -->
              <li class="sceneBottomItem" @click="copyBtn(item)">复制</li>
              <li class="sceneBottomItem" @click="delItem(item)" v-if="item.sceneStatus === 1">删除</li>
              <li class="sceneBottomItem" @click="projectItem(item, '1-5')">团队成员</li>
            </ul>
          </div>
        </li>
      </ul>
      <!-- 复制 -->
      <copyDialog
        ref="copyDialog"
        :basicInfoData="basicInfoData"
        :versionTableData="versionTableData"
        @submitCopyData="submitCopyData"
      ></copyDialog>
    </div>
  </client-only>
</template>

<script>
import copyDialog from './copyDialog'; //复制 弹窗
export default {
  components: {
    copyDialog
  },
  props: {
    // 判断 切换 我的应用 还是团队应用
    activeName: {
      type: String,
      default: 'myApp'
    }
  },
  data() {
    return {
      // 搜索 5条历史记录存储数据
      restaurants: [],
      // 场景 数据
      sceneData: [],
      // 场景名称
      sceneName: '',
      // 复制 当前场景的基本信息
      basicInfoData: {},
      // 版本信息
      versionTableData: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.queryList();
    });
  },
  methods: {
    // 保存 复制数据
    submitCopyData(data) {
      let params = data;
      this.$axios.post('/api/controlpanel/sceneOperation/copyScene', params).then((res) => {
        this.$notify({
          title: '提示',
          message: '复制操作成功',
          type: 'success'
        });
        this.$refs.copyDialog.handleClose();
        this.queryList();
      });
    },
    // 复制
    async copyBtn(item) {
      let params = {
        intelSceneId: item.intelSceneId
      };
      // 基本信息
      await this.$axios.post('/api/controlpanel/panel/getIntelSceneById', params).then((res) => {
        this.basicInfoData = res.body;
        this.basicInfoData.sceneName = this.basicInfoData.sceneName + '_副本';
      });
      // 版本号 信息
      await this.$axios.post('/api/controlpanel/panel/getDevelopManagement', params).then((res) => {
        this.versionTableData = res.body;
        this.$refs.copyDialog.dialogVisible = true;
      });
    },
    // 模糊搜素
    querySearch(queryString, cb) {
      let params = { sceneStatus: 1 };
      this.$axios.post('/api/controlpanel/panel/searchTerms', params).then((res) => {
        this.restaurants = res.body;
        cb(this.restaurants);
      });
    },
    // 选中 历史搜索数据
    handleSelect(item) {
      this.sceneName = item.searchTerm;
      this.queryList();
    },
    // 删除
    delItem(item) {
      this.$confirm('确认要将该场景放入回收站吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            intelSceneId: item.intelSceneId,
            delType: -1 //普通删除进入回收站
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
    // 暂停 or 取消暂停
    suspendOrcancelBtn(item, data) {
      let message = '';
      message = data === 0 ? '暂停' : '取消暂停';
      this.$confirm(`确定要${message}该应用?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            intelSceneId: item.intelSceneId,
            sceneStatus: data
          };
          this.$axios.post('/api/controlpanel/panel/pauseSceneState', params).then((res) => {
            this.$notify({
              title: '提示',
              message: data === 0 ? '暂停操作成功' : '取消暂停操作成功',
              type: 'success'
            });
            this.queryList();
          });
        })
        .catch(() => {});
    },

    //查询创建项目ID
    queryList() {
      let params = {
        sceneName: this.sceneName
      };
      //当 切换 为 我的应用
      if (this.activeName === 'myApp') {
        this.$axios.post('/api/controlpanel/panel/getIntelScene', params).then((res) => {
          this.sceneData = res.body;
        });
      } else {
        this.$axios.post('/api/controlpanel/panel/getTeamScene', params).then((res) => {
          this.sceneData = res.body;
        });
      }
    },
    createBtn() {
      this.$emit('changeTab');
    },
    /**
     * @param item 场景每一项
     * @param menuIndex 对应到 开发管理 能力管理 设置 数据统计
     */
    projectItem(item, menuIndex) {
      this.$router.push({
        path: '/controlBoard/projectManagement',
        query: {
          myOrTeam: this.activeName,
          sceneStatus: item.sceneStatus,
          sceneName: item.sceneName,
          intelSceneId: item.intelSceneId,
          menuIndex: menuIndex
        }
      });
    }
  }
};
</script>

<style scoped>
.sceneContent {
  min-height: calc(100vh - 288px);
}
.sceneContentHeard {
  height: 64px;
}
.createScene {
  width: 140px;
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  border: 1px solid #2f74ff;
  cursor: pointer;
  float: left;
}
.sceneInput {
  float: right;
  width: 400px;
  /* top: 20px; */
}
.sceneWrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.sceneBg {
  display: block;
  width: 60px;
  height: 60px;
  margin-top: 5px;
  margin-right: 20px;
}

.sceneItem {
  width: 440px;
  height: auto;
  background: #eff4f8;
  margin-bottom: 20px;
  display: flex;
}
.sceneItemLeft {
  /* float: left; */
  width: 60px;
  height: auto;
}
.sceneItemRightContentItem {
  display: flex;
}
.sceneItemRightContentItemTitle {
  width: 86px;
}
.sceneItemRightBottom {
  display: flex;
}
.sceneItemRightBottom :nth-child(1) {
  padding: 15px 15px 15px 0px;
}
.sceneBottom {
  display: flex;
}
.sceneBottomItem {
  line-height: 20px;
  color: #666666;
  padding: 15px;
  cursor: pointer;
}
</style>
