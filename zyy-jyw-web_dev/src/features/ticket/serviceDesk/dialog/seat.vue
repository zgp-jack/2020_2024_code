<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-18 15:09:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-16 18:10:38
 * @Description:坐席设定弹窗
-->
<template>
  <dialog-template>
    <template #title>
      坐席设定
    </template>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="138px"
      size="mini"
    >
      <el-form-item label="坐席设定">
        <el-radio-group v-model="formData.seatType">
          <el-radio :label="1">人工坐席</el-radio>
          <!-- <el-radio :label="2" disabled>自动坐席</el-radio> -->
          <!-- <el-radio :label="3">呼叫转移</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <div v-if="formData.seatType===1" key="seatType1">
        <el-form-item label="上下线设置">
          <el-switch
            v-model="formData.onlineStatus"
            active-text="上线"
            active-value="online"
            inactive-text="下线"
            inactive-value="offline"
            @change="onlineStatusChange"
          />
        </el-form-item>
        <el-form-item label="选择分机号" prop="extensions">
          <el-checkbox-group v-model="formData.extensions">
            <el-checkbox
              v-for="item in extensionList"
              :key="item.phone"
              :label="item.remark"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="当前上线人">
          <span class="current-online">{{ onlineList }}</span>
        </el-form-item>
      </div>
      <div v-else-if="formData.seatType===2" key="seatType2">
        <!-- <el-form-item label="派单设置">
          <el-radio-group v-model="formData.deliveryType" style="display:inline-grid">
            <el-radio :label="1">按排班表排班
              <span style="color:#909399;margin-left:10px">当前值班人:张三</span>
            </el-radio>
            <el-radio
              :label="2"
              style="margin-top:10px;padding-right:10px"
            >选择工程师
              <el-form-item
                prop="engineer"
                label-width="0px"
                style="display:inline-block"
                :required="false"
              >
                <engineer-select
                  v-model="formData.engineer"
                  placeholder="请选择工程师"
                  :disabled="formData.deliveryType===1"
                  style="width:160px;margin-left:5px"
                />
              </el-form-item>
            </el-radio>
          </el-radio-group>
        </el-form-item> -->
      </div>
      <div v-else key="seatType3">
        <el-form-item label="呼叫转移号码" prop="phone">
          <el-input v-model="formData.phone" style="width:200px" />
        </el-form-item>
        <el-form-item label="呼叫转移开关">
          <el-switch
            v-model="formData.divertStatus"
            active-text="开启"
            :active-value="1"
            inactive-text="关闭"
            :inactive-value="0"
          />
        </el-form-item>
        <el-divider />
        <el-form-item label="微信报修通知">
          <el-switch
            v-model="formData.wechatTicketNotifyToggle"
            active-text="开启"
            :active-value="1"
            inactive-text="关闭"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="通知人员" prop="engineersNeedToNotify">
          <el-input v-model="formData.engineersNeedToNotify" />
          <!-- <user-select v-model="formData.engineersNeedToNotify" multiple /> -->
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <pure-button label="提交" @click="onSubmit" />

    </template>

  </dialog-template>
</template>

<script>
import DialogTemplate from '@/common/components/dialog/template.vue';
import ServiceDeskApi from '../api';
// import EngineerSelect from '@/features/system/user/drawer/user.vue';
// import UserSelect from '@/features/system/user/drawer/user.vue';
import * as Regex from '@/common/utils/regex';
import { mapState, } from 'vuex';
export default {
  name: 'SeatSettingDialog',
  components: {
    DialogTemplate,
    // EngineerSelect,
    // UserSelect,
  },
  props: {
    // 当前设置的坐席类型
    currentSeatType: {
      type: String,
      default: null,
    },
    // 已设置的坐席类型相关数据
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      // 分机号列表
      extensionList: [],
      formData: {
        // 坐席设定类型
        seatType: 1,
        // 坐席上下线状态 online上线 offline下线
        onlineStatus: 'online',
        // 派单设置类型 1按排班表排班 2选择工程师
        deliveryType: 1,
        engineer: null,
        // 分机号列表
        extensions: [],
        // 呼叫转移号码
        phone: null,
        // 呼叫转移开关
        divertStatus: 0,
        // 微信报修通知开关
        wechatTicketNotifyToggle: 0,
        // 需要通知的人员
        engineersNeedToNotify: '',
      },
    };
  },
  computed: {
    ...mapState('TICKET_SERVICE_DESK', {
      userInfo: 'userInfo',
      onlineList: 'onlineList',
      selfOnlinePhoneList: 'phoneList',
    }),
    rules: function () {
      return {
        engineer: [
          { required: this.formData.deliveryType === 2, message: '请选择工程师', trigger: 'change', },
        ],
        extensions: [
          { type: 'array', required: true, message: '请选择分机号', trigger: 'change', },
        ],
        phone: [
          { type: 'string', required: this.formData.divertStatus === 1, message: '请输入手机号', trigger: 'blur', },
          { pattern: Regex.phone, message: '请输入有效手机号码', trigger: 'blur', },
        ],
        engineersNeedToNotify: [
          {
            type: 'string', required: this.formData.wechatTicketNotifyToggle === 1, message: '请选择通知人员', trigger: 'change',
          },
        ],
      };
    },
  },
  async mounted() {
    if (this.currentSeatType === 'ARTIFICIAL_SEAT') { // 人工坐席
      this.formData.seatType = 1;
      await this.fetchCurrentDutyWatchman();
    } else if (this.currentSeatType === 'CALL_DIVERT') { // 呼叫转移
      this.formData.seatType = 3;

      // 通过呼叫转移号码回显呼叫转移设置
      if (!this.data.callDivertPhone) {
        this.formData.divertStatus = 0;
      } else {
        this.formData.divertStatus = 1;
        this.formData.phone = this.data.callDivertPhone;
      }
      // 通过是否有通知人员回显微信报修通知设置
      if (!this.data.engineersNeedToNotify) {
        this.formData.wechatTicketNotifyToggle = 0;
        // await this.fetchCurrentDutyWatchman();
      } else {
        this.formData.wechatTicketNotifyToggle = 1;
        this.formData.engineersNeedToNotify = this.data.engineersNeedToNotify;
      }
    }
    await this.getPhoneList();

    this.formData.extensions = this.selfOnlinePhoneList || [];
    this.$nextTick(() => {
      this.$refs['form']?.clearValidate();
    });
  },
  methods: {
    // 获取分机列表数据
    async getPhoneList() {
      try {
        const data = await ServiceDeskApi.extensionList();
        this.extensionList = data;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取当前值班人员
    async fetchCurrentDutyWatchman() {
      try {
        const data = await ServiceDeskApi.receptionList();
        this.formData.engineersNeedToNotify = data.map(item => {
          return item.id;
        }).join(',');
      } catch (error) {
        console.log(error);
      }
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        switch (this.formData.seatType) {
          case 1:
            this.setArtificialSeat();
            break;
          case 3:
            this.setCallDivert(this.formData.phone, this.formData.engineersNeedToNotify);
            break;
        }
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    // 设置人工坐席
    setArtificialSeat() {
      if (this.formData.onlineStatus === 'online') {
        this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 16, data: this.formData.extensions, });
      } else {
        this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 16, data: [], });
      }
    },
    /**
     * 设置呼叫转移
     * @param {String} phone 呼叫转移的手机号
     */
    setCallDivert(phone, engineersNeedToNotify) {
      if (this.formData.divertStatus === 1) {
        this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 18, data: phone, });
      } else {
        this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 18, data: '', });
      }
      if (this.formData.wechatTicketNotifyToggle === 1) {
        this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 19, data: engineersNeedToNotify, });
      } else {
        this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 19, data: '', });
      }
    },
    onlineStatusChange(val) {
      if (val === 'offline' && this.selfOnlinePhoneList.length === 0) {
        this.$message.warning('当前账号未上线坐席，请先执行人工坐席上线操作');
        this.formData.onlineStatus = 'online';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.current-online {
  font-size: 18px;
}
</style>
