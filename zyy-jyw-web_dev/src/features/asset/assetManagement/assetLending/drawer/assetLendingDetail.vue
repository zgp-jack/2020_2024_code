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
      资产借用详情
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
      <el-descriptions-item label="出借科室">
        {{ formDetail.inDeptName }}
      </el-descriptions-item>
      <el-descriptions-item label="联系人">
        {{ formDetail.inUser }}
      </el-descriptions-item>
      <el-descriptions-item label="预计归还日期">
        {{ formDetail.estimateReturnDate | timeFormat }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">
        {{ formDetail.inPhone }}
      </el-descriptions-item>
      <el-descriptions-item label="借用原因">
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
import AssetLendingApi from '../api';

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
        auditUser: '',
        // 审核人名称
        auditUserName: '',
        // 申请时间
        createTime: '',
        // 申请人
        createUser: '',
        // 申请人名称
        createUserName: '',
        // 预计归还日期
        estimateReturnDate: '',
        // 主键
        id: '',
        // 借入科室
        inDept: '',
        // 借出科室名称
        inDeptName: '',
        // 联系电话
        inPhone: '',
        // 联系人
        inUser: '',
        // 借用资产列表
        list: [],
        // 借出科室
        outDept: '',
        // 借出科室名称
        outDeptName: '',
        // 借用原因
        reason: '',
        // 归还日期
        returnDate: '',
        // 归还人电话
        returnPhone: '',
        // 归还备注
        returnRemark: '',
        // 归还人
        returnUser: '',
        // 借用状态(1:待审核,2:驳回,3:待归还,4:已归还)
        state: '',
      },
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {

    async init() {
      this.formDetail = await AssetLendingApi.borrowDetail(this.data.id);
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
