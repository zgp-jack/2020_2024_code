<template>
    <div>
        <el-form :model="formData" label-position="top" ref="formAddEdit" :rules="rules">
            <el-form-item prop="name" label="权限名称">
                <el-input v-model="formData.name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-scrollbar style="height: 360px; margin-bottom: 16px;">
            <el-tree
                ref="menuTree"
                :data="tree"
                show-checkbox
                node-key="id"
                default-expand-all
                :check-strictly="true"
                :default-checked-keys="checkedMenuIds"
                :expand-on-click-node="false"
                @check="checkNode"
            ></el-tree>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </div>
</template>
<script>
import ApiPermissions from '@/api/permissions';
import { ApiMenuTreeAndAction } from '@/api/index';
export default {
    props: {
        type: {
            type: String,
            default: 'edit'
        },
        detailData: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    code: ''
                }
            }
        },
        menuTree: {
            type: Array
        }
    },
    data() {
        return {
            formData: {
                id: null,
                name: '',
                code: ''
            },
            tree: null,
            checkedMenuIds: [],
            rules: {
                name: [{ required: true, message: '权限名称不能为空', trigger: 'blur'}],
            }
        }
    },
    mounted() {
        this.initData();
        this.getMenuTreeAndAction();
    },
    methods: {
        checkNode (currentObj, treeStatus) {
            // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
            let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
            // 选中
            if (selected !== -1) {
                // 子节点只要被选中父节点就被选中
                this.selectedParent(currentObj)
                // 统一处理子节点为相同的勾选状态
                this.uniteChildSame(currentObj, true)
            } else {
                // 未选中 处理子节点全部未选中和父节点选中状态
                this.uniteChildSame(currentObj, false)
                this.uniteParent(currentObj)
            }
        },
        // 统一处理父节点为选中
        selectedParent: function (currentObj) {
            let currentNode = this.$refs.menuTree.getNode(currentObj.id)
            if (currentNode !== null && currentNode.parent.key !== undefined) {
                this.$refs.menuTree.setChecked(currentNode.parent, true, false)
                this.selectedParent(currentNode.parent)
            }
        },
        // 统一处理子节点为相同的勾选状态
        uniteChildSame: function (treeList, isSelected) {
            this.$refs.menuTree.setChecked(treeList.id, isSelected, false)
            if (treeList.children && treeList.children.length !== 0) {
                for (let i = 0; i < treeList.children.length; i++) {
                    this.uniteChildSame(treeList.children[i], isSelected)
                }
            }
        },
        // 统一处理当节点兄弟全部都未选中时，设置当前节点父节点为未选中
        uniteParent: function (currentObj) {
            // 当前未选中节点
            let currentNode = this.$refs.menuTree.getNode(currentObj.id)
            if (currentNode !== null && currentNode.parent.key !== undefined) {
                // 当前节点父节点
                let parent = currentNode.parent
                // 当前节点兄弟节点
                let brothers = parent.childNodes
                // 是否设置父节点未选中
                let isParentSelected = false
                if (brothers && brothers.length > 0) {
                    for (let index = 0; index < brothers.length; index++) {
                        const element = brothers[index]
                        if (element.checked === true) {
                            isParentSelected = true
                        }
                    }
                }
                this.$refs.menuTree.setChecked(parent, isParentSelected, false)
            }
        },
        getMenuTreeAndAction() {
            if(this.type === 'edit') {
                const params = {
                    permissionId: this.detailData.id
                }
                ApiMenuTreeAndAction(params).then(res => {
                    if(res.status === 1) {
                        this.tree = res.data;
                    }
                })
            } else {
                this.tree = this.menuTree;
            }
        },
        initData() {
            if(this.type === 'edit') {
                this.formData.id = this.detailData['id'];
                this.formData.name = this.detailData['name'];
                this.formData.code = this.detailData['code'];
                this.checkedMenuIds = this.detailData['menuIds'];
            }
        },
        getCheckMenuIds() {
            var selectNode = this.$refs.menuTree.getCheckedNodes(false, true);
            return selectNode.map(item => item.id);
        },
        submitForm() {
            let menuIds = this.getCheckMenuIds();
            var params = {
                permission: this.formData,
                menuIds: menuIds
            }
            this.formData.permissionIds = [this.permissionsList];
            this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
                    ApiPermissions.save(params).then(res => {
                        if(res.status === 1) {
                            this.$emit('handleSubmit');
                        }
                    })
                }
            })
        },
        closeDialog() {
            this.$emit('handleClose');
        }
    }
}
</script>