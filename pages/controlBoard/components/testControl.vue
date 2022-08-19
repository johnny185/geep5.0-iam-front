<template>
  <div>
    <div class="marginTop10">
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        min-label-width="80px"
        label-position="left"
        :rules="rules"
        hide-required-asterisk
      >
        <el-form-item label="选择流程" class="item" prop="flowId">
          <el-select v-model="form.flowId" size="small" placeholder="请选择流程" @change="handleSelect">
            <el-option
              v-for="item in dataList"
              :label="item.flowName"
              :value="item.flowId"
              :key="item.flowId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大执行次数" class="item" prop="perform_count">
          <el-select v-model="form.perform_count" size="small" placeholder="请选择最大执行次数" @change="handleSelect">
            <el-option v-for="item in countList" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button size="small" @click="handleStart" :disabled="!startFlag">开始</el-button>
      <el-button size="small" @click="handleEnd" :disabled="startFlag">结束</el-button>
      <el-button size="small" @click="handleDefault">恢复默认设置</el-button>
      <el-button size="small" @click="handleRefresh">刷新</el-button>
    </div>
    <!-- 设定值 -->
    <el-collapse v-model="activeName" accordion class="marginTop10" v-if="abilityList.length">
      <div v-for="(item, index) in abilityList" :key="index">
        <el-collapse-item v-for="(it, idx) in item.parameterOptions" :key="idx" :name="index">
          <template slot="title">
            <p>{{ item.abilityName }}--{{ it.parameterName }}</p>
            <span style="margin-left: 10px; color: #409eff">{{ it.parameterEcho }}</span>
          </template>
          <!-- 1、数值；4、区间   -->
          <div v-if="it.parameterType === 1 || it.parameterType === 4" style="padding: 0 20px">
            <div>
              {{ it.parameterName }}：
              <span>{{ it.parUnits }}</span>
            </div>
            <!-- 使用滑块 -->
            <el-slider
              v-model="it.parameterValue"
              show-input
              :show-input-controls="false"
              :min="Number(it.parMin)"
              :max="Number(it.parMax)"
              @change="handleSet(it.parameterCode, item, it.parameterType)"
            ></el-slider>
            <p>最小值：{{ it.parMin }}，最大值：{{ it.parMax }}</p>
          </div>
          <!-- 2、选项；3、开关   -->
          <div v-if="it.parameterType === 2" style="padding: 0 20px">
            <el-radio-group v-model="it.parameterValue" @change="handleSet(it.parameterCode, item, it.parameterType)">
              <el-radio :label="e.choiceCode" v-for="(e, i) in it.parameterMoreList" :key="i">{{
                e.choiceDesc
              }}</el-radio>
            </el-radio-group>
          </div>
          <!-- 开关 -->
          <div v-if="it.parameterType === 3" style="padding: 0 20px">
            <el-radio-group v-model="it.parameterValue" @change="handleSet(it.parameterCode, item, it.parameterType)">
              <el-radio :label="e" v-for="(e, i) in it.parSwitchList" :key="i">{{ e }}</el-radio>
            </el-radio-group>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
    <p v-else class="marginTop20">当前流程无参数</p>
    <!-- 执行结果 -->
    <div class="marginTop20">
      <span>执行结果</span>
      <el-button size="small" style="float: right" @click="handleEmpty">清空执行结果</el-button>
      <el-button size="small" style="float: right; margin-right: 10px" @click="handleDownload">下载执行结果</el-button>
    </div>
    <div class="output marginTop20">
      <p v-if="!resultList10.length">注：仅展示最后10条结果</p>
      <div v-else>
        <p v-for="item in resultList10" :key="item">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val: 0,
      dataList: JSON.parse(this.$route.query.data), // 流程集合
      parameterObj: {}, // 各种能力下 参数 集合
      countList: [50, 100, 200, 500],
      // 下拉的表单数据
      form: {
        flowId: '',
        perform_count: 50
      },
      // 校验
      rules: {
        flowId: [{ required: true, message: '请选择流程', trigger: 'change' }]
      },
      flowName: '', //选中执行的流程名称
      startFlag: true, //开始 结束按钮的 互斥标识
      marks: { 0: '0', 100: '300' }, // 刻度
      resultList: [], //执行结果
      resultList10: [], //执行结果展示部分 （目前需求最多10条）
      carStatus: [], //小车状态 返回数组
      activeName: null,
      // 需要 赋值 输入 的能力下的参数
      abilityList: []
    };
  },
  methods: {
    /** 操作各种流程后 给出综合赋值
     * @param parameterCode 当前取出来的值
     * @param item 当前取出来的值对应的所属对象
     * @param parameterType 当前选中数据 参数类型
     * */
    handleSet(parameterCode, item, parameterType) {
      if (parameterType === 2) {
        item.parameterOptions[0].parameterMoreList.forEach((it) => {
          if (item.parameterOptions[0].parameterValue === it.choiceCode) {
            item.parameterOptions[0].parameterEcho = it.choiceDesc;
          }
        });
      } else if (parameterType === 1 || parameterType === 4) {
        item.parameterOptions[0].parameterEcho =
          item.parameterOptions[0].parameterValue + item.parameterOptions[0].parUnits;
      } else {
        // parameterType 3 开关 选项
        item.parameterOptions[0].parSwitchList.forEach((it) => {
          if (item.parameterOptions[0].parameterValue === it) {
            item.parameterOptions[0].parameterEcho = it;
          }
        });
      }
      // else if (n === 3) {
      //   data.value = v === 1 ? '开' : '关';
      // } else if (n === 4) {
      //   data.value = v + data.parUnits;
      // }
      this.$forceUpdate();
      // console.log(this.parameterObj);
    },
    //开始
    handleStart() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 整理出 能力下参数 值 集合
          this.parameterObj = {};
          this.abilityList.forEach((item) => {
            item.parameterOptions.forEach((it) => {
              this.parameterObj[it.parameterCode] = it.parameterValue;
            });
          });

          const params = {
            perform_count: this.form.perform_count,
            params: this.parameterObj,
            flowId: this.form.flowId
          };
          this.dataList.forEach((item) => {
            if (this.form.flowId === item.flowId) this.flowName = item.flowName;
          });

          this.$axios.post('/api/controlpanel/panel/emulateStart', params).then((res) => {
            this.startFlag = false;
            const { body } = res;
            // 执行结果
            this.resultList = body.carStatusSummary.result;
            //展示结果 resultList10 处理
            if (this.resultList.length > 10) {
              this.resultList10 = this.resultList.slice(-10);
            } else if (this.resultList.length <= 10 && this.resultList.length) {
              this.resultList10 = this.resultList.slice(this.resultList.length * -1);
            } else {
              this.resultList10 = [];
            }
            //
            this.carStatus = body.carStatusSummary.status;
            this.$emit('getCarStatus', this.carStatus);
          });
        } else {
          return false;
        }
      });
    },
    //结束
    handleEnd() {
      this.$emit('handleEnd');
    },
    //恢复默认
    handleDefault() {
      this.activeName = null;
      this.abilityList.forEach((item) => {
        item.parameterOptions.forEach((it) => {
          // 当 parameterType 为 1(数值类型) 4(区间类型)
          if (it.parameterType === 1 || it.parameterType === 4) {
            // 设置 赋值 具体字段 默认值
            this.$set(it, 'parameterValue', 0);
          } else {
            // 设置 赋值 具体字段 默认字段
            this.$set(it, 'parameterValue', '');
          }
          // 配合显示 能力下参数 综合值 默认值
          this.$set(it, 'parameterEcho', '');
        });
      });

      this.$forceUpdate();
    },
    // 下拉选择事件
    handleSelect(v) {
      this.parameterOptions = [];
      console.log('下拉选中的flowId', v);
      this.getParameterList(v);
      this.handleEnd();
    },
    // 刷新
    handleRefresh() {
      location.reload();
      // this.$emit('handleRefresh')
    },
    // 清空执行结果
    handleEmpty() {
      this.resultList10 = [];
    },
    // 获取对应流程下的 可选条件
    getParameterList(v) {
      const params = {
        flowId: v
      };
      this.$axios.post('/api/controlpanel/panel/simulationParameter', params).then((res) => {
        const { body } = res;
        // 需要 赋值 输入 的能力下的参数
        this.abilityList = [];
        body.forEach((item) => {
          if (item.abilityData.length && item.abilityData[0].parameterOptions.length) {
            this.abilityList.push.apply(this.abilityList, item.abilityData);
          }
        });
        this.abilityList.forEach((item) => {
          item.parameterOptions.forEach((it) => {
            // 当 parameterType 为 1(数值类型) 4(区间类型)
            if (it.parameterType === 1 || it.parameterType === 4) {
              // 设置 赋值 具体字段 默认值
              this.$set(it, 'parameterValue', 0);
            } else {
              // 设置 赋值 具体字段
              this.$set(it, 'parameterValue', '');
            }
            // 配合显示 能力下参数 综合值
            this.$set(it, 'parameterEcho', '');
          });
        });
        console.log(this.abilityList, 'abilityList');
        // this.parameterOptions = arr.map((item) => {
        //   if (item.parameterOptions.length) {
        //     return item.parameterOptions[0];
        //   }
        // });
        // if (!this.parameterOptions[0]) {
        //   this.parameterOptions = [];
        // } else {
        //   this.parameterOptions
        //     .map((item) => {
        //       item.value = '';
        //       return item.parameterCode;
        //     })
        //     .forEach((it) => {
        //       this.parameterObj[it] = null;
        //     });
        // }
      });
    },
    // 下载执行结果
    handleDownload() {
      if (!this.resultList.length) {
        this.$notify({
          title: '提示',
          message: '请先开始执行一个流程',
          type: 'warning'
        });
        return false;
      }
      const data = JSON.stringify(this.resultList);
      // 将 数据流 转为blob
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
      // 创建新的URL并指向File对象或者Blob对象的地址
      const blobURL = window.URL.createObjectURL(blob);
      // 创建a标签，用于跳转至下载链接
      const tempLink = document.createElement('a');
      tempLink.href = blobURL;
      tempLink.download = `流程-${this.flowName}-执行数据.txt`;
      // 挂载a标签
      document.body.appendChild(tempLink);
      tempLink.click();
    }
  }
};
</script>

<style scoped>
.carCondition {
  display: flex;
  flex-wrap: wrap;
}
.conditionCard {
  flex: 1;
  /* height: 350px; */
  width: calc((100% - 50px) / 3);
  min-width: calc((100% - 50px) / 3);
  max-width: calc((100% - 50px) / 3);
  text-align: center;
  margin: 10px 5px;
  box-sizing: border-box;
  border-radius: 3px;
}
.output {
  width: 100%;
  min-height: 40px;
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 10px 20px;
  background: #eee;
  color: #666;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

::v-deep .item .el-form-item__label {
  color: #fff;
}

::v-deep .el-collapse {
  border: 1px !important;
  box-sizing: border-box;
}
::v-deep .el-collapse-item__header {
  padding: 0 0 0 20px;
  background: #ccc !important;
  box-sizing: border-box;
  border-radius: 3px 3px 0 0;
}
::v-deep .el-collapse-item__content {
  padding: 20px 0 10px;
  border-radius: 0 0 3px 3px;
}
</style>
