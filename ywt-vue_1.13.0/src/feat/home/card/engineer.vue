<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-28 17:19:29
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-24 12:39:16
 * @FilePath: \ywt-vue\src\views\home\components\engineer.vue
 * @Description: 工程师
-->
<template>
  <div class="container">
    <div class="header">
      <div class="title">人员</div>
      <el-select v-model="teamValue" class="select" size="mini" placeholder="请选择" @change="changeTeam">
        <el-option
          v-for="item in teamList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="body">
      <engineerCard
        v-for="(item ,idx ) in engineerCardDatalist"
        :key="idx"
        :user-item="item"
        class="card"
        :is-change="idx===inChangeCardIdx"
        :style="{top:`${98*idx + 10}px`,'border-left':idx===inChangeCardIdx ? '5px solid #426ED7' :'','background':idx===inChangeCardIdx ? 'rgba(66,126,215,0.10)' :''}"
        @click.native="clickCard(item,idx)"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import TeamApi from '@/apis/system/group';
import engineerCard from './engineerCard';
export default {
  components: {
    engineerCard,
  },
  props: {
    apiParams: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: ['FrontPage'],
  data() {
    return {
      teamList: [],
      engineerCardDatalist: [],
      teamValue: '',
      inChangeCardIdx: 0,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    'FrontPage.cardIndexOwnTeamList': {
      handler(newVal, oldVal) {
        if (newVal.length > 0) {
          this.teamList = newVal;
          this.teamValue = newVal[0].id;
          this.getTeamMember(this.teamValue);
        } else {
          const { id, name, } = this.userInfo;
          this.engineerCardDatalist = [{ showRange: '0', id, name, isGroupCard: false, }];
          this.teamList = this.engineerCardDatalist;
          this.teamValue = this.engineerCardDatalist[0].id;
          this.setWorkWarpData(this.engineerCardDatalist[0]);
        }
      },
      deep: true,
    },
    'FrontPage.queryCondition.dateRange': {
      handler(newVal, oldVal) {
        this.setWorkWarpData(this.engineerCardDatalist[this.inChangeCardIdx]);
      },
      deep: true,
    },
  },
  created() {
  },
  methods: {
    // 点击用户卡片
    clickCard(userItem, idx) {
      this.$emit('setIsLoginUserBtns', userItem.id === this.userInfo.id,);
      if (this.inChangeCardIdx === idx) {
        return false; // 点击已经选中卡片 无需刷新工种卡片
      } else {
        this.inChangeCardIdx = idx;
        this.setWorkWarpData(userItem);
      }
    },
    changeTeam(id) {
      this.getTeamMember(id);
    },
    // 如无分组 将当前登录人移动到第一位 反之则放在该分组的后一位
    moveUserToFirstArr(severData, showRange) {
      let firstUserIdx = 0;
      severData.forEach((item, idx) => {
        item.isGroupCard = false;
        item.showRange = showRange;
        item.sendUser = item.id;
        if (item.id === this.userInfo.id) firstUserIdx = idx;
      });
      const firstUser = severData.splice(firstUserIdx, 1)[0];
      firstUser && severData.unshift(firstUser);
      return severData;
    },
    // 获取组或人员列表
    async getTeamMember(teamId) {
      try {
        const { userObjs, } = await TeamApi.detail(teamId);
        const isChangeTeam = this.FrontPage.cardIndexOwnTeamList.filter(team => {
          return team.id === teamId;
        });
        const { id, leader, name, } = isChangeTeam[0] || { id: '', leader: '', name: '', isGroupCard: false, };
        const groupCard = { showRange: id, leader, name, isGroupCard: true, };
        this.engineerCardDatalist = this.moveUserToFirstArr(userObjs, groupCard.showRange);
        this.engineerCardDatalist = [groupCard, ...this.engineerCardDatalist];// 将组放在第一位
        this.setWorkWarpData(this.engineerCardDatalist[0]);// 当获取到人员列表后 初始化列表第一位人员/组的卡片数据
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    // 渲染当前选中用户的工种卡片数据
    setWorkWarpData(userItem) {
      this.$emit('setWorkWarp', userItem,);
    },

  },
};
</script>

<style lang="scss" scoped>
.container{
  height: 100%;
}
.header{
  width: 100%;
  height: 42px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #E2E3E7;
  border-radius: 4px 4px 0 0;
  .title{
    font-family: AlibabaPuHuiTi_2_75_SemiBold;
    font-weight: 600;
    font-size: 18px;
    color: #334266;
    letter-spacing: 0;
    line-height: 18px;
  }
  .select{
    width: 115px;
  }
}
.body{
  position: relative;
  background: #fff;
  padding: 0 10px;
  height: calc(100% - 56px);
  overflow: auto;
  .card{
    position: absolute;
    left: 0;
    height: 78px;
    width: 100%;
    padding: 8px;
    cursor: pointer;
  }
}
.body::-webkit-scrollbar { display: none; }
</style>>

