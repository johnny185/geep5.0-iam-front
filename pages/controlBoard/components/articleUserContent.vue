<template>
  <div class="userBox padding20">
    <!-- <div class="avatar mainCenter"></div> -->
    <!-- <div class="mainCenter" @click="imageVisible=true"
    :style="'width: 80px;height: 80px;background:url('+imageUrl+');background-size: 100%;border-radius: 50%;'">
    </div> -->
    <!-- <div class="avatar mainCenter" 
      v-show="imageUrl!==''" >
      <img :src="imageUrl" style="width:100%;height:100%;border-radius: 50%; "/>
    </div> -->

    <!-- 如果路由头像信息为null，就取默认头像 -->
    <div v-if="$route.query.avatarUrl === null" class="avatar mainCenter"></div>
    <div v-else class="avatar mainCenter">
      <img :src="$route.query.avatarUrl" style="margin: 0 auto; border-radius: 50%" />
    </div>

    <div class="username fontSize18 fontCenter">
      {{ $route.query.hasOwnProperty('userName') ? $route.query.userName : $store.state.user.userInfo.nickName }}
    </div>
    <!-- <div
      class="notCertified fontCenter mainCenter"
      v-if="$store.state.user.userInfo.registerStatus !== '2' && !$route.query.hasOwnProperty('userName')"
      @click="toCertified()"
    >
      未认证
    </div> -->
    <div
      class="notCertified fontCenter mainCenter"
      v-if="$route.query.hasOwnProperty('userId') && !ifFollow"
      @click="followBtn()"
    >
      关注
    </div>
    <div
      class="notCertifiedBlueborder fontCenter mainCenter"
      v-if="$route.query.hasOwnProperty('userId') && ifFollow"
      @click="followBtn()"
    >
      取消关注
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ifFollow: false, //判断 该用户 是否被关注 默认false 未关注
      imageVisible: false,
      isPublic: true, //上传图片时的参数
      isTmp: true, //上传图片时的参数
      imageUrl: this.$store.state.user.userInfo.avatarUrl,
      //昵称部分
      isshowEditIcon: false,
      editNickNameInput: false,
      nickNameVal: ''
    };
  },
  created() {
    // 判断当前作者是否被关注
    if (this.$route.query.hasOwnProperty('userId')) {
      this.checkiIfFollow();
    }
  },
  watch: {
    // 监听 当前作者是否被关注
    $route() {
      this.checkiIfFollow();
    },
    '$store.state.user.userInfo.avatarUrl': {
      handler: function (newVal, oldVal) {
        this.imageUrl = newVal;
      },
      deep: true
    }
  },
  methods: {
    // 关注  praise 1关注0取消
    followBtn() {
      let params = {
        userId: this.$route.query.userId,
        praise: this.ifFollow ? 0 : 1
      };
      this.$axios.post('/api/forum/userArticle/toFollow', params).then((res) => {
        this.ifFollow = !this.ifFollow;
        //  this.ifFollow
      });
    },
    // 判断  第三方作者是否被关注过
    checkiIfFollow() {
      let params = { userId: this.$route.query.userId };
      this.$axios.post('/api/forum/userArticle/ifFollow', params).then((res) => {
        this.ifFollow = res.body;
      });
    }
    // 未认证 跳转认证页面
    // toCertified() {
    //   this.$router.push({
    //     path: '/login/certified'
    //   });
    // },
  }
};
</script>

<style scoped>
.userBox {
  width: 200px;
  height: 170px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  border-radius: 4px;
}
.avatar {
  width: 80px;
  height: 80px;
  background: url('/img/controlBoard/avatar.png');
  background-size: 100%;
  border-radius: 50%;
  margin: 0 auto;
}
.username {
  padding: 20px 0px;
  height: 25px;
  line-height: 25px;
  font-weight: 600;
  color: #333333;
}
.notCertified {
  width: 100px;
  height: 30px;
  line-height: 30px;
  line-height: 30px;
  background: #2f74ff;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.notCertifiedBlueborder {
  width: 100px;
  height: 30px;
  line-height: 30px;
  line-height: 30px;
  border: 1px solid #2f74ff;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 400;
  color: #2f74ff;
  cursor: pointer;
}
</style>
