<template>
    <section>
        <!--工具条-->
        <el-col :span="8" class="toolbar roles">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>权限</span>
                    <el-button @click="getRoles" style="float: right; padding: 3px 0" type="text">刷新</el-button>
                </div>
                <div v-for="o in roles" :key="o.Id" @click="operate(o.Id)" :class="o.Id==roleid ? 'active':''"
                     class="text item role-item">
                    {{o.Name }}
                </div>
            </el-card>

        </el-col>
        <el-col :span="16" class="toolbar perms morechildren">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>菜单</span> 
                    <el-button :loading="loadingSave" @click="saveAssign" style="float: right; padding: 3px 0" type="text">{{loadingSaveStr}}</el-button>
                </div>
                <div class="block">
                    <!--<el-tree :data="data5" size="mini" show-checkbox node-key="value" :props="defaultProps"-->
                             <!--style="width: 100%;pading-top:20px;" default-expand-all ref="menuTree" :render-content="renderContent"-->
                              <!--element-loading-text="拼命加载中" :check-strictly="true"-->
                             <!--@check-change="handleMenuCheckChange">-->
                    <!--</el-tree>-->


                    <el-tree
                            :data="data5"
                            show-checkbox
                            node-key="value"
                            ref="tree"
                            default-expand-all
                            :expand-on-click-node="true"
                            :check-strictly="true"
                    >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}<el-button @click.prevent="reverse(data.btns)" v-if="(data.btns && data.btns.length>1)" style="padding:5px 8px;margin-left:5px;" size="mini" type="plain">反选</el-button> </span>
                        <span>
                        <el-checkbox-group v-model="assignBtns">
                        <el-checkbox v-for="btn in data.btns" :key="btn.value"
                                     :label="btn.value.toString()">
                                     {{btn.label}}
                                     </el-checkbox>
                        </el-checkbox-group>

                        </span>
                        </span>
                    </el-tree>
                </div>
            </el-card>

        </el-col>


    </section>
</template>

<script>
    import util from '../../../util/date'
    import {getRoleListPage, getPermissionTree, getPermissionIds, addRolePermission} from '../../api/api';

    let id = 1000;

    export default {
        data() {

            const data = [];
            return {
                roles: [],
                roleid: 0,
                data5: [],
                btns: [],
                assigns: [],
                checked1: false,
                loadingSaveStr:'保存',
                loadingSave:false,
                assignBtns: [],
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    btns: 'btns',
                },
                selectedPermissions: [],
                currentRoleCode: "",
                stores: {
                    role: {
                        data: []
                    },
                    permissionTree: {
                        data: []
                    }
                },
                buttonProps: {
                    type: "default",
                    size: "small"
                }

                ,
                selectRole: {},
                menuData: [],
                menuSelections: [],
                menuLoading: false,
                authLoading: false,
                checkAll: false,
                currentRoleMenus: [],
            }
        },
        methods: {
            //反选
            reverse(ls){
                console.log(this.data5);
                console.log(ls);
                if(ls && ls.length){
                    for(let i=0;i<ls.length;i++){
                        let btn = ls[i];
                        let findBtnIndex = this.assignBtns.findIndex(t=>t == btn.value);
                        if(findBtnIndex>-1){
                            this.assignBtns.splice(findBtnIndex,1);
                        }else{
                            this.assignBtns.push(""+btn.value);
                        }
                    }
                }
            },
            //性别显示转换
            formatEnabled: function (row, column) {
                return row.Enabled ? '正常' : '未知';
            },
            formatCreateTime: function (row, column) {
                return (!row.CreateTime || row.CreateTime == '') ? '' : util.formatDate.format(new Date(row.CreateTime), 'yyyy-MM-dd');
            },
            //获取角色列表
            getRoles() {
                getRoleListPage().then((res) => {
                    this.roles = res.data.response.data;
                    this.getPermissions();
                });
            },
            //获取菜单树
            getPermissions() {
                let _this=this;
                let para = {needbtn: false}
                getPermissionTree(para).then((res) => {
                    _this.loadingSave=false;
                    _this.loadingSaveStr='保存';
                    this.data = res.data.response.children;
                    this.data5 = JSON.parse(JSON.stringify(this.data));
                });
            },
            //获取菜单Id，通过角色id
            getPermissionIds(rid) {
                let _this=this;
                this.assigns = [];
                this.assignBtns = [];
                let para = {rid: rid}
                getPermissionIds(para).then((res) => {

                    _this.loadingSave=false;
                    _this.loadingSaveStr='保存';
                    this.$refs.tree.setCheckedKeys(res.data.response.permissionids);
                    this.assignBtns = res.data.response.assignbtns;

                });
            },
            operate(id) {

                this.loadingSave=true;
                this.loadingSaveStr='加载中...';
                this.roleid = id;
                this.getPermissionIds(id);
            },
            saveAssign() {

                let _this=this;
                this.loadingSave=true;
                this.loadingSaveStr='保存中...';
                //console.log(this.$refs.tree.getCheckedKeys());
                //console.log(this.assignBtns)
                let pids = this.$refs.tree.getCheckedKeys();
                try {
                    if (this.assignBtns.length > 0) {
                        for (let i = 0; i < this.assignBtns.length; i++) {
                            // let assginbtn = this.assignBtns[i].split("_")[1];
                            let assginbtn = this.assignBtns[i];
                            if (assginbtn && assginbtn > 0) {
                                pids.push(assginbtn);
                            }
                        }
                    } else {
                        this.loadingSaveStr = "保存";
                        this.loadingSave = false;
                        this.$message({
                            message: "参数错误",
                            type: "error",
                        });
                        return false;
                    }
                } catch (e) {
                    this.$message({
                        message: "操作异常",
                        type: "error",
                    });
                    return false;
                }
                console.log(this.assignBtns);
                console.log(pids);
              
                let para = {pids: pids, rid: this.roleid}
                if (para.rid > 0 && para.pids.length > 0) {
                    addRolePermission(para).then((res) => {

                        _this.loadingSave=false;
                        _this.loadingSaveStr='保存';

                        if (res.data.success) {

                            this.$message({
                                message: res.data.msg,
                                type: 'success'
                            });

                            let para = {rid: this.roleid}
                            getPermissionIds(para).then((res) => {

                                this.$refs.tree.setCheckedKeys(res.data.response.permissionids);
                                this.assignBtns = res.data.response.assignbtns;
                                this.$message({
                                    message: "数据更新成功",
                                    type: 'success'
                                });
                            });
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    });
                } else {

                    this.loadingSaveStr='保存';
                    this.loadingSave=false;
                    this.$message({
                        message: "参数错误",
                        type: 'error'
                    });
                }
            },
            append(data) {
                const newChild = {id: id++, label: 'testtest', children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },

            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            // 获取数据
            findTreeData: function () {
                this.menuLoading = true
                this.$api.menu.findMenuTree().then((res) => {
                    this.menuData = res.data
                    this.menuLoading = false
                })
            },
            // 角色选择改变监听
            handleRoleSelectChange(val) {
                if(val == null || val.val == null) {
                    return
                }
                this.selectRole = val.val
                this.$api.role.findRoleMenus({'roleId':val.val.id}).then((res) => {
                    this.currentRoleMenus = res.data
                    this.$refs.menuTree.setCheckedNodes(res.data)
                })
            },
            // 树节点选择监听
            handleMenuCheckChange(data, check, subCheck) {
                if(check) {
                    // 节点选中时同步选中父节点
                    let parentId = data.parentId
                    this.$refs.menuTree.setChecked(parentId, true, false)
                } else {
                    // 节点取消选中时同步取消选中子节点
                    if(data.children != null) {
                        data.children.forEach(element => {
                            this.$refs.menuTree.setChecked(element.id, false, false)
                        });
                    }
                }
            },
        // 递归全选
        checkAllMenu(menuData, allMenus) {
            menuData.forEach(menu => {
                allMenus.push(menu)
                if(menu.children) {
                    this.checkAllMenu(menu.children, allMenus)
                }
            });
        },
        // 角色菜单授权提交
        submitAuthForm() {
            let roleId = this.selectRole.id
            if('admin' == this.selectRole.name) {
                this.$message({message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error'})
                return
            }
            this.authLoading = true
            let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
            let roleMenus = []
            for(let i=0, len=checkedNodes.length; i<len; i++) {
                let roleMenu = { roleId:roleId, menuId:checkedNodes[i].id }
                roleMenus.push(roleMenu)
            }
            this.$api.role.saveRoleMenus(roleMenus).then((res) => {
                if(res.code == 200) {
                    this.$message({ message: '操作成功', type: 'success' })
                } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.authLoading = false
            })
        },
        renderContent(h, { node, data, store }) {
            return (
                <div class="column-container">
                <span style="text-algin:center;margin-right:80px;">{data.label}</span>
            <span style="text-algin:center;margin-right:80px;">
                <el-tag type={data.isbtn ?'success':'info'} size="small">
            {!data.isbtn ?'菜单':'按钮'}
        </el-tag>
            </span>

            </div>);
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index){
            return format(row[column.property])
        }


        },
        mounted() {
            this.loadingSave=true;
            this.loadingSaveStr='加载中...';
            this.getRoles();

            // this.getPermissions();
        }
    }

</script>

<style>
    .role-item {
        cursor: pointer;
        padding: 10px;
    }

    .role-item.active {
        background: #ebf5ff;
    }

    .role-item:hover {
        background: #ebf5ff;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .text {
        font-size: 14px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 90%;
    }


    .morechildren .el-checkbox{
        margin-right: 5px !important;
        float: left;
    }
    .morechildren .el-checkbox-group{
        margin-left: 50px;
        padding: 5px;
    }
    .morechildren .el-tree-node__content{
        height: auto !important;
    }
</style>
