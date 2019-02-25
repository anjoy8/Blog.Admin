<template>
    <section>
        <!--工具条-->
        <el-col :span="8" class="toolbar">
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
        <el-col :span="16" class="toolbar">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>菜单</span>
                    <el-button @click="saveAssign" style="float: right; padding: 3px 0" type="text">保存</el-button>
                </div>
                <div class="block">

                    <el-tree
                            :data="data5"
                            show-checkbox
                            node-key="value"
                            ref="tree"
                            default-expand-all
                            :expand-on-click-node="true"

                    >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                        <el-checkbox-group v-model="assignBtns">
                        <el-checkbox v-for="btn in data.btns" :key="btn.value"
                                     :label="btn.label+'_'+btn.value"></el-checkbox>
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
            }
        },
        methods: {
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
                });
            },
            //获取菜单树
            getPermissions() {
                let para = {needbtn: false}
                getPermissionTree(para).then((res) => {
                    this.data = res.data.response.children;
                    this.data5 = JSON.parse(JSON.stringify(this.data));
                });
            },
            //获取菜单Id，通过角色id
            getPermissionIds(rid) {
                this.assigns = [];
                this.assignBtns = [];
                let para = {rid: rid}
                getPermissionIds(para).then((res) => {

                    this.$refs.tree.setCheckedKeys(res.data.response.permissionids);
                    this.assignBtns = res.data.response.assignbtns;

                });
            },
            operate(id) {
                this.roleid = id;
                this.getPermissionIds(id);
            },
            saveAssign() {
                console.log(this.$refs.tree.getCheckedKeys());
                console.log(this.assignBtns)
                let pids = this.$refs.tree.getCheckedKeys();
                try {
                    if (this.assignBtns.length > 0) {
                        for (let i = 0; i < this.assignBtns.length; i++) {
                            let assginbtn = this.assignBtns[i].split("_")[1];
                            if (assginbtn > 0) {
                                pids.push(assginbtn);
                            }
                        }
                    }
                } catch (e) {

                }
                let para = {pids: pids, rid: this.roleid}
                if (para.rid > 0 && para.pids.length > 0) {
                    addRolePermission(para).then((res) => {
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
            renderContent(h, {node, data, store}) {
                return h(
                    "span",
                    {
                        style: {
                            display: "inline-block",
                            width: "100%"
                        },
                        class: "permission-tree-node"
                    },
                    [
                        h("span", [

                            h("span", data.label)
                        ]),
                        h(
                            "span",
                            {
                                style: {
                                    display: "inline-block",
                                    float: "right",
                                    marginRight: "32px"
                                }
                            },
                            [
                                h(
                                    "div",
                                    {
                                        style: {
                                            display: "inline-block",
                                            marginRight: "10px"
                                        }
                                    },
                                    [
                                        h(
                                            "div",
                                            {
                                                props: {
                                                    style: {},
                                                },
                                                on: {}
                                            },
                                            (data.btns || []).map(obj => {
                                                return h(
                                                    "el-checkbox",
                                                    {
                                                        props: {
                                                            label: obj.value
                                                        },
                                                        on: {
                                                            change: (event) => {
                                                                console.log(obj)
                                                                let currentIndex = this.assignBtns.indexOf(obj.value);
                                                                if (currentIndex >= 0) {
                                                                    this.assignBtns.splice(currentIndex, 1);
                                                                } else {
                                                                    this.assignBtns.push(obj.value);
                                                                }
                                                                console.log(this.assignBtns);
                                                            },
                                                            click: () => {
                                                                console.log(2)
                                                            },

                                                        }
                                                    },
                                                    obj.label
                                                );
                                            })
                                        )
                                    ]
                                ),

                            ]
                        )
                    ]
                );
            }

        },
        mounted() {
            this.getRoles();
            this.getPermissions();
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
</style>
