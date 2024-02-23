<!-- 巡检信息 -->
<template>
  <el-card
    shadow="never"
    :body-style="{overflow:'unset'}"
    :class="{'disabled':isdisabled}"
  >
    <div slot="header">
      <el-row class="title-row" type="flex" align="middle">
        <el-col :span="3">巡检信息</el-col>
        <el-col :span="4">
          巡检人:
          <span>{{ Inspector }}</span>
        </el-col>
        <el-col :span="17">
          巡检时间:
          <span>{{ InspectTime }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="seeInspectionDialog-from">
      <el-form label-width="70px">
        <div style="display:flex;">
          <el-form-item label="巡检结果">
            <el-select
              v-model="result"
              :filterable="true"
              :disabled="isdisabled"
              size="mini"
              placeholder="请选择"
              clearable
              @change="EventpatrolStatus"
            >
              <el-option
                v-for="item in patrolStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="result == 2" label="异常处理办法" label-width="100px">
            <el-radio-group v-model="handle" text-color="#000" fill="#000">
              <el-radio label="1">限期改整</el-radio>
              <el-radio label="2">转工单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="handle == 1 && result == 2" label="整改时间">
            <el-date-picker
              v-model="rectificationTime"
              size="mini"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </div>
        <el-form-item label="详细说明">
          <el-input
            v-model="explain"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="过程照片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog>
            <img :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
      </el-form>
    </div>
    <div class="seeInspectionDialog-table">
      <div>
        <span>巡检内容</span>
        <span style="color:#ccc;">巡检设备：{{ equipment }}</span>
      </div>
      <el-table
        v-if="!isdisabled"
        :data="seetableData"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          width="62px"
        />
        <el-table-column
          v-for="(item, index) in tablecolumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width+44"
          align="left"
        >
          <template slot-scope="prop">
            <el-select
              v-if="item.prop === 'actual'&&prop.row.isNum === false"
              v-model="prop.row.actualValue"
              :filterable="true"
              style="padding:0;"
              size="mini"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="i in patrolStatus"
                :key="i.value"
                :label="i.label"
                :value="i.value"
              />
            </el-select>
            <el-input-number
              v-else-if="item.prop === 'actual'&&prop.row.isNum === true"
              v-model="prop.row.actualNum"
              size="mini"
              style="padding:0;width:100%;"
              controls-position="right"
              :min="1"
              :max="100"
            />
            <el-select
              v-else-if="item.prop === 'result'"
              v-model="prop.row.resultValue"
              :filterable="true"
              style="padding:0;"
              size="mini"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="i in patrolStatus"
                :key="i.value"
                :label="i.label"
                :value="i.value"
              />
            </el-select>
            <el-input
              v-else-if="item.prop === 'opinion'"
              v-model="prop.row.opinionValue"
              size="mini"
              style="padding:0;width:100%;"
            />
            <span v-else>
              {{ prop.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        :data="seetableData"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          width="60px"
        />
        <el-table-column
          v-for="(item, index) in tablecolumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          align="left"
        />
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'isdisabled'
  ],
  data() {
    return {
      tablecolumn: null,
      seetableData: [
        {
          classification: '电脑',
          resultValue: null,
          actualValue: null,
          actualNum: null,
          isNum: false,
          opinionValue: null,
        },
        {
          classification: '电脑',
          resultValue: null,
          actualValue: null,
          actualNum: null,
          isNum: true,
          opinionValue: null,
        }
      ],
      result: null,
      Inspector: '张三',
      InspectTime: '2021-06-01 00:00:00',
      rectificationTime: null,
      explain: '',
      dialogImageUrl: '',
      equipment: '联想电脑',
      patrolStatus: [{
        value: '1',
        label: '正常',
      }, {
        value: '2',
        label: '异常',
      }],
      handle: null,
      disabled: true,
    };
  },
  computed: {
    inspectionContents() {
      return this.$store.state['inspection/center'].inspectionContents;
    },
  },
  created() {
    this.tablecolumn = this.inspectionContents;
    this.$emit('isProcessingFlow', this.handle);
  },
  mounted() {
  },
  methods: {
    EventpatrolStatus(e) {
      this.result = e;
    },
  },

};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item {
  padding: 0 16px 0 0;
}
.el-card ::v-deep .el-card__header {
  padding: 0;
}
.el-card ::v-deep .el-card__body {
  padding: 20px;
}
.el-card {
  overflow: unset;
}
.disabled {
  background: #f7f7f7;
  pointer-events: none;
  ::v-deep .el-radio{
    color: #ccc;
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #000 !important;
}
/* 选中后小圆点的颜色 */
.is-checked  ::v-deep .el-radio__inner {
  background: #000 !important;
  border-color: #000 !important;
}
}
.title-row {
  height: 32px;
  background: #d7e5f9;
  border-radius: 4px 4px 0 0;
  padding: 6px 12px 6px 20px;
  :nth-child(1) {
    font-size: 14px;
    font-weight: 500;
    color: #2d405e;
  }
  :nth-child(2), :nth-child(3){
    font-size: 12px;
    font-weight: 500;
    color: #879bba;
    span {
      opacity: 1;
      font-size: 12px;
      font-weight: 400;
      color: #2d405e;
    }
  }
}
.seeInspectionDialog-from{
  padding:0 0 0 20px;
}
::v-deep .el-radio{
  margin-right: 10px;
}
.seeInspectionDialog-table{
  border-top: 1px solid #ccc;
  padding-top:20px;
  div{
    padding-bottom: 20px;
      font-size: 16px;
    span{
      margin-right: 30px;
    }
  }
  .el-table{
    padding: 0;
    ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 1px;
}
// 滚动条的滑块
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #D7E5F9;
  border-radius: 3px;
}
  }
}
::v-deep .el-table td div{
  text-align: center;
}
</style>
