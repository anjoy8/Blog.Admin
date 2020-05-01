<template>
    <section>
        <!--工具条-->
        <toolbar :buttonList="buttonList" @callFunction="callFunction"></toolbar>
    
        <!--列表-->
        <el-table :data="users" highlight-current-row 
        @current-change="selectCurrentRow"
        v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column type="index" width="80">
            </el-table-column>
            <el-table-column prop="Id" label="Id" width="" sortable>
            </el-table-column>
            <el-table-column prop="tdName" label="标题" width="" sortable>
            </el-table-column>
            <el-table-column prop="tdAuthor" label="作者" width="300" sortable>
            </el-table-column>
            <el-table-column prop="tdDetail" label="内容" :formatter="formattdDetail" width="" sortable>
            </el-table-column>
            <el-table-column prop="tdCreatetime" label="创建时间" :formatter="formatCreateTime" width="" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="6"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="接口地址" prop="LinkUrl">
                    <el-input v-model="editForm.LinkUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口描述" prop="Name">
                    <el-input v-model="editForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="editForm.Enabled" placeholder="请选择状态">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.LinkUrl"
                                   :value="item.value"></el-option>

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
                <el-form-item label="接口地址" prop="LinkUrl">
                    <el-input v-model="addForm.LinkUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="接口描述" prop="Name">
                    <el-input v-model="addForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="addForm.Enabled" placeholder="请选择状态">
                        <el-option label="激活" value="true"></el-option>
                        <el-option label="禁用" value="false"></el-option>
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
    import {getBugListPage, removeBug, editBug, addBug} from '../../api/api';
    import { getButtonList } from "../../promissionRouter";
    import Toolbar from "../../components/Toolbar";

    export default {
        components: { Toolbar },
        data() {
            return {
                filters: {
                    LinkUrl: ''
                },
                buttonList: [],
                currentRow: null,
                users: [],
                statusList: [{LinkUrl: '激活', value: true}, {LinkUrl: '禁用', value: false}],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                addDialogFormVisible: false,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {

                    LinkUrl: [
                        {required: true, message: '请输入接口地址', trigger: 'blur'}
                    ],

                },
                //编辑界面数据
                editForm: {
                    Id: 0,
                    CreateBy: '',
                    LinkUrl: '',
                    Name: '',
                    Enabled: false,
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {

                    LinkUrl: [
                        {required: true, message: '请输入接口地址', trigger: 'blur'}
                    ],

                },
                //新增界面数据
                addForm: {
                    CreateBy: '',
                    CreateId: '',
                    LinkUrl: '',
                    Name: '',
                    Enabled: '',
                }

            }
        },
        methods: {
            selectCurrentRow(val) {
            this.currentRow = val;
            },
            callFunction(item) {
            this.filters = {
                name: item.search
            };
            this[item.Func].apply(this, item);
            },
            //性别显示转换
            formattdDetail: function (row, column) {
                return row.tdDetail? row.tdDetail.substring(0,20):"N/A";
            },
            formatCreateTime: function (row, column) {
                return (!row.tdCreatetime || row.tdCreatetime == '') ? '' : util.formatDate.format(new Date(row.tdCreatetime), 'yyyy-MM-dd');
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getBugs();
            },
            //获取用户列表
            getBugs() {
                let para = {
                    page: this.page,
                    key: this.filters.LinkUrl
                };
                this.listLoading = true;

                //NProgress.start();
                getBugListPage(para).then((res) => {

                    this.total = res.data.response.dataCount;
                    this.users = res.data.response.data;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel() {
                let row = this.currentRow;
                if (!row) {
                    this.$message({
                    message: "请选择要删除的一行数据！",
                    type: "error"
                    });

                    return;
                }
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.Id};
                    removeBug(para).then((res) => {

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

                        this.getBugs();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit() {
                let row = this.currentRow;
                if (!row) {
                    this.$message({
                    message: "请选择要编辑的一行数据！",
                    type: "error"
                    });

                    return;
                }
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.addForm = {
                    CreateBy: '',
                    LinkUrl: '',
                    Name: '',
                    Enabled: 'true',
                };
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

                            editBug(para).then((res) => {

                                if (util.isEmt.format(res)) {
                                    this.editLoading = false;
                                    return;
                                }
                                if (res.data.success) {
                                    this.editLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getBugs();
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


                            addBug(para).then((res) => {

                                if (util.isEmt.format(res)) {
                                    this.addLoading = false;
                                    return;
                                }
                                if (res.data.success) {
                                    this.addLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getBugs();
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
            this.getBugs();

            let routers = window.localStorage.router
            ? JSON.parse(window.localStorage.router)
            : [];
            this.buttonList = getButtonList(this.$route.path, routers);
        }
    }

</script>

<style scoped>

</style>
