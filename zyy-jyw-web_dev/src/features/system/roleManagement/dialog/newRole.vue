/**
* @file newRole.vue
* @author huang
* @date 2023/8/21
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="角色名称"
        prop="roleName"
      >
        <el-input
          v-model="form.roleName"
          placeholder="请输入角色名称"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="权限字符"
        prop="roleKey"
      >
        <el-input
          v-model="form.roleKey"
          placeholder="请输入权限字符"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="角色顺序"
        prop="roleSort"
      >
        <el-input-number
          v-model="form.roleSort"
          :min="0"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio label="0">
            启用
          </el-radio>
          <el-radio label="1">
            停用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          placeholder="请输入内容"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-checkbox
          v-model="menuExpand"
          @change="handleCheckedTreeExpand($event, 'menu')"
        >展开/折叠
        </el-checkbox>
        <el-checkbox
          v-model="menuNodeAll"
          @change="handleCheckedTreeNodeAll($event, 'menu')"
        >全选/全不选
        </el-checkbox>
        <el-checkbox
          v-model="form.menuCheckStrictly"
          @change="handleCheckedTreeConnect($event, 'menu')"
        >父子联动
        </el-checkbox>
        <el-tree
          ref="menu"
          :check-strictly="!form.menuCheckStrictly"
          :data="menuListTree"
          :props="defaultProps"
          class="tree-box"
          :default-expand-all="defaultExpand"
          empty-text="加载中，请稍候"
          node-key="menuId"
          show-checkbox
        />

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SystemRoleApi from '../api';
import { convertToTree, } from '@/common/utils/convert';

export default {
  components: {
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    currentData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        roleName: '',
        roleKey: '',
        roleSort: '',
        status: '0',
        menuCheckStrictly: false,
        remark: '',
        menuIds: [],
      },
      menuList: [],
      defaultExpand: false,
      menuExpand: false,
      menuNodeAll: false,
      menuOptions: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur', },
        ],
        roleKey: [
          { required: true, message: '请输入权限字符', trigger: 'blur', },
        ],
        roleSort: [
          { required: true, message: '请输入角色顺序', trigger: 'blur', },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur', },
        ],
      },
    };
  },
  computed: {
    menuListTree: {
      set(val) {
        this.menuList = val;
      },
      get() {
        return convertToTree(this.menuList, { id: 'menuId', parentId: 'parentId', });
      },
    },
  },
  watch: {
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = newVal;
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
            this.getMenuList();
          });
        }
      },
      deep: true,
    },
  },
  mounted() {
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      // 查询启用菜单
      const param = {
        status: '0',
      };
      const res = await SystemRoleApi.getMenuList(param);
      this.menuListTree = res;
      this.$nextTick(async () => {
        await this.getMenuListByRoleId();
      });
    },
    // 获取对应角色的菜单列表
    async getMenuListByRoleId() {
      if (this.form?.roleId) {
        const rs = await SystemRoleApi.getMenuByRole(this.form.roleId);
        rs.forEach(v => {
          this.$refs.menu.setChecked(v, true, false);
        });
        //  选中的菜单节点判断
        this.menuNodeAll = this.menuList.length === rs.length;
      }
    },

    // 展开/折叠
    handleCheckedTreeExpand(val) {
      const treeNode = this.$refs.menu.store.nodesMap;
      for (const i in treeNode) {
        treeNode[i].expanded = val;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(val) {
      this.$refs.menu.setCheckedNodes(val ? this.menuList : []);
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value) {
      this.form.menuCheckStrictly = !!value;
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false;
      this.menuNodeAll = false;
      this.deptExpand = true;
      this.deptNodeAll = false;
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined,
      };
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    validate() {
      const result = {};
      this.$refs.form.validate(valid => {
        result.valid = valid;
        if (valid) {
          this.form.menuIds = this.getMenuAllCheckedKeys();
          const data = { ...this.form, };
          result.data = data;
        }
      });
      return result;
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.tree-box {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #FFFFFF none;
  border-radius: 4px;
}
</style>
