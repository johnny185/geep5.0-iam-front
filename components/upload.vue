<template>
  <div>
    <el-upload
      :action="`/api/file/center/write/upload?isPublic=${isPublic}&isTmp=${isTmp}`"
      :show-file-list="false"
      :on-success="handleSuccess"
      :headers="config"
      :on-error="handleError"
      :before-upload="beforeUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <!-- {{ bgImg }} -->
      <!-- <div
        :style="{ backgroundImage: 'url(' + bgImg + ')',  }"
        alt=""
      ></div> -->
      <div class="IDImgBox" v-else>
        <div class="IDImg" :style="{ backgroundImage: 'url(' + bgImg + ')', backgroundSize: '100%' }"></div>
      </div>
      <!-- <img v-else :src="bgImg" alt="" class="avatar" /> -->
      <!-- <img src="./positiveImg.png" alt="" /> -->
      <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    // 上传类型
    uploadType: {
      type: String,
      default: ''
    },
    // 背景图
    bgImg: {
      type: String,
      default: ''
    },
    // 图片回显
    imgUrl: {
      type: String,
      default: ''
    },
    // 限制 文件大小
    fileSize: {
      type: Number,
      default: 0
    },
    // 限制 文件类型
    fileType: {
      type: String,
      default: ''
    },
    // 可选参数，默认是false.  身份证 false
    // false代表非公开文件，生成的url链接有时效性
    // true代表公开文件，生成的url链接永久有效，即可以匿名访问
    isPublic: {
      type: Boolean,
      default: true
    },
    // 可选参数，默认是false. 身份证 true
    // true代表临时文件，临时文件7天之后文件系统会自动删除
    isTmp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: '' // 图片回显
      // bgImg: '' //背景图
    };
  },
  computed: {
    config() {
      return { Authorization: this.$store.state.user.userInfo.token };
    }
  },
  watch: {
    imgUrl: {
      handler(data) {
        this.imageUrl = data;
      },
      immediate: true
    }
  },
  methods: {
    beforeUpload(file) {
      const fileSize = this.fileSize * 1024 * 1024; // 转换为 字节
      if (file.size > fileSize) {
        this.$notify({
          title: '提示',
          message: `文件大小不能超过${this.fileSize}MB`,
          type: 'error'
        });
        return false;
      }
      const fileType = file.name.split('.');
      if (!this.fileType.includes(fileType[fileType.length - 1].toLowerCase())) {
        this.$notify({
          title: '提示',
          message: `请上传${this.fileType}的文件`,
          type: 'error'
        });
        return false;
      }
    },
    handleSuccess(res) {
      if (res.status === 200) {
        this.imageUrl = res.body.downloadUrl;
        this.$emit('handleSuccess', res, this.uploadType);
      } else {
        this.$notify({
          title: '提示',
          type: 'error',
          message: res.message,
          duration: 5 * 1000
        });
        return Promise.reject(res);
      }
    },
    handleError(err, file, fileList) {
      this.$notify({
        title: '提示',
        type: 'error',
        message: err.message,
        duration: 5 * 1000
      });
      return Promise.reject(err);
      // console.log(err);
      // console.log(file);
      // console.log(fileList);
    }
  }
};
</script>

<style scoped>
.IDImgBox {
  width: 166px;
  height: 132px;
  background: #fafdff;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  position: relative;
}
.IDImg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 138px;
  height: 104px;
  border: 1px dotted #999990;
}
/* .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
} */
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  /* color: #8c939d; */
  color: red;
  width: 166px;
  height: 134px;
  /* line-height: 178px; */
  /* text-align: center; */
}
.avatar {
  width: 168px;
  height: 134px;
  display: block;
}
</style>
