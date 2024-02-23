
<!--  -->
<template>
  <el-input v-if="allDisabled" v-model="valueModel" data-flag="no" :disabled="allDisabled" />
  <el-popover v-else v-model="visible" :placement="'bottom'" width="600">
    <el-input slot="reference" v-model="valueModel" readonly placeholder="会议室" data-flag="yes" :clearable="true" @clear="clearMeeting" />
    <el-row class="search-row">
      <el-col :span="24" class="t-r">
        <pure-button label="清空所选会议室" size="mini" @click="clearMeeting" />
      </el-col>
    </el-row>
    <el-row class="search-row">
      <el-col :span="24">
        <el-input v-model="SW.keyWord" placeholder="搜索会议" clearable />
      </el-col>

    </el-row>
    <el-container>
      <el-main>
        <el-table :data="result.list" height="300px" border>
          <!-- <el-table-column align="left" type="index" width="85px" label="序号" /> -->
          <el-table-column align="left" show-overflow-tooltip prop="name" width="120px" label="会议室名称" />
          <el-table-column align="left" show-overflow-tooltip prop="peopleNumber" width="auto" label="容纳人数" />
          <el-table-column align="left" show-overflow-tooltip prop="devices" width="auto" label="设备">
            <template #default="{row}">
              {{ row.devices | dicValueToKey('metting_device') }}
            </template>
          </el-table-column>
          <el-table-column align="left" show-overflow-tooltip prop="address" width="auto" label="地址" />

          <el-table-column align="left" width="80px" label="操作">
            <template #default="{row}">
              <el-button type="text" @click="clickChoose(row)">
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
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';

import _ from 'lodash';
export default {
  name: 'SelectMetting',
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
        this.getData();
      }, 300),
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {

    clearMeeting() {
      this.$emit('input', '');
      this.$emit('clear', {});
    },
    clickChoose(row) {
      this.isOnceDefaultVal = true;
      this.valueModel = row.name;
      this.$emit('input', row.id);
      this.$emit('info', row);
      this.visible = false;
    },
    async getData() {
      if (this.allDisabled) {
        return;
      }
      this.result = await MeetingMangementApi.enableOrReserve({
        pageNum: this.SW.P,
        pageSize: this.SW.N,
        name: this.SW.keyWord,
        // name: this.SW.W.code,
      });
    },
    async renderDefaultValue() {
      if (!this.value) {
        return;
      }
      const result = (await MeetingMangementApi.roomData({ id: this.value, }));
      this.valueModel = result.name;
      this.$emit('load', result);
      this.isOnceDefaultVal = true;
    },
    sizeChange(n) {
      this.SW.N = n;
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
