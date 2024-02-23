/**
* @file applicationHistory.vue
* @author huang
* @date 2023/11/8
* @description  耗材申领详情
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      详情
    </template>
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item label="申请人">
        {{ detailData.createUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="申请时间">
        {{ detailData.createTime }}

      </el-descriptions-item>
      <el-descriptions-item label="申领科室">
        {{ detailData.inDeptName }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">
        {{ detailData.remark }}
      </el-descriptions-item>

    </el-descriptions>
    <div class="table-area base-margin-top">

      <el-table :data="detailData.claimReserve">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
        />
        <el-table-column
          label="耗材名称"
          prop="name"
        />
        <el-table-column
          label="规格型号"
          prop="model"
        />
        <el-table-column
          label="供应商"
          prop="supplierName"
        />
        <el-table-column
          label="数量"
          prop="quantity"
        >
          <template #defatul="{row}">
            {{ row.quantity }}{{ row.unitToName }}
          </template>
        </el-table-column>

      </el-table>
    </div>
    <template #footer>
      <pure-button
        label="取消"
        @click="$emit('done')"
      />
    </template>
  </drawer-template>

</template>
<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import PureButton from '@/common/components/button/index.vue';
import ApplyApi from '../api';

export default {
  components: {
    PureButton,
    DrawerTemplate,
  },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      detailData: {
        // 审核备注
        auditRemark: '',
        // 审核结果(0待审核 1驳回 2通过)
        auditState: '',
        // 审核人
        auditUser: '',
        // 审核人名称
        auditUserName: '',
        // 申领资产列表
        claimReserve: [],
        // 申请时间
        createTime: '',
        // 申请人
        createUser: '',
        // 申请人名称
        createUserName: '',
        // 主键
        id: '',
        // 申请科室
        inDept: '',
        // 申请科室名称
        inDeptName: '',
        // 备注
        remark: '',
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init() {
      if (this.data?.id) {
        this.detailData = await ApplyApi.getDetail(this.data.id);
      }
    },
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.table-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }
}
</style>
