<template>
  <div>
    <ul class="mainCenter mainWidth navTopStyle ">
      <li class="navTopItemLeft">
        <div class="navTopBg"></div>
        <div class="navTopItem borderLeft marginLeft20 hoverStyle">入门指南</div>
      </li>
      <li class="navTopItemRight">
        <div class="navTopItem hoverStyle">登录</div>
        <div class="navTopItem borderLeft hoverStyle">成为开发者</div>
        <div class="navTopItem borderLeft hoverStyle">帮助文档</div>
      </li>
    </ul>
    <!-- <nav></nav> -->
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
.navTopStyle{
  border: 1px solid;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* justify-content: center; */
}
.borderLeft{
  border-left: 1px solid;
}
.navTopItem{
  /* width: 80px; */
  padding:0px 20px 0px 20px;
  height: 16px;
  text-align: center;
  /* background: aqua; */
  line-height: 16px;
  cursor: pointer;
}
.navTopItemRight{
  display: flex;
}

.navTopItemLeft :hover  {
  /* cursor: pointer; */
  color: #87CEFA;
}
.navTopItemRight :hover  {
  /* cursor: pointer; */
  color: #87CEFA;
}
</style>
