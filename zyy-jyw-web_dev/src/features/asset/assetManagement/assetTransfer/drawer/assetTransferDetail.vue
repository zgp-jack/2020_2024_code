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
      转移详情
    </template>
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item label="审核人">
        {{ formDetail.auditUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="审核结果">
        {{ formDetail.auditState | state }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">
        {{ formDetail.auditRemark }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      :column="2"
      border

      class="base-margin-top"
    >
      <el-descriptions-item
        label="申请人"
      >
        {{ formDetail.createUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="申请时间">
        {{ formDetail.createTime | timeFormat }}
      </el-descriptions-item>
      <el-descriptions-item
        label="转出科室"
      >
        {{ formDetail.outDeptName }}
      </el-descriptions-item>
      <el-descriptions-item label="转移原因">
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
import AssetTransferApi from '../api';
import { ASSET_TRANSFER_AUDIT_STATE_MAP, } from '@/features/asset/assetManagement/config';

export default {
  components: {
    DrawerTemplate,
  },
  filters: {
    state: function (value) {
      if (value !== '') {
        return ASSET_TRANSFER_AUDIT_STATE_MAP[value].label;
      }
      return '-';
    },
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
        // 审核备注
        auditRemark: '',
        // 审核状态(0未审核,1驳回,2已完成)
        auditState: '',
        // 审核人
        auditUser: '',
        // 申请时间
        createTime: '',
        // 申请人
        createUser: '',
        // 申请人名称
        createUserName: '',
        // 主键
        id: '',
        // :' ,转移资产信息
        list: [],
        // 转出科室
        outDept: '',
        // 转出科室名称
        outDeptName: '',
        // 转移原因
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
      this.formDetail = await AssetTransferApi.assetTransferDetail(this.data.id);
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
