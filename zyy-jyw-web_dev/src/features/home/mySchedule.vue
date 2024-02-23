<template>
  <!--  我的待办事项-->
  <div>
    <div class="home_card home_card_center">
      <div class="home_card_header">
        <span>我的代办事项</span>
        <i style="float: right;cursor: pointer;padding: 3px 0" class="iconfont icon-diandian" @click="onSetSchedule" />
      </div>
      <div class="home_card_body">
        <el-row :gutter="11">
          <el-col v-for="(item,index) in currentConfigs" :key="index" :span="12">
            <div v-if="item === 'repair'" class="home_card_item">
              <div class="home_card_item_body" @click="onPending(4)">
                <div class="item_left item_left_icon1">
                  <i class="iconfont icon-baoxiu-baoxiuren " />
                </div>
                <div class="item_center">
                  <div class="item_center_title">待处理报修</div>
                  <div class="item_center_num"><span>{{ mySchedule.repair }}</span>个</div>
                </div>
                <div class="item_right">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
            <div v-if="item === 'order'" class="home_card_item">
              <div class="home_card_item_body" @click="onPending(5)">
                <div class="item_left item_left_icon2">
                  <i class="iconfont icon-gongdanshu" />
                </div>
                <div class="item_center">
                  <div class="item_center_title">待处理工单</div>
                  <div class="item_center_num"><span>{{ mySchedule.order }}</span>个</div>
                </div>
                <div class="item_right">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
            <div v-if="item === 'task'" class="home_card_item">
              <div class="home_card_item_body">
                <div class="item_left item_left_icon3">
                  <i class="iconfont icon-xunjian1" />
                </div>
                <div class="item_center">
                  <div class="item_center_title">待巡检任务</div>
                  <div class="item_center_num"><span>{{ mySchedule.task }}</span>个</div>
                </div>
                <div class="item_right">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
            <div v-if="item === 'rectify'" class="home_card_item">
              <div class="home_card_item_body">
                <div class="item_left item_left_icon4">
                  <i class="iconfont icon-ziyuan135" />
                </div>
                <div class="item_center">
                  <div class="item_center_title">待异常整改</div>
                  <div class="item_center_num"><span>{{ mySchedule.rectify }}</span>个</div>
                </div>
                <div class="item_right">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
            <div v-if="item === 'duty'" class="home_card_item">
              <div class="home_card_item_body">
                <div class="item_left item_left_icon5">
                  <i class="iconfont icon-zhibanguanli" />
                </div>
                <div class="item_center">
                  <div class="item_center_title">待值班任务</div>
                  <div class="item_center_num"><span>{{ mySchedule.duty }}</span>个</div>
                </div>
                <div class="item_right">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
            <div v-if="item === 'job'" class="home_card_item">
              <div class="home_card_item_body">
                <div class="item_left item_left_icon6">
                  <i class="iconfont icon-renwu" />
                </div>
                <div class="item_center">
                  <div class="item_center_title">待处理任务</div>
                  <div class="item_center_num"><span>{{ mySchedule.job }}</span>个</div>
                </div>
                <div class="item_right">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
            <div v-if="item === 'meeting'" class="home_card_item">
              <div class="home_card_item_body">
                <div class="item_left item_left_icon7">
                  <i class="iconfont icon-huiyishenqing" />
                </div>
                <div class="item_center">
                  <div class="item_center_title">待处理会议</div>
                  <div class="item_center_num"><span>{{ mySchedule.meeting }}</span>个</div>
                </div>
                <div class="item_right">
                  <i class="el-icon-arrow-right" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="我的待办事项" :width="'30%'" :visible.sync="scheduleDialogVisible" @closed="onScheduleDialogClosed">
      <el-form ref="formRef" label-width="120px" :model="scheduleForm" :rules="rules">
        <el-form-item label="展示内容" prop="exhibit">
          <div class="form-item-__box">
            <div class="form-item-__tip">
              <i class="el-icon-warning-outline" />
              <span>最多可选择6个展示内容</span>
            </div>
          </div>
          <el-checkbox-group v-model="scheduleForm.exhibit">
            <el-checkbox label="repair">待处理报修</el-checkbox>
            <el-checkbox label="order">待处理工单</el-checkbox>
            <el-checkbox label="task">待巡检任务</el-checkbox>
            <el-checkbox label="rectify">待异常整改</el-checkbox>
            <el-checkbox label="duty">待值班任务</el-checkbox>
            <el-checkbox label="job">待处理任务</el-checkbox>
            <el-checkbox label="meeting">待处理会议</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="scheduleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setSchedule">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getMyInspectionTodo, getMyObstaclesTodo, } from '@/features/home/api';
import { getJSON, setJSON, } from '@/common/utils/localStorage';

export default {
  name: 'MySchedule',
  data() {
    return {
      scheduleDialogVisible: false,
      scheduleForm: {
        exhibit: [],
      },
      currentConfigs: [],
      scheduleConfigs: ['order',
        'repair',
        'rectify',
        'task',
        'duty',
        'job',
      ],
      mySchedule: {
        order: 0,
        repair: 0,
        rectify: 0,
        task: 0,
        duty: 0,
        job: 0,
        meeting: 0,
      },
      scheduleConfigsKey: 'HOME_SCHEDULE_CONFIGS',
    };
  },
  computed: {
    rules() {
      const checkLength = (rule, value, callback) => {
        const confirmPassword = this.scheduleForm.exhibit.length;
        if (confirmPassword > 6) {
          callback(new Error('最多可选择6个展示内容'));
        } else {
          callback();
        }
      };
      return {
        exhibit: [
          { required: true, message: '请选择展示内容', },
          { validator: checkLength, },
        ],
      };
    },
  },
  mounted: function () {
    const configs = this.getConfigs();
    this.currentConfigs = configs;
    this.getMyObstaclesTodo();
    this.getMyInspectionTodo();
  },
  methods: {
    /* 获取缓存配置 */
    getConfigs() {
      const data = getJSON(this.scheduleConfigsKey);
      if (data) {
        return data;
      } else {
        return this.scheduleConfigs;
      }
    },
    /* 点击待办 */
    onPending(type) {
      this.$router.push({ path: '/pending', query: { type: type, }, });
    },
    onSetSchedule() {
      const configs = this.getConfigs();
      this.scheduleForm.exhibit = configs;
      this.scheduleDialogVisible = true;
    },
    setSchedule() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.currentConfigs = this.scheduleForm.exhibit;
          setJSON(this.scheduleConfigsKey, this.currentConfigs);
          this.$message.success('操作成功');
          this.scheduleDialogVisible = false;
        }
      });
    },
    onScheduleDialogClosed() {
      this.scheduleForm = {
        exhibit: [],
      };
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    getMyObstaclesTodo() {
      getMyObstaclesTodo().then((res) => {
        if (res) {
          this.mySchedule.order = res.order;
          this.mySchedule.repair = res.repair;
        }
      });
    },
    getMyInspectionTodo() {
      getMyInspectionTodo().then((res) => {
        if (res) {
          this.mySchedule.task = res.task;
          this.mySchedule.rectify = res.rectify;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
.form-item-__tip {
  font-size: 14px;
  padding: 6px;
  line-height: 22px;
  @include font_color_imp('color-special');
  @include background_color_imp('color-assist-3');
}
/* 卡片样式*/
.home_card {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  overflow: hidden;
  color: #2D405E;
  transition: 0.3s;
}
.home_card_center {
  height: 320px;
}
.home_card_body {
  padding: 12px;
}

.home_card_header {
  padding: 12px 12px;
  box-sizing: border-box;

  span {
    @include font_color_imp('color-primary');
    font-size: 15px;
    font-weight: bold;
  }
}
.el-row {
  margin-bottom: 11px;

  &:last-child {
    margin-bottom: 0;
  }
}
/*事项卡片*/
.home_card_item {
  height: 72px;
  overflow: hidden;
  border: 1px solid #e6ebf5;
  border-radius: 5px;
  margin-bottom: 11px;
}

.home_card_item_body {
  padding: 10px;
  display: flex;
  cursor: pointer;
}

.item_left {
  position: absolute;
  margin-left: 10px;
  width: 50px;
  height: 50px;
  text-align: center;
  border-radius: 2px;
  i{
    font-size: 26px;
    line-height: 46px;
  }
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

.item_left_icon5 {
  background-color: #F8F8FF;

  i {
    color: #00CD00;
  }
}

.item_left_icon6 {
  background-color: #F8F8FF;

  i {
    color: #7B68EE;
  }
}
.item_left_icon7 {
  background-color: #F8F8FF;

  i {
    color: #D02090;
  }
}

.item_center {
  margin-left: 80px;
}

.item_center_title {
  font-size: 13px;
  line-height: 24px;
  @include font_color_imp('color-primary');
}

.item_center_num {
  font-size: 13px;
  line-height: 24px;

  span {
    @include font_color_imp('color-primary');
    font-weight: bold;
  }
}

.item_right {
  margin: auto 10px auto auto;
  cursor: pointer;
  i {
    font-size: 16px;
  }
}
</style>
