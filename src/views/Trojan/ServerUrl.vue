<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="para" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="para.publicAccount" placeholder="标题/内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchWeChatAccount">查询</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button> 
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="tableData"
      highlight-current-row
       
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="servername" label="链接名称" width sortable></el-table-column>
       <el-table-column prop="userid" label="绑定用户" width="150" sortable>
          <template slot-scope="scope">
          <el-select :disabled="true"  v-model="scope.row.userid" >
            <el-option
              v-for="item in tableUser"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
       </el-table-column> 
      <el-table-column prop="serveraddress" label="链接地址" width sortable></el-table-column> 
      <el-table-column prop="serverremark" label="备注" width sortable></el-table-column> 
      <el-table-column prop="serverenable" label="是否启用" width sortable>
         <template slot-scope="scope">
          <el-tag v-if="scope.row.serverenable" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
        </el-table-column> 
      <el-table-column label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="handleDel(scope.row)">删除</el-button> 
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :total="page.pageTotal"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      :title="editType"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="200px" :rules="editFormRules" ref="editForm">
        <el-form-item label="链接名称" prop="servername">
          <el-input v-model="editForm.servername" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="serveraddress">
          <el-input v-model="editForm.serveraddress" auto-complete="off"></el-input>
        </el-form-item> 
        <el-form-item label="是否启用" prop="serverenable">
           <el-switch v-model="editForm.serverenable"  auto-complete="off"></el-switch>
        </el-form-item>
        <el-form-item label="绑定用户" prop="userid">
           <el-select filterable v-model="editForm.userid" placeholder="请选择绑定用户">
            <el-option
              v-for="item in tableUser"
              :key="item.id"
              :label="item.username"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         
        <el-form-item label="备注" prop="serverremark">
          <el-input v-model="editForm.serverremark" auto-complete="off"></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getTrojanUrlServer, 
  delTrojanUrlServer,
  addTrojanUrlServer,
  updateTrojanUrlServer,
  GetAllTrojanUser
} from "../../api/api";
export default {
  name: "WeChatCompany",
  data() {
    return {
      para: {
        CompanyID: "test"
      },
      listLoading: false,
      tableData: [],
      tableUser:[],
      sels: [],
      page: {
        pageSize: 50,
        pageIndex: 1,
        pageTotal: 50
      },
      editFormVisible: false,
      editLoading: false,
      editType: "add", //默认新增类型
      editForm: {},
      editFormRules: {
        serveraddress: [
          { required: true, message: "链接地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.searchWeChatAccount();
    this.getAllUser();
  },
  methods: {
    getAllUser(){
      this.listLoading = false;
      GetAllTrojanUser().then(res => {
            this.listLoading = false;
            if (res.data.success) {
              res.data.response.unshift({
                id:0,
                username:'所有用户'
              });
              this.tableUser = res.data.response; 
            }
          });
    },
    selsChange(sels) {
      this.sels = sels;
    },
    handleCurrentChange(index) {
      this.page.pageIndex = index;
      this.searchWeChatAccount();
    },
    searchWeChatAccount() {
      this.listLoading = true;
      getTrojanUrlServer()
        .then(res => {
          this.listLoading = false;
          if(res.data.success){
            this.tableData = res.data.response;
          }
        });
    },   
    handleDel(row) {
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        var servers = [];
        servers.push(row.id);
        delTrojanUrlServer(servers).then(res => {
          if (res.data.success) {
            this.searchWeChatAccount();
            this.$message({
              message: "删除成功!",
              type: "success"
            });
          }
        });
      });
    },
    handleEdit(row) {
      //编辑
      this.editFormVisible = true;
      this.editType = "edit";
      this.editForm = Object.assign({}, row);
       
    },
    handleAdd() {
      //新增
      this.editFormVisible = true;
      this.editType = "add";
      this.editForm = Object.assign({});
      
    },
    editSubmit() {
      //保存
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            if (this.editType == "add") {
              //console.log(this.editForm);
              //var postPara = this.editForm;
              addTrojanUrlServer(this.editForm)
                .then(res => {
                  this.editLoading = false;
                  if (res.data.success) {
                    this.$message({
                       message: "添加成功!",
                      type: "success"
                    });
                    this.searchWeChatAccount();
                    this.editFormVisible = false;
                  }
                  
                });
            } else if (this.editType == "edit") {
              //console.log(this.editForm);
              //var postPara = this.editForm;
              updateTrojanUrlServer(this.editForm)
                .then(res => {
                  this.editLoading = false;
                  if (res.data.success) {
                    this.$message({
                        message: "编辑成功!",
                      type: "success"
                    });
                    this.searchWeChatAccount();
                    this.editFormVisible = false;
                  } 
                });
            }
          });
        }
      });
    },
    batchRemove() {
      this.$confirm("确认批量删除吗？", "提示").then(() => {
        //批量删除
        if (this.sels.length > 0) {
          var servers = this.sels.map(t => t.id);
          delTrojanUrlServer(servers)
            .then(res => {
              if (res.data.success) {
                this.$message({
                    message: "批量删除成功!",
                  type: "success"
                });
                this.searchWeChatAccount();
              }
            });
        } else {
          this.$message({
            message: "请先选择要删除的数据!",
            type: "info"
          });
        }
      });
    }
  },
  mounted() {
    let that = this;
  }
};
</script> 
