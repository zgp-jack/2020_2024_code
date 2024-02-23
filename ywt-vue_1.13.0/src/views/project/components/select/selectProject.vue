
<!--  -->
<template>
  <el-input v-if="allDisabled" v-model="valueModel" data-flag="no" :disabled="allDisabled" />
  <el-popover v-else v-model="visible" :placement="'bottom'" width="600">
    <el-input slot="reference" v-model="valueModel" readonly data-flag="yes" :placeholder="placeholder" :clearable="true" @clear="clearProject" />
    <el-row class="search-row">
      <el-col :span="24" class="t-r">
        <pure-button label="清空所选项目" size="mini" @click="clearProject" />
      </el-col>
    </el-row>
    <el-row class="search-row">
      <el-col :span="24">
        <el-input v-model="SW.keyWord" placeholder="搜索项目" clearable />
      </el-col>

    </el-row>
    <el-container>
      <el-main>
        <el-table :data="result.list" height="300px" border>
          <el-table-column align="left" type="index" width="85px" label="序号" />
          <el-table-column align="left" prop="title" width="auto" label="项目名称" />
          <el-table-column align="left" width="80px" label="操作">
            <template #default="{row}">
              <el-button type="text" size="medium" @click="clickChoose(row)">
                选择
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-main>
      <el-footer class="footer-tag">
        <el-pagination
          :current-page="result.pageNum"
          :page-size="result.pageSize"
          :total="result.total"
          layout="total,sizes,prev,pager,next,jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </el-footer>
    </el-container>
  </el-popover>

</template>

<script>
import ProjectAPI from '@/apis/project';
import _ from 'lodash';
export default {
  name: 'SelectProject',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    valueType: {
      type: [String],
      default: 'value',
    },
    disabled: Boolean,
    placeholder: {
      type: [String],
      default: '项目',
    },
  },
  // 获取 el-form 原生的disabled 状态
  inject: {
    elForm: {
      default: '',
    },
  },
  data() {
    return {
      gridData: [],
      SW: {
        W: {
          code: 'quote',
        },
        keyWord: '',
        P: 1,
        N: 10,
      },
      result: {
        list: [],
      },
      valueModel: '',
      visible: false,
      isOnceDefaultVal: false,
    };
  },
  computed: {
    allDisabled() {
      return this.disabled || (this.elForm || {}).disabled || false;
    },
  },
  watch: {
    value(n, o) {
      if (n === '') {
        this.valueModel = '';
      }
      if (n) {
        if (!this.isOnceDefaultVal) {
          this.renderDefaultValue();
        }
      }
    },
    SW: {
      handler: _.debounce(function () {
        this.getAllProject();
      }, 300),
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getAllProject();
    });
  },
  methods: {

    clearProject() {
      this.$emit('input', '');
    },
    clickChoose(row) {
      this.isOnceDefaultVal = true;
      this.valueModel = row.title;
      if (this.isValueType()) {
        this.$emit('input', row.id);
      } else {
        this.$emit('input', row.itemCode);
      }
      this.visible = false;
    },
    async getAllProject() {
      if (this.allDisabled) {
        return;
      }
      this.result = await ProjectAPI.setUp.getListData({
        pageNum: this.SW.P,
        pageSize: this.SW.N,
        code: this.SW.W.code,
        query: this.SW.keyWord,
      });
    },
    async renderDefaultValue() {
      if (!this.value) {
        return;
      }
      const sw = {
        keyWord: '',
        W: {
          code: 'all',
          id: this.value,
          itemCode: this.value,
        },
        P: 1,
        N: 1,
      };
      const result = (await ProjectAPI.setUp.getListData({
        pageNum: sw.P,
        pageSize: sw.N,
        code: sw.W.code,
        id: this.isValueType() ? sw.W.id : '',
        query: this.isValueType() ? '' : sw.W.itemCode,
      })).list[0] || {};
      this.valueModel = result.title;
      this.isOnceDefaultVal = true;
    },
    sizeChange(n) {
      this.SW.N = n;
    },
    isValueType() {
      return this.valueType === 'value';
    },
    currentChange(p) {
      this.SW.P = p;
    },
  },

};
</script>
<style lang="scss" scoped>
.search-row{
  // display: flex;
  // align-items: center;
  margin-bottom: 16px;
}
.t-r{
  text-align: right;
}
.footer-tag{
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
