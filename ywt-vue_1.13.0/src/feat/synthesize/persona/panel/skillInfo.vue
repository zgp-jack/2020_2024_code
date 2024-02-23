<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-03 14:46:31
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:13
 * @Description: 人员画像技能分布面板
-->
<template>
  <div>
    <div class="header">
      <span class="title">技能分布</span>
      <pure-button :disabled="!personaId" label="添加技能信息" @click="onCreateSkill" />
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
            @click="onUpdateSkill(row)"
          />
          <pure-button
            type="text"
            label="删除"
            @click="onDeleteSkill(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PersonaApi from '../api.js';
import SkillDialog from '../dialog/skill.vue';
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
          label: '技能信息',
          prop: 'specialtie',
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
    onCreateSkill() {
      const data = {
        personnelId: this.personaId,
      };
      this.$dialog({
        width: '688px',
        title: '新增技能信息',
        component: () => <SkillDialog data={data} onDone={this.fetchData}/>,
      });
    },
    onUpdateSkill(row) {
      this.$dialog({
        width: '688px',
        title: '编辑技能信息',
        component: () => <SkillDialog data={row} onDone={this.fetchData}/>,
      });
    },
    async onDeleteSkill(id) {
      try {
        await this.$confirm('确认删除本条技能信息吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await PersonaApi.deleteSkillInfo(id);
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
      this.list = await PersonaApi.skillInfoList(this.personaId);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
