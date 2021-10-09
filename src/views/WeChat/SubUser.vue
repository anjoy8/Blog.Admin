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
        <el-form-item>
          <el-button type="primary" :disabled="selectWeChat==''" @click="searchWeChatAccount">刷新</el-button>
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
      <el-table-column prop="openid" label="OpenID" width="300" ></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="200" ></el-table-column>
      <el-table-column prop="country" label="国家" width="100" ></el-table-column>
      <el-table-column prop="province" label="省份" width="100" ></el-table-column>
      <el-table-column prop="city" label="城市" width="50" ></el-table-column>
      <el-table-column prop="headimgurl" label="头像" width >
         <!--插入图片链接的代码-->
      <template slot-scope="scope">
        <img  :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px">
      </template>

      </el-table-column>
      
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
import { getWeChatSubUser, getWeChatAccount } from "../../api/api";
export default {
  name: "WeChatCompany",
  data() {
    return {
      wechats: [], //微信公众号列表
      selectWeChat: "", //当前选中的微信公众号 
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
      this.listLoading = true;  
      getWeChatSubUser({
        id:this.selectWeChat,
        intPageIndex: this.page.pageIndex,
        intPageSize: this.page.pageSize,
        strOrderByFileds: "PushLogTime desc"
      }).then(res => {
        this.listLoading = false;
        console.log(res);
        if (res.data.success) {
          console.log(res.data.response.users);
          this.tableData = res.data.response.users;
          this.page.pageTotal = res.data.response.total;
          this.$message({
            type: "success",
            message: res.data.msg
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
    }
  },
  mounted() {
    let that = this;
  },
  watch: {
    selectWeChat: function(newName, oldName) {
      this.page.pageIndex = 1; 
      this.searchWeChatAccount();
    }
  }
};
</script> 
