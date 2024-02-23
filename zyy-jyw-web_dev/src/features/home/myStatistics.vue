<template>
  <div>
    <div class="statistics-card">
      <div style="display: flex;align-items: center;">
        <div style="width: 100%;">
          <el-row :gutter="11">
            <el-col :span="4">
              <div class="avatar-box">
                <div class="avatar-image">
                  <img v-if="userInfo.avatar" :src="userInfo.avatar">
                  <img v-else :src="defaultHeader">
                </div>
                <div class="left-username">
                  <div class="nick_name">{{ userInfo.nickName }}</div>
                  <div class="dept_name">{{ userInfo.deptName }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="20">
              <el-row :gutter="11">
                <el-col v-for="(item,index) in currentConfigs" :key="index" :span="6">
                  <div v-if="item === 'server'" class="top_card_item">
                    <div class="top_card_item_body">
                      <div class="top_item_left">
                        <div class="top_item_left_icon item_left_icon1">
                          <i class="iconfont icon-icon-test-copy" />
                        </div>
                        <span>我的服务台</span>
                      </div>
                      <div class="top_item_right">
                        <div class="top_item_right_box">
                          <div>已接/未接</div>
                          <div>{{ myObstaclesServer.received }}/{{ myObstaclesServer.notReceived }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>已建/未建</div>
                          <div>{{ myObstaclesServer.built }}/{{ myObstaclesServer.unBuilt }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>已派/未派</div>
                          <div>{{ myObstaclesServer.dispatched }}/{{ myObstaclesServer.unassigned }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>找人/解决/无效</div>
                          <div>{{ myObstaclesServer.look }}/{{ myObstaclesServer.solve }}/{{ myObstaclesServer.invalid }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="item === 'fault'" class="top_card_item">
                    <div class="top_card_item_body">
                      <div class="top_item_left">
                        <div class="top_item_left_icon item_left_icon2">
                          <i class="iconfont icon-shequguanli_gongdanguanli" />
                        </div>
                        <span>我的工单</span>
                      </div>
                      <div class="top_item_right">
                        <div class="top_item_right_box">
                          <div>总数</div>
                          <div>{{ myObstaclesFault.total }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>已完成</div>
                          <div>{{ myObstaclesFault.done }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>进行中</div>
                          <div>{{ myObstaclesFault.progress }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>待接单</div>
                          <div>{{ myObstaclesFault.pending }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="item === 'task'" class="top_card_item">
                    <div class="top_card_item_body">
                      <div class="top_item_left">
                        <div class="top_item_left_icon item_left_icon3">
                          <i class="iconfont icon-gxunjians" />
                        </div>
                        <span>我的巡检</span>
                      </div>
                      <div class="top_item_right">
                        <div class="top_item_right_box">
                          <div>总数</div>
                          <div>{{ myInsTask.total }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>已完成</div>
                          <div>{{ myInsTask.done }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>待巡检</div>
                          <div>{{ myInsTask.inspection }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>已超时</div>
                          <div>{{ myInsTask.timeout }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="item === 'rectify'" class="top_card_item">
                    <div class="top_card_item_body">
                      <div class="top_item_left">
                        <div class="top_item_left_icon item_left_icon4">
                          <i class="iconfont icon-zhenggaiguanli_zhenggaiyilan" />
                        </div>
                        <span>我的整改</span>
                      </div>
                      <div class="top_item_right">
                        <div class="top_item_right_box">
                          <div>总数</div>
                          <div>{{ myInsRectify.total }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>已完成</div>
                          <div>{{ myInsRectify.done }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>待整改</div>
                          <div>{{ myInsRectify.rectify }}</div>
                        </div>
                        <div class="top_item_right_box">
                          <div>已超时</div>
                          <div>{{ myInsRectify.timeout }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div style="align-self: flex-start;padding-left: 5px;padding-top: 10px;">
          <i style="margin-top:5px;cursor: pointer;" class="iconfont icon-diandian" @click="onSetStatistics" />
        </div>
      </div>
    </div>
    <el-dialog title="统计数据" :width="'36%'" :visible.sync="statisticsDialogVisible" @closed="onStatisticsDialogClosed">
      <el-form ref="formRef" label-width="120px" :model="statisticsForm" :rules="rules">
        <el-form-item label="展示内容" prop="exhibit">
          <el-checkbox-group v-model="statisticsForm.exhibit">
            <el-checkbox label="server">我的服务台</el-checkbox>
            <el-checkbox label="fault">我的工单</el-checkbox>
            <el-checkbox label="task">我的巡检</el-checkbox>
            <el-checkbox label="rectify">我的整改</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="统计时间" prop="startMonth">
          <el-select v-model="statisticsForm.startMonth" class="w-10 base-margin-right" @change="onStartMonthChange">
            <el-option
              v-for="item in monthOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="statisticsForm.startDay" class="w-80">
            <el-option
              v-for="item in currentMonthDayOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          号
          至
          <el-select v-model="statisticsForm.endMonth" class="w-10 base-margin-right" @change="onEndMonthChange">
            <el-option
              v-for="item in monthOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="statisticsForm.endDay" class="w-80">
            <el-option
              v-for="item in currentMonthDayOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          号
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statisticsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setStatistics">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import moment from 'moment';
import {
  getMyObstaclesServer,
  getMyInsRectify,
  getMyInsTask,
  getMyObstaclesFault,
} from '@/features/home/api';
import LoginApi from '@/features/login/api';
import { getJSON, setJSON, } from '@/common/utils/localStorage';
export default {
  data() {
    return {
      userInfo: {
        nickName: '',
        avatar: '',
      },
      defaultHeader: require('@/assets/images/defaultUserProfile.jpg'),
      score: 4.2,
      statisticsDialogVisible: false,
      monthOption: [{
        value: 'previousMonth',
        label: '上月',
      }, {
        value: 'currentMonth',
        label: '本月',
      },
      ],
      currentMonthDays: 31, // 本月天数
      statisticsForm: {},
      currentConfigs: [],
      statisticsConfigs: ['server',
        'fault',
        'task',
        'rectify',
      ],
      myObstaclesServer: {
        notReceived: 0,
        received: 0,
        built: 0,
        unBuilt: 0,
        dispatched: 0,
        unassigned: 0,
        look: 0,
        solve: 0,
        invalid: 0,
      },
      myObstaclesFault: {
        total: 0,
        done: 0,
        progress: 0,
        pending: 0,
      }, // 我的工单
      myInsTask: {
        total: 0,
        done: 0,
        inspection: 0,
        timeout: 0,
      }, // 我的巡检
      myInsRectify: {
        total: 0,
        done: 0,
        rectify: 0,
        timeout: 0,
      }, // 我的整改
      statisticsConfigsKey: 'HOME_STATISTICS_CONFIGS',
    };
  },
  computed: {
    rules() {
      const checkTime = (rule, value, callback) => {
        const startTime = this.getDateTime(this.statisticsForm.startMonth, this.statisticsForm.startDay);
        const endTime = this.getDateTime(this.statisticsForm.endMonth, this.statisticsForm.endDay);
        if (startTime > endTime) {
          callback(new Error('开始时间不能大于结束时间'));
        } else {
          callback();
        }
      };
      return {
        exhibit: [
          { required: true, message: '请选择展示内容', },
        ],
        startMonth: [
          { required: true, message: '请选择统计时间', },
          { validator: checkTime, },
        ],
      };
    },
    currentMonthDayOption() {
      const option = [];
      for (let i = 1; i <= this.currentMonthDays; i++) {
        const value = i < 10 ? `0${i}` : i;
        option.push({
          value: value,
          label: i,
        });
      }
      return option;
    },
  },
  mounted: function () {
    this.getUserInfo();
    const configs = this.getConfigs();
    this.statisticsForm = configs;
    this.currentConfigs = configs.exhibit;
    this.getStatisticsData();
  },
  methods: {
    async getUserInfo() {
      const data = await LoginApi.getUserInfo();
      this.userInfo = data.user;
    },
    getStatisticsData() {
      const param = this.getTimeParam();
      this.getMyObstaclesServer(param);
      this.getMyObstaclesFault(param);
      this.getMyInsTask(param);
      this.getMyInsRectify(param);
    },
    getTimeParam() {
      const startTime = this.getDateTime(this.statisticsForm.startMonth, this.statisticsForm.startDay);
      const endTime = this.getDateTime(this.statisticsForm.endMonth, this.statisticsForm.endDay);
      const param = {
        beginDate: moment(startTime).format('YYYY-MM-DD'),
        endDate: moment(endTime).format('YYYY-MM-DD'),
      };
      return param;
    },
    /* 获取缓存配置 */
    getConfigs() {
      const data = getJSON(this.statisticsConfigsKey);
      if (data) {
        return data;
      } else {
        return {
          exhibit: this.statisticsConfigs,
          startMonth: 'currentMonth',
          startDay: '1',
          endMonth: 'currentMonth',
          endDay: '31',
        };
      }
    },
    getDateTime(month, startDay) {
      const startMonth = this.getMonth(month);
      const startDate = `${startMonth}-${startDay}`;
      return moment(new Date(startDate)).valueOf();
    },
    getMonth(monthLabel) {
      switch (monthLabel) {
        case 'currentMonth':
          return moment().startOf('month').format('YYYY-MM');
        case 'previousMonth':
          return moment().subtract('month', 1).format('YYYY-MM');
      }
    },
    onStartMonthChange(val) {
      if (val === 'currentMonth') {
        this.endMonth = 'currentMonth';
      }
    },
    onEndMonthChange(val) {
      if (val === 'previousMonth') {
        this.startMonth = 'previousMonth';
      }
    },
    /* 弹出设置页面 */
    onSetStatistics() {
      const configs = this.getConfigs();
      this.statisticsForm = configs;
      this.statisticsDialogVisible = true;
    },
    /* 设置统计配置 */
    setStatistics() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.currentConfigs = this.statisticsForm.exhibit;
          setJSON(this.statisticsConfigsKey, this.statisticsForm);
          this.$message.success('操作成功');
          this.getStatisticsData();
          this.statisticsDialogVisible = false;
        }
      });
    },
    /* 关闭设置 */
    onStatisticsDialogClosed() {
      this.$refs.formRef.resetFields();
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    /* 我的服务台 */
    getMyObstaclesServer(param) {
      getMyObstaclesServer(param).then((res) => {
        if (res) {
          res.forEach(data => {
            // 类型 1未接 2已接 3未建 4已建 5未派 6已派 7电话找人 8电话解决 9无效电话
            if (data.type === '1') {
              this.myObstaclesServer.notReceived = data.count;
            }
            if (data.type === '2') {
              this.myObstaclesServer.received = data.count;
            }
            if (data.type === '3') {
              this.myObstaclesServer.unBuilt = data.count;
            }
            if (data.type === '4') {
              this.myObstaclesServer.built = data.count;
            }
            if (data.type === '5') {
              this.myObstaclesServer.unassigned = data.count;
            }
            if (data.type === '6') {
              this.myObstaclesServer.dispatched = data.count;
            }
            if (data.type === '7') {
              this.myObstaclesServer.look = data.count;
            }
            if (data.type === '8') {
              this.myObstaclesServer.solve = data.count;
            }
            if (data.type === '9') {
              this.myObstaclesServer.invalid = data.count;
            }
          });
        }
      });
    },
    /* 我的工单 */
    getMyObstaclesFault(param) {
      getMyObstaclesFault(param).then((res) => {
        if (res) {
          res.forEach(data => {
            if (data.type === null) {
              this.myObstaclesFault.total = data.count;
            }
            // 待接单
            if (data.type === '1') {
              this.myObstaclesFault.pending = data.count;
            }
            // 进行中
            if (data.type === '2') {
              this.myObstaclesFault.progress = data.count;
            }
            // 已完成
            if (data.type === '3') {
              this.myObstaclesFault.done = data.count;
            }
          });
        }
      });
    },
    /* 我的巡检 */
    getMyInsTask(param) {
      getMyInsTask(param).then((res) => {
        if (res) {
          res.forEach(data => {
            if (data.type === null) {
              this.myInsTask.total = data.count;
            }
            // 待巡检
            if (data.type === '0') {
              this.myInsTask.inspection = data.count;
            }
            // 超时
            if (data.type === '1') {
              this.myInsTask.timeout = data.count;
            }
            // 已巡检
            if (data.type === '2') {
              this.myInsTask.done = data.count;
            }
          });
        }
      });
    },
    /* 我的整改  */
    getMyInsRectify(param) {
      getMyInsRectify(param).then((res) => {
        if (res) {
          res.forEach(data => {
            if (data.type === null) {
              this.myInsRectify.total = data.count;
            }
            // 待整改
            if (data.type === '0') {
              this.myInsRectify.rectify = data.count;
            }
            // 超时
            if (data.type === '1') {
              this.myInsRectify.timeout = data.count;
            }
            // 已整改
            if (data.type === '2') {
              this.myInsRectify.done = data.count;
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
.statistics-card{
  padding: 20px 10px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
}
.avatar-box{
  display: flex;
  padding: 20px 0px 20px 10px;
}
/**/
.avatar-image{
  width: 60px;
  height: 60px;
  line-height: 64px;
  font-size: 18px;
  border-radius: 50%;
  overflow: hidden;
}
.avatar-image>img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.left-username{
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.nick_name{
  margin: 6px;
  font-size: 18px;
  font-weight: bold;
  @include font_color_imp('color-primary');
}
.dept_name{
  margin: 6px;
  font-size: 16px;
  padding: 4px 0;
  overflow: hidden;
}
/* 顶部卡片*/
.top_card_item {
  height: 112px;
  overflow: hidden;
  border: 1px solid #e6ebf5;
  border-radius: 5px;
}

.top_card_item_body {
  padding: 12px 12px;
  display: flex;
}

.top_item_left {
  width: 100px;
  text-align: center;
  padding-top: 4px;

  span {
    @include font_color_imp('color-primary');
    font-size: 14px;
    font-weight: bold;
  }
}

.top_item_left_icon {
  width: 56px;
  height: 56px;
  text-align: center;
  margin: 0 auto 5px auto;
  border-radius: 2px;

  i {
    font-size: 32px;
    line-height: 56px;
  }
}
.top_item_right{
  width: 100%;
  padding: 4px 16px;
}
.top_item_right_box {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  padding-bottom: 6px
}
.item_left_icon1 {
  background-color: #F8F8FF;

  i {
    color: #FA8072;
  }
}

.item_left_icon2 {
  background-color: #F8F8FF;

  i {
    color: #006666;
  }
}

.item_left_icon3 {
  background-color: #F8F8FF;

  i {
    color: #1E90FF;
  }
}

.item_left_icon4 {
  background-color: #F8F8FF;

  i {
    color: #FFD700;
  }
}
.w-10 {
  width: 100px;
}
.w-80 {
  width: 80px;
}
.base-margin-right {
  margin-right: 16px;
}
</style>
