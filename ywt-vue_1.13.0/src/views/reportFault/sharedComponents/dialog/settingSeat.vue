<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-10 15:24:36
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-23 17:17:16
 * @Description:
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="formData"

      :rules="rules"
      label-position="right"
      label-width="128px"
      size="mini"
    >
      <el-form-item label="坐席设定">
        <el-radio-group v-model="formData.zuoxisheding">
          <el-radio :label="1">人工坐席</el-radio>
          <el-radio :label="2" disabled>自动坐席</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="formData.zuoxisheding===1">
        <el-form-item label="上下线设置">
          <el-switch
            v-model="formData.shangxianxiaxian"
            active-text="上线"
            inactive-text="下线"
          />
        </el-form-item>
        <el-form-item label="选择分机号" prop="type">
          <el-checkbox-group v-model="formData.type">
            <el-checkbox
              v-for="item in phoneList"
              :key="item.phone"
              :label="item.remark"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="当前上线人">
          <span class="current-online">{{ onlineList }}</span>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="派单设置">
          <el-radio-group v-model="formData.paidanshezhi" style="display:inline-grid">
            <el-radio :label="1">按排班表排班

              <span style="color:#909399;margin-left:10px">当前值班人:张三</span>
            </el-radio>
            <el-radio
              :label="2"
              style="margin-top:10px;padding-right:10px"
            >选择工程师
              <el-form-item
                prop="gongchengshi"
                label-width="0px"
                style="display:inline-block"
                :required="false"
              >
                <engineer-select
                  v-model="formData.gongchengshi"
                  placeholder="请选择工程师"

                  :disabled="formData.paidanshezhi===1"
                  style="width:160px;margin-left:5px"
                />
              </el-form-item>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <el-row>
      <el-col style="text-align:right">
        <el-button size="mini" type="primary" @click="submit"> 提交 </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import engineerSelect from '../select/engineerSelect.vue';
import {
  mapGetters,
} from 'vuex';
import CallCenterApi from '@/apis/reportFault/callCenter';
export default {
  name: 'SettingSeatDialog',
  components: { engineerSelect, },

  data() {
    return {
      // 分机号列表
      phoneList: [],
      formData: {
        zuoxisheding: 1,
        shangxianxiaxian: true,
        paidanshezhi: 1,
        gongchengshi: null,
        type: [],
      },
      // 当前上线人信息
      currentOnlineList: null,
    };
  },
  computed: {
    ...mapGetters({ userInfo: 'userInfo',
      onlineList: 'onlineList',
      selfOnlinePhoneList: 'phoneList', }),
    rules: function () {
      return {
        gongchengshi: [
          { required: this.formData.paidanshezhi === 2, message: '请选择工程师', trigger: 'change', }
        ],
        type: [
          { type: 'array', required: true, message: '请选择分机号', trigger: 'change', }
        ],
      };
    },
  },
  async mounted() {
    await this.getPhoneList();
    this.formData.type = this.selfOnlinePhoneList;
    this.$nextTick(() => {
      this.$refs['form'].clearValidate();
    });
  },
  methods: {
    // 获取分机列表数据
    async getPhoneList() {
      try {
        const data = await CallCenterApi.extensionList();
        this.phoneList = data;
      } catch (error) {
        console.log(error);
      }
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.formData.shangxianxiaxian) {
            this.$store.state['reportFault/callCenter'].ws.send({ code: 16, data: this.formData.type, });
          } else {
            this.$store.state['reportFault/callCenter'].ws.send({ code: 16, data: [], });
          }
          this.$emit('done');
        } else {
          console.log('验证失败');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.current-online {
  font-size: 18px;
}
</style>
