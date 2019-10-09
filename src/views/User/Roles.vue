<template>
  <section>
    <!--工具条-->
    <toolbar :buttonList="buttonList" @callFunction="callFunction"></toolbar>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @current-change="selectCurrentRow"
      style="width: 100%;"
    >
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="Name" label="角色名" width sortable></el-table-column>
      <el-table-column prop="Description" label="说明" width sortable></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" :formatter="formatCreateTime" width sortable></el-table-column>
      <!--<el-table-column prop="CreateBy" label="创建者" width="" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="Enabled" label="状态" width="200" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.Enabled  ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.Enabled ? "正常":"禁用"}}</el-tag>
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
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="50"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="角色名" prop="Name">
          <el-input v-model="editForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="Enabled">
          <el-select v-model="editForm.Enabled" placeholder="请选择角色状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="Description">
          <el-input v-model="editForm.Description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="角色名" prop="Name">
          <el-input v-model="addForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="Enabled">
          <el-select v-model="addForm.Enabled" placeholder="请选择角色状态">
            <el-option label="激活" value="true"></el-option>
            <el-option label="禁用" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="Description">
          <el-input v-model="addForm.Description" auto-complete="off"></el-input>
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
import util from "../../../util/date";
import { getRoleListPage, removeRole, editRole, addRole } from "../../api/api";
import { getButtonList } from "../../promissionRouter";
import Toolbar from "../../components/Toolbar";

export default {
  components: { Toolbar },
  data() {
    return {
      filters: {
        name: ""
      },
      buttonList: [],
      users: [],
      statusList: [
        { name: "激活", value: true },
        { name: "禁用", value: false }
      ],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      currentRow: null,
      addDialogFormVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        Name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        Enabled: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        Id: 0,
        CreateBy: "",
        Name: "",
        Enabled: false
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        Name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        Enabled: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        CreateBy: "",
        CreateId: "",
        Name: "",
        Enabled: true
      }
    };
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
    formatEnabled: function(row, column) {
      return row.Enabled ? "正常" : "未知";
    },
    formatCreateTime: function(row, column) {
      return !row.CreateTime || row.CreateTime == ""
        ? ""
        : util.formatDate.format(new Date(row.CreateTime), "yyyy-MM-dd");
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRoles();
    },
    //获取用户列表
    getRoles() {
      let _this = this;
      let para = {
        page: this.page,
        key: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      getRoleListPage(para).then(res => {
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
          message: "请选择要编辑的一行数据！",
          type: "error"
        });

        return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.Id };
          removeRole(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }

            this.getRoles();
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
        CreateBy: "",
        Name: "",
        Enabled: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);

            para.birth =
              !para.birth || para.birth == ""
                ? util.formatDate.format(new Date(), "yyyy-MM-dd")
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");

            editRole(para).then(res => {
              if (util.isEmt.format(res)) {
                this.editLoading = false;
                return;
              }

              if (res.data.success) {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getRoles();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      let _this = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? util.formatDate.format(new Date(), "yyyy-MM-dd")
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");

            var user = JSON.parse(window.localStorage.user);

            if (user && user.uID > 0) {
              para.CreateId = user.uID;
              para.CreateBy = user.uRealName;
            } else {
              this.$message({
                message: "用户信息为空，先登录",
                type: "error"
              });
              _this.$router.replace(
                _this.$route.query.redirect ? _this.$route.query.redirect : "/"
              );
            }

            addRole(para).then(res => {
              if (util.isEmt.format(res)) {
                this.addLoading = false;
                return;
              }
              if (res.data.success) {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getRoles();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      this.$message({
        message: "该功能未开放",
        type: "warning"
      });
    },
    getButtonList2(routers) {
      let _this = this;
      routers.forEach(element => {
        let path = this.$route.path.toLowerCase();
        if (element.path && element.path.toLowerCase() == path) {
          _this.buttonList = element.children;
          return;
        } else if (element.children) {
          _this.getButtonList(element.children);
        }
      });
    }
  },
  mounted() {
    this.getRoles();

    let routers = window.localStorage.router
      ? JSON.parse(window.localStorage.router)
      : [];
    //第一种写法，每个页面都需要写方法，但是可以做特性化处理
    // this.getButtonList(routers);
    
    //第二种写法，封装到 permissionRouter.js 中
    this.buttonList = getButtonList(this.$route.path, routers);
  }
};
</script>

<style scoped>
</style>
