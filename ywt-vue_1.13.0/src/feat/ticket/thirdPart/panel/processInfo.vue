<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-30 10:04:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 15:28:01
 * @Description:
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand" v-bind="$attrs">
    <div slot="header">
      处理信息
      <span
        v-if="formData.sendUser"
        class="makeUser"
      >处理人:
        <span>{{ formData.sendUser }}</span>
      </span>
      <span
        class="makeUser"
      >
        完成时间
        <span>{{ formData.completeTime }}</span>
      </span>
    </div>
    <div slot="subHeader">
      <span v-if="formData.responseTime" class="responseTime">
        响应时长：
        <span>{{ formData.responseTime }}小时</span>
      </span>
      <span v-if="formData.makeTime" class="makeTime">
        处理时长：
        <span>{{ formData.makeTime }}小时</span>
      </span>
      <span v-if="formData.realTime" class="totalTime">
        总时长：
        <span>{{
          formData.realTime
        }}小时</span>
      </span>
    </div>
    <el-form
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
    >

      <el-row>
        <el-col :span="12">
          <el-form-item label="处理方式">
            <el-input v-model="formData.dealMethod" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备现状">
            <el-input v-model="formData.equipmentStatus" placeholder="" />
          </el-form-item>
        </el-col>
        <el-form-item label="故障原因">
          <el-input v-model="formData.reason" placeholder="" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="事件原因">
          <el-input v-model="formData.eventReason" placeholder="" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="处理方法">
          <el-input v-model="formData.makeWay" placeholder="" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="处理描述">
          <el-input v-model="formData.dealDesc" placeholder="" type="textarea" :rows="4" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="维修费用">
              <el-input v-model="formData.cost" placeholder="" style="width: 80%" />
              <span class="unit">元</span>
            </el-form-item>
          </el-col>
        </el-row>

      </el-row>

    </el-form>

  </pure-card>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: function () {
        return {};
      },
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        // 处理人
        sendUser: null,
        // 完成时间
        completeTime: null,
        // 响应时长
        responseTime: null,
        // 处理时长
        makeTime: null,
        // 总时长
        realTime: null,
        // 处理方式
        dealMethod: null,
        // 设备现状
        equipmentStatus: null,
        // 故障原因
        reason: null,
        // 事件原因
        eventReason: null,
        // 处理方法
        makeWay: null,
        // 处理描述
        dealDesc: null,
        // 维修费用
        cost: null,
      },
    };
  },
  watch: {
    info: {
      handler(val) {
        this.formData = Object.assign({}, val);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.makeUser,
.responseTime,
.makeTime,
.totalTime {
  color: #879bba;
  font-size: $--pure-little-font-size;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
.makeUser {
  padding-left: 36px;
}
.responseTime,
.makeTime {
  padding-right: 38px;
}
.tip {
  text-align: center;
  font-size: $--pure-base-font-size;
  color: #2d405e;
}
</style>
