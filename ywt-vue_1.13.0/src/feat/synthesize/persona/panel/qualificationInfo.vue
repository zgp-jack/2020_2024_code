<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-03 14:45:04
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:08
 * @Description: 人员画像学历信息面板
-->
<template>
  <div>
    <div class="header">
      <span class="title">学历信息</span>
      <pure-button :disabled="!personaId" label="添加学历信息" @click="onCreateQualification" />
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
            @click="onUpdateQualification(row)"
          />
          <pure-button
            type="text"
            label="删除"
            @click="onDeleteQualification(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PersonaApi from '../api.js';
import QualificationDialog from '../dialog/qualification.vue';
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
          label: '学校',
          prop: 'school',
          width: '200',
        },
        {
          label: '专业',
          prop: 'major',
          width: '200',
        },
        {
          label: '学历',
          prop: 'educationToName',
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
    onCreateQualification() {
      const data = {
        personnelId: this.personaId,
      };
      this.$dialog({
        width: '688px',
        title: '新增学历信息',
        component: () => <QualificationDialog data={data} onDone={this.fetchData}/>,
      });
    },
    onUpdateQualification(row) {
      this.$dialog({
        width: '688px',
        title: '编辑学历信息',
        component: () => <QualificationDialog data={row} onDone={this.fetchData}/>,
      });
    },
    async onDeleteQualification(id) {
      try {
        await this.$confirm('确认删除本条学历信息吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await PersonaApi.deleteQualificationInfo(id);
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
      this.list = await PersonaApi.qualificationInfoList(this.personaId);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
