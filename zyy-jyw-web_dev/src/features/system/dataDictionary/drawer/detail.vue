/**
* @file detail.vue
* @author huang
* @date 2023/8/18
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-container>
    <el-header>
      故障分类
    </el-header>
    <el-main>
      <el-form ref="form" :model="table">
        <el-table
          ref="pureTable"
          :data="table.data"
          :hide-index="true"
          :query-condition="queryData"
          :show-pagination="false"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          default-expand-all
          row-key="dictCode"
        >
          <template #header>
            <pure-button icon="add" label="添加选项" />
          </template>

          <el-table-column label="选项" prop="dictLabel">
            <template #default="{row,$index}">
              <template v-if="row.editMode">
                <el-form-item
                  :prop="'data.'+$index+'.dictLabel'"
                  :rules="{
                    required: true,
                    message: '内容不能为空',
                    trigger: 'change'
                  }"
                >
                  <el-input v-model="row.dictLabel" />
                </el-form-item>
              </template>
              <template v-else>
                {{ row.dictLabel }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="启停" prop="status">
            <template #default="{row}">
              <el-form-item>
                <el-switch v-model="row.status" active-value="0" inactive-value="1" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row,$index}">
              <el-button size="small" type="text" @click="onEdit(row)">编辑</el-button>
              <el-button size="small" type="text" @click="onDel(row)">删除</el-button>
              <el-button size="small" type="text" @click="onAddChild(row,$index)">添加子项</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

    </el-main>
    <el-footer>
      <pure-button label="取消" @click="onCancel" />
      <pure-button label="提交" @click="submit" />
    </el-footer>

    <el-dialog :visible.sync="visible">
      <dialog-add-content :data="addValue" />
    </el-dialog>

  </el-container>

</template>

<script>
import SystemDataDictionaryApi from '../api';
import DialogAddContent from '../dialog/addDicData.vue';
import { map, } from 'lodash';

export default {
  components: {
    DialogAddContent,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: false,
      table: {
        data: [],
      },

      queryData: {},
      addValue: {
        createBy: '',
        createTime: '',
        // * 样式属性（其他样式扩展）
        cssClass: '',
        // * 字典编码
        dictCode: '',
        // * 字典标签
        dictLabel: '',
        // * 字典排序
        dictSort: '',
        // * 字典类型
        dictType: '',
        // * 字典键值
        dictValue: '',
        // * 是否默认（Y是 N否）
        isDefault: '',
        // * 表格字典样式
        listClass: '',
        params: '',
        // * 上级Id
        parentId: '',
        remark: '',
        // * 状态（0正常 1停用）
        status: '0',
        updateBy: '',
        updateTime: '',
      },
    };
  },
  watch: {},
  created() {
    this.queryData = this.data;
  },
  mounted() {
    this.init();
    // this.$refs.pureTable.convertListData = (list) => {
    //   const arr = map(list, (item) => {
    //     return {
    //       ...item,
    //       editMode: false,
    //     };
    //   });
    //   return arr;
    // };
  },
  methods: {
    fn(row, index) {
      console.log(row, index);
    },
    // 提交
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await SystemDataDictionaryApi.updateDictionaryDetail(this.table.data);
        }
      });
    },
    // 初始化
    async init() {
      const res = await SystemDataDictionaryApi.getDictionaryDetail(this.data);
      const arr = map(res.rows, (item) => {
        return {
          ...item,
          editMode: false,
        };
      });
      this.table.data = arr;
      console.log(res, 'res');
    },
    // 编辑
    onEdit(row) {
      console.log(row, 'row');
      row.editMode = true;
    },
    onDel(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    onAddChild(row, index) {
      this.addValue.parentId = row.dictCode;
      this.visible = true;
      // if (this.table.data[index]?.children) {
      //   this.table.data['children'].push(this.addValue);
      // } else {
      //   this.$set(this.table.data[index], 'children', []);
      //
      //   // this.table.data[index].children.push(this.addValue);
      //   this.table.data[index]['hasChildren'] = true;
      //   this.table.data.push(this.addValue);
      //   console.log(this.table.data[index]);
      // }
    },

    onCancel() {

    },
  },
};
</script>

<style lang="scss" scoped>

</style>
