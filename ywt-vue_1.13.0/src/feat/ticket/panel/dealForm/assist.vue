<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-25 18:52:53
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 15:22:41
 * @Description:多人协作
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
  >
    <el-form-item v-if="requiredDealTime" label="处理时间" required>
      <el-date-picker
        v-model="formData.createTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        align="right"
        :prefix-icon="'null'"
        :clear-icon="'null'"
        class="date-picker"
      />
    </el-form-item>
    <template v-for="(k, index) in formData.assist">
      <el-form-item :key="index" label-width="0px" class="form-item-wrapper">
        <el-col :span="9" class="no-padding">
          <el-form-item
            :ref="index+'user'"
            label="协作人"
            label-width="128px"
            :prop="'assist.'+index+'.name'"
            :rules="{ required: true, message: '请选择协作人', trigger: 'blur' }"
          >
            <!-- <el-input v-model="k.user" /> -->
            <el-input
              :ref="'sendUserInput'+index"
              v-model="k.name"
              style="width: auto"
              @focus="handleOpenAssistEngineerPanel(index)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="协作事务"
            label-width="100px"
            :prop="'assist.'+index+'.content'"
            :rules="[{ required: true, message: '请输入协作事务' }]"
          >
            <el-input v-model="k.content" />

          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="formData.assist.length>1"
            style="margin-left:16px"
            @click="handleDeleteAssist(index)"
          >删除</el-button>
        </el-col>
      </el-form-item>
    </template>
    <el-form-item>
      <el-button
        @click="onAddAssist()"
      >添加协作</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import TicketApi from '@/feat/ticket/api';
import EngineerPanelSingle from '@/views/components/engineer/engineerPanel.vue';
import EngineerMultiSelectDrawer from '@/feat/system/user/drawer/engineerMultiSelect.vue';
import {
  mapGetters,
} from 'vuex';
import moment from 'moment';
export default {
  name: 'Assist',
  components: {

  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    requiredDealTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        // assist数据格式{ user: '', content: '', name: null, engineerId: null, isTeam: false, teamId: null, }
        assist: [],
        requiredDealTime: false,
        createTime: null,
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.onAddAssist();
  },
  mounted() {
    this.formData.createTime = this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    async onSubmit(ticketId) {
      await this.$refs.form.validate();
      if (!this.formData.assist.length) {
        throw new Error('至少添加一项协助项');
      }
      const assist = this.formData.assist.map(item => {
        if (item.isTeam) {
          return {
            content: item.content,
            sendTeam: item.teamId, };
        } else {
          return {
            content: item.content,
            sendUser: item.engineerId, };
        }
      });
      await TicketApi.assist({
        ticketId,
        assist: JSON.stringify(assist),
        makeTime: this.formData.createTime,
      });
    },
    onSelectedMultiEngineer(data) {
      console.log(data);
      data.forEach((item) => {
        this.formData.assist.push({ ...item, content: '', });
      });
    },
    async handleOpenAssistEngineerPanel(index) {
      this.$refs['sendUserInput' + index][0].blur();
      this.currentAssistIndex = index;
      const defaultSelectedData = this.formData.assist[index];
      this.$innerDrawer({
        width: '688px',
        component: () => <EngineerPanelSingle onDone={this.handleAssistSelectedEngineer} defaultSelectedData={defaultSelectedData} disabledEngineer={[this.userInfo.id]}/>,
      });
    },
    async handleAssistSelectedEngineer(data) {
      this.$refs['sendUserInput' + this.currentAssistIndex][0].blur();
      this.formData.assist[this.currentAssistIndex] = Object.assign(this.formData.assist[this.currentAssistIndex], data);
      this.$refs.form.validate();
    },
    onAddAssist() {
      this.$innerDrawer({
        width: '688px',
        onSelectedMultiEngineer(data) {},
        component: () => <EngineerMultiSelectDrawer onDone={this.onSelectedMultiEngineer}/>,
      });
    },
    handleDeleteAssist(index) {
      this.formData.assist.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-12 {
    padding:0;
  }
}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner {
    padding: 0 16px;
  }
}
</style>
