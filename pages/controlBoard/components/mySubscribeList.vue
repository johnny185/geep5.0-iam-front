<template>
  <div>
    <!--  我的订阅 数据列表 -->
    <el-table :data="dataList" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="55" align="center" fixed />
      <el-table-column prop="abilityName" label="能力名称" show-overflow-tooltip align="center" />
      <el-table-column prop="abilityDescription" label="能力介绍" show-overflow-tooltip header-align="center" />
      <el-table-column label="品牌&车型" header-align="center" min-width="180">
        <template slot-scope="scope">
          <el-tabs v-model="scope.row.carBrand">
            <el-tab-pane
              :name="item.id"
              v-for="(item, i) in scope.row.brandModelVO.brands"
              :key="i"
              :label="item.brand"
            >
              <el-tooltip class="carTypeItem" effect="dark" :content="item.carType" placement="bottom">
                <p class="carType">
                  车型：
                  <span v-for="(it, i) in item.models" :key="i" style="margin-right: 10px; color: #aaa">
                    {{
                    it.model
                    }}
                  </span>
                </p>
              </el-tooltip>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column prop="abilityTypeName" label="能力类型" align="center" />
      <el-table-column label="更新说明" header-align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="carTypeItem"
            effect="dark"
            :content="scope.row.abilityIssueLogVO.issueDate"
            placement="bottom"
          >
            <p class="carType">
              更新时间：
              <span class="gxItems">{{scope.row.abilityIssueLogVO.issueDate}}</span>
            </p>
          </el-tooltip>
          <el-tooltip
            class="carTypeItem"
            effect="dark"
            :content="scope.row.abilityIssueLogVO.abilityVersion"
            placement="bottom"
          >
            <p class="carType" v-if="scope.row.abilityIssueLogVO.logType === 1">
              发布版本：
              <span class="gxItems">{{scope.row.abilityIssueLogVO.abilityVersion}}</span>
            </p>
          </el-tooltip>

          <el-tooltip
            class="carTypeItem"
            effect="dark"
            :content="scope.row.abilityIssueLogVO.issueDesc"
            placement="bottom"
          >
            <p class="carType" v-if="scope.row.abilityIssueLogVO.logType === 1">
              版本说明：
              <span class="gxItems">{{scope.row.abilityIssueLogVO.issueDesc}}</span>
            </p>
          </el-tooltip>
          <p v-if="scope.row.abilityIssueLogVO.logType === 3">打开该能力</p>
          <p v-if="scope.row.abilityIssueLogVO.logType === 2">关闭该能力</p>
          <!-- scope.row.abilityIssueLogVO.logType  1发布 2 隐藏 3 显示 -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleCancel(scope.row)">取消订阅</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :pageData="pageData" @currentPage="currentPage" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0 // 总数据条数 默认 0
      },
      dataList: [] // 数据列表list
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    // 获取数据list
    queryList(curPage) {
      const params = {
        pageSize: this.pageData.pageSize,
        pageNum: typeof curPage === 'number' ? curPage : 1
      }
      this.$axios.post('/api/controlpanel/manage/queryMySubscribe', params).then(res => {
        const { body } = res
        body.list.forEach((item) => {
          item.carBrand = '0';
          item.brandModelVO.brands.forEach((ele, i) => {
            ele.carType = ele.models.map((it) => it.model).join(',');
            ele.id = i + '';
          });
        });
        this.dataList = body.list;
        // console.log(this.dataList);
        this.pageData.total = body.total;
      });
    },
    // 分页器选择页码 触发方法
    currentPage(val) {
      // console.log('页码', val)
      this.pageData.pageNum = val;
      this.queryList(val);
    },
    // 分页器 pageSize 改变时触发方法
    sizeChange(val) {
      // console.log('pagesize', val)
      this.pageData.pageSize = val;
      this.queryList(this.pageData.pageNum);
    },
    //取消订阅
    handleCancel(data) {
      const params = {
        abilityId: data.abilityId
      };
      this.$confirm('此操作将取消该订阅, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/controlpanel/manage/unsubscribe', params).then(res => {
          this.$notify({
            type: 'success',
            message: '取消操作成功!'
          });
          this.queryList(this.pageData.pageNum);
        });
      })
    }
  },

};
</script>

<style scoped>
.carType {
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.carTypeItem {
  margin: 4px;
}
.gxItems {
  color: 999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
