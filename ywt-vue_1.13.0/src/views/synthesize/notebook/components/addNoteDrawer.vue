<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-07 14:47:22
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-19 13:41:07
 * @FilePath: \ywt-vue-qp\src\views\synthesize\notebook\components\addNoteDrawer.vue
 * @Description: 新增/编辑待办事项弹窗
-->

<template>
  <div>
    <div class="title">{{ title }}</div>
    <div class="container">
      <div class="header">事项详情</div>
      <el-form
        ref="form"
        :model="FormData"
        label-width="110px"
        size="mini"
        label-position="right"
        :rules="rules"
        class="el-form-box"
      >
        <el-form-item prop="name" label="事项名称" label-width="140px">
          <el-input v-model="FormData.name" type="textarea" />
        </el-form-item>
        <el-form-item label="重要紧急程度" label-width="140px">
          <el-radio-group v-model="FormData.importantUrgent" class="q-radio">
            <el-radio :label="1" class="radio1 clear-style" style="color:#4574E6" @click.native.prevent="onClick(1)">重要且不紧急</el-radio>
            <el-radio :label="2" class="radio2 clear-style" style="color:#E6A23C" @click.native.prevent="onClick(2)">不重要且紧急</el-radio>
            <el-radio :label="3" class="radio3 clear-style" style="color:#F56C6C" @click.native.prevent="onClick(3)">重要且紧急</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="date-time-box">
          <el-form-item label="截止日期" label-width="140px">
            <el-date-picker
              v-model="FormData.endDate"
              style="width:100%"
              type="date"
              placeholder="选择截止日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="截止时间" label-width="140px">
            <el-time-picker
              v-model="FormData.endTime"
              format="HH:mm"
              style="width:100%"
              placeholder="请先选择截止日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="!FormData.endDate"
              @change="changeTime"
            />
          </el-form-item>
        </div>
        <el-form-item label="所属项目/任务" label-width="140px">
          <el-cascader
            ref="cascader"
            :key="cascaderKey"
            v-model="FormData.workId"
            filterable
            clearable
            placeholder="请选择子任务"
            class="w-100"
            :options="workList"
            :props="workCascaderProps"
            @change="onWorkCascaderChange"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" size="mini" @click="onSave">保存</el-button>
  </div>
</template>
<script>
import NotebookApi from '@/apis/notebook';
export default {
  name: 'AddNoteDrawer',
  components: {
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    itemCodeList: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      FormData: {
        id: '',
        name: '',
        importantUrgent: 0,
        endDate: '',
        endTime: '',
        itemCode: '',
        // 子任务Id
        workId: null,
      },
      // 项目所属子任务列表
      workList: [],
      workCascaderProps: {
        children: 'child',
        label: 'name',
        value: 'id',
        checkStrictly: true,
        emitPath: false,
      },
      rules: {
        name: [{
          required: true, message: '请输入项目名称', trigger: 'blur',
        }],
      },
      // 此值是为了解决el-cascader 设置为show-all-levels=false时，activePath未被清空导致的‘Cannot read properties of null (reading 'level')'错误
      cascaderKey: 0,
    };
  },
  computed: {
  },
  watch: {
    'FormData.endDate': {
      handler(newVal, oldVal) {
        if (!newVal) this.FormData.endTime = '';
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.fetchWorkListOfProject();
  },
  mounted() {
    if (this.title === '编辑事项') {
      const { name, endDate, endTime, itemCode, id, workId, importantUrgent, } = this.row;
      let workIdOrItemCode = '';
      // 有所属任务 回显所属任务 没有则 回显所属项目
      !workId ? workIdOrItemCode = `${itemCode}` : workIdOrItemCode = `${workId}`;
      let EndTime;
      endDate && endTime ? EndTime = `${endDate} ${endTime}` : EndTime = ''; // 兼容处理后台null
      this.FormData = { name, endDate, endTime: EndTime, itemCode, id, workId: workIdOrItemCode, importantUrgent, };
    }
  },
  methods: {
    onClick(val) {
      this.FormData.importantUrgent = this.FormData.importantUrgent === val ? 0 : val;
    },
    changeTime(v) {
      console.log(v);
    },
    onProjectChange() {
      this.cascaderKey++;
      this.workList = [];
      this.FormData.workId = null;
    },
    async fetchWorkListOfProject(itemCode) {
      const data = await NotebookApi.workListOfProject(itemCode);
      this.workList = this.removeNullChildren(data);
    },
    removeNullChildren(data) {
      return data.map(item => {
        if (item.child && item.child.length > 0) {
          this.removeNullChildren(item.child);
        } else {
          delete item.child;
        }
        return item;
      });
    },
    async onSave() {
      await this.$refs.form.validate();
      this.getProjectListData();
    },
    funRecursion(list, id) {
      for (const i in list) {
        if (list[i].id === id) {
          return [list[i].id];
        }
        if (list[i].child) {
          const node = this.funRecursion(list[i].child, id);
          if (node !== undefined) {
            return node.concat(list[i].id);
          }
        }
      }
    },
    onWorkCascaderChange(v) {
      if (!v) {
        this.FormData.itemCode = '';
      } else {
        let allIds = [];
        allIds = this.funRecursion(this.workList, v).reverse();
        allIds.length ? this.FormData.itemCode = allIds[0] : '';
        if (this.workCascaderProps.checkStrictly) {
          this.$refs.cascader.dropDownVisible = false;
        }
      }
    },
    // 新增或编辑备忘录
    getProjectListData() {
      // 后台无法接收接口返回的null 判断为null 改为‘’
      !this.FormData.endDate ? this.FormData.endDate = '' : '';
      !this.FormData.endTime ? this.FormData.endTime = '' : '';
      !this.FormData.itemCode ? this.FormData.itemCode = '' : '';
      NotebookApi.saveOrUpdate(this.FormData).then(res => {
        this.$emit('done');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title{
  font-weight: 500;
  font-size: 20px;
  color: #334266;
  letter-spacing: 0;
  line-height: 20px;
}
.container{
  margin: 12px 0 16px 0;
  background: #FFFFFF;
  height: auto;
  border: 1px solid #ececec;
  border-radius: 0 0 4px 4px;
  .header{
    height: 34px;
    line-height: 34px;
    background: #E2E3E7;
    padding-left: 16px;
    font-weight: 400;
    font-size: 18px;
    color: #334266;
    border-radius: 4px 4px 0 0;
  }
  .el-form-box{
    padding: 16px;
    .date-time-box{
      display: flex;
      justify-content: space-between;
    }
  }
}
.q-radio{
  ::v-deep.el-radio__inner {
    border-radius: 2px;
  }
  ::v-deep.el-radio__input.is-checked .el-radio__inner::after {
    content: "";
    width: 10px;
    height: 5px;
    border: 1px solid white;
    border-top: transparent;
    border-right: transparent;
    text-align: center;
    display: block;
    position: absolute;
    top: 3px;
    left: 3px;
    transform: rotate(-45deg);
    border-radius: 0px;
    background: none;
  }
  /* 选中后的字体颜色 */
  ::v-deep.radio1 .el-radio__input.is-checked + .el-radio__label {
    color: #4574E6 !important;
  }
  ::v-deep.radio2 .el-radio__input.is-checked + .el-radio__label {
    color: #E6A23C !important;
  }
  ::v-deep.radio3 .el-radio__input.is-checked + .el-radio__label {
    color: #F56C6C !important;
  }
  /* 选中后小圆点的颜色 */
  ::v-deep.el-radio__input.is-checked .el-radio__inner {
    background: #426ED7 !important;
    border-color: #426ED7 !important;
  }
  ::v-deep.clear-style .el-radio__inner {
    background: #FFFFFF !important;
    border-color: #DCDFE6 !important;
    box-shadow:none !important;
  }
}

</style>

