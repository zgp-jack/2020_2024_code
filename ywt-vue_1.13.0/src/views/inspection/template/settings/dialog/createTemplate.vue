<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-03 11:58:10
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:00:42
 * @Description: 新增模板弹窗
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">基本信息</div>
        <el-form
          ref="form"
          :inline="true"
          label-width="128px"
          label-position="right"
          size="mini"
          :model="formData"
          :rules="rules"
          :disabled="formData.id&&!editTemplate"
        >
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="formData.name" class="template-name" />
          </el-form-item>
          <el-form-item label="科室" prop="deptId">
            <department-cascader v-model="formData.deptId" />
          </el-form-item>
          <el-form-item label="频次" prop="frequencyTimer" style="margin-right:0px">
            <el-input-number v-model="formData.frequencyTimer" style="width:80px;" controls-position="right" :min="1" :max="20" />

          </el-form-item>
          <el-form-item label-width="20px" style="margin-right:0px" prop="frequencyInterval">
            <span class="unit">次/</span>
            <el-input-number v-model="formData.frequencyInterval" style="width:80px;" controls-position="right" :min="1" :max="20" />
          </el-form-item>
          <el-form-item prop="frequencyUnit">
            <dic-select v-model="formData.frequencyUnit" style="width:85px;margin-left:5px" dic-key="frequencyUnit" />
          </el-form-item>
          <el-form-item label="必须上传照片" prop="hasImage">
            <el-radio-group v-model="formData.hasImage">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="巡检异常办法" label-width="160px">
            <el-radio-group v-model="formData.errorMake">
              <el-radio :label="1">限期整改</el-radio>
              <el-radio :label="2">转工单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch
              v-model="formData.state"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row>
          <el-col>
            <el-button
              v-if="editTemplate"
              type="primary"
              size="mini"
              :disabled="type==='view'"
              @click="handleSubmitTemp"
            >保存</el-button>
            <el-button
              v-if="!editTemplate&&formData.id"
              type="primary"
              size="mini"
              :disabled="type==='view'"
              @click="editTemplate=!editTemplate"
            >编辑</el-button>
          </el-col>
        </el-row>
        <empty-row />
      </pure-card>
      <empty-row />
      <el-button
        type="primary"
        size="mini"
        :disabled="!formData.id || type==='view'"
        @click="handleAddInspectionContent"
      >添加巡检内容</el-button>
      <empty-row />
      <el-table
        border
        :data="formData.details"
      >
        <el-table-column
          label="序号"
          type="index"
          align="left"
          width="78px"
        />
        <el-table-column
          label="巡检分类"
          align="left"
          prop="inspectionType"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="巡检内容"
          align="left"
          prop="inspectionRemark"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="值域类型"
          align="left"
          prop="valueType"
        >
          <template slot-scope="{row}">
            {{ row.valueType===2?'数值':'选项' }}
          </template>
        </el-table-column>
        <el-table-column
          label="值域"
          align="left"
          prop="valueScope"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            {{ convertVauleScope(row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="默认值"
          align="left"
          prop="defaultValue"
        >
          <template slot-scope="{row}">
            {{ convertDefaultValue(row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="异常值域"
          align="left"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            {{ convertExceptionScope(row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="启用"
          align="left"
          prop="state"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.state"
              disabled
              :active-value="1"
              :inactive-value="0"
              inactive-text="否"
              active-text="是"
            />
          </template>

        </el-table-column>
        <el-table-column
          label="填写实测值"
          align="left"
          prop="isWrite"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.isWrite"
              disabled
              :active-value="1"
              :inactive-value="0"
              inactive-text="否"
              active-text="是"
            />
          </template>

        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              :disabled="type==='view'"
              @click="handleEditInspectionContent(row)"
            >编辑</el-button>

            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelInspectionContent(row)"
            >
              <el-button
                slot="reference"
                size="medium"
                type="text"
                :disabled="type==='view'"
                style="margin-left:5px"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import emptyRow from '@/components/emptyRow.vue';
import InspectionTempApi from '@/apis/inspection/template';
import AddInspectionContent from './addInspectionContent.vue';
import * as InspectionUtil from '@/views/inspection/utils';
export default {
  components: { emptyRow,
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
    type: {
      type: String,
      default: 'create',
    },
    tempId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        id: null,
        name: null,
        deptId: null,
        frequencyTimer: 1,
        frequencyInterval: 1,
        frequencyUnit: 1,
        hasImage: 1,
        errorMake: 1,
        state: 1,
        details: [],
      },

      rules: {
        name: [{
          required: true, message: '请输入模板名称', trigger: 'blur',
        }],
        deptId: [{
          required: true, message: '请选择科室', trigger: 'change',

        }],
        frequencyTimer: {
          required: true, message: '请输入频次', trigger: 'blur',
        },
        frequencyInterval: {
          required: true, message: '请输入周期', trigger: 'blur',
        },
      },
      editTemplate: false,
    };
  },
  computed: {
    title() {
      let title = '';
      switch (this.type) {
        case 'update':
          title = '编辑巡检模板';
          break;
        case 'view':
          title = '巡检模板';
          break;
        case 'create':
          title = '新增巡检模板';
          break;
        default:
          title = '巡检模板';
          break;
      }
      return title;
    },
  },
  async created() {
    this.formData = Object.assign({}, this.formData, this.data);
    if (this.tempId) {
      const result = await InspectionTempApi.detail(this.tempId);
      this.formData = Object.assign({}, this.formData, result);
    }
    if (this.type === 'create') {
      this.editTemplate = true;
      this.formData.state = 1;
    } else {
      this.editTemplate = false;
    }
  },
  methods: {
    // 新增或修改模板
    async handleSubmitTemp() {
      try {
        await this.$refs.form.validate();
        const { id, name, deptId, frequencyTimer, frequencyInterval, frequencyUnit, hasImage, errorMake, state, } = this.formData;
        if (id) {
          await InspectionTempApi.update({ id, name, deptId, frequencyTimer, frequencyInterval, frequencyUnit, hasImage, errorMake, state, isEffect: 0, });
          this.$message({
            type: 'success',
            message: '修改模板成功',
          });
        } else {
          const id = await InspectionTempApi.create({ name, deptId, frequencyTimer, frequencyInterval, frequencyUnit, hasImage, errorMake, state, });
          this.formData.id = id;
          this.$message({
            type: 'success',
            message: '新增模板成功',
          });
        }
        this.editTemplate = false;
        this.$emit('reloadData');
      } catch (error) {
        console.log(error);
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    // 转换值域
    convertVauleScope(row) {
      let data = '';
      switch (row.valueType) {
        // 选项
        case 1:
          data = row.chooseValue.split(',').join('/');
          break;
        // 数值
        case 2:
          data = `${InspectionUtil.convertDefaultValue(row.minValue, row.valueUnit)}-${InspectionUtil.convertDefaultValue(row.maxValue, row.valueUnit)}`;
          break;

        default:
          break;
      }
      return data;
    },
    // 转换默认值
    convertDefaultValue(row) {
      let data = '';
      switch (row.valueType) {
        // 选项
        case 1:
          data = row.chooseDefault;
          break;
        // 数值
        case 2:
          data = InspectionUtil.convertDefaultValue(row.defaultValue, row.valueUnit);
          break;
        default:
          break;
      }
      return data;
    },
    // 转换异常值域
    convertExceptionScope(row) {
      let data = '';

      switch (row.valueType) {
        // 选项
        case 1:
          data = row.chooseException.split(',').join('/');
          break;
        // 数值
        case 2:

          data = InspectionUtil.convertExceptionValue(row.exceptionValue, row.valueUnit);
          break;
        default:
          break;
      }
      return data;
    },
    // 删除巡检内容
    async handleDelInspectionContent(row) {
      try {
        await InspectionTempApi.delTempContent(row.id);
        await this.handleAddedInspectionContent();
        this.$message({
          type: 'success',
          message: '删除成功',
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    // 编辑巡检内容
    async handleEditInspectionContent(row) {
      2;
      this.$dialog({
        title: '编辑巡检内容',
        width: '688px',
        position: 'center',
        component: () => <AddInspectionContent data={row} tempId={this.formData.id} onDone={this.handleAddedInspectionContent}/>,
      });
    },
    async handleAddInspectionContent() {
      this.$dialog({
        title: '添加巡检内容',
        width: '688px',
        position: 'center',
        component: () => <AddInspectionContent tempId={this.formData.id} onDone={this.handleAddedInspectionContent}/>,
      });
    },
    // 添加巡检内容成功后的处理
    async handleAddedInspectionContent(data) {
      try {
        const result = await InspectionTempApi.detail(this.formData.id);
        this.formData.details = result.details;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.template-name {
  width:423px;
}
.unit {
  font-size: $--pure-base-font-size;
  color: #879BBA;
  padding-left: 5px;
  padding-right: 5px;
}

</style>
