<template>
    <section>
        <!--工具条-->
        <el-col :span="8" class="toolbar">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>权限</span>
                    <el-button style="float: right; padding: 3px 0" type="text">刷新</el-button>
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
                    <el-button style="float: right; padding: 3px 0" type="text">保存</el-button>
                </div>
                <div class="block">
                    <el-tree
                            :data="data5"
                            show-checkbox
                            node-key="value"
                            default-expand-all
                            :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
            <el-checkbox-group >
				<el-checkbox v-for="btn in node.btns"  :label="btn.label" :name="btn.Pid"></el-checkbox>
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
    import {getRoleListPage,getPermissionTree} from '../../api/api';

    let id = 1000;

    export default {
        data() {

            const data = [];
            return {
                roles: [],
                roleid: 0,
                data5: [],
                btns: [],
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
                let para={needbtn:true}
                getPermissionTree(para).then((res) => {
                    this.data = res.data.response.children;
                    this.data5=JSON.parse(JSON.stringify(this.data));
                });
            },
            operate(id) {
                this.roleid = id;
            },
            append(data) {
                const newChild = { id: id++, label: 'testtest', children: [] };
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
            renderContent(h, { node, data, store }) {
                return (`
                    <span class="custom-tree-node">
                    <span>{node.label}</span>
                <span>
                <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
                <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
                </span>
                </span> `
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
