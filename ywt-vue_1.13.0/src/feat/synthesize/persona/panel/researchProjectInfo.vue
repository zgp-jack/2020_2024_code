<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-03 15:01:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:10
 * @Description: 人员画像科研课题面板
-->
<template>
  <div>
    <div class="header">
      <span class="title">科研课题情况</span>
      <pure-button :disabled="!personaId" label="添加课题情况" @click="onCreateResearchProject" />
    </div>

    <el-table
      :data="list"
      border
    >
      <el-table-column
        label="序号"
        align="left"
        type="index"
        width="85px"
        fixed
      />
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :fixed="item.fixed"
        align="left"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="left" width="270" fixed="right">
        <template slot-scope="{row}">
          <pure-button
            type="text"
            label="编辑"
            @click="onUpdateResearchProject(row)"
          />
          <pure-button
            type="text"
            label="删除"
            @click="onDeleteResearchProject(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PersonaApi from '../api.js';
import ResearchProjectDialog from '../dialog/researchProject.vue';
export default {
  props: {
    // 人员画像id
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      tableColumn: [
        {
          label: '开始时间',
          prop: 'startDate',
          width: '130px',
        },
        {
          label: '结束时间',
          prop: 'endDate',
          width: '130px',
        },
        {
          label: '课题名称',
          prop: 'title',
          width: '242',
        },
        {
          label: '主导部门',
          prop: 'deptName',
          width: '242',
        },
        {
          label: '负责人',
          prop: 'principal',
          width: '242',
        },
        {
          label: '参与人',
          prop: 'participant',
          width: '200',
        },
        {
          label: '课题级别',
          prop: 'topicLevelToName',
          width: '200',
        },
        {
          label: '是否成功',
          prop: 'successStateToName',
          width: '200',
        }
      ],
      list: [],
      // 临时人员画像id,由baseInfo新建后更新
      tempPersonaId: null,
    };
  },
  computed: {
    personaId() {
      return this.id || this.tempPersonaId;
    },
  },
  created() {
    if (this.personaId) {
      this.fetchData();
    }
  },
  methods: {
    onCreateResearchProject() {
      const data = {
        personnelId: this.personaId,
      };
      this.$dialog({
        width: '688px',
        title: '新增科研课题',
        component: () => <ResearchProjectDialog data={data} onDone={this.fetchData}/>,
      });
    },
    onUpdateResearchProject(row) {
      this.$dialog({
        width: '688px',
        title: '编辑科研课题',
        component: () => <ResearchProjectDialog data={row} onDone={this.fetchData}/>,
      });
    },
    async onDeleteResearchProject(id) {
      try {
        await this.$confirm('确认删除本条科研课题记录吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await PersonaApi.deleteResearchProjectInfo(id);
        this.fetchData();
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async fetchData() {
      this.list = await PersonaApi.researchProjectInfoList(this.personaId);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
