<template>
  <div>
    <!-- 控制台首页 -->
    <controlNav></controlNav>

    <!-- 流程主体 -->
    <div class="createFlowWrap">
      <div class="createContent">
        <div class="createContentLeft">
          <el-button type="text" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
          <p style="line-height: 30px; margin-left: 10px">应用名称：{{ sceneName }}</p>
          <p style="line-height: 30px; margin-left: 10px">版本号：{{ versionCode }}</p>
          <div class="createFlow fontCenter" :class="yOrNflag ? 'noDrop' : 'pointer'" @click="createFlow">
            +新建流程
          </div>
          <div class="createFlow fontCenter" :class="yOrNflag ? 'noDrop' : 'pointer'" @click="simulation">
            +仿真测验
          </div>
          <!-- <div class="createFlow fontCenter" @click="saveFlow">+保存流程</div> -->
          <el-table
            ref="singleTable"
            v-loading="loading"
            :data="tableData"
            max-height="370"
            highlight-current-row
            @row-click="rowDetails"
            style="width: 100%; margin-bottom: 10px"
            border
            @cell-mouse-enter="handleMouseEnter"
            @cell-mouse-leave="handleMouseLeave"
          >
            <el-table-column label="流程名称" prop="flowName" show-overflow-tooltip>
              <template slot-scope="scope">
                <p class="flowName">{{ scope.row.flowName }}</p>
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.flag">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="delFlow(scope.row)"
                    circle
                  ></el-button>
                  <el-button type="text" size="small" @click="editFlow(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="total > 10"
            :current-page.sync="pageData.pageNum"
            :page-size="pageData.pageSize"
            layout="prev, pager, next"
            :total="total"
            :pager-count="5"
            @current-change="currentPage"
          />
        </div>
        <!-- {{ $store.state.user.userInfo.id }} 用户id -->
        <div class="createContentRight">
          <!-- 流程 画布 -->
          <lfContent
            ref="lfContent"
            :currentRowData="currentRowData"
            :myAbilityList="myAbilityList"
            @saveFlow="saveFlow"
          ></lfContent>
        </div>
        <!-- 新建 修改流程名称 弹框 -->
        <!-- <createFlowDialog
          ref="createFlowDialog"
          :editRowInfo="editRowInfo"
          @subitForm="subitForm"
          :addOrEditStatus="addOrEditStatus"
        ></createFlowDialog> -->
      </div>
    </div>
  </div>
</template>

<script>
// import createFlowDialog from './components/createFlowDialog';
// import lfContent from './components/lfContent';
export default {
  components: {
    // createFlowDialog,
    lfContent
  },
  data() {
    return {
      // sceneStatus 0场景停用 1使用 ， pauseStatus 0版本停用 1使用 ， 从 发布版本 列表 developStatus 为 Y (已发布) ，从 开发版本 列表 developStatus 为 T (测试中)，从 测试版本 列表 developStatus 为 I (待发布)
      yOrNflag:
        this.$route.query.sceneStatus === '0' ||
        this.$route.query.pauseStatus === '0' ||
        this.$route.query.synthesisStatus === '0',
      // 版本号
      versionCode: this.$route.query.versionCode,
      // 应用名称
      sceneName: this.$route.query.sceneName,
      //流程列表总list
      tableData: [],
      // 流程列表分页
      pageData: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false, // 表数据加载 loading
      total: 0, //总数据条数
      consoleVersionId: this.$route.query.consoleVersionId,
      intelSceneId: this.$route.query.intelSceneId,
      // 编辑当前行数据
      editRowInfo: {},
      //当前行 流程名称 数据
      currentRowData: {},
      // 区别 新建add 编辑edit
      addOrEditStatus: 'add',
      //当前项目的 能力
      myAbilityList: []
      // userID: $store.state.user.userInfo.id
    };
  },
  mounted() {
    this.queryList();
    this.getMyAbility();
  },
  distroyed() {
    console.log('销毁');
    this.websocketclose();
  },
  methods: {
    // 创建 websocket
    initWebSocket(flowId) {
      const wsuri = `ws://10.255.132.40:7011/api/controlpanel/teamWorkWs?flowId=${flowId}&userId=${this.$store.state.user.userInfo.id}`;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let params = { flowId: this.currentRowData.flowId, userId: this.$store.state.user.userInfo.id };
      this.websocketsend(JSON.stringify(params));
    },
    //连接建立失败重连
    websocketonerror() {
      this.initWebSocket(this.currentRowData.flowId);
    },
    // 接收消息
    websocketonmessage(event) {
      // console.log(JSON.parse(event.data));
      // console.log(JSON.parse(event.data).response);
      // let editUser = JSON.parse(event.data).response.editUser;
      // if (editUser) {
      //   console.log('有用户', editUser);
      // } else {
      //   console.log('谁都能操作');
      // }
      //数据接收
      // const redata = JSON.parse(e.data);
    },
    websocketsend(data) {
      //数据发送
      console.log('发送', data);
      this.websock.send(data);
    },
    websocketclose(error) {
      //关闭
      console.log('断开连接', error);
    },
    //返回键
    goBack() {
      this.$router.back();
    },
    // 分页器选择页码 触发方法
    currentPage(val) {
      this.pageData.pageNum = val;
      this.queryList();
    },
    //获取当前项目的 能力
    getMyAbility() {
      const params = {
        intelSceneId: this.intelSceneId
      };
      this.$axios.post('/api/controlpanel/panel/getSceneLayoutAbilityOptions', params).then((res) => {
        const { body } = res;
        this.myAbilityList = body;
        // console.log(this.myAbilityList);
      });
    },
    // 流程表格 鼠标移入 移出事件
    handleMouseEnter(row, column, cell, event) {
      row.flag = !this.yOrNflag;
    },
    handleMouseLeave(row, column, cell, event) {
      row.flag = false;
    },
    // 仿真测验
    simulation() {
      if (this.yOrNflag) return false;
      // console.log(this.tableData);
      if (!this.tableData.length) {
        this.$notify({
          title: '提示',
          message: '请先创建流程',
          type: 'warning'
        });
        return false;
      }
      const dataList = this.tableData.map((item) => {
        return {
          flowName: item.flowName,
          flowId: item.flowId
        };
      });
      this.$router.push({
        path: '/controlBoard/simulation',
        query: {
          data: JSON.stringify(dataList)
        }
      });
    },
    // 点击当前流程名称列表行
    rowDetails(row) {
      this.currentRowData = row;
      this.$refs.singleTable.setCurrentRow(row);
      console.log('133', row.consoleVersionId);
      this.initWebSocket(this.currentRowData.flowId);
      // 校验 画布节点数据 是否跟最新一致
      // if (row) {
      //   let params = {
      //     flowId: row.flowId,
      //     flowContent: row.flowContent
      //   };
      //   this.checkFlowDiagram(params).then((res) => {
      //     this.handlingResult(res);
      //   });
      // }
    },
    //校验 校验 画布节点数据 是否跟最新一致
    checkFlowDiagram(params) {
      return this.$axios.post('/api/controlpanel/panel/checkFlowDiagram', params);
    },
    // 处理校验结果R
    handlingResult(res) {
      const { body } = res;
      const msg = body.message;
      let str = '';
      Object.keys(msg).forEach((i) => {
        if (msg[i] === '验证不通过！') {
          str = str + i + '<br/>';
        }
      });
      if (str) {
        // console.log('有不通过');
        const newStr = str.slice(0, str.length - 1);
        this.$alert(`<span style='color:#F56C6C'>${newStr}</span><span>为变动数据，请及时修改</span>`, '提示', {
          // this.$alert(`<span style='color:#F56C6C'>您所选择的能力参数已改变，请重新选择</span>`, '提示', {
          dangerouslyUseHTMLString: true
        });
        return false;
      } else {
        // console.log('通过');
        return true;
      }
    },
    // 保存流程
    async saveFlow(data, flowData) {
      // 判断是否有流程列表
      if (this.tableData.length === 0 && data['nodes'].length === 0) {
        this.$notify({
          title: '提示',
          message: '请先创建流程',
          type: 'warning'
        });
        return false;
      }
      // 当 没有创建流程 又先在画布上画图 需要创建流程并保存
      if (this.tableData.length === 0) {
        this.$notify({
          title: '提示',
          message: '请创建一条流程',
          type: 'warning'
        });
        return false;
      }

      let params = {
        flowId: flowData.flowId,
        flowContent: JSON.stringify(data)
      };
      // 校验数据
      // const resObj = await this.checkFlowDiagram(params);
      // if (resObj.status === 200) {
      //   const flag = this.handlingResult(resObj);
      //   // 保存数据
      //   if (flag) this.saveSceneFlowContent(params, flowData);
      // }
      this.saveSceneFlowContent(params, flowData);
    },
    // 保存数据 接口
    saveSceneFlowContent(params, flowData) {
      this.$axios.post('/api/controlpanel/panel/saveSceneFlowContent', params).then((res) => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: `流程${flowData.flowName}保存成功`,
            type: 'success'
          });
          this.queryList(true);
          // this.rowDetails(this.currentRowData)
        }
      });
    },
    // 删除流程
    delFlow(row) {
      this.$confirm('此操作将永久删除该流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            flowId: row.flowId
          };
          this.$axios.post('/api/controlpanel/panel/deleteSceneFlowCompose', params).then((res) => {
            if (res.status === 200) {
              this.$notify({
                title: '成功',
                message: '删除操作成功',
                type: 'success'
              });
              this.queryList();
            }
          });
        })
        .catch(() => {});
    },
    // 提交 创建流程
    subitForm(data) {
      let params = Object.assign(
        {
          consoleVersionId: this.consoleVersionId
        },
        data
      );
      this.$axios.post('/api/controlpanel/panel/createSceneFlowCompose', params).then((res) => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: `${this.addOrEditStatus === 'add' ? '创建' : '编辑'}流程操作成功`,
            type: 'success'
          });
          // this.$refs.createFlowDialog.handleClose(); //this.pageData.pageNum = 1
          if (this.addOrEditStatus === 'add') {
            this.pageData.pageNum = 1;
            this.currentPage(this.pageData.pageNum);
          } else {
            this.currentPage(this.pageData.pageNum);
          }
        }
      });
    },
    /**查询流程列表v
     * @param v 表示手动点击保存数据后查询的数据
     *
     * */
    queryList(v) {
      this.loading = true;
      let params = {
        consoleVersionId: this.consoleVersionId,
        ...this.pageData
      };
      this.$axios
        .post('/api/controlpanel/panel/getSceneFlowComposeList', params)
        .then((res) => {
          if (res.status === 200) {
            this.total = res.body.total;
            res.body.list.forEach((item) => {
              item.flag = false;
            });
            this.tableData = res.body.list;
            // 刚进创建流程 页面， 流程列表有数据 默认取第一个
            this.$nextTick((_) => {
              if (this.tableData.length && !v) {
                this.rowDetails(this.tableData[0]);
              } else if (this.tableData.length && v) {
                this.tableData.forEach((item) => {
                  if (item.flowId === this.currentRowData.flowId) this.rowDetails(item);
                });
              }
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 编辑 流程
    editFlow(row) {
      this.addOrEditStatus = 'edit';
      this.editRowInfo = JSON.parse(JSON.stringify(row));
      // this.$refs.createFlowDialog.dialogVisible = true;
    },
    // 新建 流程
    createFlow() {
      if (this.yOrNflag) return false;
      this.addOrEditStatus = 'add';
      this.editRowInfo = {};
      // this.$refs.createFlowDialog.reset();
      // this.$refs.createFlowDialog.dialogVisible = true;
    }
  }
};
</script>

<style scoped>
.createFlowWrap {
  width: calc(100vw - 100px);
  padding: 40px;
  height: calc(100vh - 248px);
}
.createContentLeft {
  float: left;
  width: 302px;
}
.createContentRight {
  float: left;
  margin-left: 20px;
  width: calc(100vw - 440px);
}
.createFlow {
  width: 120px;
  height: 40px;
  background: #fafdff;
  border-radius: 4px;
  border: 1px solid #2f74ff;
  line-height: 40px;
  color: #2f74ff;
  margin-bottom: 20px;
}
.pointer {
  cursor: pointer;
}
.noDrop {
  cursor: no-drop;
}
.flowName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  line-height: 34px;
}
::v-deep .el-table--border .el-table__cell,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 0;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 8px; /*滚动条宽度*/
  height: 8px !important; /*滚动条高度*/
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0px; /*滚动条的背景区域的圆角*/
  background-color: rgb(250, 248, 248); /*滚动条的背景颜色*/
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-corner {
  background-color: rgb(255, 255, 255);
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 4px; /*滚动条的圆角*/
  background-color: rgba(214, 216, 218, 0.5); /*滚动条的背景颜色*/
}
</style>
