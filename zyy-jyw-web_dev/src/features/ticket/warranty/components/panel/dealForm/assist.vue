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
    <el-form-item prop="assistRemark">
      <span slot="label">
        协作说明
        <el-tooltip
          class="item"
          effect="dark"
          content="填写“协作说明”，可让协作人更快了解协作情况"
          placement="top"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </span>
      <el-input
        v-model="formData.assistRemark"
        placeholder="请输入协作说明"
        type="textarea"
        show-word-limit
        :rows="4"
        maxlength="1000"
      />
    </el-form-item>
    <el-form-item>
      <span slot="label">
        公共附件
        <el-tooltip
          class="item"
          effect="dark"
          content="公共附件所有协作人都可见"
          placement="top"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </span>
      <el-col :span="22" style="padding-left: 0px;">
        <upload v-model="formData.assistEnclosure" />
      </el-col>
    </el-form-item>
    <template v-for="(k, index) in formData.assistList">
      <div :key="index" class="card__item_box">
        <div class="card__item">
          <div class="card__header">协作人{{ index+1 }}
            <el-button v-if="index!==0" class="card__item-btn" icon="el-icon-delete" circle @click.prevent="handleDeleteAssist(index)" />
          </div>
          <el-form-item
            :ref="index+'user'"
            label="协作人"
            :prop="'assistList.'+index+'.name'"
            :rules="{ required: true, message: '请选择协作人', trigger: 'blur' }"
          >
            <el-input
              :ref="'sendUserInput'+index"
              v-model="k.name"
              style="width: auto"
              @focus="handleOpenAssistEngineerPanel(index)"
            />
          </el-form-item>
          <el-form-item
            label="协作事务"
            :prop="'assistList.'+index+'.content'"
            :rules="[{ required: true, message: '请输入协作事务' }]"
          >
            <el-input
              v-model="k.content"
              type="textarea"
              placeholder="请输入协作事务"
              :rows="4"
              show-word-limit
              maxlength="1000"
            />
          </el-form-item>
          <el-form-item label="上传附件">
            <el-col :span="22" style="padding-left: 0px;">
              <upload v-model="k.assistEnclosure" />
            </el-col>
          </el-form-item>
        </div>
      </div>

    </template>
    <div class="bottom-btn-box">
      <el-button
        icon="el-icon-plus"
        class="bottom-btn"
        @click="onAddAssist()"
      >添加协作人</el-button>
    </div>
  </el-form>
</template>

<script>
import TicketApi from '@/features/ticket/api';
import EngineerMultiSelectDrawer from '@/features/system/user/drawer/multiUser.vue';
import EngineerPanelSingle from '@/features/system/user/drawer/user.vue';
import {
  mapGetters,
} from 'vuex';
import moment from 'moment';
export default {
  name: 'Assist',
  components: {
    Upload: () => import('@/common/components/upload'),
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
        assist: [],
        requiredDealTime: false,
        createTime: null,
        assistRemark: null,
        assistEnclosure: [],
        assistList: [],
      },
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
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
      if (!this.formData.assistList.length) {
        throw new Error('至少添加一项协助项');
      }
      const assist = this.formData.assistList.map(item => {
        const data = {};
        data.content = item.content;
        data.assistEnclosure = item.assistEnclosure || [];
        if (item.isTeam) {
          data.sendObjId = item.teamId;
          data.sendObjType = 2;
        } else {
          data.sendObjId = item.engineerId;
          data.sendObjType = 1;
          data.sendTeam = item.teamId || null;
        }
        return data;
      });
      await TicketApi.assist({
        ticketId,
        assistList: assist,
        assistEnclosure: this.formData.assistEnclosure,
        assistRemark: this.formData.assistRemark,
        makeTime: this.formData.createTime,
      });
    },
    onSelectedMultiEngineer(data) {
      console.log(data);
      data.forEach((item) => {
        this.formData.assistList.push({ ...item, content: '', });
      });
    },
    async handleOpenAssistEngineerPanel(index) {
      this.$refs['sendUserInput' + index][0].blur();
      this.currentAssistIndex = index;
      const defaultSelectedData = this.formData.assist[index];
      this.$drawer({
        width: '688px',
        component: () => <EngineerPanelSingle onDone={this.handleAssistSelectedEngineer} defaultSelectedData={defaultSelectedData} disabledEngineer={[
          this.userInfo.id,
        ]}/>,
      });
    },
    async handleAssistSelectedEngineer(data) {
      this.$refs['sendUserInput' + this.currentAssistIndex][0].blur();
      this.formData.assistList[this.currentAssistIndex] = Object.assign(this.formData.assistList[this.currentAssistIndex], data);
      this.$refs.form.validate();
    },
    onAddAssist() {
      this.$drawer({
        width: '688px',
        onSelectedMultiEngineer(data) {},
        component: () => <EngineerMultiSelectDrawer onDone={this.onSelectedMultiEngineer}/>,
      });
    },
    handleDeleteAssist(index) {
      this.formData.assistList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
.card__header {
  display: flex;
  align-items: center;
  height: 47px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  @include font_color_imp('color-assist-gray');
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  padding: 0  0 0 16px;
  &::before {
    content: '';
    width: 5px;
    height: 50%;
    margin-right: 6px;
    top: 0;
    left: 0;
    @include background_color_imp('color-primary');
  }
}
.card__item-btn{
  margin:auto 0 auto auto;
}
.card__item_box{
  padding: 10px 0px 10px 30px;
  border-radius: 5px;
}
.card__item{
  padding: 0 20px;
  border: 1px solid #dddddd;
}
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
.bottom-btn-box{
  width: 100%;
  text-align: center;
  padding: 10px 0 14px 0;
}
.bottom-btn{
  @include font_color_imp('color-primary');
  @include border_color_imp('color-primary')
}
</style>
