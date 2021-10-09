<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" @submit.native.prevent>
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
        <el-form-item v-if="selectWeChat">
          <el-select v-model="selectCompany" placeholder="请选择要操作的客户">
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
        <el-form-item>
          <el-button type="primary" :disabled="selectWeChat=='' || selectCompany==''" @click="searchWeChatAccount">刷新</el-button>
        </el-form-item>
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
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="SubFromPublicAccount" label="来自公众号" width="100" ></el-table-column>
      <el-table-column prop="CompanyID" label="来自公司" width="100" ></el-table-column>
      <el-table-column prop="SubUserOpenID" label="OpenID" width="300" ></el-table-column>
      <el-table-column prop="SubJobID" label="员工ID" width="150" ></el-table-column>
      <el-table-column prop="SubUserRegTime" label="注册时间" width="200" ></el-table-column>
      <el-table-column prop="SubUserRefTime" label="更新时间" width="200" ></el-table-column>
      
    </el-table>
    <!--工具条-->
    <div class="block"> 
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageIndex"
      :hide-on-single-page="true"
      :page-sizes="[10, 100, 500, 1000]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.pageTotal">
    </el-pagination>
  </div> 
  </section>
</template>

<script>
import { getWeChatBindUser, getWeChatAccount,getWeChatCompany } from "../../api/api";
export default {
  name: "WeChatCompany",
  data() {
    return {
      wechats: [], //微信公众号列表
      companys: [], //客户列表
      selectWeChat: "", //当前选中的微信公众号 
      selectCompany: "", //当前选中的微信客户
      listLoading: false,
      tableData: [],
      sels: [],
      page: {
        pageSize: 10,
        pageIndex: 1,
        pageTotal: 0
      }
    };
  },
  created() {
    this.getWeChats();
    this.getWeCompanys();
  },
  methods: {
    selsChange(sels) {
      this.sels = sels;
    },
    handleCurrentChange(index) {
      this.page.pageIndex = index;
      this.searchWeChatAccount();
    },
    handleSizeChange(size){ 
      this.page.pageIndex = 1;
      this.page.pageSize = size;
      this.searchWeChatAccount();
    },
    searchWeChatAccount() {
      if(this.selectWeChat == '' || this.selectCompany=='') return;
      this.listLoading = true;  
      var pars = {
        intPageIndex: this.page.pageIndex,
        intPageSize: this.page.pageSize,
        strOrderByFileds: "SubFromPublicAccount asc",
        conditions:"SubFromPublicAccount = " + this.selectWeChat + " & " + "IsUnBind = false"
      };
      if(this.selectCompany){
        pars.conditions += "& CompanyID = "+this.selectCompany
      }
      getWeChatBindUser(pars).then(res => {
        this.listLoading = false;
        console.log(res);
        if (res.data.success) {
          this.tableData = res.data.response.data;
          this.page.pageTotal = res.data.response.dataCount;
          this.$message({
            type: "success",
            message: "获取成功!"
          });
        }
      });
    },
    getWeChats() {
      getWeChatAccount().then(res => {
        this.wechats = [];
        res.data.response.data.forEach(element => {
          this.wechats.push({
            value: element.publicAccount,
            label: element.publicNick
          });
        });
      });
    },
    getWeCompanys() {
      getWeChatCompany().then(res => {
        this.companys = [];
        console.log(res);
        res.data.response.data.forEach(element => {
          this.companys.push({
            value: element.CompanyID,
            label: element.CompanyName
          });
        });
      });
    }
  },
  mounted() {
    let that = this;
  },
  watch: {
    selectWeChat: function(newName, oldName) {
      this.page.pageIndex = 1;
      this.searchWeChatAccount();
    },
    selectCompany: function(newName, oldName) {
      this.page.pageIndex = 1;
      this.searchWeChatAccount();
    }
  }
};
</script> 
