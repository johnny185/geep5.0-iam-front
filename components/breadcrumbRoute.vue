<template>
  <div>
    <el-breadcrumb 
    class="breadcrumbStyle"
    separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item to="/">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item 
          v-for="(item,index) in breadcrumbData" 
          :key="index" 
          :to="item.path">
          {{item.name}}
          <!-- {{item.channelName || item.meta.title||item.name}} -->
          <!-- :to="breadcrumbData.length-1===index?'':item.path" -->
        </el-breadcrumb-item>
      </el-breadcrumb>
  </div>
</template>

<script>
export default {
   props: {
    // 面包屑 导航
    breadcrumbData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      //breadcrumbData:[]
    };
  },
  mounted(){
     //获取路由信息，不显示面包屑最后一级
    //  let arr = this.$store.state.breadcrumb.routeInfo
    //  let breadcrumbData =[]
    //  for(let i=0;i<arr.length-1;i++){
    //    breadcrumbData.push(arr[i])
    //  }
    //   this.breadcrumbData = breadcrumbData
  },
  watch: {
    //监听路由变化，给面包屑赋值
    // '$store.state.breadcrumb.routeInfo':{
    //   handler:function(newVal,oldVal){
    //     for(let i=0;i<newVal.length-1;i++){
    //       this.breadcrumbData.push(newVal[i])
    //     }
    //   },
    //   deep:true,
    // }
  },
  methods: {

  },
};
</script>

<style scoped>
.breadcrumbStyle {
  line-height: 30px;
  margin:15px 0 0 20px;
}
</style>
