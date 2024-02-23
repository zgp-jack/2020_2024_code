/**
* @file index.vue.vue
* @author huang
* @date 2023/8/17
* @description 数据字典
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
            selection
            @selection-change="handleSelectionChange"
          >
            <template #header>
              <query-panel
                @query="onQuery"
                @reset="onReset"
              >
                <el-form-item>
                  <el-input
                    v-model="queryData.dictName"
                    placeholder="字典名称"
                    prefix-icon="el-icon-search"
                  />
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="queryData.dictType"
                    placeholder="字典类型"
                    prefix-icon="el-icon-search"
                  />
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="queryData.status"
                    placeholder="状态"
                  >
                    <el-option
                      label="启用"
                      value="0"
                    />
                    <el-option
                      label="停用"
                      value="1"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    v-model="queryData.time"
                    format="yyyy-MM-dd"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="创建开始日期"
                    end-placeholder="创建结束日期"
                    @change="datePicker"
                  />
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="queryData.dictLevel"
                    placeholder="层级"
                  >
                    <el-option
                      :value="0"
                      label="单层"
                    />
                    <el-option
                      :value="1"
                      label="多层"
                    />
                  </el-select>

                </el-form-item>
                <template #extra>
                  <pure-button
                    v-auth="'system:dict:add'"
                    icon="add"
                    label="新增"
                    @click="onAdd"
                  />
                  <pure-button
                    v-auth="'system:dict:remove'"
                    :disabled="multiple"
                    icon="delete"
                    label="删除"
                    @click="handleDelete"
                  />
                  <pure-button
                    v-auth="'system:dict:refresh'"
                    icon="reset"
                    label="刷新缓存"
                    @click="handleRefreshCache"
                  />
                </template>
                <template #rightExtra>
                  <el-radio-group
                    v-model="type"
                    @change="changeRadio"
                  >
                    <el-radio-button :label="0">
                      系统级
                    </el-radio-button>
                    <el-radio-button :label="1">
                      用户级
                    </el-radio-button>
                  </el-radio-group>
                </template>
              </query-panel>

            </template>

            <el-table-column
              label="字典编码"
              prop="dictId"
            />
            <el-table-column
              label="名称"
              prop="dictName"
            />
            <el-table-column
              label="字典类型"
              prop=""
            >
              <template #default="{row}">
                <span>{{ row.dictType }}</span>
              </template>
            </el-table-column>
            <el-table-column
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
              label="备注"
              prop="remark"
            />
            <el-table-column
              label="创建时间"
              prop="createTime"
            />
            <el-table-column
              label="层级"
              prop="dictLevel"
            >
              <template #default="{row}">
                <!--        0单层,1多层-->
                {{ formatDictLevel(row.dictLevel) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{row}">
                <pure-button
                  v-auth="'system:dict:edit'"
                  label="编辑"
                  size="small"
                  type="text"
                  @click="onEdit(row)"
                />
                <pure-button
                  v-auth="'system:dict:list'"
                  label="字典列表"
                  size="small"
                  type="text"
                  @click="onDictData(row)"
                />
                <pure-button
                  v-auth="'system:dict:remove'"
                  label="删除"
                  size="small"
                  type="text"
                  text-color="warning"
                  @click="handleDelete(row)"
                />
              </template>
            </el-table-column>

          </pure-table>
          <custom-drawer
            size="65%"
            :wrapper-closable="false"
            :title="dictDataDialogTitle"
            :visible.sync="showDictDataDialog"
            @closed="onSelectDictDataClosed"
          >
            <DictDataList ref="dictDataListRef" :current-data="currentData" />
            <template v-slot:footer>
              <pure-button type="patch" label="关闭" @click="showDictDataDialog = false" />
            </template>
          </custom-drawer>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import SystemDataDictionaryApi from './api';
import NewDicDialog from './dialog/newDic.vue';
import DictDataList from './data.vue';
import { DICT_STATUS, } from './config';

export default {
  components: { DictDataList, QueryPanel, },
  data() {
    return {
      listApi: SystemDataDictionaryApi.getDictionaryList,
      DICT_STATUS,
      multiple: true,
      ids: [],
      type: 0,
      visible: false,
      drawerVisible: false,
      row: null,
      queryCondition: {
        dictBelong: 0,
      },
      dictBelong: 0,
      queryData: {
        dictName: '',
        dictType: '',
        dictLevel: '',
        status: '',
      },
      dictDataDialogTitle: '字典列表',
      showDictDataDialog: false,
      currentData: {},
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    datePicker(val) {
      if (val) {
        this.queryData.createStartTime = val[0] || '';
        this.queryData.createEndTime = val[1] || '';
      } else {
        this.queryData.createEndTime = '';
        this.queryData.createStartTime = '';
      }
    },
    formatDictLevel(dictLevel) {
      if (dictLevel === 0) {
        return '单层';
      }
      if (dictLevel === 1) {
        return '多层';
      }
      return '-';
    },
    initData() {
      this.$refs.pureTable.fetchData();
    },
    onQuery() {
      this.queryCondition = {
        dictBelong: this.dictBelong,
        ...this.queryData,
      };
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    onReset() {
      this.queryData = {
        dictName: '',
        dictType: '',
        dictLevel: '',
        status: '',
        createTime: '',
      };
      this.onQuery();
    },
    // 新增按钮操作
    onAdd() {
      this.$dialog({
        component: () => <NewDicDialog title={'新增字典类型'} onDone={this.onDone}/>,
      });
    },
    // 新增完成后刷新列表
    onDone() {
      this.$refs.pureTable.fetchData();
    },
    // 编辑按钮操作
    onEdit(row) {
      this.$dialog({
        component: () => <NewDicDialog data={row}
          title={'修改字典类型'}
          onDone={this.onDone}
        />,
      });
    },
    /* 字典列表 */
    onDictData(row) {
      this.showDictDataDialog = true;
      this.currentData = { ...row, };
    },
    /* 按钮切换 */
    changeRadio(val) {
      this.dictBelong = val;
      this.onQuery();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(async () => {
        await SystemDataDictionaryApi.deleteDictionary(dictIds).then(() => {
          this.$message.success('删除成功');
          this.onDone();
        }).catch((err) => {
          this.$message.error(err);
        });
      }).catch(() => {
      });
    },

    /** 刷新缓存按钮操作 */
    async handleRefreshCache() {
      await SystemDataDictionaryApi.refreshDictionary();
      this.initData();
      this.$message.success('刷新成功');
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId);
      this.multiple = !selection.length;
    },
    onSelectDictDataClosed() {
      this.$refs.dictDataListRef.reset();
    },
  },

};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.link-type {
  @include font_color_imp('color-primary');
}
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
  padding: 10px;
  background: #fff;
}
</style>
