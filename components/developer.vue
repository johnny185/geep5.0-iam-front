<template>
  <div class="developer">
    <p class="fontSize40 fontBlue marginBottom20">成为开发者</p>
    <ul class="developerContent">
      <li class="developerItem" v-for="(item, index) in developerData" :key="index">
        <div
          class="itemIcon marginBottom20"
          :style="{
            backgroundImage: 'url(' + item.bg + ')',
            backgroundSize: '100%'
          }"
        ></div>
        <div class="arrow" v-show="item.arrowShow"></div>
        <div class="itemTheme marginBottom10 fontSize24 bold fontCenter">
          {{ item.title }}
        </div>
        <div class="itemiText1 fontCenter">{{ item.text1 }}</div>
        <div class="itemiText2 fontCenter">{{ item.text2 }}</div>
      </li>
      <div class="joinDeveloper mainCenter fontCenter"><p>加入开发者</p></div>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      developerData: [
        {
          arrowShow: true,
          bg: '/img/developer/register.png',
          title: '注册',
          text1: '注册/登录',
          text2: 'SQA平台账号'
        },
        {
          arrowShow: true,
          bg: '/img/developer/authentication.png',
          title: '认证开发者',
          text1: '认证开发者',
          text2: '获取更多权益'
        },
        {
          arrowShow: true,
          bg: '/img/developer/obtain.png',
          title: '获取实例',
          text1: '创建产品',
          text2: '获取实例'
        },
        {
          arrowShow: false,
          bg: '/img/developer/development.png',
          title: '开始开发',
          text1: '集成服务',
          text2: 'API,SKD等'
        }
      ]
    };
  },
  methods: {}
};
</script>

<style scoped>
.developer {
  flex: 2;
}
.developerContent {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 40px;
}
.developerItem {
  width: 134px;
  height: 278px;
  position: relative;
}
.itemIcon {
  width: 100%;
  height: 134px;
  background: url('/img/developer/authentication.png');
  background-size: 100%;
}
.joinDeveloper {
  width: 210px;
  height: 60px;
  line-height: 60px;
  color: #2f74ff;
  border: 1px solid #2f74ff;
  cursor: pointer;
  border-radius: 4px;
}
.joinDeveloper :hover {
  background: #2f74ff;
  color: #fff;
}
.arrow {
  width: 20px;
  height: 16px;
  background: url('/img/developer/arrow.png') no-repeat;
  background-size: 100%;
  position: absolute;
  right: -45px;
  top: 62px;
}
</style>
