<template>
  <div>
    <el-form ref="formRef" label-width="120px" style="maxwidth: 480px" :model="formData" :rules="rules">
      <el-form-item label="上级菜单" prop="parentId">
        <CompTreeSelect
          v-model="formData.parentId"
          width="500px"
          placeholder="请选择上级菜单"
          :tree-props="config"
          :tree-data="parentTreeData"
          :is-single="true"
          :show-checkbox="false"
          :node-key="'id'"
          :default-checked-keys.sync="checkedId"
          :default-checked-labels="checkedName"
          :default-width="320"
          @treeNodeClick="nodeTree"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="formData.menuType">
          <el-radio label="M">目录</el-radio>
          <el-radio label="C">菜单</el-radio>
          <el-radio label="F">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="formData.menuName"
          placeholder="请输入菜单名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item v-if="formData.menuType != 'F'" label="菜单图标" prop="icon">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <IconSelect ref="iconSelect" :active-icon="formData.icon" @selected="selected" />
          <el-input slot="reference" v-model="formData.icon" placeholder="点击选择图标" readonly>
            <i v-if="formData.icon" slot="prefix" :class="formData.icon" style="height: 25px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="显示排序" prop="orderNum">
        <el-input-number v-model="formData.orderNum" controls-position="right" :min="0" :max="9999" />
      </el-form-item>
      <el-form-item v-if="formData.menuType != 'F'" prop="isFrame">
        <span slot="label">
          <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          是否外链
        </span>
        <el-radio-group v-model="formData.isFrame">
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.menuType != 'F'" prop="path">
        <span slot="label">
          <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          路由地址
        </span>
        <el-input
          v-model="formData.path"
          placeholder="请输入路由地址"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item v-if="formData.menuType == 'C'" prop="component">
        <span slot="label">
          <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          组件路径
        </span>
        <el-input
          v-model="formData.component"
          placeholder="请输入组件路径"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item v-if="formData.menuType != 'M'" prop="perms">
        <el-input
          v-model="formData.perms"
          placeholder="请输入权限标识"
          maxlength="100"
          show-word-limit
        />
        <span slot="label">
          <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          权限字符
        </span>
      </el-form-item>
      <el-form-item v-if="formData.menuType == 'C'" prop="query">
        <el-input
          v-model="formData.query"
          placeholder="请输入路由参数"
          maxlength="500"
          show-word-limit
        />
        <span slot="label">
          <el-tooltip content="访问路由的默认传递参数，如：`{&quot;id&quot;: 1, &quot;name&quot;: &quot;ry&quot;}`" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          路由参数
        </span>
      </el-form-item>
      <!--      <el-form-item v-if="formData.menuType == 'C'" prop="isCache">
        <span slot="label">
          <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          是否缓存
        </span>
        <el-radio-group v-model="formData.isCache">
          <el-radio label="0">缓存</el-radio>
          <el-radio label="1">不缓存</el-radio>
        </el-radio-group>
      </el-form-item>-->
      <!--      <el-form-item v-if="formData.menuType != 'F'" prop="visible">
        <span slot="label">
          <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          显示状态
        </span>
        <el-radio-group v-model="formData.visible">
          <el-radio label="0">显示</el-radio>
          <el-radio label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>-->
      <el-form-item v-if="formData.menuType != 'F'" prop="status">
        <span slot="label">
          <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
          菜单状态
        </span>
        <el-radio-group v-model="formData.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import IconSelect from './icon-select.vue';
import CompTreeSelect from '@/common/components/treeSelect/index.vue';
import { listMenu, } from '@/features/system/menu/api';
import { convertToTree, } from '@/common/utils/convert';
export default {
  components: { CompTreeSelect, IconSelect, },
  props: {
    currentData: {
      type: Object,
      default() {
        return {
          isCache: '0',
          visible: '0',
          status: '0',
        };
      },
    },
    operateType: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      formData: {
      },
      parentTreeData: [],
      checkedId: [],
      checkedName: [],
      config: {
        children: 'children',
        label: 'menuName',
        id: 'id',
      },
    };
  },
  computed: {
    rules() {
      return {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur', },
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur', },
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur', },
        ],
      };
    },
  },
  watch: {
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const { ...rest } = newVal;
          const data = { ...rest, };
          this.formData = data;
          if (this.formData.parentId) {
            this.checkedId = [this.formData.parentId,
            ];
            this.checkedName = [this.formData.parentName,
            ];
          } else {
            this.checkedId = [];
            this.checkedName = [];
          }
          this.$nextTick(() => {
            this.$refs.formRef.clearValidate();
          });
          this.getTreeSelect();
        }
      },
      deep: true,
    },
  },
  methods: {
    nodeTree(node,) {
      if (node.menuId !== undefined) {
        this.formData.parentId = node.menuId;
      } else {
        this.formData.parentId = null;
      }
    },
    // 选择图标
    selected(iconData) {
      this.$set(this.formData, 'icon', iconData.icon);
    },
    /** 查询菜单下拉树结构 */
    getTreeSelect() {
      listMenu().then(res => {
        this.parentTreeData = [];
        const menu = { menuId: 0, menuName: '主类目', children: [], };
        menu.children = convertToTree(res, {
          id: 'menuId',
          parentId: 'parentId',
        });
        this.parentTreeData.push(menu);
      });
    },
    reset(reserveData) {
      if (reserveData) {
        this.formData = { ...reserveData, };
        // 延时两秒操作
        setTimeout(() => {
          this.getTreeSelect();
        }, 1000);
      } else {
        this.formData = {};
      }
      this.checkedId = [];
      this.checkedName = [];
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    validate() {
      const result = {};
      this.$refs.formRef.validate(valid => {
        result.valid = valid;
        if (valid) {
          const data = { ...this.formData, };
          result.data = data;
        }
      });
      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
