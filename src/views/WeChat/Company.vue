<template>
  <section>
    <!--工具条-->
     <toolbar :buttonList="buttonList" @callFunction="callFunction"></toolbar>

    <!--列表-->
    <el-table
      :data="tableData"
      highlight-current-row
       
      v-loading="listLoading"
      @selection-change="selsChange"
      @current-change="selectCurrentRow"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="CompanyID" label="客户代码" width sortable></el-table-column>
      <el-table-column prop="CompanyName" label="客户名称" width sortable></el-table-column>
      <el-table-column prop="CompanyIP" label="客户IP" width sortable></el-table-column>
      <el-table-column prop="CompanyAPI" label="客户API" width sortable></el-table-column> 
      <el-table-column prop="CompanyRemark" label="备注" width sortable></el-table-column> 
       <el-table-column prop="Enabled" label="状态" width="" sortable>
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.Enabled  ? 'success' : 'danger'"
                            disable-transitions>{{scope.row.Enabled ? "正常":"禁用"}}
                    </el-tag>
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
        <el-form-item label="客户代码" prop="CompanyID">
          <el-input v-model="editForm.CompanyID" auto-complete="off" :disabled="editType=='edit'?true:false"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="CompanyName">
          <el-input v-model="editForm.CompanyName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户IP" prop="CompanyIP">
          <el-input v-model="editForm.CompanyIP" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户API" prop="CompanyAPI">
          <el-input v-model="editForm.CompanyAPI" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="CompanyRemark">
          <el-input v-model="editForm.CompanyRemark" auto-complete="off"></el-input>
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
  </section>
</template>

<script>
import {
  getWeChatCompany, 
  removeWeChatCompany,
  addWeWeChatCompany,
  updateWeChatCompany,
  batchDeleteWeChatCompany, 
} from "../../api/api";
import { getButtonList } from "../../promissionRouter";
import Toolbar from "../../components/Toolbar";
export default {
  components: { Toolbar },
  data() {
    return {
      filters: {
        name: ""
      },
      listLoading: false,
      tableData: [],
      sels: [],
      currentRow: null,
      page: {
        pageSize: 50,
        pageIndex: 1,
        pageTotal: 50
      },
      editFormVisible: false,
      editLoading: false,
      editType: "add", //默认新增类型
      editForm: {},
      statusList: [{LinkUrl: '激活', value: true}, {LinkUrl: '禁用', value: false}],
      editFormRules: {
        CompanyID: [
          { required: true, message: "请输入客户代码", trigger: "blur" }
        ],
        Enabled: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ]
      },
      buttonList: [],
    };
  },
  created() {
    this.getWeChatCompany();
  },
  methods: {
    selectCurrentRow(val) {
      this.currentRow = val;
    },
    selsChange(sels) {
      this.sels = sels;
    },
    handleCurrentChange(index) {
      this.page.pageIndex = index;
      this.getWeChatCompany();
    },
    getWeChatCompany() {
      this.listLoading = true;
      let para = {
          intPageIndex: this.page.pageIndex,
          intPageSize: this.page.pageSize,
          strOrderByFileds:'', 
      };
      if(this.filters.name){
        para.conditions = 'CompanyName like '+this.filters.name+' | '+ 'CompanyName like '+this.filters.name;
      }
      getWeChatCompany(para)
        .then(res => {
          this.listLoading = false;
          if(res.data.success){
            this.tableData = res.data.response.data;
          }else{
            this.$message.error(res.data.msg);
          }
        });
    },   
    handleDel() {
      if(!this.currentRow){
        this.$message.error("请选择要操作的数据行");
        return;
      }
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        removeWeChatCompany({ id: this.currentRow.CompanyID }).then(res => {
          if (res.data.success) {
            this.getWeChatCompany();
            this.$message.success("删除成功!");
          }else{
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    handleEdit() {
      //编辑
      if(!this.currentRow){
        this.$message.error("请选择要操作的数据行");
        return;
      }
      this.editFormVisible = true;
      this.editType = "edit";
      this.editForm = Object.assign({}, this.currentRow);
       
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
              addWeWeChatCompany(this.editForm)
                .then(res => {
                  this.editLoading = false;
                  if (res.data.success) {
                    this.getWeChatCompany();
                    this.editFormVisible = false;
                    this.$message.success("添加成功!");
                  }else{
                      this.$message.error(res.data.msg);
                  }
                  
                });
            } else if (this.editType == "edit") {
              //console.log(this.editForm);
              //var postPara = this.editForm;
              updateWeChatCompany(this.editForm)
                .then(res => {
                  this.editLoading = false;
                  if (res.data.success) {
                    this.getWeChatCompany();
                    this.editFormVisible = false;
                    this.$message.success("修改成功!");
                  } else{
                    this.$message.error(res.data.msg);
                  }
                });
            }
          });
        }
      });
    },
    batchRemove() {
      if(!(this.sels.length > 0)){
        this.$message.error("请选择要操作的数据行");
        return;
      }
      this.$confirm("确认批量删除吗？", "提示").then(() => {
        //批量删除
         var ids = this.sels.map(t => t.CompanyID).join(",");
          batchDeleteWeChatCompany({ ids: ids })
          .then(res => {
            if (res.data.success) {
              this.getWeChatCompany();
              this.$message.success("批量成功!");
            }else{
              this.$message.error(res.data.msg);
            }
          });
      });
    },
    callFunction(item) {
        this.filters = {
            name: item.search
        };
        this[item.Func].apply(this, item);
    },
  },
  mounted() {
    let that = this; 
    let routers = window.localStorage.router  ? JSON.parse(window.localStorage.router) : [];
    this.buttonList = getButtonList(this.$route.path, routers);
  }
};
</script> 
