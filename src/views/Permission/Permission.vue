<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.Name" placeholder="菜单名"></el-input>
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
            <el-table-column prop="Name" label="菜单名称" width="" sortable>
            </el-table-column>
            <el-table-column prop="Description" label="描述" width="300" sortable>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" :formatter="formatCreateTime" width="" sortable>
            </el-table-column>
            <el-table-column prop="CreateBy" label="创建者" width="" sortable>
            </el-table-column>
            <el-table-column prop="Enabled" label="状态" width="" sortable>
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.Enabled  ? 'success' : 'danger'"
                            disable-transitions>{{scope.row.Enabled ? "正常":"禁用"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="IsButton" label="是否按钮" width="" sortable>
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.IsButton  ? 'success' : 'danger'"
                            disable-transitions>{{scope.row.IsButton ? "否":"是"}}
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
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="菜单名称" prop="Name">
                    <el-input v-model="editForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="Description">
                    <el-input v-model="editForm.Description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="editForm.Enabled" placeholder="请选择状态">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.Name"
                                   :value="item.value"></el-option>

                    </el-select>
                </el-form-item>

                <el-table-column prop="IsButton" label="是否按钮" width="" sortable>
                    <el-switch v-model="editForm.IsButton" >
                    </el-switch>
                </el-table-column>
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
                <el-form-item label="描述" prop="Description">
                    <el-input v-model="addForm.Description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="addForm.Enabled" placeholder="请选择状态">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.Name"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="IsButton" label="是否按钮" width="" sortable>
                    <el-switch v-model="addForm.IsButton" >
                    </el-switch>
                </el-form-item>
                <el-form-item prop="Pid" label="父级菜单" width="" sortable>
                    <el-cascader
                            :options="options"
                            change-on-select
                    ></el-cascader>
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
    import {getPermissionListPage, removePermission, editPermission, addPermission} from '../../api/api';

    export default {
        data() {
            return {
                options: [{
                    value: 'zhinan',
                    label: '指南',
                    children: [{
                        value: 'shejiyuanze',
                        label: '设计原则',
                        children: [{
                            value: 'yizhi',
                            label: '一致'
                        }, {
                            value: 'fankui',
                            label: '反馈'
                        }, {
                            value: 'xiaolv',
                            label: '效率'
                        }, {
                            value: 'kekong',
                            label: '可控'
                        }]
                    }, {
                        value: 'daohang',
                        label: '导航',
                        children: [{
                            value: 'cexiangdaohang',
                            label: '侧向导航'
                        }, {
                            value: 'dingbudaohang',
                            label: '顶部导航'
                        }]
                    }]
                }, {
                    value: 'zujian',
                    label: '组件',
                    children: [{
                        value: 'basic',
                        label: 'Basic',
                        children: [{
                            value: 'layout',
                            label: 'Layout 布局'
                        }, {
                            value: 'color',
                            label: 'Color 色彩'
                        }, {
                            value: 'typography',
                            label: 'Typography 字体'
                        }, {
                            value: 'icon',
                            label: 'Icon 图标'
                        }, {
                            value: 'button',
                            label: 'Button 按钮'
                        }]
                    }, {
                        value: 'form',
                        label: 'Form',
                        children: [{
                            value: 'radio',
                            label: 'Radio 单选框'
                        }, {
                            value: 'checkbox',
                            label: 'Checkbox 多选框'
                        }, {
                            value: 'input',
                            label: 'Input 输入框'
                        }, {
                            value: 'input-number',
                            label: 'InputNumber 计数器'
                        }, {
                            value: 'select',
                            label: 'Select 选择器'
                        }, {
                            value: 'cascader',
                            label: 'Cascader 级联选择器'
                        }, {
                            value: 'switch',
                            label: 'Switch 开关'
                        }, {
                            value: 'slider',
                            label: 'Slider 滑块'
                        }, {
                            value: 'time-picker',
                            label: 'TimePicker 时间选择器'
                        }, {
                            value: 'date-picker',
                            label: 'DatePicker 日期选择器'
                        }, {
                            value: 'datetime-picker',
                            label: 'DateTimePicker 日期时间选择器'
                        }, {
                            value: 'upload',
                            label: 'Upload 上传'
                        }, {
                            value: 'rate',
                            label: 'Rate 评分'
                        }, {
                            value: 'form',
                            label: 'Form 表单'
                        }]
                    }, {
                        value: 'data',
                        label: 'Data',
                        children: [{
                            value: 'table',
                            label: 'Table 表格'
                        }, {
                            value: 'tag',
                            label: 'Tag 标签'
                        }, {
                            value: 'progress',
                            label: 'Progress 进度条'
                        }, {
                            value: 'tree',
                            label: 'Tree 树形控件'
                        }, {
                            value: 'pagination',
                            label: 'Pagination 分页'
                        }, {
                            value: 'badge',
                            label: 'Badge 标记'
                        }]
                    }, {
                        value: 'notice',
                        label: 'Notice',
                        children: [{
                            value: 'alert',
                            label: 'Alert 警告'
                        }, {
                            value: 'loading',
                            label: 'Loading 加载'
                        }, {
                            value: 'message',
                            label: 'Message 消息提示'
                        }, {
                            value: 'message-box',
                            label: 'MessageBox 弹框'
                        }, {
                            value: 'notification',
                            label: 'Notification 通知'
                        }]
                    }, {
                        value: 'navigation',
                        label: 'Navigation',
                        children: [{
                            value: 'menu',
                            label: 'NavMenu 导航菜单'
                        }, {
                            value: 'tabs',
                            label: 'Tabs 标签页'
                        }, {
                            value: 'breadcrumb',
                            label: 'Breadcrumb 面包屑'
                        }, {
                            value: 'dropdown',
                            label: 'Dropdown 下拉菜单'
                        }, {
                            value: 'steps',
                            label: 'Steps 步骤条'
                        }]
                    }, {
                        value: 'others',
                        label: 'Others',
                        children: [{
                            value: 'dialog',
                            label: 'Dialog 对话框'
                        }, {
                            value: 'tooltip',
                            label: 'Tooltip 文字提示'
                        }, {
                            value: 'popover',
                            label: 'Popover 弹出框'
                        }, {
                            value: 'card',
                            label: 'Card 卡片'
                        }, {
                            value: 'carousel',
                            label: 'Carousel 走马灯'
                        }, {
                            value: 'collapse',
                            label: 'Collapse 折叠面板'
                        }]
                    }]
                }, {
                    value: 'ziyuan',
                    label: '资源',
                    children: [{
                        value: 'axure',
                        label: 'Axure Components'
                    }, {
                        value: 'sketch',
                        label: 'Sketch Templates'
                    }, {
                        value: 'jiaohu',
                        label: '组件交互文档'
                    }]
                }],
                filters: {
                    Name: ''
                },
                users: [],
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

                },
                //编辑界面数据
                editForm: {
                    Id: 0,
                    CreateBy: '',
                    Name: '',
                    Description: '',
                    Enabled: true,
                    IsButton: false,
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {

                    Name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],

                },
                //新增界面数据
                addForm: {
                    CreateBy: '',
                    CreateId: '',
                    Name: '',
                    Description: '',
                    Enabled: true,
                    IsButton: false,
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
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.addForm = {
                    CreateBy: '',
                    CreateId: '',
                    Name: '',
                    Description: '',
                    Enabled: true,
                    IsButton: false,
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

                            editPermission(para).then((res) => {

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
        }
    }

</script>

<style scoped>

</style>
