<template>
  <div class="notice">
    <p class="fontSize40 fontBlue marginBottom20">平台动态</p>
    <!-- <div class="noticeContent"></div> -->
    <el-carousel class="noticeContent" :interval="5000" trigger="click" height="340px" indicator-position="none">
      <el-carousel-item class="noticeContentItem" v-for="(item, index) in noticeData" :key="index">
        <p class="fontSize24 bold">{{ item.newsTitle }}</p>
        <p class="fontSize16 marginTop10 articleContent" v-html="item.newsAbstract"></p>
        <!-- <h3 class="small">{{ item }}</h3> -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  mounted() {
    this.queryList();
  },
  data() {
    return {
      noticeData: []
    };
  },
  methods: {
    queryList() {
      let params = {
        pageNum: 1,
        pageSize: 5,
        newsType: 0
      };
      this.$axios.post('/api/document/dynamicNews/getShowNewsList', params).then((res) => {
        this.noticeData = res.body.list;
      });
    }
  }
};
</script>

<style scoped>
.notice {
  flex: 1;
  margin-left: 40px;
}
.noticeContent {
  /* height: 420px; */
  background: #fff;
  padding: 40px;
}
.noticeContentItem {
  /* padding: 40px 40px;
  overflow: hidden; */

  /* padding: 40px; */
}
</style>
