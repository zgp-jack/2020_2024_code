<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-03 11:58:10
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-27 15:50:54
 * @Description: 新增模板弹窗
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">巡检模板</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">基本信息</div>
        <el-form
          ref="form"
          :inline="true"
          label-width="108px"
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
            <el-input-number v-model="formData.frequencyTimer" style="width:80px;" controls-position="right" :min="1" :max="9999" />

          </el-form-item>
          <el-form-item label-width="20px" style="margin-right:0px" prop="frequencyInterval">
            <span class="unit">次/</span>
            <el-input-number v-model="formData.frequencyInterval" style="width:80px;" controls-position="right" :min="1" :max="9999" />
          </el-form-item>
          <el-form-item prop="frequencyUnit">
            <dic-select v-model="formData.frequencyUnit" style="width:85px;margin-left:5px" dic-key="brand" />
          </el-form-item>
          <el-form-item label="必须上传照片" prop="hasImage">
            <el-radio-group v-model="formData.hasImage">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="巡检异常办法" label-width="160px">
            <el-radio-group v-model="formData.errorMake">
              <el-radio :label="0">限期整改</el-radio>
              <el-radio :label="1">转工单</el-radio>
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
              @click="handleSubmitTemp"
            >保存</el-button>
            <el-button
              v-if="!editTemplate&&formData.id"
              type="primary"
              size="mini"
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
        :disabled="!formData.id"
        @click="handleAddPermission"
      >添加巡检内容</el-button>
      <empty-row />
      <el-table
        border
        :data="formData.roles"
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
          prop="deptName"
        />
        <el-table-column
          label="巡检内容"
          align="left"
          prop="roleName"
        />
        <el-table-column
          label="值域类型"
          align="left"
          prop="startDate"
        >
          <template slot-scope="{row}">
            {{ row.startDate||'-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="值域"
          align="left"
          prop="endDate"
        >
          <template slot-scope="{row}">
            {{ row.endDate||'-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="默认值"
          align="left"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.state"
              :active-value="1"
              :inactive-value="0"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="异常值域"
          align="left"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.primary"
              :active-value="1"
              :inactive-value="0"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="启用"
          align="left"
          prop="roleName"
        />
        <el-table-column
          label="填写实测值"
          align="left"
          prop="roleName"
        />
        <el-table-column
          label="操作"
          align="left"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="handleEditPermission(row)"
            >编辑</el-button>

            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDeletePermisson(row)"
            >
              <el-button
                slot="reference"
                size="medium"
                type="text"
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
// import {
//   bus,
// } from '@/utils/bus';
import emptyRow from '@/components/emptyRow.vue';
import InspectionTempApi from '@/apis/inspection/template';
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
  async created() {
    this.formData = Object.assign({}, this.formData, this.data);
    if (this.type === 'create') {
      this.editTemplate = true;
      this.formData.state = 1;
    } else {
      this.editTemplate = false;
      this.formData.password = 'test';
    }
  },
  methods: {
    // 新增或修改模板
    async handleSubmitTemp() {
      try {
        this.$emit('reloadData');
        await this.$refs.form.validate();
        const { id, name, deptId, frequencyTimer, frequencyInterval, frequencyUnit, hasImage, errorMake, state, } = this.formData;
        if (id) {
          await InspectionTempApi.create({ id, name, deptId, frequencyTimer, frequencyInterval, frequencyUnit, hasImage, errorMake, state, isEffect: 0, });
          this.$message({
            type: 'success',
            message: '修改模板成功',
          });
        } else {
          const id = await InspectionTempApi.create({ deptId, frequencyTimer, frequencyInterval, frequencyUnit, hasImage, errorMake, state, });
          this.formData.id = id;
          this.$message({
            type: 'success',
            message: '新增模板成功',
          });
        }
        this.editTemplate = false;
        // bus.$emit('reloadUserList');
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
    async handleDeletePermisson(row) {
      // try {
      //   await EngineerApi.deleteRole(row.id);
      //   const result = await EngineerApi.roleList(this.formData.id);
      //   this.formData.roles = result.roles;
      // } catch (error) {
      //   if (error) {
      //     this.$message({
      //       type: 'error',
      //       message: error,
      //     });
      //   }
      // }
    },
    async handleEditPermission(row) {
      // this.$dialog({
      //   title: '编辑权限',
      //   width: '548px',
      //   position: 'center',
      //   component: () => <CreatePermission data={row} engineerId={this.formData.id} onDone={this.handleAddedPermission}/>,
      // });
    },
    async handleAddPermission() {
      // this.$dialog({
      //   title: '添加权限',
      //   width: '548px',
      //   position: 'center',
      //   component: () => <CreatePermission engineerId={this.formData.id} onDone={this.handleAddedPermission}/>,
      // });
    },
    // 添加权限成功后的处理
    async handleAddedPermission(data) {
      // try {
      //   const result = await EngineerApi.roleList(this.formData.id);
      //   this.formData.roles = result.roles;
      //   bus.$emit('reloadUserList');
      // } catch (error) {
      //   console.log(error);
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.template-name {
  width:423px;
}
.unit {
  font-size: 14px;
  color: #879BBA;
  padding-left: 5px;
  padding-right: 5px;
}

</style>
