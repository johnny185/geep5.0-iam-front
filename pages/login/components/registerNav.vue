<template>
  <div class="registerWrap">
    <ul class="registerTop mainCenter">
      <li
        class="registerItemStatus"
        v-for="(item, index) in registerData"
        :key="index"
      >
        <div
          class="registerItemStatusBg"
          :style="{
            backgroundImage: 'url(' + item.bg + ')',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
          }"
        ></div>
        <div
          class="arrow"
          :style="{
            backgroundImage: 'url(' + item.lineBg + ')',
            backgroundSize: '100%',
          }"
          v-show="item.arrowShow"
        ></div>
        <P class="fontCenter registerItemTitle">{{ item.title }}</P>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // 注册头部信息
    registerData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.registerWrap {
  width: 100%;
  background: #fff;
  height: auto;
  padding: 20px 0px;
}
.registerTop {
  width: 568px;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.registerItemStatus {
  position: relative;
}
.registerItemStatusBg {
  width: 80px;
  height: 90px;
  margin-bottom: 10px;
}
.registerItemTitle {
  color: #666660;
}
.arrow {
  width: 134px;
  height: 8px;
  position: absolute;
  right: -150px;
  top: 36px;
}
</style>
