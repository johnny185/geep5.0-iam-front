<template>
  <div>
    <div class="boxFlex">
      <el-button type="text" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
      <p class="fontSize18 bold">消息设置</p>
    </div>

    <el-collapse v-model="activeNames" class="marginTop20">
      <el-collapse-item name="1">
        <template slot="title">
          <p class="fontSize16">系统消息</p>
        </template>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">系统消息</p>
            <p class="fontColor">我会收到系统消息的提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v0"
            active-color="#13ce66"
            @change="handleChange(data.v0,1001)"
          ></el-switch>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <p class="fontSize16">个人信息</p>
        </template>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">认证审核通知</p>
            <p class="fontColor">当个人认证信息被管理员审核后，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v1"
            active-color="#13ce66"
            @change="handleChange(data.v1,1101)"
          ></el-switch>
        </div>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">帐户变更通知</p>
            <p class="fontColor">当帐户变更被管理员审核后，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v2"
            active-color="#13ce66"
            @change="handleChange(data.v2,1102)"
          ></el-switch>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <p class="fontSize16">开发者论坛</p>
        </template>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">帖子审核通知</p>
            <p class="fontColor">当帖子被管理员审核后，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v3"
            active-color="#13ce66"
            @change="handleChange(data.v3,1201)"
          ></el-switch>
        </div>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">禁言提醒</p>
            <p class="fontColor">当被管理员禁言/解除禁言后，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v4"
            active-color="#13ce66"
            @change="handleChange(data.v4,1202)"
          ></el-switch>
        </div>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">评论互动提醒</p>
            <p class="fontColor">有人对我的内容进行评论/跟我互动时，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v5"
            active-color="#13ce66"
            @change="handleChange(data.v5,1203)"
          ></el-switch>
        </div>
        <!-- <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">新增粉丝消息提醒设置</p>
            <p class="fontColor">有人关注我后会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v6"
            active-color="#13ce66"
            @change="handleChange(data.v6)"
          ></el-switch>
        </div>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">赞和收藏消息提醒设置</p>
            <p class="fontColor">有人对我表达的内容表示赞同或收藏时，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v7"
            active-color="#13ce66"
            @change="handleChange(data.v7)"
          ></el-switch>
        </div>-->
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <p class="fontSize16">控制台</p>
        </template>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">能力审核通知</p>
            <p class="fontColor">当提交能力申请被管理员审核后，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v6"
            active-color="#13ce66"
            @change="handleChange(data.v6,1301)"
          ></el-switch>
        </div>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">测试审核通知</p>
            <p class="fontColor">当提交测试申请被管理员审核后，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v7"
            active-color="#13ce66"
            @change="handleChange(data.v7,1302)"
          ></el-switch>
        </div>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">发布审核通知</p>
            <p class="fontColor">当提交发布申请被管理员审核后，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v8"
            active-color="#13ce66"
            @change="handleChange(data.v8,1303)"
          ></el-switch>
        </div>
      </el-collapse-item>
      <el-collapse-item title="咨询反馈" name="5">
        <template slot="title">
          <p class="fontSize16">咨询反馈</p>
        </template>
        <div class="boxFlex boxStyle">
          <div>
            <p class="fontSize16">回复通知</p>
            <p class="fontColor">咨询反馈被回复时，我会收到消息提醒</p>
          </div>
          <el-switch
            style="display: block"
            v-model="data.v9"
            active-color="#13ce66"
            @change="handleChange(data.v9,1401)"
          ></el-switch>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      data: {
        v0: true,
        v1: true,
        v2: true,
        v3: true,
        v4: true,
        v5: true,
        v6: true,
        v7: true,
        v8: true,
        v9: true,
      },
      notifySubCategorys: '', // getMessageUserSetting()返回值  所有通知的 子分类  多个 逗号隔开 字符串
    };
  },
  created() {
    this.getMessageUserSetting()
  },
  mounted() {

  },
  methods: {
    //返回
    goBack() {
      this.$emit('toBack');
    },
    // 设置详情
    // 消息 业务小类 subCategory: [
    //   { value: 1001, label: '系统消息' },
    //   { value: 1101, label: '认证审核通知' },
    //   { value: 1102, label: '帐户变更通知' },
    //   { value: 1201, label: '帖子审核通知' },
    //   { value: 1202, label: '禁言提醒' },
    //   { value: 1203, label: '评论互动提醒' },
    //   { value: 1301, label: '能力审核' },
    //   { value: 1302, label: '测试审核' },
    //   { value: 1303, label: '发布审核' },
    //   { value: 1401, label: '咨询反馈' }
    // ],
    getMessageUserSetting() {
      this.$axios.get('/api/message/messageUserSetting/get').then((res) => {
        if (res.status === 200) {
          const { body } = res
          this.notifySubCategorys = body ? body.notifySubCategorys : ''
          this.data.v0 = this.notifySubCategorys.indexOf('1001') !== -1
          this.data.v1 = this.notifySubCategorys.indexOf('1101') !== -1
          this.data.v2 = this.notifySubCategorys.indexOf('1102') !== -1
          this.data.v3 = this.notifySubCategorys.indexOf('1201') !== -1
          this.data.v4 = this.notifySubCategorys.indexOf('1202') !== -1
          this.data.v5 = this.notifySubCategorys.indexOf('1203') !== -1
          this.data.v6 = this.notifySubCategorys.indexOf('1301') !== -1
          this.data.v7 = this.notifySubCategorys.indexOf('1302') !== -1
          this.data.v8 = this.notifySubCategorys.indexOf('1303') !== -1
          this.data.v9 = this.notifySubCategorys.indexOf('1401') !== -1
        }
      });
    },
    // 插入
    insertStr(str, insertStr) {
      const ary = str.split(',');		// 转化为数组
      ary.push(insertStr);	// 使用数组方法插入字符串
      return ary.join(',');				// 拼接成字符串后输出
    },
    // 截取
    deleteStr(str, insertStr) {
      const ary = str.split(',');		// 转化为数组
      const arr = ary.filter(item => item !== insertStr)	// 使用数组方法 删除 字符串
      return arr.join(',');				// 拼接成字符串后输出
    },
    // 开关
    handleChange(val, n) {
      const params = {
        notifySubCategorys: ""
      }
      if (val) {
        //选中
        if (this.notifySubCategorys.length) {
          params.notifySubCategorys = this.insertStr(this.notifySubCategorys, n)
        } else {
          params.notifySubCategorys = n.toString()
        }
      } else {
        // 取消
        params.notifySubCategorys = this.deleteStr(this.notifySubCategorys, n.toString())

      }
      // console.log(params);
      // 调用接口
      this.$axios.post('/api/message/messageUserSetting/save', params).then((res) => {
        if (res.status === 200) {
          // const { body } = res
          this.$notify({
            type: 'success',
            message: '操作成功'
          });
          this.getMessageUserSetting()
        }
      });
    },

  }
};
</script>

<style scoped>
.boxFlex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.boxStyle {
  box-sizing: border-box;
  padding: 20px;
  border-bottom: 1px solid #f0f0f2;
}
.fontColor {
  font-size: 14px;
  color: #999;
}
</style>
