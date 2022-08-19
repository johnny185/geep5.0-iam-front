<template>
  <!-- 分页器组件 -->
  <el-pagination
    v-if="pageData.total"
    background
    :pager-count="5"
    :current-page="pageData.pageNum"
    :page-size="pageData.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[10, 20, 50]"
    :total="pageData.total"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pageData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    // pageSize 每页数据条数 改变时会触发
    handleSizeChange(val) {
      this.$emit('sizeChange', val);
    },
    // 分页当前页信息
    handleCurrentChange(data) {
      this.$emit('currentPage', data);
    }
  }
};
</script>

<style scoped>
.el-pagination {
  text-align: right;
  padding: 20px;
  min-width: 500px;
}
</style>
