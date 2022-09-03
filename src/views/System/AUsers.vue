<template>
  <section>
    <!--工具条-->
    <toolbar :buttonList="buttonList" @callFunction="callFunction"></toolbar>

    <!--列表-->
    <el-table :data="users" v-loading="listLoading" @select="dialogCheck" @row-click="selectCurrentRow" ref="table"
      style="width: 100%" class="custom-tbl">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="MD5Token" label="MD5Token" width sortable></el-table-column>
      <el-table-column prop="UserName" label="UserName" width sortable></el-table-column>
      <el-table-column prop="UserId" label="UserId" width sortable></el-table-column>

    </el-table>

  </section>
</template>

<script>
import util from "../../../util/date";
import {
  GetOnlineUsers,
  ForcedDownline,
  Add2Black,
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
      buttonList: [],
      options: [],
      users: [],
      defaultProps: {
        children: "children",
        label: "label",
      },

      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      currentRow: null,
      isResouceShow: 0,
    };
  },
  methods: {
    ForcedDownline() {
      let row = this.currentRow;
      let that = this;
      this.options = [];
      if (!row) {
        this.$message({
          message: "请选择要操作的一行数据！",
          type: "error",
        });

        return;
      }

      let para = { MD5Token: row.MD5Token };
      ForcedDownline(para).then((res) => {
        if (res.data.success) {
          that.getData();
          that.$message({
            message: "操作成功",
            type: "success",
          });
        }
      });
    },
    Add2Black() {
      let row = this.currentRow;
      this.options = [];
      if (!row) {
        this.$message({
          message: "请选择要操作的一行数据！",
          type: "error",
        });

        return;
      }

      let para = { MD5Token: row.MD5Token };
      Add2Black(para).then((res) => {
        if (res.data.success) {
          this.getData();
          this.$message({
            message: "操作成功",
            type: "success",
          });
        }
      });
    },
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
    formatEnabled: function (row, column) {
      return row.Enabled ? "正常" : "未知";
    },
    formatCreateTime: function (row, column) {
      return !row.CreateTime || row.CreateTime == ""
        ? ""
        : util.formatDate.format(new Date(row.CreateTime), "yyyy-MM-dd");
    },
    //获取用户列表
    getData() {
      let _this = this;
      this.currentRow = null;
      this.options = [];
      let para = {
        page: this.page,
        key: this.filters.name,
      };
      this.listLoading = true;
      //NProgress.start();
      GetOnlineUsers(para).then((res) => {
        this.users = res.data.response;
        this.listLoading = false;
        //NProgress.done();
      });
    },

  },
  mounted() {
    this.getData();

    let routers = window.localStorage.router
      ? JSON.parse(window.localStorage.router)
      : [];
    //第一种写法，每个页面都需要写方法，但是可以做特性化处理
    // this.getButtonList(routers);

    //第二种写法，封装到 permissionRouter.js 中
    this.buttonList = getButtonList(this.$route.path, routers);
  },
};
</script>

<style scoped>
.custom-tbl /deep/ .has-gutter .el-checkbox {
  display: none;
}
</style>
