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
      <el-table-column prop="publicAccount" label="微信公众号ID" width sortable></el-table-column>
      <el-table-column prop="publicNick" label="微信公众名称" width sortable></el-table-column>
      <el-table-column prop="weChatAccount" label="微信用户ID" width sortable></el-table-column>
      <el-table-column prop="weChatNick" label="微信用户名称" width sortable></el-table-column>
      <el-table-column prop="tokenExpiration" label="token过期时间" width sortable></el-table-column> 
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
        <el-pagination  
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" 
                    :page-size="page.pageSize"
                    :page-sizes="[10, 100, 1000]"
                    layout="total, sizes, prev, pager, next"
                    :total="page.pageTotal" style="float:right;">
        </el-pagination>
    </el-col> 
    <!--编辑界面-->
    <el-dialog
      :title="editType"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="200px" :rules="editFormRules" ref="editForm">
        <el-form-item label="微信公众号ID" prop="publicAccount">
          <el-input v-model="editForm.publicAccount" auto-complete="off" :disabled="editType=='edit'?true:false"></el-input>
        </el-form-item>
        <el-form-item label="微信公众号名称" prop="publicNick">
          <el-input v-model="editForm.publicNick" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信ID" prop="weChatAccount">
          <el-input v-model="editForm.weChatAccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信名称" prop="weChatNick">
          <el-input v-model="editForm.weChatNick" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="AppID(应用ID)" prop="appid">
          <el-input v-model="editForm.appid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="APPSecret(应用密钥)" prop="appsecret">
          <el-input v-model="editForm.appsecret" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Token(交互-认证用)" prop="interactiveToken">
          <el-input v-model="editForm.interactiveToken" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Token(令牌-推送用)" prop="token">
          <el-input v-model="editForm.token" auto-complete="off" :disabled="1==1?true:true"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" auto-complete="off"></el-input>
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
  getWeChatAccount, 
  removeWeChatAccount,
  addWeChatAccount,
  updateWeChatAccount,
  batchDeleteChatAccount, 
  refreshWeChatToken
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
      buttonList: [],
      listLoading: false,
      tableData: [],
      sels: [],
      currentRow: null,
      page: {
        pageSize: 10,
        pageIndex: 1,
        pageTotal: 0
      },
      editFormVisible: false,
      editLoading: false,
      editType: "add", //默认新增类型
      editForm: {},
      statusList: [{LinkUrl: '激活', value: true}, {LinkUrl: '禁用', value: false}],
      editFormRules: {
        publicAccount: [
          { required: true, message: "请输入微信公众号ID", trigger: "blur" }
        ],
        publicNick: [
          { required: true, message: "请输入微信公众号名称", trigger: "blur" }
        ],
        appid: [
          { required: true, message: "请输入AppID(应用ID)", trigger: "blur" }
        ],
        appsecret: [
          {
            required: true,
            message: "请输入APPSecret(应用密钥)",
            trigger: "blur"
          }
        ],
        interactiveToken: [
          {
            required: true,
            message: "请输入Token(交互-认证用)",
            trigger: "blur"
          }
        ],
        Enabled: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getWeChatAccount();
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
      this.getWeChatAccount();
    },
    handleSizeChange(val) {
      this.page.pageIndex = 1;
      this.page.pageSize = val;
      this.getWeChatAccount();
    },
    getWeChatAccount() {
      this.listLoading = true;
      let para = {
          intPageIndex: this.page.pageIndex,
          intPageSize: this.page.pageSize,
          strOrderByFileds:'', 
      };
      if(this.filters.name){
        para.conditions = 'publicNick like '+this.filters.name+' | '+ 'publicAccount like '+this.filters.name;
      }
      getWeChatAccount(para)
        .then(res => { 
          this.listLoading = false;
          if(res.data.success){
            this.tableData = res.data.response.data;
            this.page.pageTotal = res.data.response.dataCount
          }
        });
    }, 
    handleRefreshWeChatToken() {
      if(!this.currentRow){
        this.$message.error("请选择要操作的数据行");
        return;
      }
      refreshWeChatToken({ id: this.currentRow.publicAccount }).then(res => { 
          if (res.data.success) { 
            this.getWeChatAccount(); 
            this.$message.success("刷新Token成功!");
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
        removeWeChatAccount({ id:  this.currentRow.publicAccount}).then(res => {
          if (res.data.success) {
            this.getWeChatAccount();
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
              addWeChatAccount(this.editForm)
                .then(res => {
                  this.editLoading = false;
                  if (res.data.success) {
                    this.getWeChatAccount();
                    this.editFormVisible = false;
                    this.$message.success("添加成功!");
                  }else{
                    this.$message.error(res.data.msg);
                  }
                }) 
            } else if (this.editType == "edit") {
              console.log(this.editForm);
              //var postPara = this.editForm;
              updateWeChatAccount(this.editForm)
                .then(res => {
                  this.editLoading = false;
                  if (res.data.success) {
                    this.getWeChatAccount();
                    this.editFormVisible = false;
                    this.$message.success("修改成功!");
                  }else{
                    this.$message.error(res.data.msg);
                  }
                  
                }) 
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
        var ids = this.sels.map(t => t.publicAccount).join(",");
          batchDeleteChatAccount({ ids: ids })
            .then(res => {
              if (res.data.success) {
                this.getWeChatAccount();
                 this.$message.success("批量删除成功!");
              }else{
                this.$message.error(res.data.msg);
              }
            })
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
