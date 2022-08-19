<template>
  <div :class="{ wrap: isWrap }">
    <ul class="followContent">
      <li
        v-for="(item, index) in followList"
        :key="item.userId"
        class="followItem padding20"
        :class="{ marginRight20: (index + 1) % 5 !== 0 }"
      >
        <div class="followAvatar mainCenter hoverStyle" @click="toPersonCenter(item)"></div>
        <!-- 作者名字 -->
        <div
          class="username fontSize14 bold fontCenter hoverStyle"
          @click="toPersonCenter(item)"
        >{{ item.userName }}</div>
        <!-- 已关注 / 未关注 -->
        <div v-if="isMe">
        <div
          class="followBtn fontBlue fontCenter mainCenter marginTop20 hoverStyle"
          v-if="item.ifFollow === 0"
          @click="followBtn(item)"
        >关注</div>
        <div
          class="followBtn fontBlue fontCenter mainCenter marginTop20 hoverStyle"
          v-if="item.ifFollow === 1"
          @click="followBtn(item)"
        >取消关注</div>
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
      followList: [], //发布数据
      pageData: {
        pageNum: 1,
        pageSize: 10
      },
       isMe:!this.$route.query.hasOwnProperty('userId') || (this.$route.query.hasOwnProperty('userId') && this.$route.query.userId==this.$store.state.user.userInfo.id)
    };
  },
  mounted() {
    this.getList();
  },
  watch: {
    // 监听 当前作者信息 变化
    $route() {
      this.getList();
    }
  },
  methods: {
    //跳转 第三方个人中心
    toPersonCenter(item) {
       if(item.userId===this.$store.state.user.userInfo.id){
        this.$router.push({
          path: '/controlBoard/personalCentre',
          query: {
            menu: '5',
            tab: '5'
          }
        });
      }else{
      this.$router.push({
        path: '/controlBoard/articlePersonalCentre',
        query: {
          menu: '5',
          userId: item.userId,
          userName: item.userName
        }
      });
      }
    },
    sizeChange(data) {
      this.pageData.pageSize = data;
      this.getList();
    },
    currentPage(data) {
      this.pageData.pageNum = data;
      this.getList();
    },
    // 关注  praise 1关注0取消
    followBtn(item) {
      let params = {
        userId: item.userId,
        praise: item.ifFollow === 1 ? 0 : 1
      };
      this.$axios.post('/api/forum/userArticle/toFollow', params).then((res) => {
        this.getList();
      });
    },
    getList() {
      let params = Object.assign(this.pageData, {
        userId: this.$route.query.hasOwnProperty('userId') ? this.$route.query.userId : null
      });
      this.$axios.post('/api/forum/userArticle/getFansList', params).then((res) => {
        if (res.status === 200) {
          this.followList = res.body.list;
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
  height: 558px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  margin-left: 20px;
  /* padding: 60px 24px 60px 48px; */
}
.followContent {
  height: 558px;
}
.followItem {
  float: left;
  width: 170px;
  /* height: 170px; */
  padding-bottom:30px;
  margin-bottom: 15px;
  position: relative;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  border-radius: 4px;
}
.followAvatar {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  background: url('/img/developerPlatform/user.png') no-repeat;
  background-size: 100% 100%;
}
.followBtn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  border: 1px solid #2f74ff;
  font-size: 12px;
  font-weight: 400;
  color: #2f74ff;
  cursor: pointer;
}
.followBtn:hover {
  color: #ffffff;
  background: #2f74ff;
}
.el-pagination {
  text-align: right;
  padding: 20px;
  min-width: 500px;
}
</style>
