<template>
    <div class="setting-panel">
        <TableList ref="table" @handleFunc="handleFunc"></TableList>
        <el-dialog :title="title" :visible.sync="visible" width="650px" v-if="visible">
            <Edit :type="editType" :menuTree="menuTree" :detailData="detailData" @handleSubmit="handleSubmit" @handleClose="handleClose"></Edit>
        </el-dialog>
    </div>
</template>
<script>
import { ApiMenuTree } from '@/api/index';
    export default {
        name: 'settingPermissions',
        components: {
            TableList: () => import('./components/TableList.vue'),
            Edit: () => import('./components/Edit.vue'),
        },
        data() {
            return {
                visible: false,
                title: '新增权限',
                editType: 'edit',
                detailData: null,
                menuTree: null
            }
        },
        mounted() {
            this.getMenuTree();
        },
        methods: {
            getMenuTree() {
                ApiMenuTree().then(res => {
                    if(res.status === 1) {
                        this.menuTree = res.data;
                    }
                })
            },
            handleFunc(data) {
                switch(data.type) {
                    case 'add':
                        this.title = '新增权限';
                        this.editType = 'add';
                        this.visible = true;
                        break;
                    case 'edit':
                        this.title = '编辑权限';
                        this.editType = 'edit';
                        this.visible = true;
                        this.detailData = data.value;
                    default: break;
                }
            },
            handleClose() {
                this.visible = false;
            },
            handleSubmit() {
                this.$refs['table'].getList();
                this.handleClose();
            }
        }
    }
</script>
<style scoped lang="scss">
.setting-panel{
    padding: 16px;
    height: 100%;
}
</style>