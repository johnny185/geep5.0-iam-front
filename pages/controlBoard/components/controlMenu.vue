<template>
  <div class="marginTop20">
    <el-menu :default-active="active" class="el-menu-vertical-demo">
      <el-menu-item index="1" @click="toMenu('1')" v-if="!$route.query.hasOwnProperty('userId')">
        <i class="el-icon-user"></i>
        <span slot="title">我的资料</span>
      </el-menu-item>
      <el-menu-item index="2" @click="toMenu('2')" v-if="!$route.query.hasOwnProperty('userId')">
        <i class="el-icon-message"></i>
        <span slot="title">我的消息</span>
      </el-menu-item>
      <el-menu-item index="3" @click="toMenu('3')" v-if="!$route.query.hasOwnProperty('userId')">
        <i class="el-icon-message"></i>
        <span slot="title">我的互动</span>
      </el-menu-item>
      <el-menu-item index="4" @click="toMenu('4')">
        <i class="el-icon-document"></i>
        <span slot="title" v-if="!$route.query.hasOwnProperty('userId')">我的关注</span>
        <span slot="title" v-if="$route.query.hasOwnProperty('userId')">关注</span>
      </el-menu-item>
      <el-menu-item index="5" @click="toMenu('5')">
        <i class="el-icon-document"></i>
        <span slot="title" v-if="!$route.query.hasOwnProperty('userId')">我的粉丝</span>
        <span slot="title" v-if="$route.query.hasOwnProperty('userId')">粉丝</span>
      </el-menu-item>
      <el-menu-item index="6" @click="toMenu('6')">
        <i class="el-icon-document"></i>
        <span slot="title" v-if="!$route.query.hasOwnProperty('userId')">我的收藏</span>
        <span slot="title" v-if="$route.query.hasOwnProperty('userId')">收藏</span>
      </el-menu-item>
      <el-menu-item index="7" @click="toMenu('7')">
        <i class="el-icon-document"></i>
        <span slot="title" v-if="!$route.query.hasOwnProperty('userId')">我的发布</span>
        <span slot="title" v-if="$route.query.hasOwnProperty('userId')">发布</span>
      </el-menu-item>
      <el-menu-item index="8" @click="toMenu('8')" v-if="!$route.query.hasOwnProperty('userId')">
        <i class="el-icon-document"></i>
        <span slot="title">我的草稿</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: this.$route.query.menu
    };
  },
  methods: {
    toMenu(data) {
      this.$emit('toMenu', data);
    }
  }
};
</script>

<style scoped></style>
