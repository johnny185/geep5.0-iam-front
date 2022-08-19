<template>
  <div class="footWrap">
    <div class="mainWidth mainCenter">
      <div class="footTop fontSize14">
        <p class="marginLeft20">联系电话：(+86)10-86868686</p>
        <p>商务合作邮箱：services@gwm.com.cn</p>
        <p>冀ICP备05008632号-1</p>
        <p class="wxbg"></p> 
        <p class="wbbg"></p> 
      </div>
      <div class="footBottom fontSize18 fontWhite fontCenter">Copyright © 2021 长城汽车</div>
    </div>
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
.footTop{
  color: #666666;
  display: flex;
  padding-top: 50px;
  padding-top: 30px;
}
.footTop p{
  line-height: 70px;
}
.footTop p:nth-child(1){
  flex: 1;
}
.footTop p:nth-child(2){
  flex: 1;
}
.footTop p:nth-child(3){
  flex: 1;
}
.footTop p:nth-child(4){
  flex: 1;
}
.footTop p:nth-child(5){
  flex: 1;
}
.footWrap{
  width: 100%;
  height: 200px;
  background: #282828;
  position: absolute;
  bottom: 0px;
}
.wxbg{
  background: url('../static/img/footContent/wx.png') no-repeat;
  background-size: 10%;
  background-position-y: 20px;
}
.wbbg{
  background: url('../static/img/footContent/wb.png') no-repeat;
  background-size: 10%;
  background-position-y: 20px;
}
</style>
