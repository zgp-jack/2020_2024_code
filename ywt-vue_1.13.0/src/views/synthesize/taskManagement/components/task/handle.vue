<!--  -->
<template>
  <el-form ref="form" label-position="right" :model="formData" :rules="rules" label-width="100px" size="mini">
    <el-form-item label="任务名称">
      <span>{{ formData.name }}</span>
    </el-form-item>
    <el-form-item label="处理说明">
      <el-input
        v-model="formData.explan"
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
            v-model="formData.compRate"
            :disabled="!isLeader "

            controls-position="right"
            :min="0"
            :max="100"
            style="width: 75%; margin-right: 5px"
          />
          <span>%</span>
        </el-form-item>
      </el-col>
      <el-col :span="13">
        <el-form-item label="处理时间" label-width="90px">
          <el-date-picker
            v-model="formData.processTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="附件" prop="attachment">
      <JYWUpload v-model="formData.attachment" />
    </el-form-item>
    <el-row>
      <el-col :span="24" class="t-r">
        <el-button v-if="isLeader" type="primary" :loading="completeButtonLoading" size="mini" @click="clickComplete">
          完成
        </el-button>
        <el-button type="primary" size="mini" :loading="handelButtonLoading" @click="clickHandle">
          处理
        </el-button>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>
import TaskApi from '@/apis/synthesize/taskManagement';
import moment from 'moment';
import { mapState, } from 'vuex';
import { stringifyToArr, } from '@/filters';
export default {
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      completeButtonLoading: false,
      handelButtonLoading: false,
      formData: {
        name: '',
        // 任务ID
        taskId: '',
        // 说明
        explan: '',
        // 进度
        compRate: '',
        // 处理时间
        processTime: '',
        // 附件
        attachment: JSON.stringify([]),

      },
    };
  },
  computed: {
    ...mapState('login', ['userInfo']),

    // 当前登录账号是否是责任人
    isLeader() {
      return Number(this.info.leaderUser) === Number(this.userInfo.id) || Number(this.info.parentLeaderId) === Number(this.userInfo.id);
    },
    rules() {
      return {
        attachment: [{
          required: this.info.mustAttr || false,
          message: '请上传附件',
          validator: (r, v, cb) => {
            if (!this.info.mustAttr) {
              return cb();
            }
            if (stringifyToArr(v).length) {
              return cb();
            } else {
              return cb(new Error('请上传附件'));
            }
          },
        }],
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async  clickHandle() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.handelButtonLoading = true;
            const params = this.formData;
            params.taskId = this.info.id;

            await TaskApi.handle(params);
            this.handelButtonLoading = false;
            this.$emit('done');
          } catch (error) {
            this.completeButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },

    async  clickComplete() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.completeButtonLoading = true;
            const params = this.formData;
            params.taskId = this.info.id;
            await TaskApi.complaete(params);
            this.completeButtonLoading = false;
            this.$emit('done');
          } catch (error) {
            this.completeButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },
    init() {
      this.formData.processTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.formData.compRate = this.info.compRate || 0;
      if (Object.values(this.info).length) {
        this.formData.name = this.info.taskName;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
  text-align: right;
}
</style>
