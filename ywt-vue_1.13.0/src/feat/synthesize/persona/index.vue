<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-01 16:56:01
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-11 17:19:31
 * @Description: 人员画像
-->
<template>
  <el-container>
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="filteredColumns"
        :query-condition="queryCondition"
        :list-api="listApi"
      >
        <template slot="header">
          <el-row
            type="flex"
            align="middle"
            class="base-margin-left base-margin-top"
          >
            <el-col :span="4" class="base-margin-right">
              <el-input
                v-model="formData.name"
                size="mini"
                placeholder="姓名关键字"
                prefix-icon="el-icon-search"
              />
            </el-col>
            <el-col :span="3">
              <dic-select v-model="formData.education" dic-key="user_education" type="string" size="mini" placeholder="学历" class="base-margin-right" />
            </el-col>
            <el-col :span="3" class="base-margin-right">
              <el-input
                v-model="formData.position"
                size="mini"
                placeholder="职位"
                prefix-icon="el-icon-search"
              />
            </el-col>
            <el-col :span="3">
              <group-select v-model="formData.teamId" size="mini" class="base-margin-right" />
            </el-col>
            <el-col :span="3" class="base-margin-right">
              <el-input
                v-model="formData.specialties"
                size="mini"
                placeholder="技能关键字/词"
                prefix-icon="el-icon-search"
              />
            </el-col>
            <el-col :span="3">
              <dic-select v-model="formData.staging" type="string" size="mini" placeholder="人员分期" dic-key="personnel_staging" class="base-margin-right" />
            </el-col>
            <el-col :span="3">
              <pure-button label="查询" type="wire-frame" @click="onQuery" />
            </el-col>
            <el-col :span="3" class="align-right base-margin-right">
              <pure-button label="新建画像" @click="onCreatePersona" />
            </el-col>
          </el-row>
        </template>
        <template slot="indexColumn" slot-scope="scope">
          <el-popover
            v-if="scope.column.fixed"
            style="padding:0"
            popper-class="no-padding"
            placement="bottom-start"
            width="400"
            :offset="-16"
            :visible-arrow="false"
            trigger="click"
          >
            <el-tabs type="border-card">
              <el-tab-pane label="表头设置">
                <pure-draggable :data="columns" :has-checked="true" @change="onTableColumnChange" />
              </el-tab-pane>
            </el-tabs>
            <i slot="reference" class="el-icon-s-operation" />
          </el-popover>
          序号
        </template>
        <template slot="columns" slot-scope="{row,prop}">
          {{ row[prop] }}
        </template>
        <template slot="operationColumn" slot-scope="{row}">
          <pure-button label="预览" type="text" @click="onPreviewPersona(row.id)" />
          <pure-button label="编辑" type="text" @click="onUpdatePersona(row.id)" />
          <pure-button label="删除" type="text" @click="onDeletePersona(row.id)" />
        </template>
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import PersonaApi from './api';
import PureTable from '@/feat/component/pureTable';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect';
import PureDraggable from '@/components/draggable';
import PersonaInfoDrawer from './drawer/persona.vue';
import PersonaPreviewDialog from './dialog/preview.vue';
import GroupSelect from '@/feat/system/group/component/groupSelect';

export default {
  name: 'ZhRyhx',
  components: {
    PureTable,
    DicSelect,
    PureDraggable,
    GroupSelect,
  },
  data() {
    return {
      columns: [],
      listApi: PersonaApi.list,
      formData: {
        name: null,
        education: null,
        position: null,
        teamId: null,
        specialties: null,
        staging: null,
      },
      queryCondition: {
        name: null,
        education: null,
        position: null,
        teamId: null,
        specialties: null,
        staging: null,
      },
    };
  },
  computed: {
    personaTableColumn() {
      return this.$store.state.synthesizePersona.personaTableColumn;
    },
    filteredColumns() {
      return this.columns.filter(item => item.checked).map(item => {
        return item;
      });
    },
  },
  async created() {
    try {
      this.columns = this.personaTableColumn;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    // 表头设置变更
    async onTableColumnChange(newVal) {
      this.columns = newVal;
      this.$store.dispatch('synthesizePersona/UPDATE_PERSONA_TABLE_COLUMN', newVal);
    },
    async onQuery() {
      this.queryCondition = Object.assign({}, this.queryCondition, this.formData);
    },
    async onCreatePersona() {
      this.$drawer({
        width: '74.17%',
        component: () => <PersonaInfoDrawer operatorType='CREATE' onRefresh={this.onRefresh}/>,
      });
    },
    async onUpdatePersona(id) {
      this.$drawer({
        width: '74.17%',
        component: () => <PersonaInfoDrawer operatorType='UPDATE' id={id} onRefresh={this.onRefresh}/>,
      });
    },
    onRefresh() {
      this.$refs.pureTable.fetchData();
    },
    async onDeletePersona(id) {
      try {
        await this.$confirm('确认删除本条人员画像信息吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await PersonaApi.deleteBaseInfo(id);
        this.$refs.pureTable.fetchData();
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onPreviewPersona(id) {
      this.$dialog({
        'customClass': 'persona-preview-dialog',
        fullscreen: true,
        component: () => <PersonaPreviewDialog id={id}/>,
      });
    },
    onRetrievalChange() {},
  },
};
</script>

<style lang="scss" scoped>

</style>
