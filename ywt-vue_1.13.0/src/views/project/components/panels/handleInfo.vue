<!-- 处理信息 -->
<template>
  <Panel title="处理信息" left-flag-title="处理时间" :height="$attrs.height" left-flag-value="2021-05-01 00:00:00">
    <el-form
      ref="form"
      :model="formData"
      label-width="110px"
      size="mini"
      label-position="right"
      :rules="rules"
    >
      <el-form-item label="处理人" prop="Handler">
        <el-select
          v-model="formData.users"
          :filterable="true"
          placeholder="请选择"
          size="mini"
          style="width:30%;"
        >
          <el-option

            v-for="item in personList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理描述">
        <el-input
          v-model="formData.remark"
          type="textarea"
          size="small"
          :autosize="{ minRows: 5, maxRows: 10}"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="完成进度">
            <el-input-number
              v-model="formData.progress"
              controls-position="right"
              :min="0"
              :max="100"
              style="width:60%;margin-right:5px;"
            />
            <span>%</span>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="完成时间">
            <el-date-picker
              v-model="formData.updateTime"
              type="datetime"
              placeholder="选择日期时间"
              style="width:100%;"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件">
        <Upload v-model="formData.enclosure" />
      </el-form-item>
    </el-form>

  </Panel>
</template>

<script>
import { mixins_base, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
export default {
  components: {
    Panel: () => import('../panel/index.vue'),
    Upload: () => import('@/components/upload/index.vue'),
  },
  mixins: [mixins_base],
  data() {
    return {
      formData: {
        users: '',
        remark: '',
        progress: '',
        updateTime: '',
        endTime: '',
        linkedKey: '',
        enclosure: JSON.stringify([]),
      },

      rules: {
        users: [
          { required: true, message: '请选择处理人', trigger: 'blur', }
        ],
      },
    };
  },
  mounted() {
    this.SET_INJECT_EVENT({ name: 'confirm', fun: this.submit, });
  },
  methods: {
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          await ProjectAPI.impose.handleImpose(this.formData);
          this.FETCH_PERFORM_EVENT({ name: 'process', });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
    ::v-deep .panel-container-head-base-name{
        color: #000;
        font-weight: 200;
    }
    ::v-deep .el-form-item__content{
        color: #ccc;
    }
</style>
