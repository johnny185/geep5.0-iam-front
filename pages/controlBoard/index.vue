<template>
  <div>
    <client-only>
      <!-- 控制台首页 -->
      <controlNav></controlNav>
      <div class="controlWrap">
        <div class="controlContent mainCenter">
          <div class="controlContentLeft">
            <el-menu default-active="1-2" @select="handleSelect" :default-openeds="openeds">
              <el-submenu index="1">
                <span slot="title">应用管理</span>
                <el-menu-item index="1-1">轻应用</el-menu-item>
                <el-menu-item index="1-2">智能场景</el-menu-item>
                <el-menu-item index="1-3">回收站</el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <span slot="title">能力管理</span>
                <el-menu-item index="2-1">全部能力</el-menu-item>
                <el-menu-item index="2-2">我的能力</el-menu-item>
                <el-menu-item index="2-3">我的订阅</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <div class="controlContentRight padding20">
            <!-- 轻应用 -->
            <lightApplication v-if="tab === 'app'"></lightApplication>

            <!-- 只能只能场景切换 -->
            <!-- v-if="tab === '1-2'" -->
            <el-tabs v-model="activeName" @tab-click="handleClick" v-if="tab === '1-2'">
              <el-tab-pane label="我的应用" name="myApp">
                <intelligenScene @changeTab="changeTab" :activeName="activeName" v-if="activeName === 'myApp'"></intelligenScene>
              </el-tab-pane>
              <el-tab-pane label="团队应用" name="teamApp">
                <intelligenScene @changeTab="changeTab" :activeName="activeName" v-if="activeName === 'teamApp'"></intelligenScene>
              </el-tab-pane>
            </el-tabs>
            <!-- 智能场景 -->
            <!-- <intelligenScene v-if="tab === '1-2'" @changeTab="changeTab"></intelligenScene> -->
            <!-- 回收站 -->
            <recycleScene v-if="tab === '1-3'" @changeTab="changeTab"></recycleScene>
            <!-- 创建智能场景 -->
            <createScene v-if="tab === 'createSC'" @closeSCTab="closeSCTab"></createScene>
            <!-- 能力管理 全部能力 -->
            <!-- <allAbilityList v-if="tab === '2-1'" /> -->
            <!-- 能力管理 我的能力 -->
            <myAbilityList v-if="tab === '2-2'" />
            <!-- 能力管理 我的订阅 -->
            <mySubscribeList v-if="tab === '2-3'" />
          </div>
        </div>
      </div>
      <!-- 版权位 -->
      <!-- <footContent></footContent> -->
    </client-only>
  </div>
</template>

<script>
// import controlUser from './components/controlUser'; //控制台用户
// import controlNotice from './components/controlNotice'; //控制台公告
import lightApplication from './components/lightApplication'; //轻应用
import intelligenScene from './components/intelligenScene'; //智能场景
import recycleScene from './components/recycleScene'; //智能场景
import createScene from './components/createScene'; //创建智能场景
// import allAbilityList from './components/allAbilityList'; //全部能力
import myAbilityList from './components/myAbilityList'; //我的能力
import mySubscribeList from './components/mySubscribeList'; //我的订阅

export default {
  components: {
    // controlUser,
    // controlNotice,
    intelligenScene,
    recycleScene,
    lightApplication,
    createScene,
    // allAbilityList,
    myAbilityList,
    mySubscribeList
  },
  data() {
    return {
      openeds: ['1', '2'], //默认展开的菜单
      tab: '1-2', // 选中的菜单值
      activeName: 'myApp'
    };
  },
  methods: {
    handleClick() { },
    /**
     * 关闭 创建应用
     * @param data
     * **/
    closeSCTab(data) {
      this.tab = '1-2';
    },
    changeTab() {
      this.tab = 'createSC';
    },
    //  菜单目录 选择事件
    handleSelect(key, keyPath) {
      // console.log('菜单目录 选择事件', key, keyPath);
      this.tab = key;
    }
  }
};
</script>

<style scoped>
.controlWrap {
  width: 100%;
  background: #eff4f8;
}
.controlContent {
  display: flex;
  width: fit-content;
  padding: 40px 0px;
}
.controlContentLeft {
  width: 224px;
  height: auto;
}
.controlContentRight {
  width: 980px;
  height: auto;
  background: #fff;
  margin-left: 20px;
}
</style>
