<template>
  <div>
    <div class="title">
      <el-button type="text" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
    </div>
    <p>{{categoryName}} -->{{subCategoryName}}</p>
    <p>{{rowData.channelSendTime}}</p>
    <hr />
    <p>{{rowData.content}}</p>
  </div>
</template>

<script>
export default {
  props: {
    // 当前消息详情
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  data() {
    return {
      // 消息 业务大类 
      msgTypeDictionary: [
        { value: 1000, label: '系统消息' },
        { value: 1100, label: '个人信息' },
        { value: 1200, label: '开发者论坛' },
        { value: 1300, label: '控制台' },
        { value: 1400, label: '咨询反馈' }
      ],
      // 消息 业务小类 
      subCategory: [
        { value: 1001, label: '系统消息' },
        { value: 1101, label: '认证审核通知' },
        { value: 1102, label: '账户变更通知' },
        { value: 1201, label: '帖子审核通知' },
        { value: 1202, label: '禁言提醒' },
        { value: 1203, label: '评论互动提醒' },
        { value: 1301, label: '能力审核' },
        { value: 1302, label: '测试审核' },
        { value: 1303, label: '发布审核' },
        { value: 1401, label: '咨询反馈' }
      ],
    };
  },
  computed: {
    subCategoryName() {
      const arr = this.subCategory.filter(item => item.value === this.rowData.subCategory)
      return arr[0]?.label
    },
    categoryName() {
      const arr = this.msgTypeDictionary.filter(item => item.value === this.rowData.category)
      return arr[0]?.label
    }
  },
  mounted() {
    this.read()
  },
  methods: {
    //返回
    goBack() {
      this.$emit('toBack');
    },
    // 已读
    read() {
      const timer = setInterval(() => {
        clearInterval(timer);
        const params = []
        params.push(this.rowData.id)
        this.$axios.post('/api/message/messageNotification/read', params).then((res) => {
          if (res.status === 200) {
            console.log(res);
            // this.dataList = res.body.list;
          }
        });
      }, 1000)
    }
  }
};
</script>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
