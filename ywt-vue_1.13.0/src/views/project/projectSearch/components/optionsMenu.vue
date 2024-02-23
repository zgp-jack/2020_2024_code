<template>
  <el-row>
    <el-col :span="24">
      <el-button v-for="v in baseAll" :key="v.code" type="text" @click="emitClick(v)">
        {{ v.text }}
      </el-button>
      <!-- 暂时取消其他操作项 只保留查看操作  2021.12.3 -->
      <!--
         <template v-for="v in computedOptionsButton.base">
        <el-button
          v-if="v.permissions.includes(permissionDemand)"
          :key="v.code"
          type="text"
          @click="emitClick(v)"
        >
          {{ v.text }}
        </el-button>
      </template>
      <template v-if="computedOptionsButton.more.length">
        <el-dropdown class="el-dropdown">
          <el-button type="text">
            更多 <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="v in computedOptionsButton.more"
              :key="v.code"
              @click="emitClick(v)"
            >
              {{ v.text }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
       -->
    </el-col>
  </el-row>
</template>

<script>
import { mapState, } from 'vuex';
export default {
  name: 'OptionsMenu',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
    };
  },
  computed: {
    baseAll() {
      return [{
        text: '查看',
        code: this.data.type === 1 ? 'demandSearch' : 'standSearch',
      }];
    },
    ...mapState('login', {
      mePermissions: (v) => {
        return v.userInfo.permissions || [];
      },
      myId: (v) => {
        return Number(v.userInfo.id) || 0;
      },
    }),
    state() {
      return this.data.showState;
    },
    // 是否有评审权限
    isReviewPermission() {
      if (['demand_inv_review', 'item_program_review'].includes(this.state)) {
        return this.mePermissions.includes('ITEM_AUDIT');
      }
      return true;
    },
    permissionDemand() {
      // 负责人 与创建人 PS:缺少创建人的字段
      let perName = '';
      if (['demand_inv_review', 'item_program_review'].includes(this.state)) {
        if (this.mePermissions.includes('ITEM_AUDIT')) {
          perName = 'ITEM_AUDIT';
          return perName;
        }
      }

      if (this.data.principal === this.myId) {
        perName = 'principal';
      } else if (this.data.users && this.data.users.includes(this.myId)) {
        perName = 'joinUser';
      }
      return perName;
    },

    buttonOptionsDemand() {
      const baseDemand = [
        {
          text: '终止',
          code: 'end',
          permissions: ['createUser', 'principal'],
        },
        {
          text: '转工单',
          code: 'demandToOrder',
          permissions: ['createUser', 'principal'],
        }
      ];
      const back = {
        text: '撤销',
        code: 'back',
        permissions: ['createUser', 'principal'],
      };
      const end = {
        text: '终止',
        code: 'end',
        permissions: ['createUser', 'principal'],
      };
      const del = {
        text: '删除',
        code: 'demandDel',
        permissions: ['createUser', 'principal'],
      };
      const edit = {
        text: '编辑',
        code: 'demandEdit',
        permissions: ['createUser', 'principal', 'joinUser'],
      };

      const item_program_review = function () {
        if (this.data?.principal === this.myId) {
          return edit;
        }
        return {};
      }.bind(this);

      const items = {
        null: [edit, del],
        demand_init: [
          {
            text: '分配',
            code: 'distribute',
            permissions: ['createUser', 'principal'],
          },
          ...baseDemand
        ],
        demand_inv_review: [
          {
            text: '评审',
            code: 'demandReview',
            dataCode: this.state,
            permissions: ['ITEM_AUDIT'],
          },
          ...baseDemand
        ],
        demand_inv: [
          {
            text: '调研',
            code: 'demandResearch',
            permissions: ['createUser', 'principal'],
          },
          ...baseDemand
        ],
        demand_inv_review_next: [
          {
            text: '调研',
            code: 'demandResearch',
            permissions: ['createUser', 'principal'],
          },
          ...baseDemand
        ],

        item_establish: [end, back],
        item_program_review: [
          {
            text: '评审',
            code: 'demandReview',
            dataCode: this.state,
            permissions: ['ITEM_AUDIT'],
          },
          item_program_review(),
          ...baseDemand
        ],
        implement_start: [end, back],
        program_review_reject: [edit, ...baseDemand, back],
        end_inv_reject: [end, back],
        end_project_order: [end, back],
      };
      return items;
    },
    buttonOptionsStand() {
      const back = {
        text: '撤销',
        code: 'back',
        permissions: ['createUser', 'principal'],
      };
      const end = {
        text: '终止',
        code: 'end',
        permissions: ['createUser', 'principal'],
      };
      const del = {
        text: '删除',
        code: 'standDel',
        permissions: ['createUser', 'principal'],
      };
      const edit = {
        text: '编辑',
        code: 'standEdit',
        permissions: ['createUser', 'principal'],
      };
      const items = {
        null: [edit, del],
        item_establish: [
          {
            text: '方案制定',
            code: 'standSet',
            permissions: ['createUser', 'principal'],
          },
          end
        ],
        item_program_review: [
          {
            text: '评审',
            code: 'standReview',
            dataCode: this.state,
            permissions: ['review'],
          },
          end
        ],
        implement_start: [end, back],
        program_review_reject: [edit, back, end],
        item_before_project: [
          {
            text: '确认结果',
            code: 'confirmResult',
            permissions: ['createUser', 'principal'],
          }
        ],
        implement_over: [
          {
            text: '确认结果',
            code: 'confirmResult',
            permissions: ['createUser', 'principal'],
          }
        ],
        end_inv_reject: [back],
        end_project_order: [back],
      };
      return items;
    },

    computedOptionsButton() {
      const buttons = {
        base: [],
        more: [],
      };
      let btns;
      if (this.data.type === 1) {
        // if (this.isReviewPermission) {
        //   }
        btns = this.buttonOptionsDemand[this.data.showState] || [];
      } else {
        btns = this.buttonOptionsStand[this.data.showState] || [];
      }
      console.log(
        this.data.showState,
        this.data.type,
        btns,
        btns?.length,
        'btns.length'
      );
      if (btns && btns.length < 3) {
        buttons.base = btns;
      } else {
        buttons.base = btns.slice(0, 1) || [];
        buttons.more = btns.slice(1) || [];
      }
      return buttons;
    },
  },
  methods: {
    emitClick(v) {
      this.$emit('click', v);
    },
  },
};
</script>

<style lang="scss">
.el-dropdown {
  margin-left: 10px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
