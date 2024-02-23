<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-30 10:19:44
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-20 15:22:20
 * @Description:人员面板
-->
<template>
  <el-card>
    <el-row type="flex" justify="space-between">
      <el-col :span="6">

        <el-avatar :size="60" :src="Avatar" class="hot-area" @click.native="onPreviewPersona" />

        <div class="icon-wrapper">
          <svg-icon v-if="data.isDeptManager" icon-class="chief" class="icon" />
          <svg-icon v-if="data.isTeamManager" icon-class="leader" class="icon" />

        </div>
      </el-col>
      <el-col :span="17">
        <el-row type="flex" justify="end" class="mb-12">
          <el-col :span="12">
            <span class="pure-name">{{ userInfo.name }}</span>
            <i v-if="data.gender" :class="data.gender | gender" />
          </el-col>
          <el-col :span="12" class="right">
            <span class="pure-period">{{ data.workYear }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="1" class="mb-12">
          <el-col>
            <el-tooltip placement="top" :content="userInfo.roleName" :disabled="userInfo.roleName.length<=ellipsisCount">
              <span class="team">{{ userInfo.roleName|ellipsis(6) }}</span>
            </el-tooltip>
            <el-tooltip placement="top" :content="userInfo.deptName" :disabled="userInfo.deptName.length<=ellipsisCount">
              <span class="department">{{ userInfo.deptName|ellipsis(ellipsisCount) }}</span>
            </el-tooltip>

          </el-col>

        </el-row>
        <el-row type="flex" justify="end">
          <el-col :span="24" class="flex" style="align-items: center">
            <el-rate
              :value="data.stars"
              disabled
              text-color="#334266"
            />
            <span style="font-size:14px">{{ data.stars||'暂无评' }}分</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {
  mapGetters, mapState,
} from 'vuex';
import HomeApi from '@/apis/home/index';
import PersonaPreviewDialog from '@/feat/synthesize/persona/dialog/preview.vue';

export default {
  filters: {
    gender(val) {
      return val ? 'el-icon-male' : 'el-icon-female';
    },
  },
  data() {
    return {
      data: {},
      defaultAvatar: require('@/assets/home/defaultAvatar.png'),
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('login', {
      FileBaseUrl: (data) => {
        return data.uriConfig.fileBaseUri;
      },
    }),
    UserId() {
      return this.userInfo.id;
    },
    Avatar() {
      if (this.data.photoAddr) {
        return `${this.FileBaseUrl}${this.data.photoAddr}`;
      }
      return this.defaultAvatar;
    },
  },
  async created() {
    this.ellipsisCount = 4;// 设置显示文本长度
    await this.init();
  },
  methods: {
    async init() {
      const result = await HomeApi.userInformation({
        userId: this.UserId,
      });
      this.data = Object.assign({}, this.data, result);
      this.data.stars = this.data.stars || 0;
    },
    async onPreviewPersona() {
      if (!this.data.id) {
        await this.$confirm('还未创建人员画像,是否前去新建！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        this.$router.push({
          path: '/synthesize/persona',
        });
        return;
      }
      this.$dialog({
        'customClass': 'persona-preview-dialog',
        fullscreen: true,
        component: () => <PersonaPreviewDialog id={this.data.id}/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  padding: 22px 16px;
}
::v-deep .el-rate__text{
  font-size: 14px;
}
::v-deep .el-rate__icon{
  margin-right: 3px;
}
::v-deep .el-avatar > img{
  display: inline;
}

.pure-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 6px;
}
.pure-period {
  font-size: 14px;
  text-align: right;
  color: #879bba;
}
.score {
  font-size: 14px;
  font-weight: 400;
  color: #2d405e;
}
.el-icon-male {
  color: #55A1EC;
  font-size: 14px;
  font-weight: 600;
}
.el-icon-female{
  color: #e2099bc7;
  font-size: 14px;
  font-weight: 600;
}
.right {
  text-align: right;
}
.team,.department {
  background-color: #67C23A;
  color: white;
  font-size: 12px;
  padding: 4px;
  border-radius: 2px;
}
.department {
  background-color: #4B7FDA;
  margin-left: 6px;
}
.leader {
  vertical-align: middle;
  margin-left: 6px;
}
.mb-12 {
  margin-bottom: 12px;
}
.icon{

  &-wrapper{
    display: flex;
    justify-content: space-around;
  }

}
.hot-area {
  cursor: pointer;
}
</style>
