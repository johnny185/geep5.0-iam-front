<template>
  <div>
    <el-badge :value="unreadNum" :max="99" :hidden="!unreadNum" class="item">
      <p>消息</p>
    </el-badge>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '', // 消息
      unreadNum: 0, // 未读消息数
      token: this.$store.state.user.userInfo.token, //token
      websock: null, // //建立的ws连接
      wsUrl: 'ws://10.255.132.40:7001/api/message/websocket', // ws等同于http，wss等同于https
      lockReconnect: false, //是否真正建立连接
      timeout: 10 * 1000, //10秒一次心跳
      timeoutObj: null, //心跳倒计时
      timeoutnum: null //断开 重连倒计时
    };
  },
  created() {
    // 页面创建生命周期函数

    //初始化  websocket 实例
    if ('WebSocket' in window) {
      this.initWebSocket();
    }
  },
  mounted() {
    //  获取 未读消息数
    // this.getUnreadNum();
  },
  destroyed() {
    // 离开页面生命周期函数
    this.onclose();
  },
  methods: {
    // 未读消息数
    getUnreadNum() {
      if (this.$route.name !== 'login' && this.$route.path.indexOf('personalCentre') === -1) {
        this.$axios.get('/api/message/messageNotification/siteUnreadCount').then((res) => {
          if (res.status === 200) {
            // console.log('未读消息数', res);
            this.unreadNum = res.body;
          }
        });
      }
    },
    // websocket初始化
    initWebSocket() {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      // this.websock = new WebSocket(this.wsUrl, [this.token]);
      this.websock = new WebSocket(`${this.wsUrl}?token=${this.token}`);
      this.websock.onopen = this.onopen;
      this.websock.onerror = this.onerror;
      this.websock.onmessage = this.onmessage;
      this.websock.onclose = this.onclose;
    },
    //WebSocket连接成功
    onopen() {
      // 开启心跳
      this.start();
    },
    // WebSocket连接发生错误
    onerror(e) {
      //重连
      this.reconnect();
    },
    // WebSocket连接 返回
    onmessage(e) {
      if (e.data !== 'pong') {
        const da = JSON.parse(e.data);
        this.message = da;
        // 获取 未读消息数
        this.getUnreadNum();
      }
      // 收到服务器信息，心跳重置
      this.reset();
    },
    // WebSocket断开连接
    onclose(e) {
      //重连
      clearTimeout(this.timeoutObj);
      clearTimeout(this.timeoutnum);
    },
    //重新连接
    reconnect() {
      let that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      // console.log('重新连接');
      //没连接上会一直重连，设置延迟 避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(() => {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    },
    reset() {
      //重置心跳
      let that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      //重启心跳
      that.start();
    },
    //开启心跳
    start() {
      // console.log('开启心跳');
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.timeoutObj = setTimeout(() => {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState == 1) {
          //如果连接正常
          self.websock.send('ping');
        } else {
          //否则重连
          self.reconnect();
        }
      }, self.timeout);
    }
  }
};
</script>
<style>
.item {
  margin-right: 40px;
}
.el-badge__content.is-fixed {
  top: 30px !important;
}
</style>
