<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-25 18:43:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-05 15:30:47
 * @Description:工单升级
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
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
    <el-form-item label="需求标题" prop="title">
      <el-input v-model="formData.title" />
    </el-form-item>
    <el-form-item label="需求描述">
      <el-input v-model="formData.remark" type="textarea" :rows="4" />
    </el-form-item>
    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目优先级" prop="level">
            <dic-select v-model="formData.level" type="string" dic-key="itemPriority" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
    <template v-for="(item,index) in formData.proposerList">
      <div :key="index">
        <el-form-item
          :label="'提出科室'+(index+1)"
          :prop="'proposerList.'+index+'.organizer'"
          :rules="{
            required: true, message: '请选择提出科室', trigger: 'change',
          }"
        >
          <department-cascader v-model="item.organizer" class="w-100" />
        </el-form-item>
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-row>
            <el-col :span="11">
              <el-form-item
                :label="'提出人'+(index+1)"
                :prop="'proposerList.'+index+'.sponsor'"
                :rules=" {required: true, message: '请输入提出人', trigger: 'blur',}"
              >
                <el-input
                  v-model="item.sponsor"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                :label="'联系电话'+(index+1)"
                :prop="'proposerList.'+index+'.phone'"
                :rules="[{
                  required: true, message: '请输入联系电话', trigger: 'blur',
                }, {
                  pattern: /^[\d-]*$/, message: '只能输入数字，中划线', trigger: 'blur',
                }]"
              >
                <el-input v-model="item.phone" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button
                v-if="index!==0"
                icon="el-icon-delete"
                style="margin-left:16px"
                type="danger"
                @click="onDeleteDepartment(index)"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </div>
    </template>
    <el-form-item>
      <el-button
        @click="onAddDepartment()"
      >添加科室</el-button>
    </el-form-item>
    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-row>
        <el-col :span="12">
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
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-form-item label="涉及系统" prop="aboutSystem">
        <dic-multi-select v-model="formData.aboutSystem" dic-key="aboutSystem" class="w-100" />
      </el-form-item>
    </el-form-item>
    <el-form-item label="附件">
      <el-col :span="22">
        <upload v-model="formData.enclosure" />
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import TicketApi from '@/feat/ticket/api';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DicMultiSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';
import moment from 'moment';
export default {
  name: 'EndUpgrade',
  components: {
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    Upload: () => import('@/components/upload'),
    DicSelect,
    DicMultiSelect,
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
        proposerList: [{ organizer: null, sponsor: this.sponsor || null, phone: null, }],
        // 提出日期
        startTime: null,
        // 期望完成日期
        endTime: null,
        // 涉及系统
        aboutSystem: null,
        // 附件
        enclosure: null,
        // 处理时间
        createTime: null,
      },
      rules: {
        title: [{
          required: true, message: '请输入需求标题', trigger: 'blur',
        }],
        level: [{
          required: true, message: '请选择紧急程度', trigger: 'change',
        }],
        startTime: [{
          required: true, message: '请选择提出日期', trigger: 'change',
        }],
        aboutSystem: [{
          required: true, message: '请选择涉及系统', trigger: 'change',
        }],
      },
    };
  },
  mounted() {
    this.formData.createTime = this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    async onSubmit(ticketId) {
      await this.$refs.form.validate();
      await TicketApi.upgrade({
        ticketId,
        ...this.formData,
        makeTime: this.formData.createTime,
      });
    },
    async onAddDepartment() {
      this.formData.proposerList.push({
        organizer: null,
        sponsor: null,
        phone: null,
      });
    },
    async onDeleteDepartment(index) {
      this.formData.proposerList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
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
