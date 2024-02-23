<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-03 15:00:27
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:02
 * @Description: 人员画像成长计划面板
-->
<template>
  <div>
    <div class="header">
      <span class="title">成长计划</span>
      <pure-button :disabled="!personaId" label="添加成长计划" @click="onCreateGrowthPlan" />
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
            @click="onUpdateGrowthPlan(row)"
          />
          <pure-button
            type="text"
            label="删除"
            @click="onDeleteGrowthPlan(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PersonaApi from '../api.js';
import GrowthPlanDialog from '../dialog/growthPlan.vue';
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
          label: '时间',
          prop: 'planDate',
        },
        {
          label: '计划内容',
          prop: 'content',
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
    onCreateGrowthPlan() {
      const data = {
        personnelId: this.personaId,
      };
      this.$dialog({
        width: '688px',
        title: '新增成长计划',
        component: () => <GrowthPlanDialog data={data} onDone={this.fetchData}/>,
      });
    },
    onUpdateGrowthPlan(row) {
      this.$dialog({
        width: '688px',
        title: '编辑成长计划',
        component: () => <GrowthPlanDialog data={row} onDone={this.fetchData}/>,
      });
    },
    async onDeleteGrowthPlan(id) {
      try {
        await this.$confirm('确认删除本条成长计划吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await PersonaApi.deleteGrowthPlanInfo(id);
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
      this.list = await PersonaApi.growthPlanInfoList(this.personaId);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
