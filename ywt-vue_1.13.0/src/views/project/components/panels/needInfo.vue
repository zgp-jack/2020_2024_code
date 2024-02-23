<!-- 需求信息面板 -->
<template>
  <JYWPanel
    :key="'needInfo'"
    title="需求信息"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="needInfo"
    :expand="expand"
    :disabled="pancelDisabledOptions['needInfo']"
    left-flag-title="创建人"
    :left-flag-value="panelInfo.createUser | member"
    right-flag-title="创建时间"
    :right-flag-value="panelInfo.createTime"
  >
    <el-form
      ref="formData"
      label-width="130px"
      size="mini"
      label-position="right"
      :model="formData"
      :rules="rules"
      :disabled="pancelDisabledOptions['needInfo']"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="需求类型" prop="itemType">
            <DicSelect
              v-model="formData.itemType"
              disabled
              dic-key="itemType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目优先级" prop="level">
            <DicSelect
              v-model="formData.level"
              placeholder="请选择项目优先级"
              dic-key="itemPriority"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item,index) in formData.proposerList" :key="index">
        <el-col :span="21">
          <el-form-item :label="`提出科室${1+index}`" :prop="`proposerList.${index}.organizer`" :rules="rules.organizer">
            <CascaderDepartment v-model="item.organizer" class="w-100" />
          </el-form-item>
        </el-col>
        <template v-if="!pancelDisabledOptions['needInfo']">
          <el-col v-if="index !=0 " :span="1" class="p-l-16">
            <pure-button label="删除" type="wire-frame-auto" @click="onDelDepartment(index)" />
          </el-col>
        </template>
        <el-col :span="10">
          <el-form-item :label="`提出人${1+index}`" :prop="`proposerList.${index}.sponsor`" :rules="rules.sponsor">
            <el-input v-model="item.sponsor" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="`联系电话${1+index}`" :prop="`proposerList.${index}.phone`" :rules="rules.phone">
            <el-input v-model="item.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <pure-button label="添加科室" @click="onAddDepartment" />
      </el-form-item>

      <el-form-item label="提出日期" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          placeholder="选择日期"
          class="w-100"
          :editable="false"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="期望完成日期">
        <el-date-picker
          v-model="formData.endTime"
          :disabled="!formData.startTime"
          type="date"
          placeholder="选择日期"
          class="w-100"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsControlEndTime"
        />
      </el-form-item>

      <el-form-item label="涉及系统" prop="aboutSystem">
        <DicMultipleSelect
          v-model="formData.aboutSystem"
          class="w-100"
          placeholder="请选择涉及系统"
          dic-key="aboutSystem"
        />
      </el-form-item>
      <el-form-item label="需求标题" prop="title">
        <el-input v-model="formData.title" placeholder="请填写需求标题" />
      </el-form-item>
      <el-form-item label="需求描述">
        <el-input
          v-model="formData.remark"
          placeholder="请填写需求描述"
          type="textarea"
          rows="5"
          :maxlength="2000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="附件">
        <JYWUpload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>
  </JYWPanel>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { mixins_base, mixins_needInfo, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DicMultipleSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';

export default {
  name: 'NeedInfo',
  components: {
    DicSelect,
    DicMultipleSelect,
  },
  mixins: [mixins_base, mixins_needInfo],
  props: {
    where: {
      type: String,
      default: 'project',
    },
  },
  data() {
    return {
      panelInfo: {
        createUser: '',
        createTime: '',
      },
      formData: {
        id: null,
        itemType: 1,
        organizer: null,
        sponsor: '',
        phone: '',
        aboutSystem: '',
        level: 2,
        startTime: '',
        title: '',
        endTime: '',
        remark: '',
        enclosure: JSON.stringify([]),
        proposerList: [{
          organizer: null,
          sponsor: '',
          phone: '',
        }],
      },
      rules: {
        itemType: [
          {
            required: true,
            message: '请选择需求类型',

            trigger: 'change',
          }
        ],

        level: [
          {
            required: true,
            trigger: 'change',
            message: '请选择项目优先级',
          }
        ],
        sponsor: [{
          required: true,
          trigger: 'change',
          message: '提出人',

        }],
        organizer: [{
          required: true,
          trigger: 'change',
          message: '请选择提出科室',

        }],
        phone: [{
          required: true,
          trigger: 'change',
          message: '请填写联系电话',

        }],
        startTime: [{
          required: true,
          trigger: 'blur',
          message: '开始时间不能为空',
        }],
        aboutSystem: [{
          required: true,
          trigger: 'change',
          message: '请选择涉及系统',

        }],
        title: [{
          required: true,
          trigger: 'change',
          message: '标题不能为空',
        },
        {
          max: 100,
          min: 1,
          message: `长度在1到100个字符`,
          trigger: 'blur',
        }
        ],
      },
    };
  },
  computed: {
    pickerOptionsControlEndTime() {
      return {
        disabledDate: time => {
          const strat = moment(this.formData.startTime).subtract(1, 'days');

          return moment(time.getTime()) <= strat;
        },
      };
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    onAddDepartment() {
      // 添加科室
      this.formData.proposerList.push({
        organizer: null,
        sponsor: '',
        phone: '',
      });
    },
    onDelDepartment(index) {
      this.formData.proposerList.splice(index, 1);
    },
    setFormData(obj) {
      this.$set(this.panelInfo, 'createUser', obj.createUser);
      this.$set(this.panelInfo, 'createTime', obj.createTime);

      this.$set(this.formData, 'id', obj.id);
      this.$set(this.formData, 'itemType', obj.itemType);
      this.$set(this.formData, 'organizer', obj.organizer);
      this.$set(this.formData, 'sponsor', obj.sponsor);
      this.$set(this.formData, 'phone', obj.phone);
      this.$set(this.formData, 'aboutSystem', obj.aboutSystem);
      this.$set(this.formData, 'level', obj.level);
      this.$set(this.formData, 'startTime', obj.startTime);
      this.$set(this.formData, 'title', obj.title);
      this.$set(this.formData, 'endTime', obj.endTime);
      this.$set(this.formData, 'remark', obj.remark);
      this.$set(this.formData, 'enclosure', obj.enclosure);
      this.$set(this.formData, 'proposerList', obj?.proposerList || []);
    },
    async getInfo() {
      if (this.where === 'ticket') {
        if (this.itemCode) {
          const rs = await ProjectAPI.demand.getNeedInfo(this.itemCode);
          this.setFormData(rs);
        }
        return;
      }
      if (this.itemCode) {
        const rs = this.getterPanelGroupData.demand;
        this.setFormData(rs);
      } else {
        this.formData.startTime = new Date();
      }
    },
    submit(v) {
      const data = _.cloneDeep(this.formData);
      data.startTime = moment(data.startTime).format('yyyy-MM-DD');
      data.endTime = data.endTime
        ? moment(data.endTime).format('yyyy-MM-DD')
        : '';

      return new Promise((r, j) => {
        this.$refs['formData'].validate(async valid => {
          if (valid) {
            try {
              const rs = await ProjectAPI.demand.createOrSaveNeedInfo(data, v);
              this.$message['success'](
                v === 'confirm' ? '提交成功' : '保存成功' + '!'
              );
              r(rs);
            } catch (e) {
              j(e);
            }
          } else {
            j('表单校验未通过');
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
.p-l-16{
  padding-left: 16px;
}
.m-l-16{
  margin-left: 16px;
}
</style>
