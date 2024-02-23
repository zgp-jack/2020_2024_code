/**
* @file data.vue
* @author huang
* @date 2023/8/22
* @description 字典数据
* @projectName
* @email newflyhuang@gmail.com
*/
<template>
  <el-container>
    <el-main class="main">
      <div class="table-layout-container">
        <div class="content-box">
          <pure-table
            ref="pureTable"
            :hide-index="true"
            :list-api="listApi"
            :query-condition="queryCondition"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            row-key="dictCode"
            selection
            @selection-change="handleSelectionChange"
          >
            <template #header>
              <query-panel
                @query="handleQuery"
                @reset="resetQuery"
              >
                <el-form-item prop="dictType">
                  <el-select
                    v-model="queryCondition.dictType"
                    @change="changeType"
                  >
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.dictId"
                      :label="item.dictName"
                      :value="item.dictType"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="dictLabel">
                  <el-input
                    v-model="queryCondition.dictLabel"
                    clearable
                    placeholder="请输入字典标签"
                  />
                </el-form-item>
                <el-form-item prop="status">
                  <el-select
                    v-model="queryCondition.status"
                    clearable
                    placeholder="数据状态"
                  >
                    <el-option :value="0" label="启用" />
                    <el-option :value="1" label="停用" />
                  </el-select>
                </el-form-item>
                <template #extra>
                  <pure-button
                    v-auth="'system:dict:data:add'"
                    icon="add"
                    label="新增"
                    plain
                    @click="handleAdd"
                  />
                  <pure-button
                    v-auth="'system:dict:data:remove'"
                    :disabled="multiple"
                    icon="delete"
                    label="删除"
                    @click="handleDelete"
                  />
                </template>
              </query-panel>
            </template>
            <el-table-column
              align="center"
              label="字典编码"
              prop="dictCode"
            />
            <el-table-column
              align="center"
              label="字典标签"
              prop="dictLabel"
            />
            <el-table-column
              align="center"
              label="字典键值"
              prop="dictValue"
            />
            <el-table-column
              align="center"
              label="字典排序"
              prop="dictSort"
            />
            <el-table-column
              align="center"
              label="状态"
              prop="status"
            >

              <template #default="{row}">
                <pure-type-text
                  :config="DICT_STATUS"
                  :type="row.status"
                />
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              label="备注"
              prop="remark"
            />
            <el-table-column
              align="center"
              label="创建时间"
              prop="createTime"
              width="180"
            />
            <el-table-column
              align="center"
              class-name="small-padding fixed-width"
              label="操作"
            >
              <template slot-scope="scope">
                <pure-button
                  v-auth="'system:dict:data:edit'"
                  label="编辑"
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                />
                <pure-button
                  v-auth="'system:dict:data:remove'"
                  icon="el-icon-delete"
                  label="删除"
                  type="text"
                  text-color="warning"
                  @click="handleDelete(scope.row)"
                />
              </template>
            </el-table-column>
          </pure-table>
          <custom-drawer
            size="45%"
            :wrapper-closable="false"
            :append-to-body="true"
            :title="dialogTitle"
            :visible.sync="showAddEditDialog"
            @closed="onDialogClosed"
          >
            <DialogAddDicData
              ref="addDicDataRef"
              :current-data="addEditData"
              :operate-type="operateType"
            />
            <template v-slot:footer>
              <div>
                <pure-button label="保存" @click="onSaveData" />
                <pure-button label="取消" type="patch" @click="showAddEditDialog = false" />
              </div>
            </template>
          </custom-drawer>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SystemDataDictionaryApi from './api';
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DialogAddDicData from './dialog/addDicData.vue';
import { convertToTree, } from '@/common/utils/convert';
import { DICT_STATUS, } from './config';

export default {
  name: 'Data',
  components: { DialogAddDicData, QueryPanel, },
  props: {
    currentData: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      DICT_STATUS,
      listApi: SystemDataDictionaryApi.getDictionaryDataList,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 默认字典类型
      defaultDictType: '',
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryCondition: {
        dictName: undefined,
        status: undefined,
        dictType: undefined,
      },
      dicInfo: null,
      operateType: 'add', // 新增数据字典
      addEditData: {},
      showAddEditDialog: false,
      currentType: {}, // 当前切换数据
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        add: '新增数据字典',
        edit: '编辑数据字典',
      };
      return titles[this.operateType];
    },
  },
  watch: {
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.dicInfo = { ...newVal, };
          this.getType();
          this.getTypeList();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$refs.pureTable.convertListData = this.convertListData;
  },
  methods: {
    convertListData(data) {
      return convertToTree(data, {
        id: 'dictCode',
        parentId: 'parentId',
        children: 'children',
      });
    },
    /** 查询字典类型详细 */
    getType() {
      if (this.dicInfo) {
        const dictType = this.dicInfo.dictType;
        this.defaultDictType = dictType;
        this.currentType.dictType = dictType;
        this.currentType.dictLevel = this.dicInfo.dictLevel;
        this.queryCondition.dictType = dictType;
        this.$nextTick(() => {
          this.$refs.pureTable.fetchData();
        });
      }
    },
    initList() {
      this.$refs.pureTable.fetchData();
    },
    /** 查询字典类型列表 */
    async getTypeList() {
      const rs = await SystemDataDictionaryApi.getDictionaryTypeList();
      this.typeOptions = rs;
    },
    // 字典类型选中事件
    changeType(value) {
      this.queryCondition.dictType = value;
      const findVal = this.typeOptions.find(item => item.dictType === value);
      if (findVal) {
        this.currentType.dictType = findVal.dictType;
        this.currentType.dictLevel = findVal.dictLevel;
      }
      this.queryCondition = {
        ...this.queryCondition,
      };
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    // 查询重置
    reset() {
      this.queryCondition = {};
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryCondition = {
        dictLabel: '',
        dictType: this.defaultDictType,
        status: '',
      };
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode);
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.operateType = 'add';
      this.addEditData = {
        dictType: this.currentType.dictType,
        dictLevel: this.currentType.dictLevel,
        status: '0',
      };
      this.showAddEditDialog = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.operateType = 'edit';
      this.addEditData = {
        dictType: this.currentType.dictType,
        dictLevel: this.currentType.dictLevel,
        ...row,
      };
      this.showAddEditDialog = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids;
      this.$confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项？').then(async () => {
        await SystemDataDictionaryApi.deleteDictionaryData(dictCodes);
        this.initList();
        this.$notify.success('删除成功');
      }).catch(() => {
      });
    },
    onDialogClosed() {
      this.$refs.addDicDataRef.reset();
    },
    onSaveData() {
      const { valid, data, } = this.$refs.addDicDataRef.validate();
      if (valid) {
        const request = this.operateType === 'edit' ? SystemDataDictionaryApi.updateDictionaryData : SystemDataDictionaryApi.addDictionaryDetail;
        request(data)
          .then(() => {
            this.$notify.success('操作成功');
            this.initList();
            this.showAddEditDialog = false;
          }).catch((err) => {
            this.$notify.error(err);
          });
      } else {
        this.$notify.error('请正确填写');
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.table-layout-container{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
}

.content-box {
  height: 100%;
  flex: auto;
  display: flex;
  background: #fff;
}
</style>
