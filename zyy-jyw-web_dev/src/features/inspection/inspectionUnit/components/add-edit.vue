<template>
  <div>
    <el-form ref="formRef" label-width="120px" style="maxwidth: 480px" :model="formData" :rules="rules">
      <el-form-item label="编号" prop="unitCode">
        <el-input v-model="formData.unitCode" placeholder="请输入编号" />
      </el-form-item>
      <el-form-item label="单元名称" prop="unitName">
        <el-input v-model="formData.unitName" placeholder="请输入单元名称" />
      </el-form-item>
      <el-form-item label="单元所属目录" prop="directory">
        <CompTreeSelect
          v-model="formData.directory"
          placeholder="请选择单元所属目录"
          :tree-props="config"
          :tree-data="directoryTreeData"
          :is-single="true"
          :node-key="'dictValue'"
          :default-checked-keys.sync="checkedDirectory"
          :default-checked-labels="checkedDirectoryName"
        />
      </el-form-item>
      <el-form-item label="使用科室" prop="useDepartId">
        <use-department-list v-model="formData.useDepartId" style="width: 100%" />
      </el-form-item>
      <el-form-item label="科室责任人" prop="departUserId">
        <user-select v-model="formData.departUserId" placeholder="科室责任人" collapse-tags style="width: 100%" />
      </el-form-item>
      <el-form-item label="维护科室" prop="maintenanceDepartId">
        <use-department-list v-model="formData.maintenanceDepartId" multiple style="width: 100%" />
      </el-form-item>
      <el-form-item label="单元所在位置" prop="unitAddress">
        <el-input v-model="formData.unitAddress" placeholder="请输入单元所在位置" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="formData.isEnable" :active-value="activeValue" :inactive-value="inactiveValue" />
      </el-form-item>
    </el-form>
    <CompFormBox title="绑定资产">
      <template v-slot:operate>
        <pure-button type="major" label="绑定资产" icon="add" @click="onAddAst" />
      </template>
      <div class="table-box" style="height: 350px">
        <el-table ref="tableRef" :data="tableData" height="100%">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column label="资产名称" prop="name" />
          <el-table-column label="资产编号" prop="assetsCode" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <span class="operate-btn delete" @click="onDelAst(row.id)">移除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </CompFormBox>
    <custom-drawer
      size="50%"
      :append-to-body="true"
      title="绑定资产"
      :visible.sync="showBindDialog"
      @closed="onBindAssetClosed"
    >
      <CompBindAsset ref="compBindAssetRef" :select-data="selectData" :pertain-unit="pertainUnit" />
      <template v-slot:footer>
        <div>
          <pure-button label="保存" @click="onSaveAsset" />
          <pure-button label="取消" type="patch" @click="onCancelAsset" />
        </div>
      </template>
    </custom-drawer>
  </div>

</template>

<script>
import UseDepartmentList from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
import CompTreeSelect from '@/common/components/treeSelect/index.vue';
import CompFormBox from '@/common/components/formBox/index.vue';
import CompBindAsset from './bind-asset.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import { findAstById, } from '@/features/inspection/inspectionUnit/api';
import { find, } from 'lodash-es';
import { convertToTree, } from '@/common/utils/convert';

export default {
  components: {
    UserSelect,
    CompFormBox,
    CompTreeSelect,
    UseDepartmentList,
    CompBindAsset,
  },
  props: {
    currentData: {
      type: Object,
      default() {
        return {
          status: '0',
        };
      },
    },
    operateType: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      activeValue: 1,
      inactiveValue: 0,
      formData: {
        unitCode: '',
        unitName: '',
        directory: '',
        useDepartId: '',
        departUserId: '',
        maintenanceDepartId: '',
        unitAddress: '',
        isEnable: 1,
      },
      tableData: [],
      selectData: [], // 选择数据
      pertainUnit: '', // 选择数据
      checkedDepartmentId: [],
      checkedDepartmentName: [],
      checkedDirectory: [],
      checkedDirectoryName: [],
      // 绑定资产
      showBindDialog: false,
      config: {
        children: 'children',
        label: 'dictLabel',
        id: 'id',
      },
      directoryTreeData: [],
    };
  },
  computed: {
    rules() {
      const validDirectory = (rule, value, callback) => {
        const arr = this.checkedDirectory;
        if (arr.length === 0 || !arr) {
          callback(new Error('请选择单元目录'));
        } else {
          callback();
        }
      };
      return {
        unitCode: [
          { required: true, message: '请输入单元编号', },
        ],
        unitName: [
          { required: true, message: '请输入单元名称', },
        ],
        directory: [
          { required: true, validator: validDirectory, message: '请选择单元目录', },
        ],
        useDepartId: [
          { required: true, message: '请选择使用科室', },
        ],
        unitAddress: [
          { max: 200, message: '单元所在位置不超过200字符', },
        ],
      };
    },
  },
  watch: {
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const { ...rest } = newVal;
          const data = { ...rest, };
          this.formData = data;
          this.tableData = [];
          if (this.formData.id) {
            this.pertainUnit = this.formData.id;
          }
          if (this.formData.directory) {
            this.checkedDirectory = [this.formData.directory,
            ];
            this.checkedDirectoryName = [this.formData.directoryName,
            ];
          } else {
            this.checkedDirectory = [];
            this.checkedDirectoryName = [];
          }
          if (this.formData.id) {
            this.getAstById(this.formData.id);
          }
          this.getDirectoryData();
          this.$nextTick(() => {
            this.$refs.formRef.clearValidate();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    reset() {
      this.formData = {};
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    validate() {
      const result = {};
      this.$refs.formRef.validate(valid => {
        result.valid = valid;
        if (valid) {
          this.formData.directory = this.checkedDirectory[0];
          this.formData.astIdList = this.tableData.map(item => item.id);
          const data = { ...this.formData, };
          result.data = data;
        }
      });
      return result;
    },
    /* 绑定资产添加 */
    onAddAst() {
      this.showBindDialog = true;
      this.selectData = this.tableData;
    },
    /* 绑定资产移除 */
    onDelAst(id) {
      const ids = [id,
      ];
      this.tableData = this.tableData.filter((item) => {
        if (!ids.includes(item['id'])) {
          return item;
        }
      });
    },
    // 绑定资产操作
    onSaveAsset() {
      this.tableData = this.$refs.compBindAssetRef.getSelectedData();
      this.showBindDialog = false;
    },
    // 取消绑定
    onCancelAsset() {
      this.showBindDialog = false;
    },
    /* 查询单元已绑定资产 */
    getAstById(id) {
      findAstById(id).then((data) => {
        this.tableData = data;
      });
    },
    onBindAssetClosed() {
    },
    getDirectoryData() {
      const cachedDicList = this.$store.state['SYSTEM_DIC'].list || [];
      const ins_unit_directory = find(cachedDicList, { type: 'ins_unit_directory', })?.data || [];
      if (ins_unit_directory) {
        this.directoryTreeData = convertToTree(ins_unit_directory, {
          id: 'id',
          parentId: 'parentId',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";

.table-box {
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

  .operate-btn {
    margin-right: 16px;
    font-size: 14px;
    color: #006666;
    cursor: pointer;

    &.delete {
      color: #ff836b;
    }
  }
}
</style>
