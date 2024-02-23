<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-29 11:03:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-05 18:26:44
 * @Description:故障信息面板
-->
<template>
  <pure-card class="max-height">
    <div slot="header">故障信息
      <span class="createUser">建单人:
        <span />
      </span>
    </div>

  </pure-card>
</template>

<script>
export default {
  name: 'FaultInfoPanel',
  props: {
    operatorType: {
      type: String,
      default: 'CREATE',
    },
  },
  data() {
    return {
      formData: {
        createUser: '谐波',
        createTime: '2021-12-29 11:03:02',
        source: 1,
        faultType: 1,
        faultRemark: '故障描述',
        detailInfo: '故障详情',
        reqTime: 2,
        completeTime: '2021-12-29 11:03:02',
        degree: 1,
        rangeType: 1,
        responseType: 1,
        appointment: '2021-12-29 11:03:02',
        enclosure: [],
      },
      // 指派人员信息
      selectedSendEngineer: { name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      },
      rules: {
        faultType: [
          { required: true, message: '请选择故障分类', trigger: 'change', }
        ],
        faultRemark: [
          { required: true, message: '请输入故障描述', trigger: 'blur', }
        ],

        completeTime: [{
          required: false, trigger: 'change', message: '请选择完成时间',
        }],
        appointment: [
          {
            required: true, message: '请选择预约时间', trigger: 'change',
          }
        ],
      },
    };
  },
  created() {
    console.log(this.$options.name);
    console.log(this.operatorType);
    console.log(this.formData);
  },
};
</script>

<style lang="scss" scoped>

</style>
