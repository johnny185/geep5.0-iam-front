<template>
  <div :class="{ wrap: isWrap }">
    <div v-if="flag === 1">
      <div class="title">
        <p>
          {{ buttonFlag ? '消息列表' : '未读消息列表' }}（共{{ pageData.total }}封{{
            unreadNum && buttonFlag ? `，其中${unreadNum}未读消息` : ''
          }}
          <el-button type="text" @click="queryUnread" v-if="unreadNum && buttonFlag">仅查看未读消息</el-button>）
          <el-button type="text" @click="queryAll" v-if="!buttonFlag">查看全部消息</el-button>
        </p>
        <!-- <el-button type="primary" size="small" icon="el-icon-s-tools" @click="setMessage">消息设置</el-button> -->
      </div>
      <div>
        <el-button type="primary" size="small" @click="deleteFn">删除</el-button>
        <el-button type="primary" size="small" @click="readFn">标识为已读</el-button>
        <el-button type="primary" size="small" @click="readAllFn">全部标识为已读</el-button>
        <el-radio-group v-model="category" size="small" class="marginLeft20" @change="classifyChange">
          <el-radio-button label>全部</el-radio-button>
          <el-radio-button v-for="item in msgTypeDictionary" :key="item.value" :label="item.value">{{
            item.label
          }}</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 数据表 -->
      <el-table
        ref="multipleTable"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="消息内容" show-overflow-tooltip>
          <template slot-scope="scope">
            <div @click="toSee(scope.row)" class="title1">
              <div>
                <i class="el-icon-message" v-if="!scope.row.readState"></i>
                <!-- <i class="el-icon-postcard" v-else></i> -->
                <svg-icon icon-class="read" v-else />
              </div>
              <div class="marginLeft10">
                <p class="fontSize16">{{ scope.row.title }}</p>
                <p class="fontSize14 font999999">{{ scope.row.content }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="160" align="center"></el-table-column>
        <!-- <el-table-column label="消息类型" width="150">
          <template slot-scope="scope">
            <p>{{ msgType(scope.row.category) }}</p>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <pagination :pageData="pageData" @currentPage="currentPage" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- <myMessageDetails :rowData="rowData" v-if="flag === 2" @toBack="toBack" /> -->
    <!-- <myMessageSet v-if="flag === 3" @toBack="toBack" /> -->
  </div>
</template>

<script>
// import myMessageSet from '../pages/controlBoard/components/myMessageSet.vue';
// import myMessageDetails from '../pages/controlBoard/components/myMessageDetails.vue';
export default {
  components: {
    // myMessageSet,
    // myMessageDetails
  },
  data() {
    return {
      isWrap: true,
      flag: 1, //1 消息列表 2 消息详情 3 消息设置
      buttonFlag: true, // 仅查看未读消息  查看全部消息
      dataList: [], //表格数据
      //分页器数据
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      readState: '', //阅读状态  0:未读 1:已读
      category: '', // 消息分类 1000:系统消息 1100:个人信息 1200:开发者论坛 1300:控制台 1400:咨询反馈
      rowData: null, //消息详情
      unreadNum: 0, //未读消息数
      multipleSelection: [], // 选中list的集合
      msgTypeDictionary: [
        { value: 1000, label: '系统消息' },
        // { value: 1100, label: '个人信息' },
        // { value: 1200, label: '开发者论坛' },
        // { value: 1300, label: '控制台' },
        // { value: 1400, label: '咨询反馈' }
      ],
    };
  },
  computed: {
    msgType() {
      return (val) => {
        // 对计算属性进行传参
        let label = '';
        this.msgTypeDictionary.filter((item) => {
          if (val === item.value) {
            label = item['label'];
          }
        });
        return label;
      };
    }
    
  },
  created() {
    this.queryList();
  },
  methods: {
    // 消息详情
    toSee(data) {
      this.flag = 2;
      this.rowData = data;
    },
    classifyChange() {
      this.readState = this.buttonFlag ? '' : 0;
      this.queryList();
    },
    // 消息设置
    // setMessage() {
    //   this.flag = 3;
    // },
    //查看未读
    queryUnread() {
      this.readState = 0; // 未读
      this.category = ''; // 类型全部
      this.buttonFlag = false;
      this.queryList();
    },
    // 查看全部
    queryAll() {
      this.buttonFlag = true;
      this.readState = '';
      this.category = ''; // 类型全部
      this.queryList();
    },
    // 获取数据
    queryList(curPage) {
      const params = {
        pageSize: this.pageData.pageSize,
        pageNum: typeof curPage === 'number' ? curPage : 1,
        category: this.category,
        readState: this.readState
      };
      // 消息列表数据
      this.$axios.post('/api/message/messageNotification/sitePage', params).then((res) => {
        if (res.status === 200) {
          // console.log(res);
          this.dataList = res.body.list;
          this.pageData.total = res.body.total;
        }
      });
      // 未读消息数
      this.$axios.get('/api/message/messageNotification/siteUnreadCount').then((res) => {
        if (res.status === 200) {
          // console.log(res);
          this.unreadNum = res.body;
        }
      });
    },
    // 分页器事件
    sizeChange(val) {
      this.pageData.pageSize = val;
      this.queryList();
    },
    currentPage(val) {
      this.pageData.pageNum = val;
      this.queryList(val);
    },
    // 选中事件
    handleSelectionChange(val) {
      // this.multipleSelection = val
      // ids 集合
      this.multipleSelection = val.map((item) => item.id);
    },
    // 删除
    deleteFn() {
      if (!this.multipleSelection.length) {
        this.$notify({
          type: 'warning',
          message: '请选择后再操作！'
        });
        return false;
      }
      const params = this.multipleSelection;
      this.$confirm('此操作将删除该选中消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/message/messageNotification/deleteSite', params).then((res) => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: '删除操作成功'
          });
          this.queryList(this.pageData.pageNum);
        });
      });
    },
    //标记选中 已读
    readFn() {
      if (!this.multipleSelection.length) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请选择后再操作！'
        });
        return false;
      }
      const params = this.multipleSelection;
      this.$confirm('此操作将选中消息标记已读, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/message/messageNotification/read', params).then((res) => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: '标记已读操作成功'
          });
          this.queryList(this.pageData.pageNum);
        });
      });
    },
    // 全部已读
    readAllFn() {
      this.$confirm('此操作将全部消息标记已读, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/message/messageNotification/readAll').then((res) => {
          this.$notify({
            title: '提示',
            type: 'success',
            message: '全部消息标记已读操作成功'
          });
          this.queryList(this.pageData.pageNum);
        });
      });
    },
    // 消息设置 详情中 返回键
    toBack() {
      this.flag = 1;
      this.queryList();
    }
  }
};
</script>

<style scoped>
.wrap {
  width: 1020px;
  min-height: 589px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 2px rgba(152, 173, 216, 0.3);
  margin-left: 20px;
  padding: 20px;
  box-sizing: border-box;
}
.collectionContent :hover {
  background: #eff4f8;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title1 {
  display: flex;
  align-items: top;
}
</style>
