<template>
  <div class="setWrap">
    <div class="setHeard">
      <div class="fontSize24 bold">基本设置</div>
      <el-button
        size="small"
        type="text"
        icon="el-icon-edit-outline"
        class="setEdit"
        @click="setEdit"
        :disabled="sceneStatus === '0'"
        >编辑</el-button
      >
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="宿主">
        <span>{{ form.sceneHost | filterSceneHost }}</span>
      </el-form-item>
      <el-form-item label="场景名称">
        <span>{{ form.sceneName }}</span>
      </el-form-item>
      <el-form-item label="场景图标" class="sceneLogo">
        <el-image :src="form.sceneLogo" :preview-src-list="[form.sceneLogo]"></el-image>
      </el-form-item>
      <el-form-item label="场景介绍">
        <span>{{ form.sceneDescription }}</span>
      </el-form-item>
      <el-form-item label="车型信息">
        <!-- {{ form.brandModelVO }} -->
        <div v-if="form.hasOwnProperty('brandModelVO')">
          <div v-for="(item, index) in form.brandModelVO.brands" :key="index" style="display: flex">
            <!-- 停用 -->
            <div v-for="(it, idx) in item.models" :key="idx">
              <el-tag type="danger" v-if="item.brandStatus === 2 || it.modelStatus === 2">{{
                item.brand + '/' + it.model
              }}</el-tag>
              <!-- 启用 -->
              <el-tag v-if="item.brandStatus === 1 && it.modelStatus === 1" :key="idx">{{
                item.brand + '/' + it.model
              }}</el-tag>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="服务类型">
        <el-tag v-for="(item, index) in form.serviceCategoryList" :key="index">{{ item.typeValue }}</el-tag>
      </el-form-item>
      <el-form-item label="客服电话">
        <span>{{ form.phoneNumber }}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <span>{{ form.email }}</span>
      </el-form-item>
    </el-form>
    <setUpManageDialog ref="setUpManageDialog" :formData="formData" @refreshInfo="refreshInfo"></setUpManageDialog>
  </div>
</template>

<script>
import setUpManageDialog from './setUpManageDialog';
export default {
  data() {
    return {
      // 判断当前场景是 暂停0 还是 使用1 状态
      sceneStatus: this.$route.query.sceneStatus,
      form: {},
      formData: {
        brandModelVO: { brands: [] }
      }, //编辑时回显再编辑的数据
      checkedCar: false, //车型全选
      carArr: [], // 全选 选中前存储下已选车型
      carInfoList: [], //车型信息 最终回传回去格式
      carBrandOption: [], //车型信息 下拉框
      serviceCategoryList: [], //服务类型 最终回传回去格式
      serviceCategoryOption: [] //服务类型 下拉框
    };
  },
  components: { setUpManageDialog },
  filters: {
    filterSceneHost(data) {
      switch (data) {
        case 'C':
          return '车机';
          break;
        default:
          return '手机';
      }
    }
  },
  created() {
    // 查询 基本信息
    this.$nextTick(() => {
      this.queryInfo();
    });
  },
  methods: {
    // 验证车型
    checkBrandModel() {
      let params = { brands: this.form.brandModelVO.brands };
      this.$axios.post('/api/controlpanel/panel/checkBrandModel', params).then((res) => {});
    },
    setEdit() {
      this.formData = JSON.parse(JSON.stringify(this.form));
      this.$refs.setUpManageDialog.dialogVisible = true;
    },
    // 查询 基本信息
    queryInfo() {
      let params = { intelSceneId: this.$route.query.intelSceneId };
      this.$axios.post('api/controlpanel/panel/getIntelSceneById', params).then((res) => {
        this.form = res.body;
        // 验证车型
        this.checkBrandModel();
      });
    },
    //编辑后 刷新基本信息数据
    refreshInfo() {
      this.queryInfo();
      this.$refs.setUpManageDialog.handleClose();
    }
  }
};
</script>

<style scoped>
.setWrap {
  width: 100%;
  height: auto;
  background: #fff;
  /* padding: 40px -1px 40px 90px; */
}
.setHeard {
  display: flex;
}
.setEdit {
  /* float: left; */
  margin-left: 20px;
}
.sceneLogo {
  width: 400px;
}
.el-tag {
  margin-right: 20px;
}
</style>
