<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-form-item>
                    <el-input v-model="filters.Name" placeholder="菜单/按钮名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getPermissions">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column type="index" width="80">
            </el-table-column>
            <el-table-column label="菜单/按钮" width="" sortable>
                <template slot-scope="scope">
                    <i class="fa" :class="scope.row.Icon"></i>
                    {{scope.row.Name}}

                </template>
            </el-table-column>
            <el-table-column prop="PnameArr" label="父节点" width="" sortable>
            </el-table-column>
            <el-table-column prop="Code" label="路由地址" width="" sortable>
            </el-table-column>
            <el-table-column prop="MName" label="API接口" width="" sortable>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" :formatter="formatCreateTime" width="150" sortable>
            </el-table-column>
            <el-table-column prop="Enabled" label="状态" width="100" sortable>
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.Enabled  ? 'success' : 'danger'"
                            disable-transitions>{{scope.row.Enabled ? "正常":"禁用"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="OrderSort" label="Sort" width="" sortable>
            </el-table-column>
            <el-table-column prop="IsButton" label="是否按钮" width="100" sortable>
                <template slot-scope="scope">
                    <el-tag
                            :type="!scope.row.IsButton  ? 'success' : 'danger'"
                            disable-transitions>{{!scope.row.IsButton ? "否":"是"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Func" label="按钮事件" width="" sortable>
            </el-table-column>
            <el-table-column prop="IsHide" label="是否隐藏" width="100" sortable>
                <template slot-scope="scope">
                    <el-tag
                            :type="!scope.row.IsHide  ? 'success' : 'danger'"
                            disable-transitions>{{!scope.row.IsHide ? "否":"是"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="50"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="菜单名称" prop="Name">
                    <el-input v-model="editForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路由地址" prop="Code">
                    <el-tooltip class="item" effect="dark" content="如果是导航条且无路由，请填‘-’字符，如果是按钮，请输入空格即可" placement="top-start">
                        <el-input v-model="editForm.Code" auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="描述" prop="Description">
                    <el-input v-model="editForm.Description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Icon" prop="Icon">
                    <el-input v-model="editForm.Icon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="editForm.Enabled" placeholder="请选择状态">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.Name"
                                   :value="item.value"></el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="排序" prop="OrderSort">
                    <el-input type="number" v-model="editForm.OrderSort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsButton" label="是否按钮" width="" sortable>
                    <el-switch v-model="editForm.IsButton" >
                    </el-switch>
                </el-form-item>
                </el-form-item>
                  <el-form-item label="按钮事件" prop="Func">
                    <el-input v-model="editForm.Func" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsHide" label="隐藏菜单" width="" sortable>
                    <el-switch v-model="editForm.IsHide" >
                    </el-switch>
                </el-form-item>
                <el-form-item prop="PidArr" label="父级菜单" width="" sortable>
                    <el-cascader placeholder="请选择，支持搜索功能" style="width: 400px"  v-model="editForm.PidArr"
                                 :options="options"
                                 filterable
                                 change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="Mid" label="API接口" width="" sortable>
                    <el-select style="width: 100%;" v-model="editForm.Mid" placeholder="请选择API">
                        <el-option  :key="0"  :value="0" :label="'无需api'">
                        </el-option>
                        <el-option v-for="item in modules" :key="item.Id" :value="item.Id" :label="item.LinkUrl">
                            <span style="float: left">{{ item.LinkUrl }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="菜单名称" prop="Name">
                    <el-input v-model="addForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路由地址" prop="Code">
                    <el-tooltip class="item" effect="dark" content="如果是导航条且无路由，请填‘-’字符，如果是按钮，请输入空格即可" placement="top-start">
                    <el-input v-model="addForm.Code" auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="描述" prop="Description">
                    <el-input v-model="addForm.Description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="addForm.Enabled" placeholder="请选择状态">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.Name"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="OrderSort">
                    <el-input v-model="addForm.OrderSort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsButton" label="是否按钮" width="" sortable>
                    <el-switch v-model="addForm.IsButton" >
                    </el-switch>
                </el-form-item>
                  <el-form-item label="按钮事件" prop="Func">
                    <el-input v-model="addForm.Func" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsHide" label="隐藏菜单" width="" sortable>
                    <el-switch v-model="addForm.IsHide" >
                    </el-switch>
                </el-form-item>
                <el-form-item prop="PidArr" label="父级菜单" width="" sortable>
                    <el-cascader style="width: 400px" v-model="addForm.PidArr"
                            :options="options"
                            filterable
                            change-on-select
                    ></el-cascader>

                </el-form-item>


                <el-form-item prop="Mid" label="API接口" width="" sortable>
                    <el-select style="width: 100%;" v-model="addForm.Mid" placeholder="请选择API">
                        <el-option  :key="0"  :value="0" :label="'无需api'">
                        </el-option>
                        <el-option v-for="item in modules" :key="item.Id" :value="item.Id" :label="item.LinkUrl">
                            <span style="float: left">{{ item.LinkUrl }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Name }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../../util/date'
    import {getPermissionListPage, removePermission, editPermission, addPermission,getPermissionTree,getModuleListPage} from '../../api/api';

    export default {
        data() {
            return {
                options: [],
                filters: {
                    Name: ''
                },
                users: [],
                modules:[],//接口api列表
                statusList: [{Name: '激活', value: true}, {Name: '禁用', value: false}],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                addDialogFormVisible: false,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    Name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    Code: [
                        {required: true, message: '请输入路由地址', trigger: 'blur'}
                    ],

                },
                //编辑界面数据
                editForm: {
                    Id: 0,
                    Mid: 0,
                    OrderSort:0,
                    PidArr: [],
                    CreateBy: '',
                    Name: '',
                    Code: '',
                    Description: '',
                    Icon: '',
                    Func: '',
                    Enabled: true,
                    IsButton: false,
                    IsHide: false,
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    Name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    Code: [
                        {required: true, message: '请输入路由地址', trigger: 'blur'}
                    ],

                },
                //新增界面数据
                addForm: {
                    CreateBy: '',
                    CreateId: '',
                    PidArr: [],
                    Mid: 0,
                    OrderSort:0,
                    Name: '',
                    Code: '',
                    Description: '',
                    Icon: '',
                    Func: '',
                    Enabled: true,
                    IsButton: false,
                    IsHide: false,
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
            handleCurrentChange(val) {
                this.page = val;
                this.getPermissions();
            },
            //获取用户列表
            getPermissions() {
                let para = {
                    page: this.page,
                    key: this.filters.Name
                };
                this.listLoading = true;

                //NProgress.start();
                getPermissionListPage(para).then((res) => {
                    this.total = res.data.response.dataCount;
                    this.users = res.data.response.data;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.Id};
                    removePermission(para).then((res) => {

                        if (util.isEmt.format(res)) {
                            this.listLoading = false;
                            return;
                        }
                        this.listLoading = false;
                        //NProgress.done();
                        if (res.data.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });

                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                        }

                        this.getPermissions();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                let that=this;
                that.editLoading = true;

                this.editFormVisible = true;
                this.editForm = {};

                this.options=[];
                let para={pid:row.Id};
                getPermissionTree(para).then((res) => {
                    this.options.push(res.data.response);
                    that.editForm = Object.assign({}, row);
                    that.editLoading = false;
                });
            },
            //显示新增界面
            handleAdd() {
                this.options=[];
                this.addFormVisible = true;
                this.addForm = {
                    CreateBy: '',
                    CreateId: '',
                    PidArr: [],
                    Name: '',
                    Code: '',
                    OrderSort:0,
                    Description: '',
                    Enabled: true,
                    Icon: '',
                    IsButton: false,
                    IsHide: false,
                };

                let para={pid:0};
                getPermissionTree(para).then((res) => {

                    this.options.push(res.data.response);
                });


            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);

                            para.ModifyTime = util.formatDate.format(new Date(), 'yyyy-MM-dd');

                            para.Pid = para.PidArr.pop();

                            if(para.Id==para.Pid){

                                this.$message({
                                    message: "警告，父节点不能是自己！",
                                    type: 'error'
                                });

                                this.editLoading = false;
                                return;
                            }


                            editPermission(para).then((res) => {

                                if (util.isEmt.format(res)) {
                                    this.editLoading = false;
                                    return;
                                }
                                this.editLoading = false;
                                if (res.data.success) {
                                    this.editLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getPermissions();
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });

                                }
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                let _this = this;
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);

                            para.CreateTime = util.formatDate.format(new Date(), 'yyyy-MM-dd');
                            para.ModifyTime = para.CreateTime;
                            para.IsDeleted = false;

                            para.Pid = para.PidArr.pop();

                            var user = JSON.parse(window.localStorage.user);

                            if (user && user.uID > 0) {
                                para.CreateId = user.uID;
                                para.CreateBy = user.uRealName;
                            } else {
                                this.$message({
                                    message: '用户信息为空，先登录',
                                    type: 'error'
                                });
                                _this.$router.replace(_this.$route.query.redirect ? _this.$route.query.redirect : "/");
                            }


                            addPermission(para).then((res) => {

                                if (util.isEmt.format(res)) {
                                    this.addLoading = false;
                                    return;
                                }
                                this.addLoading = false;
                                if (res.data.success) {
                                    this.addLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getPermissions();
                                }
                                else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    });

                                }

                            });

                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                this.$message({
                    message: '该功能未开放',
                    type: 'warning'
                });
            }
        },
        mounted() {
            this.getPermissions();

            getModuleListPage().then((res) => {
                this.modules = res.data.response.data;
            });
        }
    }

</script>

<style scoped>

</style>
