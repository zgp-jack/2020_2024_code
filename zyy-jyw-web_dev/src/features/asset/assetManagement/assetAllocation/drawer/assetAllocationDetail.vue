/**
* @file assetAllocation.vue
* @author huang
* @date 2023/11/3
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      资产调拨
    </template>
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item
        label="操作人"
      >
        {{ formDetail.createUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="操作时间">
        {{ formDetail.createTime }}
      </el-descriptions-item>
      <el-descriptions-item
        label="调入科室"
      >
        {{ formDetail.inDeptName }}
      </el-descriptions-item>
      <el-descriptions-item label="调拨原因">
        {{ formDetail.reason }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="table">

      <el-table :data="formDetail.list">
        <el-table-column
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          label="资产名称"
          prop="name"
        />
        <el-table-column
          label="规格型号"
          prop="model"
        />
        <el-table-column
          label="资产编号"
          prop="assetsCode"
        />

        <el-table-column
          label="状态"
          prop="equipmentStateToName"
        />

      </el-table>
    </div>
    <template #footer>

      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />

    </template>
  </drawer-template>
</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import AssetAllocationApi from '../api';

export default {
  components: {
    DrawerTemplate,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {

      formDetail: {
        // 操作时间
        createTime: '',
        // 操作人
        createUser: '',
        // 操作人名称
        createUserName: '',
        // 主键
        id: '',
        // 调入科室
        inDept: '',
        // 调入科室名称
        inDeptName: '',
        // 资产列表
        list: [],
        // 调拨原因
        reason: '',

      },
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {

    async init() {
      this.formDetail = await AssetAllocationApi.assetAllocationDetail(this.data.id);
    },
    cancel() {
      this.$emit('done');
    },

  },
};

</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.table {
  margin-top: 16px;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray') ;

      font-size: 16px !important;

      th.el-table__cell {
        @include background_color_imp('color-assist-4') ;
      }
    }

  }
}
</style>
