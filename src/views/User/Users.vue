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
      ref="table"
      class="custom-tbl"
      style="width: 100%"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column type="index" width="80"> </el-table-column>
      <el-table-column prop="uRealName" label="昵称" width="" sortable>
      </el-table-column>
      <el-table-column prop="uLoginName" label="登录名" width="" sortable>
      </el-table-column>
      <el-table-column prop="RoleNames" label="角色" width="" sortable>
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.RoleNames" :key="item.Id">{{
            item
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="DepartmentName" label="所属部门" width="" sortable>
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width=""
        :formatter="formatSex"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="birth"
        label="生日"
        :formatter="formatBirth"
        width=""
        sortable
      >
      </el-table-column>
      <el-table-column prop="uStatus" label="状态" width="" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.uStatus == 0 ? 'success' : 'danger'"
            disable-transitions
            >{{ scope.row.uStatus == 0 ? "正常" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="50"
        :total="total"
        style="float: right"
      >
      </el-pagination>
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
        <el-form-item label="昵称" prop="uRealName">
          <el-input v-model="editForm.uRealName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="uLoginName">
          <el-input
            v-model="editForm.uLoginName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <!--<el-form-item label="密码" prop="uLoginPWD">-->
        <!--<el-input v-model="editForm.uLoginPWD" show-password  auto-complete="off"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="角色" prop="RIDs">
          <el-select multiple v-model="editForm.RIDs" placeholder="请选择角色">
            <el-option :key="0" :label="'未选择角色'" :value="0"></el-option>
            <el-option
              v-for="item in roles"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="所属部门"
          v-if="options && options.length > 0"
          prop="Dids"
        >
          <el-cascader
            placeholder="请选择，支持搜索功能"
            style="width: 100%"
            v-model="editForm.Dids"
            :options="options"
            filterable
            :key="isResouceShow"
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number
            v-model="editForm.age"
            :min="0"
            :max="200"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.birth"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
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
        <el-form-item label="昵称" prop="uRealName">
          <el-input v-model="addForm.uRealName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="uLoginName">
          <el-input v-model="addForm.uLoginName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="uLoginPWD">
          <el-input
            v-model="addForm.uLoginPWD"
            show-password
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属部门"
          v-if="options && options.length > 0"
          prop="Dids"
        >
          <el-cascader
            placeholder="请选择，支持搜索功能"
            style="width: 100%"
            v-model="addForm.Dids"
            :options="options"
            filterable
            :key="isResouceShow"
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number
            v-model="addForm.age"
            :min="0"
            :max="200"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addForm.birth"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.addr"></el-input>
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
  testapi,
  getUserListPage,
  getRoleListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser,
  getDepartmentTree,
} from "../../api/api";
import { getButtonList } from "../../promissionRouter";
import Toolbar from "../../components/Toolbar";

export default {
  components: { Toolbar },
  data() {
    return {
      filters: {
        name: "",
      },
      users: [],
      roles: [],
      options: [],
      total: 0,
      buttonList: [],
      currentRow: null,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      addDialogFormVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        uLoginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
        ],
        uRealName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        birth: [{ required: true, message: "请填写生日", trigger: "blur" }],
      },
      //编辑界面数据
      editForm: {
        id: 0,
        uID: 0,
        RIDs: 0,
        uLoginName: "",
        uRealName: "",
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: "",
        Dids: [],
        DepartmentId: 0,
      },

      isResouceShow: 0,
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        uLoginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
        ],
        uRealName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        uLoginPWD: [{ required: true, message: "请输入密码", trigger: "blur" }],
        birth: [{ required: true, message: "请填写生日", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        name: "",
        uLoginName: "",
        uRealName: "",
        uLoginPWD: "",
        sex: -1,
        age: 0,
        birth: "",
        Dids: [],
        DepartmentId: 0,
        addr: "",
      },
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
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    formatBirth: function (row, column) {
      return !row.birth || row.birth == ""
        ? ""
        : util.formatDate.format(new Date(row.birth), "yyyy-MM-dd");
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        key: this.filters.name,
      };
      this.listLoading = true;

      testapi();
      //NProgress.start();
      getUserListPage(para).then((res) => {
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
          let para = { id: row.uID };
          removeUser(para).then((res) => {
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

            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit() {
      let row = this.currentRow;
      this.options = [];
      if (!row) {
        this.$message({
          message: "请选择要编辑的一行数据！",
          type: "error",
        });

        return;
      }
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);

      getRoleListPage().then((res) => {
        this.roles = res.data.response.data;
      });

      let para = { pid: 0 };
      getDepartmentTree(para).then((res) => {
        ++this.isResouceShow;
        this.options.push(res.data.response);
      });
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true;
      this.options = [];
      this.addForm = {
        uLoginName: "",
        uRealName: "",
        uLoginPWD: "",
        name: "",
        sex: -1,
        age: 0,
        Dids: [],
        DepartmentId: 0,
        birth: "",
        addr: "",
      };

      let para = { pid: 0 };
      getDepartmentTree(para).then((res) => {
        ++this.isResouceShow;
        this.options.push(res.data.response);
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

            para.birth =
              !para.birth || para.birth == ""
                ? util.formatDate.format(new Date(), "yyyy-MM-dd")
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");

            para.DepartmentId = para.Dids.pop();
            editUser(para).then((res) => {
              if (util.isEmt.format(res)) {
                this.editLoading = false;
                return;
              }
              if (res.data.success) {
                this.editLoading = false;
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
                this.$refs["editForm"].resetFields();
                this.options = [];
                this.editFormVisible = false;
                this.getUsers();
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
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? util.formatDate.format(new Date(), "yyyy-MM-dd")
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");

            para.DepartmentId = para.Dids.pop();
            addUser(para).then((res) => {
              if (util.isEmt.format(res)) {
                this.addLoading = false;
                return;
              }

              if (res.data.success) {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: res.data.msg,
                  type: "success",
                });
                this.$refs["addForm"].resetFields();
                this.options = [];
                this.addFormVisible = false;
                this.getUsers();
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
    this.getUsers();

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
