<template>
  <div>
    <div :class="{ wrap: isWrap }">
      <ul class="releaseContent">
        <li v-for="item in releaseList" :key="item.articleId" class="releaseItem">
          <!-- 文章标题   若 文章标题 字段超过40个字出现鼠标移入提示全部信息 -->
          <el-tooltip placement="top" effect="light" v-if="item.articleSubject.length >= 40">
            <div slot="content">{{ item.articleSubject }}</div>
            <p class="fontSize20 singleLineHiding" @click="releaseItem(item)">{{ item.articleSubject }}</p>
          </el-tooltip>
          <p class="fontSize20 singleLineHiding" @click="releaseItem(item)" v-else>{{ item.articleSubject }}</p>
          <div class="fontSize16 font666666" @click="releaseItem(item)">{{ item.articleContent }}</div>
          <!-- 如果有用户 id 则不显示 删除 -->
          <i
            class="el-icon-delete deleteBtn"
            v-if="!$route.query.hasOwnProperty('userId')"
            @click="deletItem(item)"
          ></i>
          <div class="releaseBottom">
            <!-- 创建时间 -->
            <div class="marginRight20">{{ item.createTime }}</div>
            <!-- 1待审核 3审核通过 4审核不通过 -->
            <div v-if="!$route.query.hasOwnProperty('userId')">
              <div class="font666666" v-if="item.articleType === -3">被隐藏</div>
              <div class="fontMoccasin" v-if="item.articleType === 1">待审核</div>
              <div class="fontSpringGreen" v-if="item.articleType === 3">审核通过</div>
              <div class="fontRed" v-if="item.articleType === 4">审核不通过</div>
            </div>
          </div>
          <!-- <el-button type="danger" icon="el-icon-delete" circle class="deleteBtn"></el-button> -->
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      isWrap: true,
      releaseList: [], //发布数据
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
    // 发布文章查看详情
    releaseItem(item) {
      // articleType 为 4 ，审核不通过，跳转到可编辑页面
      if (item.articleType === 4) {
        this.$router.push({
          path: '/developerPlatform/forum',
          query: {
            item: JSON.stringify(item),
            addOrEditStatus: 'edit'
          }
        });
        return false;
      }
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
    //删除 草稿箱
    deletItem(item) {
      let params = {
        articleId: item.articleId
      };
      this.$axios.post('/api/forum/userArticle/deleteArticleId', params).then((res) => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '删除操作成功',
            type: 'success'
          });
          this.getList();
        }
      });
    },
    // 草稿 再编辑
    draftItem(item) {
      this.$router.push({
        path: '/developerPlatform/forum',
        query: {
          item: JSON.stringify(item),
          addOrEditStatus: 'edit'
        }
      });
    },
    // 获取  列表
    getList() {
      // -2删除 -1草稿箱 1发布  3审核通过 4审核不通过
      // let params = Object.assign({ articleType: 1 }, this.pageData);
      let params = Object.assign(this.pageData, {
        userId: this.$route.query.hasOwnProperty('userId') ? this.$route.query.userId : null
      });

      this.$axios.post('/api/forum/userArticle/getToShowList', params).then((res) => {
        // this.$axios.post('/api/forum/article/getArticleList', params).then((res) => {
        if (res.status === 200) {
          this.releaseList = res.body.list;
          this.pageData.pageNum = res.body.pageNum;
          this.pageData.pageSize = res.body.pageSize;
          this.pageData.total = res.body.total;
          // this.hottestData = res.body.list.splice(0, 3);
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
.releaseContent :hover {
  background: #eff4f8;
}
.releaseItem {
  padding: 15px 40px 0px 20px;
  position: relative;
  cursor: pointer;
}
.deleteBtn {
  position: absolute;
  top: 24px;
  right: 20px;
  color: red;
}
.el-pagination {
  text-align: right;
  padding: 20px;
  min-width: 500px;
}
.releaseBottom {
  display: flex;
}
</style>
