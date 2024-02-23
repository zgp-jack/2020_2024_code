<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-03 14:59:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:18
 * @Description: 人员画像工作经历面板
-->
<template>
  <div>
    <div class="header">
      <span class="title">工作经历</span>
      <pure-button :disabled="!personaId" label="添加工作经历" @click="onCreateWorkExperience" />
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
            @click="onUpdateWorkExperience(row)"
          />
          <pure-button
            type="text"
            label="删除"
            @click="onDeleteWorkExperience(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PersonaApi from '../api.js';
import WorkExperienceDialog from '../dialog/workExperience.vue';
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
        },
        {
          label: '结束时间',
          prop: 'endDate',
        },
        {
          label: '单位名称',
          prop: 'companyName',
          width: '200',
        },
        {
          label: '部门',
          prop: 'dept',
          width: '200',
        },
        {
          label: '岗位',
          prop: 'station',
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
    onCreateWorkExperience() {
      const data = {
        personnelId: this.personaId,
      };
      this.$dialog({
        width: '688px',
        title: '新增工作经历',
        component: () => <WorkExperienceDialog data={data} onDone={this.fetchData}/>,
      });
    },
    onUpdateWorkExperience(row) {
      this.$dialog({
        width: '688px',
        title: '编辑工作经历',
        component: () => <WorkExperienceDialog data={row} onDone={this.fetchData}/>,
      });
    },
    async onDeleteWorkExperience(id) {
      try {
        await this.$confirm('确认删除本条工作经历信息吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await PersonaApi.deleteWorkExperienceInfo(id);
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
      this.list = await PersonaApi.workExperienceInfoList(this.personaId);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
