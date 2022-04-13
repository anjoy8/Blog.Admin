<template>
  <section>
    <!--工具条-->
    <toolbar :buttonList="buttonList" @callFunction="callFunction"></toolbar>

    <!--列表-->
    <el-table
      :data="users"
      v-loading="listLoading"
      @select="dialogCheck"
      @row-click="selectCurrentRow"
      row-key="Id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      class="custom-tbl"
      style="width: 100%"
      ref="table"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="Name" label="部门" width="200"></el-table-column>
      <el-table-column prop="Id" label="Id" width="80"></el-table-column>
      <el-table-column
        prop="CodeRelationship"
        label="上级关系"
        width
      ></el-table-column>
      <el-table-column prop="Leader" label="负责人" width></el-table-column>
      <el-table-column prop="OrderSort" label="Sort" width></el-table-column>
      <el-table-column prop="Status" label="是否有效" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.Status ? 'success' : 'danger'"
            disable-transitions
            >{{ !scope.row.Status ? "否" : "是" }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="CreateTime"
        label="创建时间"
        :formatter="formatCreateTime"
        width="250"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="ModifyTime"
        label="更新时间"
        :formatter="formatModifyTime"
        width="250"
        sortable
      >
      </el-table-column>
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
        <el-form-item label="部门名称" prop="Name">
          <el-input v-model="editForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级关系" prop="CodeRelationship">
          <el-tooltip placement="top">
            <div slot="content">以','号结尾，方便下属部门统一查询</div>
            <el-input
              v-model="editForm.CodeRelationship"
              disabled
              auto-complete="off"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="负责人" prop="Leader">
          <el-input v-model="editForm.Leader" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="OrderSort">
          <el-input
            type="number"
            v-model="editForm.OrderSort"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否有效" prop="Status" width sortable>
          <el-switch v-model="editForm.Status"></el-switch>
        </el-form-item>
        <el-form-item
          prop="PidArr"
          v-if="options && options.length > 0"
          label="父级部门"
          width
          sortable
        >
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
        <el-form-item label="部门名称" prop="Name">
          <el-input v-model="addForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级关系" prop="CodeRelationship">
          <el-tooltip placement="top">
            <div slot="content">以','号结尾，方便下属部门统一查询</div>
            <el-input
              v-model="addForm.CodeRelationship"
              disabled
              auto-complete="off"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="负责人" prop="Leader">
          <el-input v-model="addForm.Leader" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="OrderSort">
          <el-input v-model="addForm.OrderSort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否有效" prop="Status" width sortable>
          <el-switch v-model="addForm.Status"></el-switch>
        </el-form-item>
        <el-form-item
          prop="PidArr"
          v-if="options && options.length > 0"
          label="父级部门"
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
  getDepartmentTreeTable,
  removeDepartment,
  editDepartment,
  addDepartment,
  getDepartmentTree,
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
        Name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        PidArr: [{ required: true, message: "请选择父节点", trigger: "blur" }],
      },
      //编辑界面数据
      editForm: {
        Id: 0,
        OrderSort: 0,
        PidArr: [],
        CreateBy: "",
        Name: "",
        CodeRelationship: "",
        Leader: "",
        Enabled: true,
        Status: false,
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        Name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        PidArr: [{ required: true, message: "请选择父节点", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        CreateBy: "",
        CreateId: "",
        PidArr: [],
        OrderSort: 0,
        Name: "",
        CodeRelationship: "",
        Leader: "",
        Enabled: true,
        Status: true,
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
    callFunction(item) {
      this.filters = {
        name: item.search,
      };
      this[item.Func].apply(this, item);
    },
    formatCreateTime: function (row, column) {
      return !row.CreateTime || row.CreateTime == ""
        ? ""
        : util.formatDate.format(
            new Date(row.CreateTime),
            "yyyy-MM-dd hh:mm:ss"
          );
    },
    formatModifyTime: function (row, column) {
      return !row.ModifyTime || row.ModifyTime == ""
        ? ""
        : util.formatDate.format(
            new Date(row.ModifyTime),
            "yyyy-MM-dd hh:mm:ss"
          );
    },
    handleCurrentChange(val) {
      this.page = val;
      this.handleQuery();
    },
    load(tree, treeNode, resolve) {
      let para = {
        page: this.page,
        f: tree.Id,
        key: this.filters.Name,
      };
      getDepartmentTreeTable(para).then((res) => {
        resolve(res.data.response);
      });
    },
    //获取用户列表
    handleQuery() {
      let para = {
        page: this.page,
        key: this.filters.name,
      };
      this.listLoading = true;

      //NProgress.start();
      getDepartmentTreeTable(para).then((res) => {
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
          removeDepartment(para).then((res) => {
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

            this.handleQuery();
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
      let para = { pid: row.Id };
      getDepartmentTree(para).then((res) => {
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
      this.addLoading = true;
      this.addForm = {
        CreateBy: "",
        CreateId: "",
        PidArr: [],
        Name: "",
        CodeRelationship: "",
        OrderSort: 0,
        Leader: "",
        Enabled: true,
        Status: false,
      };

      let para = { pid: 0 };
      getDepartmentTree(para).then((res) => {
        ++this.isResouceShow;
        this.options.push(res.data.response);
        this.addLoading = false;
      });
    },
    //编辑
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.CodeRelationship = para.PidArr.join() + ",";

            para.ModifyTime = util.formatDate.format(
              new Date(),
              "yyyy-MM-dd hh:mm:ss"
            );

            para.Pid = para.PidArr.pop();

            if (para.Id == para.Pid) {
              this.$message({
                message: "警告，父节点不能是自己！",
                type: "error",
              });

              this.editLoading = false;
              return;
            }
            editDepartment(para).then((res) => {
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
                this.options = [];
                this.$refs.table.setCurrentRow();
                this.editFormVisible = false;
                this.handleQuery();
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
    addSubmit() {
      let _this = this;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.CodeRelationship = para.PidArr.join() + ",";

            para.CreateTime = util.formatDate.format(
              new Date(),
              "yyyy-MM-dd hh:mm:ss"
            );
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

            addDepartment(para).then((res) => {
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
                this.handleQuery();
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
    this.handleQuery();

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
