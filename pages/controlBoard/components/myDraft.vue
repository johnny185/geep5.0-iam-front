<template>
  <div :class="{ wrap: isWrap }">
    <ul class="draftContent">
      <li v-for="item in draftList" :key="item.articleId" class="draftItem">
        <el-tooltip placement="top" effect="light" v-if="item.articleSubject.length >= 40">
          <div slot="content">{{ item.articleSubject }}</div>
          <p class="fontSize20" @click="draftItem(item)">{{ item.articleSubject }}</p>
        </el-tooltip>
        <p class="fontSize20" @click="draftItem(item)" v-else>{{ item.articleSubject }}</p>
        <!-- 创建时间 -->
        <div class="fontSize16 font666666" @click="draftItem(item)">{{ item.createTime }}</div>
        <i class="el-icon-delete deleteBtn" @click="deletItem(item)"></i>
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
</template>

<script>
export default {
  data() {
    return {
      isWrap: true,
      draftList: [],
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
    // 获取 草稿 列表
    getList() {
      // -2删除 -1草稿箱 1发布  3审核通过 4审核不通过
      let params = Object.assign({ articleType: -1 }, this.pageData);
      this.$axios.post('/api/forum/userArticle/getDraftList', params).then((res) => {
        if (res.status === 200) {
          this.draftList = res.body.list;
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
  height: 589px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  margin-left: 20px;
}
.draftContent :hover {
  background: #eff4f8;
}
.draftItem {
  padding: 20px 40px 20px 20px;
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
</style>
