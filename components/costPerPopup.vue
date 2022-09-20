<template>
  <div>
    <!-- 右下角弹窗广告 -->
    <div class="cppboxB" ref="cppboxB" v-show="dataItemBShow">
      <img
        :src="dataItemB.thumbnail"
        alt
        class="img"
        :class="dataItemB.popupPicture?'hoverStyle':''"
        @click="toMipLink(dataItemB)"
      />
      <div class="rightTop fontColor contentCenter">
        <p v-if="dataItemB.popupTime>0">{{dataItemB.popupTime}}s</p>
        <div class="marginLeft10">
          <p v-if="countB>0">
            <span v-if="dataItemB.popupTime>0">|</span>
            {{countB}}s后可关闭
          </p>
          <i class="el-icon-close hoverStyle" @click="handleClose" v-else></i>
        </div>
      </div>
    </div>
    <!-- 左 中 竖条 弹窗广告 -->
    <div class="cppboxL" ref="cppboxL" v-show="dataItemLShow">
      <img
        :src="dataItemL.thumbnail"
        alt
        class="img"
        :class="dataItemL.popupPicture?'hoverStyle':''"
        @click="toMipLink(dataItemL)"
      />
      <div class="rightTop fontColor contentCenter">
        <p v-if="dataItemL.popupTime>0">{{dataItemL.popupTime}}s</p>
        <div class="marginLeft10">
          <p v-if="countL>0">
            <span v-if="dataItemL.popupTime>0">|</span>
            {{countL}}s后可关闭
          </p>
          <i class="el-icon-close hoverStyle" @click="handleCloseLR(1)" v-else></i>
        </div>
      </div>
    </div>
    <!-- 右 中 竖条 弹窗广告 -->
    <div class="cppboxR" ref="cppboxR" v-show="dataItemRShow">
      <img
        :src="dataItemR.thumbnail"
        alt
        class="img"
        :class="dataItemR.popupPicture?'hoverStyle':''"
        @click="toMipLink(dataItemR)"
      />
      <div class="rightTop fontColor contentCenter">
        <p v-if="dataItemR.popupTime>0">{{dataItemR.popupTime}}s</p>
        <div class="marginLeft10">
          <p v-if="countR>0">
            <span v-if="dataItemR.popupTime>0">|</span>
            {{countR}}s后可关闭
          </p>
          <i class="el-icon-close hoverStyle" @click="handleCloseLR(2)" v-else></i>
        </div>
      </div>
    </div>
    <!--  居中  弹窗广告 -->
    <div class="cppboxC" ref="cppboxC" v-show="dataItemCShow">
      <img
        :src="dataItemC.thumbnail"
        alt
        class="img"
        :class="dataItemC.popupPicture?'hoverStyle':''"
        @click="toMipLink(dataItemC)"
      />
      <div class="rightTop fontColor contentCenter">
        <p v-if="dataItemC.popupTime>0">{{dataItemC.popupTime}}s</p>
        <div class="marginLeft10">
          <p v-if="countC>0">
            <span v-if="dataItemC.popupTime>0">|</span>
            {{countC}}s后可关闭
          </p>
          <i class="el-icon-close hoverStyle" @click="handleCloseLR(3)" v-else></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cPPData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      countB: 5, // 底部关闭按钮初始化 隐藏 倒计时5秒可显示 关闭按钮
      countL: 5, // 左关闭按钮初始化 隐藏 倒计时5秒可显示 关闭按钮
      countR: 5, // 右关闭按钮初始化 隐藏 倒计时5秒可显示 关闭按钮
      countC: 5, // 居中关闭按钮初始化 隐藏 倒计时5秒可显示 关闭按钮
      direction: 'btt',
      datalist: [],//传入的广告数据list
      dataItemB: {},//右下角单条广告数据
      dataItemBShow: false,
      dataItemL: {},//左中单条广告数据
      dataItemLShow: false,
      dataItemR: {},//右中单条广告数据
      dataItemRShow: false,
      dataItemC: {},//居中单条广告数据
      dataItemCShow: false,
    };
  },
  watch: {
    cPPData: {
      handler(data) {
        this.datalist = data
        if (this.datalist.length) {
          // 1, 右底部 2, '左居中' 3, '右居中' 
          const arr1 = this.datalist.filter(item => item.popupLocation === 1)
          const arr2 = this.datalist.filter(item => item.popupLocation === 2)
          const arr3 = this.datalist.filter(item => item.popupLocation === 3)
          const arr4 = this.datalist.filter(item => item.popupLocation === 4)
          this.dataItemB = arr1.length ? arr1[0] : {}
          this.dataItemL = arr2.length ? arr2[0] : {}
          this.dataItemR = arr3.length ? arr3[0] : {}
          this.dataItemC = arr4.length ? arr4[0] : {}
        }
      },
      // deep: true,
      immediate: true
    },
    //右底
    dataItemB(data) {
      // console.log('右底', data);
      if (data.id) {
        this.dataItemBShow = true
        this.fade(-300, 1)
      }
    },
    //左中
    dataItemL(data) {
      // console.log('左中', data);
      if (data.id) {
        this.dataItemLShow = true
        this.countDownLRFn(data, 1)
        this.showCloseCountDownLFn()
      }
    },
    //右中
    dataItemR(data) {
      // console.log('右中', data);
      if (data.id) {
        this.dataItemRShow = true
        this.countDownLRFn(data, 2)
        this.showCloseCountDownRFn()
      }
    },
    //居中
    dataItemC(data) {
      // console.log('中', data);
      if (data.id) {
        this.dataItemCShow = true
        this.countDownLRFn(data, 3)
        this.showCloseCountDownCFn()
      }
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log('广告');
    // });
  },
  methods: {
    handleClose() {
      this.fade(0, -1)
    },
    handleCloseLR(v) {
      if (v === 1) {
        this.dataItemLShow = false
      } else if (v === 2) {
        this.dataItemRShow = false
      } else if (v === 3) {
        this.dataItemCShow = false
      }
    },
    // 渐入渐出
    fade(h, speed) {
      let INTERVAL_TIME = 5;  //setInterval的间隔时间
      let bottom = h;
      speed = Number(speed);
      const box = this.$refs.cppboxB
      // console.log(box);
      if (!!box && !!this.dataItemB.thumbnail) {
        let timer = setInterval(() => {
          bottom += speed;
          box.style.bottom = bottom + "px";
          if (bottom > 1 || bottom < -300) {
            clearInterval(timer);
            this.countDownFn()
            this.showCloseCountDownFn()
          }
        }, INTERVAL_TIME);
      }
    },
    //底部倒计时
    countDownFn() {
      const box = this.$refs.cppboxB
      if (!!box && box.style.bottom === '2px' && this.dataItemB.popupTime > 0) {
        let countDown = setInterval(() => {
          this.dataItemB.popupTime += -1
          if (this.dataItemB.popupTime <= 0) {
            clearInterval(countDown);
            this.handleClose()
            this.dataItemBShow = false
          }
        }, 1000)
      }
    },
    // 左中 右中 居中倒计时
    countDownLRFn(data, v) {
      if (data.popupTime > 0) {
        let countDown = setInterval(() => {
          data.popupTime += -1
          if (data.popupTime <= 0) {
            clearInterval(countDown);
            this.handleCloseLR(v)
          }
        }, 1000)
      }
    },
    // 底部可关闭 倒计时
    showCloseCountDownFn() {
      let time = setInterval(() => {
        this.countB += -1
        if (this.countB <= 0) {
          clearInterval(time);
        }
      }, 1000)
    },
    // 左 可关闭 倒计时
    showCloseCountDownLFn() {
      let time = setInterval(() => {
        this.countL += -1
        if (this.countL <= 0) {
          clearInterval(time);
        }
      }, 1000)
    },
    // 右 可关闭 倒计时
    showCloseCountDownRFn() {
      let time = setInterval(() => {
        this.countR += -1
        if (this.countR <= 0) {
          clearInterval(time);
        }
      }, 1000)
    },
    // 居中 可关闭 倒计时
    showCloseCountDownCFn() {
      let time = setInterval(() => {
        this.countC += -1
        if (this.countC <= 0) {
          clearInterval(time);
        }
      }, 1000)
    },
    // 跳转链接
    toMipLink(data) {
      if (data.popupPicture) {
        window.open(data.popupPicture, '_blank')
      }
    }
  },
};
</script>

<style scoped>
.cppboxB {
  width: 280px;
  height: 280px;
  box-sizing: border-box;
  border: 1px solid #666;
  background: #fff;
  position: fixed;
  right: 0;
  bottom: -300px;
  z-index: 99999;
}
.cppboxL {
  width: 160px;
  height: 360px;
  box-sizing: border-box;
  border: 1px solid #666;
  background: #fff;
  position: fixed;
  left: 0;
  top: 160px;
  z-index: 99999;
}
.cppboxR {
  width: 160px;
  height: 360px;
  box-sizing: border-box;
  border: 1px solid #666;
  background: #fff;
  position: fixed;
  right: 0;
  top: 160px;
  z-index: 99999;
}
.cppboxC {
  width: 360px;
  height: 360px;
  box-sizing: border-box;
  border: 1px solid #666;
  background: #fff;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 99999;
}
.img {
  width: 100%;
  height: 100%;
}
.rightTop {
  position: absolute;
  top: 5px;
  right: 10px;
}
.fontColor {
  font-size: 14px;
  color: #fff;
}
</style>