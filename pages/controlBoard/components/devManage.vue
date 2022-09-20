<template>
  <client-only>
    <div class="devManageWrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="开发版本" name="devVersion">
          <devVersion ref="devVersion" :devData="devData" @refresh="refresh"></devVersion>
        </el-tab-pane>
        <el-tab-pane label="测试版本" name="reviewVersion">
          <reviewVersion ref="reviewVersion" :reviewData="reviewData" @refresh="refresh"></reviewVersion>
        </el-tab-pane>
        <el-tab-pane label="发布版本" name="onLineVersion">
          <onLineVersion ref="onLineVersion" :onLineData="onLineData" @refresh="refresh"></onLineVersion>
        </el-tab-pane>
      </el-tabs>
    </div>
  </client-only>
</template>

<script>
import devVersion from './devVersion'; //开发版
import reviewVersion from './reviewVersion'; // 测试版
import onLineVersion from './onLineVersion'; // 发布版
export default {
  components: {
    devVersion,
    reviewVersion,
    onLineVersion
  },
  props: {
    // 线上版 数据
    onLineData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 审核版 数据
    reviewData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 开发版 数据
    devData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      activeName: 'devVersion'
    };
  },
  methods: {
    // 刷新
    refresh() {
      this.$emit('refresh');
    }
  }
};
</script>

<style scoped>
.devManageWrap {
  min-height: calc(100vh - 288px);
}
.sceneBg {
  display: block;
  width: 60px;
  height: 60px;
  float: left;
  margin-top: 5px;
  margin-right: 20px;
}
.projectItem {
  width: 440px;
  height: auto;
  background: #eff4f8;
  margin-bottom: 20px;
}
.projectItemLeft {
  float: left;
}
.projectItemRight {
  float: left;
}
.projectName {
  color: #333;
}
.publicFontColor {
  color: #666;
}
.version {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.vesionBottom {
  display: flex;
}
.deletStyle {
  flex: 1;
  height: 40px;
  background: #fafdff;
  border-radius: 4px;
  border: 1px solid #cccccc;
  line-height: 40px;
  color: #ccc;
  /* margin-right: 20px; */
}
.projectDevStyle {
  flex: 1;
  height: 40px;
  background: #fafdff;
  border-radius: 4px;
  border: 1px solid #2f74ff;
  line-height: 40px;
  color: #2f74ff;
  margin-left: 20px;
}
.newDev {
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  border: 1px solid #2f74ff;
  display: inline-block;
  padding: 0px 20px;
  margin-left: 20px;
}
</style>
