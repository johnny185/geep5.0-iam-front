<template>
  <div class="userBox padding20">
    <!-- <div class="avatar mainCenter"></div> -->
    <el-tooltip class="item" effect="dark" content="点击更改头像" placement="right-end">
      <!-- <div class="mainCenter" @click="imageVisible=true"
    :style="'width: 80px;height: 80px;background:url('+imageUrl+');background-size: 100%;border-radius: 50%;'">
      </div>-->
      <div class="avatar mainCenter" @click="imageVisible = true">
        <img v-show="imageUrl !== null" :src="imageUrl" style="width: 100%; height: 100%; border-radius: 50%" />
      </div>
    </el-tooltip>

    <div class="username fontSize18 fontCenter">
      <div style="width: 100%" @mouseover="editNickName" @mouseout="readNickName">
        <span v-show="!editNickNameInput">{{
          $route.query.hasOwnProperty('userName') ? $route.query.userName : $store.state.user.userInfo.nickName
        }}</span>
        <i
          class="el-icon-edit el-input__icon"
          v-show="isshowEditIcon"
          slot="suffix"
          style="color: #2f74ff; margin-left: 5px; cursor: pointer"
          @click="editIconClick"
        ></i>
      </div>
      <div v-show="editNickNameInput">
        <el-input placeholder="请输入新昵称" v-model.trim="nickNameVal" clearable maxlength="40" show-word-limit>
        </el-input>
        <i
          slot="suffix"
          class="el-input__icon el-icon-success"
          style="color: #2f74ff; font-size: 18px; cursor: pointer"
          @click="saveNickName"
        ></i>
        <i
          slot="suffix"
          class="el-input__icon el-icon-refresh-left"
          style="color: #2f74ff; font-size: 18px; cursor: pointer"
          @click="cancelSave"
        ></i>
      </div>
    </div>

    <!-- <div
      class="notCertified fontCenter mainCenter"
      v-if="$store.state.user.userInfo.registerStatus !== '2' && !$route.query.hasOwnProperty('userName')"
      @click="toCertified()"
    >
      未认证
    </div> -->
    <!-- <div
      class="notCertified fontCenter mainCenter"
      v-if="$route.query.hasOwnProperty('userId') && !ifFollow"
      @click="followBtn()"
    >
      关注
    </div> -->
    <!-- <div
      class="notCertified fontCenter mainCenter"
      v-if="$route.query.hasOwnProperty('userId') && ifFollow"
      @click="followBtn()"
    >
      已关注
    </div> -->
    <!-- 编辑头像输入框 -->
    <el-dialog
      title="编辑头像"
      width="780px"
      top="15vh"
      :visible.sync="imageVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <CropperImage @uploadImgSuccess="uploadImgSuccess" :imageUrl="imageUrl"></CropperImage>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleClose">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
import { nickNameReg } from '../utils/validate';
export default {
  data() {
    return {
      ifFollow: false, //判断 该用户 是否被关注 默认false 未关注
      imageVisible: false,
      isPublic: true, //上传图片时的参数
      isTmp: true, //上传图片时的参数
      imageUrl: this.$store.state.user.userInfo.avatarUrl ,
      //昵称部分
      isshowEditIcon: false,
      editNickNameInput: false,
      nickNameVal: this.$store.state.user.userInfo.nickName
    };
  },
  created() {
    // 判断当前作者是否被关注
    // if (this.$route.query.hasOwnProperty('userId')) {
    //   this.checkiIfFollow();
    // }
  },
  watch: {
    // 监听 当前作者是否被关注
    // $route() {
    //   this.checkiIfFollow();
    // },
    '$store.state.user.userInfo.avatarUrl': {
      handler: function (newVal, oldVal) {
        this.imageUrl = newVal;
      },
      deep: true
    },
    '$store.state.user.userInfo.nickName': {
      handler: function (newVal, oldVal) {
        this.nickNameVal = newVal;
      },
      deep: true
    }
  },
  methods: {
    // 关注  praise 1关注0取消
    // followBtn() {
    //   let params = {
    //     userId: this.$route.query.userId,
    //     praise: this.ifFollow ? 0 : 1
    //   };
    //   this.$axios.post('/api/forum/userArticle/toFollow', params).then((res) => {
    //     this.ifFollow = !this.ifFollow;
    //     //  this.ifFollow
    //   });
    // },
    // 判断  第三方作者是否被关注过
    // checkiIfFollow() {
    //   let params = { userId: this.$route.query.userId };
    //   this.$axios.post('/api/forum/userArticle/ifFollow', params).then((res) => {
    //     this.ifFollow = res.body.false;
    //   });
    // },
    // 未认证 跳转认证页面
    // toCertified() {
    //   this.$axios.get('/api/auth/user/authapi/front/information/submit/init').then((res) => {
    //     // registerStatus用户状态  "0", "只注册还未提交认证"    "1", "已提交认证-待审核"    "2", "审核通过"    "3", "审核被拒"
    //     if (res.body.registerStatus === '1') {
    //       // 跳转 审核中 页面
    //       this.$router.push({
    //         path: '/login/inReview'
    //       });
    //     } else {
    //       this.$router.push({
    //         path: '/login/certified'
    //       });
    //     }
    //   });
    // },
    editNickName() {
      //昵称-鼠标滑过，显示可编辑按钮
      this.isshowEditIcon = true;
    },
    readNickName() {
      this.isshowEditIcon = false;
    },
    editIconClick() {
      //编辑按钮的点击事件
      this.editNickNameInput = true;
      this.isshowEditIcon = false;
    },
    cancelSave() {
      this.editNickNameInput = false;
    },
    async saveNickName() {
      //保存昵称
      if (!nickNameReg(this.nickNameVal)) {
        this.$notify({
          title: '提示',
          message: '昵称只允许输入汉字、字母、数字和下划线，并且不能以下划线开头或结尾',
          type: 'info'
        });
        return false;
      }
      const nickName = this.$route.query.hasOwnProperty('userName')
        ? this.$route.query.userName
        : this.$store.state.user.userInfo.nickName;
      if (this.nickNameVal !== '') {
        if (this.nickNameVal !== nickName) {
          let params = { nickName: this.nickNameVal };
          await this.$axios.post('/api/iam/v1/auth/user/editInfo', params).then((res) => {});
          // 获取用户信息
          await this.$axios.get('/api/iam/v1/auth/user/get').then((res) => {
            this.$store.commit('user/addUserInfo', res.body);
            this.nickName = this.$store.state.user.userInfo.nickName;
          });
          this.editNickNameInput = false;
        } else {
          this.$notify({
            title: '提示',
            message: '昵称没有改变，请重新输入',
            type: 'warning'
          });
        }
      }
    },
    // 关闭弹窗
    handleClose() {
      this.imageVisible = false;
    },
    //头像上传
    async uploadImgSuccess(formData) {
      let fileUid = '';
      let downloadUrl = '';
      await this.$axios
        .post(`/api/file/center/write/upload?isPublic=${this.isPublic}&isTmp=${this.isTmp}`, formData)
        .then((res) => {
          fileUid = res.body.fileUid;
          downloadUrl = res.body.downloadUrl;
        });
      await this.$axios
        .post(`/api/iam/v1/auth/user/info/change/avatar`, {
          fileUid: fileUid,
          fileUrl: downloadUrl
        })
        .then((res) => {
          this.handleClose();
        });
      // 获取用户信息
      await this.$axios.get('/api/iam/v1/auth/user/get').then((res) => {
        this.$store.commit('user/addUserInfo', res.body);
        this.imageUrl = this.$store.state.user.userInfo.avatarUrl;
      });
    }
  }
};
</script>

<style scoped>
.userBox {
  width: 200px;
  min-height: 170px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  border-radius: 4px;
}
.avatar {
  width: 80px;
  height: 80px;
  background: url('../static/img/controlBoard/avatar.png');
  background-size: 100%;
  border-radius: 50%;
  margin: 0 auto;
}
.username {
  padding: 20px 0px;
  /* height: 25px; */
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
::v-deep .el-input--suffix .el-input__inner {
  padding-right: 75px;
}
</style>
