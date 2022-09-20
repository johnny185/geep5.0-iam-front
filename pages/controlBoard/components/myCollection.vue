<template>
  <div :class="{ wrap: isWrap }">
    <ul class="collectionContent">
      <li v-for="item in collectionList" :key="item.articleId" class="collectionItem">
        <p class="fontSize20" @click="collectionItem(item)">{{ item.articleSubject }}</p>
        <!-- 如果有用户id 则不显示取消收藏 -->
        <div
          v-if="!$route.query.hasOwnProperty('userId')"
          class="iconBg hoverStyle noCollectionBg"
          :class="item.ifCollections == 0 ? 'noCollectionBg' : 'collectionBg'"
          @click="collectBtn(item)"
        ></div>
        <div class="collectionBottom">
          <div class="marginRight20">{{ item.createTime }}</div>
        </div>
      </li>
    </ul>
    <el-pagination
      v-if="pageData.total"
      background
      :pager-count="5"
      :current-page="pageData.pageNum"
      :page-size="pageData.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pageData.total"
      @current-change="currentPage"
      @size-change="sizeChange"
    />
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
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    sizeChange(data) {
      this.pageData.pageSize = data;
      this.getList();
    },
    currentPage(data) {
      this.pageData.pageNum = data;
      this.getList();
    },
    // 收藏
    collectBtn(item) {
      let params = {
        articleId: item.articleId,
        ifCollections: item.ifCollections === 0 ? 1 : 0
      };
      this.$axios.post('/api/forum/userArticle/collectionsArticle', params).then((res) => {
        this.getList();
      });
    },
    // 通过收藏 跳转到详情
    collectionItem(item) {
      this.$router.push({
        path: '/developerPlatform/articleItem',
        query: {
          articleId: item.articleId,
          userId: this.$route.query.hasOwnProperty('userId')
            ? this.$route.query.userId
            : this.$store.state.user.userInfo.id,
          articleType: item.articleType
        }
      });
    },
    getList() {
      let params = Object.assign(this.pageData, {
        userId: this.$route.query.hasOwnProperty('userId') ? this.$route.query.userId : null
      });
      this.$axios.post('/api/forum/userArticle/getCollectionsList', params).then((res) => {
        if (res.status === 200) {
          this.collectionList = res.body.list;
          this.pageData.pageNum = res.body.pageNum;
          this.pageData.pageSize = res.body.pageSize;
          this.pageData.total = res.body.total;
        }
      });
    }
  }
};
</script>

<style scoped>
.wrap {
  width: 1020px;
  height: 678px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  margin-left: 20px;
}
.collectionContent :hover {
  background: #eff4f8;
}
.iconBg {
  position: absolute;
  top: 24px;
  right: 20px;
  width: 14px;
  height: 14px;
}
.collectionItem {
  padding: 15px 40px 0px 20px;
  position: relative;
  cursor: pointer;
}
.noCollectionBg {
  background: url('/img/developerPlatform/noCollectionBtn.png') no-repeat;
  background-size: 100%;
  background-position-y: 1px;
}
.collectionBg {
  background: url('/img/developerPlatform/collectionBg.png') no-repeat;
  background-size: 100%;
  background-position-y: 1px;
}
.collectionBottom {
  display: flex;
}
.el-pagination {
  text-align: right;
  padding: 20px;
  min-width: 500px;
}
</style>
