<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-14 09:46:41
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-15 02:00:07
 * @Description:字典维护
-->
<template>
  <el-container>
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="columns"
        :query-condition="queryCondition"
        :list-api="listApi"
        :operation-column-width="160"
      >
        <template slot="header">
          <el-form
            size="mini"
            :inline="true"
            :model="formData"
            class="base-margin-left base-margin-top"
          >
            <el-form-item label="">
              <el-input v-model="formData.dictName" placeholder="字典名" />
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="formData.authority">
                <el-option :value="null" label="所有级别" />
                <el-option :value="1" label="可编辑" />
                <el-option :value="2" label="仅查看" /></el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="formData.type">
                <el-option :value="null" label="所有层级" />
                <el-option :value="0" label="单层" />
                <el-option :value="1" label="多层" />
              </el-select>
            </el-form-item>
            <el-form-item><el-button type="primary" @click="onQuery">查询</el-button></el-form-item>
            <el-form-item><el-button type="text" class="gray-btn" @click="onClear">清空查询条件</el-button></el-form-item>
          </el-form>
        </template>
        <template slot="indexColumn">

          序号
        </template>
        <template slot="columns" slot-scope="{row,prop}">
          <span v-if="prop==='name'&&row.authority===2">
            <el-tag size="mini" type="info" class="tag">系统</el-tag>{{ row[prop] }}
          </span>
          <span v-else>
            {{ row[prop] }}
          </span>

        </template>
        <template slot="operationColumn" slot-scope="{row}">
          <pure-button
            v-if="row.authority===1"
            type="text"
            label="配置"
            @click="onConfig(row)"
          />
          <pure-button
            v-if="row.authority===2"
            type="text"
            label="查看"
            @click="onView(row)"
          />
          <pure-button
            type="text"
            label="编辑名称"
            @click="onEditName(row)"
          />
        </template>
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import DictionaryApi from './api';
import ViewDrawer from './drawer/view.vue';
import UpdateDrawer from './drawer/update.vue';
import EditNameDialog from './dialog/editName.vue';
import PureTable from '@/feat/component/pureTable';
export default {
  name: 'XtglZdwh',
  components: {
    PureTable,
  },
  data() {
    return {
      listApi: DictionaryApi.list,
      columns: [{
        name: '字典名',
        label: '字典名 ',
        prop: 'name',
        id: 1,
        order: 1,
        checked: true,
        align: 'left',
      },
      {
        name: '层级',
        label: '层级',
        prop: 'typeToName',
        id: 1,
        order: 1,
        checked: true,
        width: 120,
      }

      ],
      formData: {
        authority: null,
        type: null,
        dictName: null,
      },
      queryCondition: {
        authority: null,
        type: null,
        dictName: null,

      },
    };
  },
  methods: {
    onQuery() {
      this.queryCondition.authority = this.formData.authority;
      this.queryCondition.type = this.formData.type;
      this.queryCondition.dictName = this.formData.dictName;
    },
    onClear() {
      this.formData.authority = null;
      this.formData.type = null;
      this.formData.dictName = null;
    },
    onConfig(row) {
      this.$drawer({
        width: '1424px',
        component: () => <UpdateDrawer id={row.id} type={row.type}/>,
      });
    },
    onView(row) {
      this.$drawer({
        width: '1424px',
        component: () => <ViewDrawer id={row.id}/>,
      });
    },
    onEditName(row) {
      this.$dialog({
        title: '编辑名称',
        width: '576px',
        component: () => <EditNameDialog onDone={this.fetchData} id={row.id} name={row.name} />,
      });
    },
    fetchData() {
      this.$refs.pureTable.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
.gray-btn {
  color:#C0C4CC
}
.tag {
    background-color: #F0F2F5;
    color: rgba(26,33,51,0.65);
}
</style>
