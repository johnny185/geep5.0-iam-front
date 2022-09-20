<template>
  <div>
    <client-only>
      <!-- 控制台首页 -->
      <controlNav></controlNav>
      <div class="projectWrap">
        <div class="projectContent mainCenter">
          <!-- 项目名称 + 开发管理 能力管理  测试管理 设置 -->
          <div class="projectContentLeft">
            <el-menu :default-active="menuIndex">
              <el-submenu index="1">
                <div
                  slot="title"
                  style="overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; -webkit-box-orient: vertical"
                >
                  {{ sceneName }}
                </div>
                <el-menu-item index="1-1" @click="toDetail('1-1')">开发管理</el-menu-item>
                <el-menu-item index="1-2" @click="toDetail('1-2')">能力管理</el-menu-item>
                <el-menu-item index="1-3" @click="toDetail('1-3')">测试管理</el-menu-item>
                <el-menu-item index="1-4" @click="toDetail('1-4')">设置</el-menu-item>
                <el-menu-item index="1-5" @click="toDetail('1-5')">团队管理</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <div class="controlContentRight padding20">
            <!--开发管理 -->
            <devManage
              v-if="menuIndex === '1-1'"
              :onLineData="onLineData"
              :reviewData="reviewData"
              :devData="devData"
              @refresh="refresh"
            ></devManage>
            <!-- 能力管理 -->
            <abilityManage
              ref="abilityManage"
              v-if="menuIndex === '1-2'"
              :abilityData="abilityData"
              :abilityApplyRecordData="abilityApplyRecordData"
              @refreshAbiityData="refreshAbiityData"
            ></abilityManage>
            <!-- 测试管理 -->
            <testManage
              v-if="menuIndex === '1-3'"
              ref="testManage"
              :testData="testData"
              @refreshTest="refreshTest"
            ></testManage>
            <!-- 设置 -->
            <setUpManage v-if="menuIndex === '1-4'"></setUpManage>
            <!-- 团队管理 -->
            <teamManage v-if="menuIndex === '1-5'"></teamManage>
          </div>
        </div>
      </div>
      <!-- 版权位 -->
      <footContent></footContent>
    </client-only>
  </div>
</template>
<script>
import devManage from './components/devManage.vue'; //开发管理
// import abilityManage from './components/abilityManage.vue'; //能力管理
import testManage from './components/testManage.vue'; //测试管理
import setUpManage from './components/setUpManage.vue'; //设置
import teamManage from './components/teamManage.vue'; //团队设置
export default {
  components: {
    devManage,
    // abilityManage,
    testManage,
    setUpManage,
    teamManage
  },
  mounted() {
    if (this.menuIndex === '1-1') {
      this.queryList();
    } else if (this.menuIndex === '1-2') {
      this.$nextTick(() => {
        this.queryAbilityData();
        this.queryAbilityApplyRecord();
      });
    } else if (this.menuIndex === '1-3') {
      this.queryTestData();
    }
  },
  data() {
    return {
      // 项目名称
      sceneName: this.$route.query.sceneName,
      intelSceneId: this.$route.query.intelSceneId,
      // 回显 下标
      menuIndex: this.$route.query.menuIndex,
      // 线上版 数据
      onLineData: [],
      // 审核版 数据
      reviewData: [],
      //开发版 数据
      devData: [],
      // 能力管理 列表
      abilityData: [],
      // 能力申请记录 列表
      abilityApplyRecordData: [],
      // 测试管理
      testData: []
    };
  },
  methods: {
    // 重新刷新 测试列表
    refreshTest() {
      this.queryTestData();
    },
    // 查询 测试数据
    queryTestData() {
      this.$nextTick(() => {
        let params = {
          pageNum: this.$refs.testManage.testPageData.pageNum,
          pageSize: this.$refs.testManage.testPageData.pageSize
        };
        this.$axios.post('/api/controlpanel/panel/findTbSubmitTestManage', params).then((res) => {
          this.testData = res.body.list;
          this.$refs.testManage.testPageData.pageNum = res.body.pageNum;
          this.$refs.testManage.testPageData.pageSize = res.body.pageSize;
          this.$refs.testManage.testPageData.total = res.body.total;
        });
      });
    },
    // 刷新 能力管理列表  能力申请列表
    refreshAbiityData() {
      this.queryAbilityData();
      this.queryAbilityApplyRecord();
    },
    // 切换 开发管理 能力管理 测试管理 设置
    toDetail(data) {
      this.menuIndex = data;
      //当选中 开发管理
      if (data === '1-1') {
        this.queryList();
        // 当选中 能力管理
      } else if (data === '1-2') {
        this.queryAbilityData();
        this.queryAbilityApplyRecord();
        // 当选中 测试管理
      } else if (this.menuIndex === '1-3') {
        this.queryTestData();
      } else {
        return false;
      }
    },
    // 能力申请 记录列表
    queryAbilityApplyRecord() {
      this.$nextTick(() => {
        let params = {
          pageNum: this.$refs.abilityManage.abilityApplyRecordPageData.pageNum,
          pageSize: this.$refs.abilityManage.abilityApplyRecordPageData.pageSize,
          intelSceneId: this.intelSceneId
        };
        this.$axios.post('/api/controlpanel/panel/abilityApplyRecordlist', params).then((res) => {
          this.abilityApplyRecordData = res.body.list;
          this.$refs.abilityManage.abilityApplyRecordPageData.pageNum = res.body.pageNum;
          this.$refs.abilityManage.abilityApplyRecordPageData.pageSize = res.body.pageSize;
          this.$refs.abilityManage.abilityApplyRecordPageData.total = res.body.total;
        });
      });
    },
    // 查询 能力 列表
    queryAbilityData() {
      this.$nextTick(() => {
        let params = {
          pageNum: this.$refs.abilityManage.abilityPageData.pageNum,
          pageSize: this.$refs.abilityManage.abilityPageData.pageSize,
          intelSceneId: this.intelSceneId
        };
        this.$axios.post('/api/controlpanel/panel/getAbilityList', params).then((res) => {
          this.abilityData = res.body.list;
          this.$refs.abilityManage.abilityPageData.pageNum = res.body.pageNum;
          this.$refs.abilityManage.abilityPageData.pageSize = res.body.pageSize;
          this.$refs.abilityManage.abilityPageData.total = res.body.total;
        });
      });
    },
    // 删除 单个开发版场景 后 刷新列表
    refresh() {
      this.queryList();
    },
    // 查询 开发管理 列表
    queryList() {
      let params = {
        intelSceneId: this.intelSceneId
      };
      this.devData = [];
      this.reviewData = [];
      this.onLineData = [];
      this.$axios.post('/api/controlpanel/panel/getDevelopManagement', params).then((res) => {
        if (res.status === 200) {
          if (res.body.length === 0) {
            return false;
          }
          //versionStatus I-开发版本 P-审核版本 O-线上版本
          res.body.forEach((item) => {
            if (item.versionStatus === 'I') {
              this.devData.push(item);
            } else if (item.versionStatus === 'P') {
              this.reviewData.push(item);
            } else {
              this.onLineData.push(item);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.projectWrap {
  width: 100%;
  background: #eff4f8;
}
.projectContent {
  display: flex;
  width: fit-content;
  padding: 40px 0px;
}
.projectContentLeft {
  width: 224px;
  height: auto;
}
.controlContentRight {
  width: 980px;
  height: auto;
  background: #fff;
  margin-left: 20px;
}

.el-menu-item span {
  white-space: normal;
  word-break: break-all;
  line-height: 20px;
  flex: 1;
}
/* .el-submenu__title {
  line-height: 18px !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
} */
</style>
