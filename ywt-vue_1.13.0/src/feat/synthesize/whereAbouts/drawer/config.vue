<template>
  <el-container>
    <el-header class="head" height="auto">
      <span>去向配置</span>
      <pure-button class="m-l-16" label="添加配置" type="wire-frame" @click="onAddConfig" />
    </el-header>
    <el-main>
      <el-form ref="form" :model="Form" size="mini" status-icon :show-message="false">

        <el-table :data="tableData" border stripe>
          <el-table-column
            prop="name"
            label="去向"
            width="450px"
            min-width="450px"
            max-width="450px"
          >
            <template #default="{row,$index}">
              <template v-if="row.isEdit">

                <el-form-item :prop="`table.${$index}.name`" :rules="{required: true, message: '请输入去向名称', trigger: 'blur'}">
                  <el-row :gutter="16">
                    <el-col :span="20">
                      <el-input v-model="row.name" :maxlength="10" placeholder="去向名称限10个字符" />
                    </el-col>
                    <el-col :span="4">
                      <el-color-picker v-model="row.colorCode" />
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>
              <template v-else>
                <Tag :color="row.colorCode">
                  {{ row.name }}
                </Tag>
              </template>

            </template>
          </el-table-column>
          <el-table-column prop="state" label="启用" align="center" width="100px">
            <template #default="{row,$index}">
              <el-switch
                v-model="row.state"
                :active-value="1"
                :inactive-value="0"
                @change="onChangeState(row,$index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="auto">
            <template #default="{row,$index}">
              <el-button v-if="row.isEdit" type="text" @click="onSave(row,$index)">
                保存
              </el-button>
              <el-button v-if="!row.isEdit" type="text" @click="onEdit(row,$index)">
                编辑
              </el-button>
              <el-button type="text" @click="onDelete(row,$index)">
                删除
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-form>

    </el-main>

  </el-container>
</template>

<script>
import WhereAboutsApi from '../api';
import Tag from '../component/tag';
export default {
  components: {
    Tag,
  },
  data() {
    return {
      tableData: [],

    };
  },
  computed: {
    Form() {
      return {
        table: this.tableData,
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const list = await WhereAboutsApi.getWhereAboutsList();
      this.tableData = list.map((item) => {
        return {
          ...item,
          isEdit: false,
        };
      });
    },
    async onChangeState(row, index) {
      const data = this.tableData[index];
      await WhereAboutsApi.savewhereAbouts(data);
      this.init();
    },
    onAddConfig() {
      this.tableData.push({
        // 编辑模式
        isEdit: true,
        // / 颜色编码
        colorCode: '',
        // / 去向名称
        name: '',
        // / 去向状态 1启用 0禁用
        state: 1,
      });
    },
    onSave(row, index) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = this.tableData[index];
          await WhereAboutsApi.savewhereAbouts(data);
          this.$emit('reload');
          this.init();
          //
        } else {
          this.$message.warning('请完善表单信息');
        }
      });
    },
    onEdit(row, index) {
      this.tableData[index].isEdit = true;
    },
    async onDelete(row, index) {
      if (row.isEdit) {
        this.tableData.splice(index, 1);
      } else {
        await WhereAboutsApi.deleteWhereAbouts(row.id);
        this.$emit('reload');

        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.head{
  padding: 8px 0 ;
}
.m-l-16{
  margin-left: 16px;
}
</style>
