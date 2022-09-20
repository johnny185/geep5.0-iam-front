<template>
  <div>
    <ul class="mainCenter mainWidth navBottomStyle">
      <li class="navBottomItem">产品服务</li>
      <li class="navBottomItem">开发者论坛</li>
      <li class="navBottomItem">生态伙伴</li>
      <li class="navBottomItem">关于我们</li>
    </ul>
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
.navBottomStyle{
  border: 1px solid;
  height: 50px;
  display: flex;
  align-items: center;
}
.navBottomItem{
  padding: 20px;
  cursor: pointer;
}
.navBottomStyle  :hover{
  color: yellow;
  border-bottom: 1px solid yellow;
}
</style>
