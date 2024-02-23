<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
    style="padding-right: 10px;"
  >
    <el-form-item v-if="requiredDealTime" label="处理时间" required>
      <el-date-picker
        v-model="formData.createTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        align="right"
        :prefix-icon="'null'"
        :clear-icon="'null'"
        class="date-picker"
      />
    </el-form-item>
    <div class="form-item-__box">
      <div class="form-item-__tip">
        <i class="el-icon-warning-outline" />
        <span>此工单升级后，不可再由需求转为工单</span>
      </div>
    </div>
    <el-form-item label="需求标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入需求标题" clearable />
    </el-form-item>
    <el-form-item label="需求描述">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入需求描述"
        :rows="4"
        show-word-limit
        maxlength="1000"
      />
    </el-form-item>
    <el-form-item label="涉及系统" prop="aboutSystem">
      <dic-select v-model="formData.aboutSystem" type="string" dic-key="obs_about_system" style="width: 100%" />
    </el-form-item>
    <el-form-item label="项目优先级" prop="level">
      <dic-radio v-model="formData.level" type="string" dic-key="obs_priority_level" />
    </el-form-item>
    <el-form-item label="期望完成日期">
      <el-date-picker
        v-model="formData.endTime"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        type="datetime"
        align="right"
        :prefix-icon="'null'"
        :clear-icon="'null'"
        class="date-picker"
        placeholder="请选择期望完成日期"
      />
    </el-form-item>
    <el-form-item label="提出日期" prop="startTime">
      <el-date-picker
        v-model="formData.startTime"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        type="datetime"
        align="right"
        :prefix-icon="'null'"
        :clear-icon="'null'"
        class="date-picker"
        placeholder="请选择提出日期"
      />
    </el-form-item>
    <el-form-item label="上传附件">
      <el-col :span="22" style="padding-left: 0px;">
        <upload v-model="formData.enclosure" />
      </el-col>
    </el-form-item>
    <template v-for="(item,index) in formData.proposeList">
      <div :key="index" class="card__item_box">
        <div class="card__item">
          <div class="card__header">提出科室{{ index+1 }}
            <el-button v-if="index!==0" class="card__item-btn" icon="el-icon-delete" circle @click.prevent="onDeleteDepartment(index)" />
          </div>
          <el-form-item
            label="提出科室"
            :prop="'proposeList.'+index+'.organizer'"
            :rules="{
              required: true, message: '请选择提出科室', trigger: 'change',
            }"
          >
            <department-cascader v-model="item.organizer" placeholder="请选择提出科室" class="w-100" />
          </el-form-item>
          <el-form-item
            label="提出人"
            :prop="'proposeList.'+index+'.sponsor'"
            :rules=" {required: true, message: '请输入提出人', trigger: 'blur',}"
          >
            <el-input
              v-model="item.sponsor"
              placeholder="请输入提出人"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="电话"
            :prop="'proposeList.'+index+'.phone'"
            :rules="[{
              required: true, message: '请输入联系电话', trigger: 'blur',
            }, {
              pattern: /^[\d-]*$/, message: '只能输入数字，中划线', trigger: 'blur',
            }]"
          >
            <el-input v-model="item.phone" placeholder="请输入提出人电话号码" clearable />
          </el-form-item>
        </div>
      </div>
    </template>
    <div class="bottom-btn-box">
      <el-button
        icon="el-icon-plus"
        class="bottom-btn"
        @click="onAddDepartment()"
      >添加科室</el-button>
    </div>

  </el-form>
</template>

<script>
import TicketApi from '@/features/ticket/api';
import moment from 'moment';
import DicRadio from '@/features/system/dataDictionary/components/dicRadio.vue';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
export default {
  name: 'EndUpgrade',
  components: {
    DicRadio,
    DepartmentCascader: () => import('@/features/system/departmentManagement/components/deptCascader.vue'),
    Upload: () => import('@/common/components/upload'),
    DicSelect,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    // 提出人
    sponsor: {
      type: String,
      default: null,
    },
    requiredDealTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        // 需求标题
        title: '',
        // 需求描述
        remark: null,
        // 项目优先级
        level: '2',
        // 提出科室对象 包含提出科室，提出人，联系电话
        proposeList: [
          { organizer: null, sponsor: this.sponsor || null, phone: null, },
        ],
        // 提出日期
        startTime: null,
        // 期望完成日期
        endTime: null,
        // 涉及系统
        aboutSystem: null,
        // 附件
        enclosure: [],
        // 处理时间
        createTime: null,
      },
      rules: {
        title: [{
          required: true, message: '请输入需求标题', trigger: 'blur',
        },
        ],
        level: [{
          required: true, message: '请选择紧急程度', trigger: 'change',
        },
        ],
        startTime: [{
          required: true, message: '请选择提出日期', trigger: 'change',
        },
        ],
        aboutSystem: [{
          required: true, message: '请选择涉及系统', trigger: 'change',
        },
        ],
      },
    };
  },
  mounted() {
    this.formData.createTime = this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    async onSubmit(orderNum) {
      await this.$refs.form.validate();
      await TicketApi.upgrade({
        orderNum,
        ...this.formData,
        makeTime: this.formData.createTime,
      });
    },
    async onAddDepartment() {
      this.formData.proposeList.push({
        organizer: null,
        sponsor: null,
        phone: null,
      });
    },
    async onDeleteDepartment(index) {
      this.formData.proposeList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
.card__header {
  display: flex;
  align-items: center;
  height: 47px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  @include font_color_imp('color-assist-gray');
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  padding: 0  0 0 16px;
  &::before {
    content: '';
    width: 5px;
    height: 50%;
    margin-right: 6px;
    top: 0;
    left: 0;
    @include background_color_imp('color-primary');
  }
}
.card__item-btn{
  margin:auto 0 auto auto;
}
.card__item_box{
  padding: 10px 0px 10px 30px;
  border-radius: 5px;
}
.card__item{
  padding: 0 20px;
  border: 1px solid #dddddd;
}
.form-item-__box{
  width: 100%;
  padding: 0 0 10px 50px;
}
.bottom-btn-box{
  width: 100%;
  text-align: center;
  padding: 10px 0 14px 0;
}
.bottom-btn{
  @include font_color_imp('color-primary');
  @include border_color_imp('color-primary')
}
.form-item-__tip {
  font-size: 14px;
  padding: 6px;
  line-height: 22px;
  @include font_color_imp('color-special');
  @include background_color_imp('color-assist-3');
}
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-12 {
    padding:0;
  }
}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner{
    padding:0 16px;
  }
}
</style>
