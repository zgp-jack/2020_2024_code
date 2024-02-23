<!--  -->
<template>
  <el-form
    ref="forms"
    :model="formData"
    :rules="rules"
    size="small"
    label-position="right"
    label-width="100px"
  >

    <el-form-item label="投票标题" prop="title">
      <el-input
        v-model="formData.title"
        disabled
      />
    </el-form-item>
    <el-form-item label="投票时间">
      <el-col :span="11">
        <el-form-item prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            class="w-100"
            type="datetime"
            placeholder="开始日期"
            :disabled=" isAdded"
            format="yyyy-MM-dd HH:mm"
            :default-value="dv"
            :default-time="ldt"
            value-format="yyyy-MM-dd HH:mm"
            popper-class="customDatePicker"
            :picker-options="pickerOptions"
          />

        </el-form-item>
      </el-col>
      <el-col :span="2" class="t-c">
        至
      </el-col>
      <el-col :span="11">
        <el-date-picker
          v-model="formData.endTime"
          type="datetime"
          class="w-100"
          placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :disabled="isAdded"
          :default-time="dt"
          popper-class="customDatePicker"
          :picker-options="pickerOptions"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="投票人员" prop="users">
      <UserSelect v-model="formData.users" multiple />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button
        type="primary"
        size="small"
        :loading="submitButtonLoading"
        @click="submit"
      >{{ isAdded? "追加投票" : "发起投票" }}
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import _ from 'lodash';
import ProjectAPI from '@/apis/project';
import moment from 'moment';
import { arrayToString, } from '@/utils/common';
import UserSelect from '@/views/project/components/userSelect/index';
import { mapActions, mapGetters, } from 'vuex';
import { pickerOptions, pickerOptionsEnd, } from '@/views/project/components/panels/config/panel.config';

export default {
  name: 'Vote',
  components: {
    UserSelect,
  },

  props: {
    addedVoteInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    flag: {
      type: String,
      default: 'new',
    },
    nextText: {
      type: String,
      default: '一',
    },
    itemCode: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      pickerOptions,
      pickerOptionsEnd,
      time: [],
      dv: new Date(),
      dt: '23:59:59',
      submitButtonLoading: false,
      ldt: moment(new Date()).format('HH:mm:ss'),
      formData: {
        title: '',
        users: [],
        startTime: '',
        endTime: '',
        linked: '',
        remark: '',
        isAnonymous: 0,
      },
      rules: {
        title: [{
          trigger: 'blur',
          required: true,
          message: '投票标题不能为空',
        }],
        startTime: [{
          trigger: 'blur',
          required: true,
          message: '开始时间不能为空',
        }],
        users: [{
          trigger: 'change',
          required: true,
          message: '请选择投票参与人员',
        }],
      },
    };
  },
  computed: {
    isAdded() {
      if (this.flag === 'add') {
        return true;
      }
      return false;
    },
    ...mapGetters('project/index', ['getterPanelGroupData']),
  },
  created() {
    // this.open();
  },
  mounted() {
    this.open();
  },
  methods: {
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT']),

    isVoteTimeEnd() {
      if (this.formData.endTime) {
        if (new Date(this.formData.endTime).getTime() < Date.now()) {
          return true;
        }
      } else if (!this.formData.endTime) {
        return false;
      } else {
        return false;
      }
    },
    async submit() {
      // 判断 投票截止时间是否过期
      if (this.isVoteTimeEnd()) {
        this.$message.error('投票结束时间已过，无法继续投票！');
        return;
      }
      const argument = {};
      this.$refs['forms'].validate(async (valid) => {
        if (valid) {
          Object.assign(argument, this.formData);
          argument.linked = this.itemCode;
          argument.users = arrayToString(argument.users);
          argument.title = argument.title.replace(`第${this.nextText}轮投票`, '');
          this.submitButtonLoading = true;
          try {
            if (this.flag === 'new') {
              await ProjectAPI.demand.submitVote(argument);
              this.FETCH_PERFORM_EVENT({ name: 'submitVote', });
            } else {
              if (this.addedVoteInfo.person?.length) {
                await ProjectAPI.demand.addedVote(this.addedVoteInfo.id, argument.users);
              }
            }
            this.submitButtonLoading = false;
            this.$emit('done');
          } catch (error) {
            this.submitButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },
    open() {
      if (this.flag === 'new') {
        this.formData.users = '';
        this.formData.startTime = '';
        this.formData.endTime = '';
      } else {
        if (this.addedVoteInfo.person?.length) {
          this.formData.users = _.uniq(this.addedVoteInfo.person);
          this.formData.title = this.addedVoteInfo.title;
          this.formData.startTime = this.addedVoteInfo.s_e_time[0];
          this.formData.endTime = this.addedVoteInfo.s_e_time[1];
        }
      }

      this.formData.title = this.getterPanelGroupData.demand.title;
      this.formData.title = `${this.formData.title}第${this.nextText}轮投票`;
    },
  },
};
</script>
<style lang='scss' scoped >
.w-100{
    width: 100%;
}
.t-c{
    text-align: center;
}
.t-r{
  text-align: right;
}

</style>
