<template>
  <section>
    <!--工具条-->
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true"  @submit.native.prevent>
        <el-form-item> 
          <el-select v-model="selectWeChat" placeholder="请选择要操作的公众号">
            <el-option
              v-for="item in wechats"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item> 
          <el-button type="primary" :disabled="selectWeChat==''" @click="searchWeChatAccount(selectWeChat)">刷新</el-button>
          <el-button type="primary" :disabled="selectWeChat==''" @click="handleSendCar">模拟消息</el-button>
        </el-form-item>
      </el-form>
      
        
    </el-col>

    <!--列表-->
    <el-table
      :data="tableData"
      highlight-current-row
      @current-change="selectCurrentRow"
      v-loading="listLoading" 
      style="width: 100%;"
    > 
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="title" label="标题" width sortable></el-table-column>
      <el-table-column prop="template_id" label="模板ID" width sortable></el-table-column>
      <el-table-column prop="content" label="示例" width sortable></el-table-column>
      <el-table-column prop="example" label="格式" width sortable></el-table-column>  
    </el-table>
     <!--工具条-->
    <el-col :span="24" class="toolbar">
       
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :total="page.pageTotal"
        style="float:right;"
      ></el-pagination>
    </el-col>



    <!--模拟消息-->
    <el-dialog
      title="卡片消息"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="200px" :rules="editFormRules" ref="editForm">
        <el-form-item label="公众号" prop="id">
          <el-select v-model="editForm.info.id" placeholder="请选择要操作的公众号">
            <el-option
              v-for="item in wechats"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择客户" prop="companyCode">
          <el-select v-model="editForm.info.companyCode" placeholder="请选择要操作的客户">
            <el-option
              v-for="item in companys"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择用户" prop="userID">
          <el-input v-model="editForm.info.userID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="模板ID" prop="template_id">
          <el-input v-model="editForm.cardMsg.template_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="first" prop="first">
          <el-input v-model="editForm.cardMsg.first" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="colorFirst" prop="colorFirst">
          <el-input v-model="editForm.cardMsg.colorFirst" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyword1" prop="keyword1">
          <el-input v-model="editForm.cardMsg.keyword1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="color1" prop="color1">
          <el-input v-model="editForm.cardMsg.color1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyword2" prop="keyword2">
          <el-input v-model="editForm.cardMsg.keyword2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="color2" prop="color2">
          <el-input v-model="editForm.cardMsg.color2" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="keyword3" prop="keyword3">
          <el-input v-model="editForm.cardMsg.keyword3" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="color3" prop="color3">
          <el-input v-model="editForm.cardMsg.color3" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="keyword4" prop="keyword4">
          <el-input v-model="editForm.cardMsg.keyword4" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="color4" prop="color4">
          <el-input v-model="editForm.cardMsg.color4" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="keyword5" prop="keyword5">
          <el-input v-model="editForm.cardMsg.keyword5" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="color5" prop="color5">
          <el-input v-model="editForm.cardMsg.color5" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="remark" prop="remark">
          <el-input v-model="editForm.cardMsg.remark" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="colorRemark" prop="colorRemark">
          <el-input v-model="editForm.cardMsg.colorRemark" auto-complete="off"></el-input>
        </el-form-item> 
         <el-form-item label="url" prop="url">
          <el-input v-model="editForm.cardMsg.url" auto-complete="off"></el-input>
        </el-form-item>  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">发送</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getWeChatTemplate,
  getWeChatAccount,
  getWeChatCompany,
  pushCardMsg
} from "../../api/api";
export default {
  name: "WeChatCompany",
  data() {
    return {
      page: {
        pageSize: 50,
        pageIndex: 1,
        pageTotal: 50
      },
      listLoading: false,
      tableData: [],
      wechats: [], //微信公众号列表
      companys: [], //客户列表
      selectWeChat: "", //当前选中的微信公众号
      currentRow:null,//当前选中行
      editFormVisible: false,
      editLoading: false, 
      editForm: {
        info:{
          id:'',
          companyCode:'',
          userID:''
        },
        cardMsg:{
          template_id:'',
          first:'',
          colorFirst:'',
          keyword1:'',
          color1:'',
          keyword2:'',
          color2:'',
          keyword3:'',
          color3:'',
          keyword4:'',
          color4:'',
          keyword5:'',
          color5:'',
          remark:'',
          colorRemark:'',
          url:''
        }
      },
      editFormRules: {
        // userID: [
        //   { required: true, message: "请输入用户ID", trigger: "blur" }
        // ],
        // template_id: [
        //   { required: true, message: "请输入模板ID", trigger: "blur" }
        // ],
        // companyCode: [
        //   { required: true, message: "请选择要操作的客户", trigger: "blur" }
        // ],
        // id: [
        //   { required: true, message: "请选择要操作的公众号", trigger: "blur" }
        // ],
      }
    };
  },
  created() {
     this.getWeChats();
     this.getWeCompanys();
  },
  methods: { 
    editSubmit() {
      //保存
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认发送吗？", "提示", {}).then(() => {
            this.editLoading = true;
            pushCardMsg(this.editForm)
            .then(res => {
              this.editLoading = false;
              if (res.data.success) { 
                this.editFormVisible = false;
                this.$message.success("推送成功!");
              }else{
                  this.$message.error(res.data.msg);
              }
              
            });
          });
        }
      });
    },
    getWeCompanys() {
      getWeChatCompany().then(res => {
        this.companys = []; 
        res.data.response.data.forEach(element => {
          this.companys.push({
            value: element.CompanyID,
            label: element.CompanyName
          });
        });
      });
    },
    selectCurrentRow(val) {
      this.currentRow = val;
    },
    handleSendCar(){ 
      this.editForm.info.id = this.selectWeChat;
      if(this.currentRow)
        this.editForm.cardMsg.template_id = this.currentRow.template_id;
      this.editFormVisible = true;
    },
    handleCurrentChange(index) {
      this.page.pageIndex = index;
      this.searchWeChatAccount();
    },
    searchWeChatAccount(id) {
      this.listLoading = true;
      this.tableData = [];
      getWeChatTemplate({id:id})
        .then(res => {
          this.listLoading = false; 
          if(res.data.success){ 
              this.tableData = res.data.response.template_list;  
          }else{
             this.$message.error(res.data.msg);
          }
        })
    },
    getWeChats() {
      getWeChatAccount().then(res => {
        if(!res.data.success){
           this.$message.error(res.data.msg);
           return;
        }
        this.wechats = [];
        res.data.response.data.forEach(element => {
          this.wechats.push({
            value: element.publicAccount,
            label: element.publicNick
          });
        });
      });
    }
  },
  mounted() {
    
  },
  watch: {
    selectWeChat: function(newName, oldName) { 
      this.searchWeChatAccount(newName);
    }
  }
};
</script> 
