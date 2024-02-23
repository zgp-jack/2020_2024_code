<template>
  <hyy-view-layout>
    <template #aside>
      <el-tabs
        v-model="currentFilterTab"
        type="border-card"
        @tab-click="handleFilterTabChange"
      >
        <el-tab-pane
          :name="tab1"
          label="资产类型"
        >
          <dic-tree
            dic-key="ast_asset_type"
            @node-click="handleAssetTypeNodeClick"
          />
        </el-tab-pane>

        <el-tab-pane
          :name="tab2"
          label="巡检单元"
        >
          <dic-tree
            dic-key="ins_unit_directory"
            @node-click="handleAssetTypeNodeClick"
          />

        </el-tab-pane>
      </el-tabs>
    </template>
    <template #header>
      <query-panel
        @query="onQuery"
        @reset="onReset"
      >
        <el-form-item>
          <el-input
            v-model="queryData.keyword"
            :placeholder="placeholder"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.itemSetting"
            placeholder="是否配置巡检项"
          >
            <el-option
              v-for="(item,index) in inspectionConfigItemSettingList"
              :key="index"
              :label="item.label"
              :value="item.state"
            />

          </el-select>
        </el-form-item>

      </query-panel>
    </template>
    <pure-table
      ref="pureTable"
      :current-row-key="currentFilterTab"
      :list-api="listApi"
      :query-condition="queryData"
      :row-key="currentFilterTab"
    >

      <template #indexColumn>
        序号
      </template>
      <el-table-column
        v-for="item in tableColumn "
        :key="item.prop"
        :column-key="item.prop"
        :formatter="item.formatter"
        :label="item.label "
        :prop="item.prop"
        :width="item.width"
      />
      <el-table-column
        #default="{row}"
        fixed="right"
        label="操作"
        min-width="100"
        width="auto"
      >
        <pure-button
          v-if="row.itemSetting"
          label="编辑"
          @click="onEdit(row)"
        />
        <pure-button
          v-else
          label="去配置"
          @click="onConfig(row)"
        />

      </el-table-column>
    </pure-table>

  </hyy-view-layout>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DicTree from '@/features/system/dataDictionary/components/dicTree.vue';
import InspectionApi from '../api.js';
import DrawerConfigInspectionItem from './drawer/configInspectionItem.vue';
import { debounce, } from 'lodash-es';
import {
  INSPECTION_RESULT,
  INSPECTION_CONFIG_ITEM_SETTING,
  INSPECTION_CONFIG_ITEM_SETTING_MAP, INSPECTION_CONFIG_ASSET_TYPE, INSPECTION_CONFIG_INSPECTION_UNIT,
} from '../inspection.config';
import { pxToPercentage, } from '@/common/utils/convert';
import HyyViewLayout from '@/common/layout/viewLayout.vue';

export default {
  name: 'InspectionHistory',
  components: {
    HyyViewLayout,
    QueryPanel,
    DicTree,
  },
  data() {
    return {
      tab1: INSPECTION_CONFIG_ASSET_TYPE,
      tab2: INSPECTION_CONFIG_INSPECTION_UNIT,
      currentFilterTab: INSPECTION_CONFIG_ASSET_TYPE,
      listApi: InspectionApi.getInspectionConfigAssetList,
      queryCondition: {},
      placeholder: '请输入资产名称/编号',
      // 资产查询参数
      queryData: {
        // 资产类型
        assetsType: '',
        // 单元目录
        directory: '',
        // 是否配置巡检项
        itemSetting: '',
        // 关键字
        keyword: '',

      },
      inspectionConfigItemSettingList: INSPECTION_CONFIG_ITEM_SETTING,
      tableColumn: [],
      // 资产类型表头
      proTypeColumn: [

        {
          label: '资产名称',
          prop: 'name',
          fixed: true,
          width: 300,
        },

        {
          label: '资产编号',
          prop: 'assetsCode',
          fixed: false,
          width: 200,
        },
        {
          label: '使用科室',
          prop: 'useDeptName',
          fixed: false,
          width: 300,
        }, {
          label: '所属资产类型',
          prop: 'assetsTypeToName',
          fixed: false,
          width: 200,
        }, {
          label: '是否配置巡检项',
          prop: 'itemSetting',
          fixed: false,
          width: 180,
          formatter: (row) => {
            return INSPECTION_CONFIG_ITEM_SETTING_MAP[row['itemSetting']].label;
          },
        },
      ],
      // 巡检单元表头
      inspUnitColumn: [
        {
          label: '单元名称',
          prop: 'unitName',
          fixed: true,
          width: 200,
          formatter: (row) => {
            return row.unitName;
          },
        },
        {
          label: '编号',
          prop: 'unitCode',
          fixed: false,
          width: 200,

        }, {
          label: '使用科室',
          prop: 'useDepartName',
          fixed: false,
          width: 200,
        }, {
          label: '所属单元目录',
          prop: 'directoryToName',
          fixed: false,
          width: 200,
        }, {
          label: '是否配置巡检项',
          prop: 'itemSetting',
          fixed: false,
          width: 200,
          formatter: (row) => {
            return INSPECTION_CONFIG_ITEM_SETTING_MAP[row['itemSetting']].label;
          },
        },
      ],
    };
  },
  computed: {
    InspectionResult() {
      return INSPECTION_RESULT;
    },
  },
  mounted() {
    this.tableColumn = this.proTypeColumn;
    this.$nextTick(() => {
      this.$refs.pureTable.beforeFetchData = this.beforeFetchData;
      this.$refs.pureTable.fetchData(1);
      // this.handleMethodClick({});
    });
  },
  methods: {
    init() {
      this.$refs.pureTable.fetchData(1);
    },
    onEdit(row) {
      const itemData = {
        ...row,
        parentType: this.currentFilterTab,
        parentId: row.id,

      };
      this.$drawer({
        width: pxToPercentage(1280),
        component: () => <DrawerConfigInspectionItem itemData={itemData}/>,
      });
    },
    onConfig(row) {
      const itemData = {
        ...row,
        parentType: this.currentFilterTab,
        parentId: row.id,

      };
      this.$drawer({
        width: pxToPercentage(1280),

        component: () => <DrawerConfigInspectionItem itemData={itemData}/>,
      });
    },

    onQuery() {
      this.init();
    },
    onReset() {
      this.queryData = {
        // 资产类型
        assetsType: '',
        // 单元目录
        directory: '',
        // 是否配置巡检项
        itemSetting: '',
        // 关键字
        keyword: '',

      };
      this.init();
    },
    async handleDeptNodeClick({ deptId, }) {
      this.queryData.useDept = deptId;
      this.$refs.pureTable.fetchData(1);
    },
    beforeFetchData() {
      if (this.currentFilterTab !== INSPECTION_CONFIG_INSPECTION_UNIT) {
        this.listApi = InspectionApi.getInspectionConfigAssetList;
      } else {
        // 巡检单元
        this.listApi = InspectionApi.getInspectionConfigUnitList;
      }
    },
    // 左侧tab切换触发
    handleFilterTabChange({ index, }) {
      console.log(index, 'index');
      if (index !== '1') {
        this.tableColumn = this.proTypeColumn;
      } else {
        this.placeholder = '单元名称/编号';
        this.tableColumn = this.inspUnitColumn;
      }
      this.$refs.pureTable.fetchData(1);
    },
    // 资产类型节点点击
    handleAssetTypeNodeClick: debounce(function (target) {
      this.queryData.assetsType = target.dictValue;
      this.$refs.pureTable.fetchData(1);
    }, 300),
  },
};
</script>

<style lang='scss'
  scoped
>
.inspectionHistoryIndex {
  // background-color: #fff;
}

</style>
