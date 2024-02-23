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
      处置申请详情
    </template>
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item label="申请人">
        {{ formDetail.createUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="申请时间">
        {{ formDetail.createTime | timeFormat }}
      </el-descriptions-item>

      <el-descriptions-item label="处置原因">
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
          prop="dispose"
        >
          <template #default>
            报废
          </template>
        </el-table-column>

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
import AssetDisposalApi from '../api';

export default {
  components: {
    DrawerTemplate,
  },
  filters: {},
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
        auditUserId: '',
        // 审核人名称
        auditUserName: '',
        // 申请时间
        createTime: '',
        // 申请人
        createUser: '',
        // 申请人名称
        createUserName: '',
        // 主键
        id: '',
        // 处置资产列表
        list: [],
        // 处置原因
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
      this.formDetail = await AssetDisposalApi.getDetail(this.data.id);
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
