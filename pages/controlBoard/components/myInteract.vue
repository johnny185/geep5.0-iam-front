<template>
  <div :class="{ wrap: isWrap }">
    互动
    <ul class="collectionContent">
      <li v-for="item in collectionList" :key="item.articleId" class="releaseItem" @click="releaseItem(item)">
        <p class="fontSize20" @click="releaseItem(item)">{{ item.articleSubject }}</p>
        <div class="fontSize16 font666666" @click="collectionItem(item)">{{ item.articleContent }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isWrap: true,
      collectionList: [], //发布数据
      pageData: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    releaseItem(item) {},
    getList() {
      // -2删除 -1草稿箱 1发布  3审核通过 4审核不通过
      let params = this.pageData;
      this.$axios.post('/api/forum/userArticle/showPersonalData', params).then((res) => {
        if (res.status === 200) {
          this.collectionList = res.body.list;
        }
      });
    }
  }
};
</script>

<style scoped>
.wrap {
  width: 1020px;
  height: 589px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  margin-left: 20px;
}
.collectionContent :hover {
  background: #eff4f8;
}
</style>
