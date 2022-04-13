<template>
  <section>
    <!--工具条-->
    <toolbar :buttonList="buttonList" @callFunction="callFunction"></toolbar>

    <!--列表-->
    <el-table
      :data="users"
      v-loading="listLoading"
      row-key="Id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
      ref="table"
      @select="dialogCheck"
      @row-click="selectCurrentRow"
      class="custom-tbl"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column label="菜单/按钮" width="200">
        <template slot-scope="scope">
          <i class="fa" :class="scope.row.Icon"></i>

          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="PnameArr" label="父节点" width="" sortable>
      </el-table-column>-->
      <el-table-column prop="Code" label="路由地址" width></el-table-column>
      <el-table-column prop="MName" label="API接口" width></el-table-column>
      <el-table-column prop="OrderSort" label="Sort" width></el-table-column>
      <el-table-column prop="IsButton" label="是否按钮" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.IsButton ? 'success' : 'danger'"
            disable-transitions
            >{{ !scope.row.IsButton ? "否" : "是" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="Func" label="按钮事件" width></el-table-column>
      <el-table-column prop="IsHide" label="是否隐藏" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.IsHide ? 'success' : 'danger'"
            disable-transitions
            >{{ !scope.row.IsHide ? "否" : "是" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="IskeepAlive" label="keepAlive" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="!scope.row.IskeepAlive ? 'success' : 'danger'"
            disable-transitions
            >{{ !scope.row.IskeepAlive ? "否" : "是" }}</el-tag
          >
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
      </el-table-column>-->
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="50"
        :total="total"
        style="float: right"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >
        <el-form-item label="菜单名称" prop="Name">
          <el-input v-model="editForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group @change="clkTypeEdit" v-model="editForm.MenuType">
            <el-radio label="目录"></el-radio>
            <el-radio label="页面"></el-radio>
            <el-radio label="按钮"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="路由地址" prop="Code">
          <el-tooltip placement="top">
            <div slot="content">
              如果是目录，请填‘-’字符
              <br />如果是按钮，请输入空格即可
              <br />如果是外链，请带上协议，比如 https://www.baidu.com
              <br />
            </div>
            <el-input
              v-model="editForm.Code"
              :disabled="editCodeDisabled"
              auto-complete="off"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input
            v-model="editForm.Description"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Icon" prop="Icon">
          <el-input v-model="editForm.Icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="Enabled">
          <el-select v-model="editForm.Enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.Name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="OrderSort">
          <el-input
            type="number"
            v-model="editForm.OrderSort"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="IsButton" label="是否按钮" width sortable>
          <el-switch v-model="editForm.IsButton"></el-switch>
        </el-form-item>
        <el-form-item label="按钮事件" prop="Func">
          <el-tooltip
            class="item"
            effect="dark"
            content="只写方法名即可，不用带括号，比如：handleEdit"
            placement="top-start"
          >
            <el-input v-model="editForm.Func" auto-complete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="IsHide" label="隐藏菜单" width sortable>
          <el-switch v-model="editForm.IsHide"></el-switch>
        </el-form-item>
        <el-form-item prop="IskeepAlive" label="keepAlive" width sortable>
          <el-switch v-model="editForm.IskeepAlive"></el-switch>
        </el-form-item>
        <el-form-item prop="PidArr" label="父级菜单" width sortable>
          <el-cascader
            placeholder="请选择，支持搜索功能"
            style="width: 400px"
            v-model="editForm.PidArr"
            :options="options"
            filterable
            :key="isResouceShow"
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
            v-if="!editLoading"
          ></el-cascader>
          <el-cascader
            placeholder="加载中..."
            style="width: 400px"
            v-if="editLoading"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="Mid" label="API接口" width sortable>
          <el-select
            style="width: 100%"
            v-model="editForm.Mid"
            placeholder="请选择API"
          >
            <el-option :key="0" :value="0" :label="'无需api'"></el-option>
            <el-option
              v-for="item in modules"
              :key="item.Id"
              :value="item.Id"
              :label="item.LinkUrl"
            >
              <span style="float: left">{{ item.LinkUrl }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.Name
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addForm"
      >
        <el-form-item label="菜单名称" prop="Name">
          <el-input v-model="addForm.Name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-radio-group @change="clkType" v-model="addForm.MenuType">
            <el-radio label="目录"></el-radio>
            <el-radio label="页面"></el-radio>
            <el-radio label="按钮"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="路由地址" prop="Code">
          <el-tooltip placement="top">
            <div slot="content">
              如果是目录，请填‘-’字符
              <br />如果是按钮，请输入空格即可
              <br />如果是外链，请带上协议，比如 https://www.baidu.com
              <br />
            </div>
            <el-input
              v-model="addForm.Code"
              :disabled="addCodeDisabled"
              auto-complete="off"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input
            v-model="addForm.Description"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="Enabled">
          <el-select v-model="addForm.Enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.Name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="OrderSort">
          <el-input v-model="addForm.OrderSort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="IsButton" label="是否按钮" width sortable>
          <el-switch v-model="addForm.IsButton"></el-switch>
        </el-form-item>
        <el-form-item label="按钮事件" prop="Func">
          <el-input v-model="addForm.Func" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="IsHide" label="隐藏菜单" width sortable>
          <el-switch v-model="addForm.IsHide"></el-switch>
        </el-form-item>
        <el-form-item prop="IskeepAlive" label="keepAlive" width sortable>
          <el-switch v-model="addForm.IskeepAlive"></el-switch>
        </el-form-item>
        <el-form-item
          prop="PidArr"
          v-if="options && options.length > 0"
          label="父级菜单"
          width
          sortable
        >
          <el-cascader
            placeholder="请选择，支持搜索功能"
            style="width: 400px"
            v-model="addForm.PidArr"
            :options="options"
            filterable
            :key="isResouceShow"
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
            v-if="!editLoading"
          ></el-cascader>
          <el-cascader
            placeholder="加载中..."
            style="width: 400px"
            v-if="editLoading"
          ></el-cascader>
        </el-form-item>

        <el-form-item prop="Mid" label="API接口" width sortable>
          <el-select
            style="width: 100%"
            v-model="addForm.Mid"
            placeholder="请选择API"
          >
            <el-option :key="0" :value="0" :label="'无需api'"></el-option>
            <el-option
              v-for="item in modules"
              :key="item.Id"
              :value="item.Id"
              :label="item.LinkUrl"
            >
              <span style="float: left">{{ item.LinkUrl }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.Name
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../../util/date";
import {
  getPermissionListPage,
  getPermissionTreeTable,
  removePermission,
  editPermission,
  addPermission,
  getPermissionTree,
  getModuleListPage,
} from "../../api/api";
import { getButtonList } from "../../promissionRouter";
import Toolbar from "../../components/Toolbar";

export default {
  components: { Toolbar },
  data() {
    return {
      buttonList: [],
      currentRow: null,
      options: [],
      filters: {
        Name: "",
      },
      users: [],
      modules: [], //接口api列表
      statusList: [
        { Name: "激活", value: true },
        { Name: "禁用", value: false },
      ],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      addDialogFormVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        Name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        Code: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
      },
      //编辑界面数据
      editForm: {
        Id: 0,
        Mid: 0,
        OrderSort: 0,
        PidArr: [],
        CreateBy: "",
        Name: "",
        Code: "",
        Description: "",
        Icon: "",
        Func: "",
        Enabled: true,
        IsButton: false,
        IsHide: false,
        IskeepAlive: false,
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addCodeDisabled: false,
      editCodeDisabled: false,
      addFormRules: {
        Name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        Code: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        CreateBy: "",
        CreateId: "",
        PidArr: [],
        Mid: 0,
        OrderSort: 0,
        Name: "",
        Code: "",
        Description: "",
        Icon: "",
        Func: "",
        Enabled: true,
        IsButton: false,
        IsHide: false,
        IskeepAlive: false,
      },
      isResouceShow: 0,
    };
  },
  methods: {
    dialogCheck(selection, row) {
      this.currentRow = null;
      this.$refs.table.clearSelection();
      if (selection.length === 0) {
        return;
      }
      if (row) {
        this.selectCurrentRow(row);
      }
    },
    selectCurrentRow(val) {
      if (val) {
        this.currentRow = val;
        this.$refs.table.clearSelection();
        this.$refs.table.toggleRowSelection(val, true);
      }
    },
    clkType() {
      this.addForm.IsButton = false;
      this.addCodeDisabled = false;
      if (this.addForm.MenuType == "页面") {
        this.addForm.Code = "";
      } else if (this.addForm.MenuType == "目录") {
        this.addForm.Code = "-";
        this.addCodeDisabled = true;
      } else if (this.addForm.MenuType == "按钮") {
        this.addForm.Code = " ";
        this.addForm.IsButton = true;
        this.addCodeDisabled = true;
      }
    },
    clkTypeEdit() {
      this.editForm.IsButton = false;
      this.editCodeDisabled = false;
      if (this.editForm.MenuType == "页面") {
        this.editForm.Code = "";
      } else if (this.editForm.MenuType == "目录") {
        this.editForm.Code = "-";
        this.editCodeDisabled = true;
      } else if (this.editForm.MenuType == "按钮") {
        this.editForm.Code = " ";
        this.editForm.IsButton = true;
        this.editCodeDisabled = true;
      }
    },
    callFunction(item) {
      this.filters = {
        name: item.search,
      };
      this[item.Func].apply(this, item);
    },
    //性别显示转换
    formatEnabled: function (row, column) {
      return row.Enabled ? "正常" : "未知";
    },
    formatCreateTime: function (row, column) {
      return !row.CreateTime || row.CreateTime == ""
        ? ""
        : util.formatDate.format(new Date(row.CreateTime), "yyyy-MM-dd");
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getPermissions();
    },
    load(tree, treeNode, resolve) {
      let para = {
        page: this.page,
        f: tree.Id,
        key: this.filters.Name,
      };
      getPermissionTreeTable(para).then((res) => {
        resolve(res.data.response);
      });
    },
    //获取用户列表
    getPermissions() {
      let para = {
        page: this.page,
        key: this.filters.name,
      };
      this.listLoading = true;

      //NProgress.start();
      getPermissionTreeTable(para).then((res) => {
        this.users = res.data.response;
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
          type: "error",
        });

        return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.Id };
          removePermission(para).then((res) => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }

            this.getPermissions();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit() {
      let row = this.currentRow;
      if (!row) {
        this.$message({
          message: "请选择要编辑的一行数据！",
          type: "error",
        });

        return;
      }
      let that = this;

      that.options = [];

      this.editForm = {};
      that.editLoading = true;
      that.editFormVisible = true;
      that.editCodeDisabled = false;
      let para = { pid: row.Id };
      getPermissionTree(para).then((res) => {
        ++that.isResouceShow;
        this.options.push(res.data.response);
        that.editForm = Object.assign({}, row);
        that.editLoading = false;
      });
    },
    //显示新增界面
    handleAdd() {
      this.options = [];
      this.addFormVisible = true;
      this.addCodeDisabled = false;
      this.addLoading = true;
      this.addForm = {
        CreateBy: "",
        CreateId: "",
        PidArr: [],
        Name: "",
        Code: "",
        OrderSort: 0,
        Description: "",
        Enabled: true,
        Icon: "",
        IsButton: false,
        IsHide: false,
        IskeepAlive: false,
      };

      let para = { pid: 0 };
      getPermissionTree(para).then((res) => {
        ++this.isResouceShow;
        this.options.push(res.data.response);
        this.addLoading = false;
      });
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);

            para.ModifyTime = util.formatDate.format(new Date(), "yyyy-MM-dd");

            para.Pid = para.PidArr.pop();

            if (para.Id == para.Pid) {
              this.$message({
                message: "警告，父节点不能是自己！",
                type: "error",
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
                  type: "success",
                });
                this.$refs["editForm"].resetFields();
                this.$refs.table.setCurrentRow();
                this.editFormVisible = false;
                this.getPermissions();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error",
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
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);

            para.CreateTime = util.formatDate.format(new Date(), "yyyy-MM-dd");
            para.ModifyTime = para.CreateTime;
            para.IsDeleted = false;

            para.Pid = para.PidArr.pop();

            var user = JSON.parse(window.localStorage.user);

            if (user && user.uID > 0) {
              para.CreateId = user.uID;
              para.CreateBy = user.uRealName;
            } else {
              this.$message({
                message: "用户信息为空，先登录",
                type: "error",
              });
              _this.$router.replace(
                _this.$route.query.redirect ? _this.$route.query.redirect : "/"
              );
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
                  type: "success",
                });
                this.$refs["addForm"].resetFields();
                this.options = [];
                this.$refs.table.setCurrentRow();
                this.addFormVisible = false;
                this.getPermissions();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error",
                });
              }
            });
          });
        }
      });
    },
  },
  mounted() {
    this.getPermissions();

    getModuleListPage({ page: -1 }).then((res) => {
      this.modules = res.data.response.data;
    });

    let routers = window.localStorage.router
      ? JSON.parse(window.localStorage.router)
      : [];
    this.buttonList = getButtonList(this.$route.path, routers);
  },
};
</script>

<style scoped>
.custom-tbl /deep/ .has-gutter .el-checkbox {
  display: none;
}
</style>
