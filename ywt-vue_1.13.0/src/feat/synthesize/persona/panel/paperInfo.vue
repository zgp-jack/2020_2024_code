<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-03 15:03:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:05
 * @Description: 人员画像论文发表面板
-->
<template>
  <div>
    <div class="header">
      <span class="title">论文发表情况</span>
      <pure-button :disabled="!personaId" label="添加论文发表" @click="onCreatePaper" />
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
            @click="onUpdatePaper(row)"
          />
          <pure-button
            type="text"
            label="删除"
            @click="onDeletePaper(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PersonaApi from '../api.js';
import PaperDialog from '../dialog/paper.vue';
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
          label: '发表时间',
          prop: 'publishDate',
          width: '130px',
        },
        {
          label: '论文名称',
          prop: 'title',
          width: '242',
        },
        {
          label: '发表平台',
          prop: 'platform',
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
    onCreatePaper() {
      const data = {
        personnelId: this.personaId,
      };
      this.$dialog({
        width: '688px',
        title: '新增论文发表',
        component: () => <PaperDialog data={data} onDone={this.fetchData}/>,
      });
    },
    onUpdatePaper(row) {
      this.$dialog({
        width: '688px',
        title: '编辑论文发表',
        component: () => <PaperDialog data={row} onDone={this.fetchData}/>,
      });
    },
    async onDeletePaper(id) {
      try {
        await this.$confirm('确认删除本条论文发表记录吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await PersonaApi.deletePaperInfo(id);
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
      this.list = await PersonaApi.paperInfoList(this.personaId);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
