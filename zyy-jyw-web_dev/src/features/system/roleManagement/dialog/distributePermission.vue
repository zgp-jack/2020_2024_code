/**
* @file distributePermission.vue
* @author huang
* @date 2023/8/21
* @description  分配数据权限
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <dialog-template>
    <template #title>
      分配数据权限
    </template>
    <el-form :model="form" label-width="100px">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input v-model="form.roleKey" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限范围">
        <el-select v-model="form.dataScope">
          <el-option
            v-for="item in dataScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <pure-button label="取消" type="patch" @click="cancel" />
      <pure-button label="确定" @click="submitForm" />
    </template>
  </dialog-template>

</template>

<script>
import DialogTemplate from '@/common/components/dialog/template.vue';
import SystemRoleApi from '../api';
import { isEmpty, } from 'lodash-es';
import { convertToTree, } from '@/common/utils/convert';

export default {
  name: 'DistributePermission',
  components: {
    DialogTemplate,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        roleName: '',
        roleKey: '',
        dataScope: '1',
        deptCheckStrictly: false,
        menuCheckStrictly: false,
        remark: '',
      },
      defaultProps: {
        children: 'children',
        label: 'deptName',
      },
      deptOptions: [],
      menuListTree: [],
      deptExpand: false,
      deptNodeAll: false,
      menuExpand: false,
      menuNodeAll: false,
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限',
        },
        {
          value: '3',
          label: '部门数据权限',
        },
        {
          value: '4',
          label: '部门及以下数据权限',
        },
        {
          value: '5',
          label: '仅本人数据权限',
        },
      ],
    };
  },
  computed: {
    deptListTree() {
      return convertToTree(this.deptOptions, { id: 'deptId', parentId: 'parentId', });
    },
  },
  watch: {
    data: {
      handler(val) {
        if (isEmpty(val)) return;
        this.form = val;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getDeptList();
  },
  methods: {
    // 获取部门列表
    async getDeptList() {
      const rs = await SystemRoleApi.getDeptList();
      this.deptOptions = rs.data;
    },

    async submitForm() {
      if (this.form?.roleId) {
        this.form.deptIds = [];
        await SystemRoleApi.updateDataScope(this.form);
        this.$message.success('分配数据权限成功');
        this.$emit('done');
      }
    },
    //   取消
    cancel() {
      this.$emit('done');
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-box {
  margin-top: 5px;
  height: 200px;
  overflow: auto;
  border: 1px solid #e5e6e7;
  background: #FFFFFF none;
  border-radius:4px;
}
</style>
