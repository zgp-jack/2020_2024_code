<!--  -->
<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
    size="mini"
    label-position="right"
    :rules="rules"
  >
    <el-form-item label="处理人" prop="users">
      <el-select
        v-model="formData.users"
        placeholder="请选择"
        size="mini"
        multiple
      >
        <el-option
          v-for="item in userList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="处理描述">
      <el-input
        v-model="formData.remark"
        type="textarea"
        size="small"
        :autosize="{ minRows: 5, maxRows: 10 }"
        placeholder="请输入内容"
      />
    </el-form-item>
    <el-row>
      <el-col :span="11">
        <el-form-item label="完成进度">
          <el-input-number
            v-model="formData.progress"
            controls-position="right"
            :disabled="progressDisabled"
            :min="0"
            :max="100"
            style="width: 75%; margin-right: 5px"
          />
          <span>%</span>
        </el-form-item>
      </el-col>
      <el-col :span="13">
        <el-form-item label="完成时间" label-width="90px">
          <el-date-picker
            v-model="formData.updateTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="附件" prop="enclosure">
      <JYWUpload v-model="formData.enclosure" />
    </el-form-item>
    <el-form-item class="t-r">
      <template v-if="title ==='处理'">
        <pure-button type="wire-frame" :loading="completeButtonLoading" label="完成任务" @click="onCompleteTask" />
      </template>
      <pure-button :loading="submitButtonLoading" label="处理任务" @click="submit" />

    </el-form-item>

  </el-form>

</template>

<script>
import { mixins_base, } from '@/minxins/project';
import { arrayToString, } from '@/utils/common';
import ProjectAPI from '@/apis/project';
import moment from 'moment';
import { mapGetters, } from 'vuex';
import DialogTaskConfirm from '@/views/project/impose/dialog/taskConfirm.vue';
import dialogWidth from '../../common/width/dialog';

export default {
  name: 'Handle',
  components: {},
  mixins: [mixins_base],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    userIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    id: {
      type: Number,
      default: 0,
    },
    isUpload: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '处理',
    },
    progressDisabled: {
      type: Boolean,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      submitButtonLoading: false,
      completeButtonLoading: false,
      formData: {
        users: [],
        remark: '',
        progress: 0,
        updateTime: new Date(),
        enclosure: JSON.stringify([]),
        linkedKey: '',
      },
      rules: {
        users: [
          { required: true, message: '请选择处理人', trigger: 'blur', },
          {
            trigger: 'change',
            type: 'array',
          }
        ],
      },
    };
  },
  computed: {
    userList() {
      return this.personList.filter((e) => {
        return this.userIds.includes(e.userId);
      });
    },
    ...mapGetters(['userInfo']),

  },
  mounted() {
    console.log(this.researchInfo, '-----');

    this.formData.users = [this.userInfo.id];
    this.formData.progress = this.info.totalProgress || 0;
  },
  methods: {

    close() {
      this.$emit('update:visible', false);
    },
    cancel() {
      this.close();
    },
    onDone() {
      this.$emit('done');
    },
    taskOverCallback() {
      this.$innerDialog({
        title: '提交确认',
        width: dialogWidth.mini_px,
        component: () => <DialogTaskConfirm data={this.researchInfo} onDone={this.onDone}/>,
      });
    },
    async submit() {
      const self = this;
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            self.formData.linkedKey = self.id;
            self.formData.updateTime = moment(self.formData.updateTime).format(
              'YYYY-MM-DD HH:mm'
            );
            const data = JSON.parse(JSON.stringify(self.formData));
            data.users = arrayToString(data.users);
            this.submitButtonLoading = true;
            if (this.title === '处理') {
              const res = await ProjectAPI.impose.handleTask(data);
              if (res) {
                this.taskOverCallback();
              }
            } else {
              await ProjectAPI.impose.handletaskAppend(data);
            }
            this.submitButtonLoading = false;
            self.formData = self.$options.data().formData;
            self.$emit('done');
          } catch (e) {
            this.submitButtonLoading = false;
            this.$message.error(e);
          }
        }
      });
    },
    onCompleteTask() {
      const self = this;
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            const params = {
              linkedKey: self.id,
              updateTime: moment(self.formData.updateTime).format(
                'YYYY-MM-DD HH:mm'
              ),
              users: arrayToString(self.formData.users),
              remark: self.formData.remark,
              progress: 100,
              enclosure: self.formData.enclosure,
            };
            this.completeButtonLoading = true;
            const res = await ProjectAPI.impose.handleTask(params);
            if (res) {
              this.taskOverCallback();
            }
            self.$emit('done');
          } catch (e) {
            this.$message.error(e);
          } finally {
            this.completeButtonLoading = false;
          }
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
  text-align: right;
}
</style>
