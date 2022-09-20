<template>
  <div>
    <el-breadcrumb
      class="mainWidth mainCenter breadcrumbStyle"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbData"
        :key="index"
        >{{ item }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    // 面包屑 导航
    breadcrumbData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.breadcrumbStyle {
  line-height: 60px;
}
</style>
