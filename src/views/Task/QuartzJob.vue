<template>
  <section>
    <!--工具条-->
    <toolbar :buttonList="buttonList" @callFunction="callFunction"></toolbar>

    <!--列表-->
    <el-table
      :data="Tasks"
      highlight-current-row
      v-loading="listLoading"
      @current-change="selectCurrentRow"
      style="width: 100%;"
    >
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="JobGroup" label="任务组" width sortable></el-table-column>
      <el-table-column prop="Name" label="名称" width sortable></el-table-column>
      
      <el-table-column prop="TriggerType" label="任务类型" width="" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.TriggerType==1  ? 'success' : ''"
            disable-transitions
          >{{scope.row.TriggerType==1 ? "Cron":"Simple"}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="Cron" label="Cron表达式" width sortable></el-table-column>
      <el-table-column prop="IntervalSecond" label="循环s" width sortable></el-table-column>
      <el-table-column prop="RunTimes" label="运行次数" width sortable></el-table-column>
      <el-table-column prop="AssemblyName" label="程序集" width sortable></el-table-column>
      <el-table-column prop="ClassName" label="执行类" width="150" sortable></el-table-column>
      <el-table-column prop="BeginTime" label="开始时间" :formatter="formatBeginTime" width sortable></el-table-column>
      <el-table-column prop="EndTime" label="结束时间" :formatter="formatEndTime" width sortable></el-table-column>
      <!--<el-table-column prop="CreateBy" label="创建者" width="" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="IsStart" label="状态" width="" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.IsStart  ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.IsStart ? "运行中":"停止"}}</el-tag>
        </template>
      </el-table-column>

      
    <el-table-column
      label="日志" >
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p v-html="scope.row.Remark"></p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">Log</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>

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
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="任务组" prop="JobGroup">
          <el-input v-model="editForm.JobGroup" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="editForm.Name" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="程序集" prop="AssemblyName">
          <el-input v-model="editForm.AssemblyName" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="执行类名" prop="ClassName">
          <el-input v-model="editForm.ClassName" auto-complete="off"></el-input>
        </el-form-item>
        
        <el-form-item prop="TriggerType" label="是否Cron" width="" sortable>
            <el-switch v-model="editForm.TriggerType" >
            </el-switch>
            <span style="float:right;color: #aaa;">(1：Cron模式，0：Simple模式)</span> 
        </el-form-item>
        
        <el-form-item label="Cron表达式" v-if="editForm.TriggerType" prop="Cron">
           <el-tooltip placement="top">
            <div slot="content">
                 每隔5秒执行一次：*/5 * * * * ?<br >
                 每隔1分钟执行一次：0 */1 * * * ?<br >
                 每天23点执行一次：0 0 23 * * ?<br >
                 每天凌晨1点执行一次：0 0 1 * * ?<br >
                 每月1号凌晨1点执行一次：0 0 1 1 * ?<br >
                 每月最后一天23点执行一次：0 0 23 L * ?<br >
                 每周星期天凌晨1点实行一次：0 0 1 ? * L<br >
                 在26分、29分、33分执行一次：0 26,29,33 * * * ?<br >
                 每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ?<br >
            </div>
          <el-input v-model="editForm.Cron" auto-complete="off"></el-input>
         </el-tooltip>
        </el-form-item>
        <el-form-item label="循环周期" v-else prop="IntervalSecond">
          <el-input-number v-model="editForm.IntervalSecond"  :min="1" style="width:200px;" auto-complete="off"></el-input-number>
            <span style="float:right;color: #aaa;">(单位：秒)</span> 
        </el-form-item>

        <el-form-item label="是否激活" prop="IsStart">
          <el-switch v-model="editForm.IsStart" >
            </el-switch>
        </el-form-item>

        <el-form-item label="开始时间" prop="BeginTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.BeginTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="EndTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.EndTime"></el-date-picker>
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
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
         <el-form-item label="任务组" prop="JobGroup">
          <el-input v-model="addForm.JobGroup" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="addForm.Name" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="程序集" prop="AssemblyName">
          <el-input v-model="addForm.AssemblyName" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="执行类名" prop="ClassName">
          <el-input v-model="addForm.ClassName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item prop="TriggerType" label="是否Cron" width="" sortable>
            <el-switch v-model="addForm.TriggerType" >
            </el-switch>
            <span style="float:right;color: #aaa;">(1：Cron模式，0：Simple模式)</span> 
        </el-form-item>
        
        <el-form-item label="Cron表达式"  v-if="addForm.TriggerType" prop="Cron">
          <el-tooltip placement="top">
            <div slot="content">
                 每隔5秒执行一次：*/5 * * * * ?<br >
                 每隔1分钟执行一次：0 */1 * * * ?<br >
                 每天23点执行一次：0 0 23 * * ?<br >
                 每天凌晨1点执行一次：0 0 1 * * ?<br >
                 每月1号凌晨1点执行一次：0 0 1 1 * ?<br >
                 每月最后一天23点执行一次：0 0 23 L * ?<br >
                 每周星期天凌晨1点实行一次：0 0 1 ? * L<br >
                 在26分、29分、33分执行一次：0 26,29,33 * * * ?<br >
                 每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ?<br >
            </div>
          <el-input v-model="addForm.Cron" auto-complete="off"></el-input>
         </el-tooltip>

        </el-form-item>
        <el-form-item label="循环周期" v-else  prop="IntervalSecond">
          <el-input-number v-model="addForm.IntervalSecond"  :min="1" style="width:200px;" auto-complete="off"></el-input-number>
            <span style="float:right;color: #aaa;">(单位：秒)</span> 
        </el-form-item>

        <el-form-item label="是否激活" prop="IsStart">
          <el-switch v-model="addForm.IsStart" >
            </el-switch>
        </el-form-item>

        <el-form-item label="开始时间" prop="BeginTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.BeginTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="EndTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.EndTime"></el-date-picker>
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
import { getTaskListPage, removeTask, editTask, addTask,startJob, stopJob, reCovery } from "../../api/api";
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
      Tasks: [],
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
        JobGroup: [{ required: true, message: "请输入组名", trigger: "blur" }],
        Name: [{ required: true, message: "请输入Job名", trigger: "blur" }],
        BeginTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
        EndTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
        AssemblyName: [{ required: true, message: "请输入程序集名", trigger: "blur" }],
        ClassName: [{ required: true, message: "请输入执行的Job类名", trigger: "blur" }],
      },
      //编辑界面数据
      editForm: {
        Id: 0,
        Name: "",
        JobGroup: "",
        Name: "",
        TriggerType: 1,
        Cron: "",
        IntervalSecond: 0,
        BeginTime: "",
        EndTime: "",
        AssemblyName: "",
        ClassName: "",
        Remark: "",
        JobParams:"",
        IsDeleted:false,
        IsStart: false
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        JobGroup: [{ required: true, message: "请输入组名", trigger: "blur" }],
        Name: [{ required: true, message: "请输入Job名", trigger: "blur" }],
        BeginTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
        EndTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
        AssemblyName: [{ required: true, message: "请输入程序集名", trigger: "blur" }],
        ClassName: [{ required: true, message: "请输入执行的Job类名", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        Id: 0,
        Name: "",
        JobGroup: "",
        Name: "",
        TriggerType: 1,
        Cron: "",
        IntervalSecond: 0,
        BeginTime: "",
        EndTime: "",
        AssemblyName: "",
        ClassName: "",
        JobParams:"",
        Remark: "",
        IsDeleted:false,
        IsStart: false
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
    formatBeginTime: function(row, column) {
      return !row.BeginTime || row.BeginTime == ""
        ? ""
        : util.formatDate.format(new Date(row.BeginTime), "yyyy-MM-dd");
    },
    formatEndTime: function(row, column) {
      return !row.EndTime || row.EndTime == ""
        ? ""
        : util.formatDate.format(new Date(row.EndTime), "yyyy-MM-dd");
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTasks();
    },
    //获取用户列表
    getTasks() {
      let _this = this;
      let para = {
        page: this.page,
        key: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      getTaskListPage(para).then(res => {
        this.total = res.data.response.dataCount;
        this.Tasks = res.data.response.data;
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
          removeTask(para).then(res => {
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

            this.getTasks();
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

      if (row.TriggerType==1) {
          row.TriggerType=true
      }

      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true;
      this.addForm = {
        Id: 0,
        Name: "",
        JobGroup: "",
        Name: "",
        TriggerType: true,
        Cron: "",
        IntervalSecond: 0,
        BeginTime: "",
        EndTime: "",
        AssemblyName: "",
        ClassName: "",
        Remark: "",
        JobParams:"",
        IsDeleted:false,
        IsStart: false
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

            if (para.TriggerType) {
                para.TriggerType=1;
            }else{
                para.TriggerType=0;
            }
            editTask(para).then(res => {
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
                this.getTasks();
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

            
            if (para.TriggerType) {
                para.TriggerType=1;
            }else{
                para.TriggerType=0;
            }

            addTask(para).then(res => {
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
                this.getTasks();
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
    //开启job
    handleStartJob() {
      let row = this.currentRow;
      if (!row) {
        this.$message({
          message: "请选择要操作的一行数据！",
          type: "error"
        });

        return;
      }
      this.$confirm("确认启动该Job吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { jobId: row.Id };
          startJob(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: "启动成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }

            this.getTasks();
          });
        })
        .catch(() => {});
    },
    //暂停job
    handleStopJob() {
      let row = this.currentRow;
      if (!row) {
        this.$message({
          message: "请选择要操作的一行数据！",
          type: "error"
        });

        return;
      }
      this.$confirm("确认暂停该Job吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { jobId: row.Id };
          stopJob(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: "暂停成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }

            this.getTasks();
          });
        })
        .catch(() => {});
    },
    //重启job
    handleReCoveryJob() {
      let row = this.currentRow;
      if (!row) {
        this.$message({
          message: "请选择要操作的一行数据！",
          type: "error"
        });

        return;
      }
      this.$confirm("确认重启该Job吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { jobId: row.Id };
          reCovery(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: "重启成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }

            this.getTasks();
          });
        })
        .catch(() => {});
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
    this.getTasks();
console.log(this.addForm)
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
