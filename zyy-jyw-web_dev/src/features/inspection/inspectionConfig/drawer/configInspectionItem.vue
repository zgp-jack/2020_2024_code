<template>
  <drawer-template>
    <template #title>
      配置巡检项
    </template>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="18">
            <el-form inline>
              <el-form-item>
                <el-input
                  v-model="queryData.itemName"
                  placeholder="巡检项名称"
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="queryData.isEnable"
                  placeholder="是否启用"
                >
                  <el-option
                    v-for="(item,index) in enbaleList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />

                </el-select>
              </el-form-item>
              <el-form-item>
                <pure-button
                  icon="search"
                  label="查询"
                  type="minor"
                  @click="onQuery"
                />
                <pure-button
                  icon="reset"
                  label="重置"
                  type="patch"
                  @click="onReset"
                />

              </el-form-item>
            </el-form>
          </el-col>
          <el-col
            :span="6"
            class="align-right"
          >
            <pure-button
              label="引用巡检项"
              type="minor"
              @click="onQuote"
            />
            <pure-button
              label="添加巡检项"
              type="major"
              @click="onAdd"
            />
          </el-col>
        </el-row>

      </el-header>
      <el-main>
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
        >
          <el-table-column
            type="index"
          />
          <el-table-column
            label="巡检项名称"
            prop="itemName"
          />
          <el-table-column
            label="巡检项类型"
            prop="itemType"
          >
            <template #default="{row}">
              {{ typesListMap[row.itemType].label }}
            </template>
          </el-table-column>
          <el-table-column
            label="阀值/内容"
          >
            <template #default="{row}">
              <template v-if="row.itemType===1">

                {{ row.minValue }}~{{ row.maxValue }}{{ row.itemUnitToName }}
              </template>
              <template v-else>
                {{ row.optionContent.join('、') }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="默认值"
            prop="defaultValue"
          >
            <template #default="{row}">
              <template v-if="row.itemType===1">
                {{ row.defaultValue }}{{ row.itemUnitToName }}
              </template>
              <template v-else>
                {{ row.defaultOption }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="异常值"
            prop="errorOption"
          >
            <template #default="{row}">
              <template v-if="row.itemType===1">

                &lt;{{ row.minValue }}{{ row.itemUnitToName }}或&gt;{{ row.maxValue }}
              </template>
              <template v-else>
                {{ row.errorOption.join('、') }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="是否启用"
            prop="isEnable"
          >
            <template #default="{row}">
              <el-switch
                v-model="row.isEnable"
                :active-value="1"
                :inactive-value="0"
                @change="changeEnable($event,row)"
              />

            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="160"
          >
            <template #default="{row}">
              <pure-button
                label="编辑"
                type="major"
                @click="onEdit(row)"
              />

              <pure-button
                label="删除"
                px-to-percentage-1280-
                type="patch"
                width:
                @click="onDel(row)"
              />

            </template>
          </el-table-column>
        </el-table>
      </el-main>

    </el-container>
  </drawer-template>

</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import DrawerAddInspectionItem from './addInspectionItem.vue';
import DrawerQuoteInspection from './quoteInspection.vue';
import InspectionApi from '../../api';
import {
  INSPECTION_CONFIG_ITEM_ENBALE,
  INSPECTION_CONFIG_ITEM_ENBALE_MAP,
  INSPECTION_CONFIG_ITEM_TYPE_MAP,
} from '../../inspection.config';
import { debounce, } from 'lodash-es';
import PureButton from '@/common/components/button/index.vue';
import { pxToPercentage, } from '@/common/utils/convert';

export default {
  components: {
    PureButton,
    DrawerTemplate,
  },
  props: {
    itemData: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      typesListMap: INSPECTION_CONFIG_ITEM_TYPE_MAP,
      // 是否启用
      enbaleList: INSPECTION_CONFIG_ITEM_ENBALE,
      enbaleListMap: INSPECTION_CONFIG_ITEM_ENBALE_MAP,
      tableData: [],
      tableLoading: false,
      queryData: {
        //   是否启用
        isEnable: '',
        //   巡检项名称
        itemName: '',
        //   配置主表ID（资产 单元）
        parentId: '',
        //   配置类型（1资产类型 2巡检单元）
        parentType: '',
      },
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    onQuery: debounce(function () {
      this.init();
    }, 300),
    onReset() {
      this.queryData.itemName = '';
      this.queryData.isEnable = '';
      this.init();
    },

    // 添加巡检项
    onAdd() {
      this.$drawer({
        component: () => <DrawerAddInspectionItem operation={'add'}
          data={this.itemData}
          onDone={this.init}
        />,
      });
    },
    // 引用巡检项
    onQuote() {
      this.$drawer({
        width: pxToPercentage(1280),
        component: () => <DrawerQuoteInspection data={this.itemData}
          onDone={this.init}
        />,
      });
    },
    async init() {
      this.queryData.parentId = this.itemData.parentId;
      this.queryData.parentType = this.itemData.parentType;
      try {
        this.tableLoading = true;
        const res = await InspectionApi.getCurrentInspectionConfig(this.queryData);
        this.tableData = res || [];
      } catch (err) {
        this.$notify({
          type: 'error',
          message: err,
        });
      } finally {
        this.tableLoading = false;
      }
    },
    onEdit(row) {
      Object.assign(row, { assetsTypeToName: this.itemData.assetsTypeToName, });
      this.$drawer({
        component: () => <DrawerAddInspectionItem operation={'edit'}
          data={row}
          onDone={this.init}
        />,
      });
    },
    onDel(row) {
      this.$confirm(`是否删除巡检项【${row.itemName}】`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await InspectionApi.delInspectionConfig(row.id);
          this.$notify({
            type: 'success',
            message: '删除成功!',
          });
          this.init();
        } catch (err) {
          this.$notify({
            type: 'error',
            message: err,
          });
        }
      }).catch(() => {
      });
    },
    changeEnable: debounce(async function (value, row) {
      row.isEnable = value;
      await InspectionApi.editInspectionConfig(row);
      this.init();
    }, 300),
  },
};
</script>

<style>

</style>
