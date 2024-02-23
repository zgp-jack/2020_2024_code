<!--  -->
<template>
  <div>
    <el-row class="row-tag">
      <el-col :span="3">
        <h5>{{ text }}</h5>
      </el-col>
      <el-col v-if="btnText" :span="3">
        <el-button size="mini" type="primary" plain @click="addPlan">
          {{ btnText }}
        </el-button>
      </el-col>
      <el-col v-if="label" :span="10" :offset="8" class="label-wrapper">
        <label> {{ label }} </label>
        <el-select v-model="tep" size="mini" class="select-tag">
          <el-option v-for="v in 2" :key="v" :value="v" :label="v" />
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-table-row">
      <el-col :span="24">
        <el-form ref="form" :model="formData" size="mini" status-icon :show-message="false">
          <el-table
            :cell-style="tableStyle.cellStyle"
            :data="tableData"
            border
            size="mini"
          >
            <el-table-column
              v-for="(v, index) in tableColumnConfig"
              :key="index"
              :type="v.type"
              :label="v.label"
              :prop="v.prop"
              :width="v.width"
              align="left"
              :formatter="v.formatter"
              :column-key="v.prop"
            >
              <el-table-column
                v-for="item in v.children"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :formatter="item.formatter"
                align="left"
                label-class-name="label-class-name"
              />
              <template v-if="v.slot" #default="{ $index }">
                <el-button type="text" size="mini" @click="del($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';
import mixinsTable from '../../management/components/mixins/table.mixin';
import tableStyle from '@/views/project/style/table';
export default {
  name: 'TemplateTable',
  mixins: [mixinsTable],
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pushData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    text: {
      type: String,
      default: '付款计划',
    },
    btnText: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },

  },
  data() {
    return {
      tep: '',
      config: [],
      tableStyle,
      tableColumnConfig: [
        {
          type: 'index',
          label: '分期',
          width: '60px',
        },
        {
          prop: 'explan',
          label: '付款说明',
          width: this.optionsModel !== 'handle' ? '' : '300px',
          formatter: (row, column, cellValue, index) => {
            return this.memoTemplate(row, index);
          },
        },
        {
          prop: 'payRate',
          label: '付款比例',
          width: '130px',
          formatter: (row, column, cellValue, index) => {
            return this.billTemplate(row, index);
          },
        },
        {
          prop: 'plan',
          label: '计划付款日期',
          width: '350px',
          formatter: (row, column, cellValue, index) => {
            return this.planTemplate(row, index);
          },
        }, {
          slot: true,
          prop: 'options',
          label: '操作',
          width: '150px',
        }
      ],
    };
  },
  computed: {
    formData() {
      return {
        table: this.tableData,
      };
    },

    // 付款比例总数
    BillNum() {
      const nums = this.tableData.map(e => Number(e.payRate));
      const sum = _.sum(nums) || 0;
      return sum;
    },

  },
  mounted() {
  },
  methods: {
    clickOptions(code, r, i) {

    },
    del(i) {
      this.tableData.splice(i, 1);
    },
    onDone() {
    },
    addPlan() {
      // 此处需要 克隆 ，直接使用this.pushData 会修改pushData的值
      const pd = JSON.parse(JSON.stringify(this.pushData));
      this.tableData.push(pd);
    },
    // 校验 表单
    validateForm() {
      if (!this.tableData.length) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '模板付款计划数据为空',
          duration: 3000,
        });
        return;
      }
      if (this.BillNum > 100) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '付款比例总数不能大于「100%」',
          duration: 3000,
        });
        return;
      } else if (this.BillNum !== 100) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '分期付款总比例需等于「100%」',
          duration: 3000,
        });
        return;
      }

      let validate = false;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          validate = valid;
        }
      });
      return validate;
    },
  },
};
</script>
<style lang='scss' scoped>
.row-tag {
  display: flex;
  align-items: center;
  height: 50px;
  h5 {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #2d405e;
  }
  .label-wrapper {
    display: flex;
    align-items: center;
    label {
      font-size: 14px;
      font-weight: 400;
      display: inline-block;
      color: #879bba;
      margin-right: 5px;
      width: 20%;
    }
    .select-tag {
      flex: 1;
    }
  }
}
.form{
  &-table{
    &-row{
      ::v-deep .el-form-item__content{
        display: flex;
      }
      ::v-deep .el-form-item{
        margin:0
      }
    }
  }
}
</style>
