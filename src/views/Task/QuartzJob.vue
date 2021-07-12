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
      <el-table-column prop="RunTimes" label="累计运行(次)" width sortable></el-table-column>
       <el-table-column prop="IntervalSecond" label="循环周期(秒)" width sortable></el-table-column>
        <el-table-column prop="CycleRunTimes" label="循环次数(次)" width sortable></el-table-column>
      <el-table-column prop="AssemblyName" label="程序集" width sortable></el-table-column>
      <el-table-column prop="ClassName" label="执行类" width="150" sortable></el-table-column>
      <el-table-column prop="BeginTime" label="开始时间" :formatter="formatBeginTime" width sortable></el-table-column>
      <el-table-column prop="EndTime" label="结束时间" :formatter="formatEndTime" width sortable></el-table-column>
      <!--<el-table-column prop="CreateBy" label="创建者" width="" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="IsStart" label="状态-数据库" width="" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.IsStart  ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.IsStart ? "运行中":"停止"}}</el-tag>
        </template>
      </el-table-column>  

      <el-table-column prop="Triggers"  label="状态-内存" width="" sortable >
      <template slot-scope="scope">
         <el-tag
            :type="(scope.row.Triggers[0].triggerStatus=='正常')  ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.Triggers[0].triggerStatus}}</el-tag>
      </template>
    </el-table-column> 
    <!-- <el-table-column prop="Remark" label="备注" ></el-table-column> -->
      
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
      :title="editForm.operType"
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
          
            <el-col :span="20"><el-input v-model="editForm.AssemblyName" auto-complete="off"></el-input></el-col>
           
            <el-col :span="4"><el-button style="width:100%;overflow: hidden;" @click.prevent="handleTask">选择任务</el-button></el-col>
         
          
        </el-form-item>
         <el-form-item label="执行类名" prop="ClassName">
          <el-input v-model="editForm.ClassName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="执行参数" prop="JobParams">
          <el-input
            class="textarea"
            type="textarea"
            :rows="10"
            v-model="editForm.JobParams"
          ></el-input>
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
        <el-form-item label="循环次数" v-if="!editForm.TriggerType" prop="CycleRunTimes">
          <el-tooltip placement="top">
            <div slot="content">
                 设置成0时,就意味着无限制次数运行
            </div>
           <el-input-number v-model="editForm.CycleRunTimes"  :min="0" style="width:200px;" auto-complete="off"></el-input-number>
         </el-tooltip> 
            <span style="float:right;color: #aaa;">(单位：次)</span> 
        </el-form-item>
        <el-form-item label="是否激活" prop="IsStart">
          <el-switch v-model="editForm.IsStart" >
            </el-switch>
        </el-form-item>

        <el-form-item label="开始时间" prop="BeginTime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.BeginTime" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="EndTime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.EndTime" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

     <!--任务选择界面-->
    <el-dialog
      title="选择任务"
      :visible.sync="namespace.editFormVisible"
      v-model="namespace.editFormVisible"
      :close-on-click-modal="false"
    >
      <el-table
        ref="singleTable"
        :data="namespace.tableData"
        highlight-current-row
        @current-change="handleTaskCurrentChange"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="nameSpace"
          label="命名空间"
          width="200">
        </el-table-column>
        <el-table-column
          property="nameClass"
          label="类名"
          width="200">
        </el-table-column>
        <el-table-column
          property="remark"
          label="备注">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="namespace.editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="selectTask" :loading="namespace.editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../../util/date";
import { getTaskListPage, removeTask, editTask, addTask,startJob, stopJob, reCovery ,pauseJob,resumeJob,getTaskNameSpace} from "../../api/api";
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
        TriggerType: 1,
        Cron: "",
        IntervalSecond: 1,
        CycleRunTimes:1,
        BeginTime: "",
        EndTime: "",
        AssemblyName: "",
        ClassName: "",
        Remark: "",
        JobParams:"",
        IsDeleted:false,
        IsStart: false
      },
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }, {
            text: '一月后(30)',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          }, {
            text: '一年后(365)',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit('pick', date);
            }
          }]
        },
        namespace:{
          tableData:[],
          currentRow:null,
          editFormVisible:false,
          editLoading:false
        },
    };
  },
  methods: {
    handleTask(){
      this.namespace.editFormVisible = true;
      this.getTaskNameSpace();
    },
    handleTaskCurrentChange(val) {
      this.namespace.currentRow = val;
    },
    selectTask(){
      if(!this.namespace.currentRow){
        this.$message.error("请选择要添加的任务");
        return;
      }
      this.editForm.AssemblyName = this.namespace.currentRow.nameSpace;
      this.editForm.ClassName = this.namespace.currentRow.nameClass;
      this.namespace.editFormVisible = false;
      this.namespace.currentRow = null;
    },
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
        : util.formatDate.format(new Date(row.CreateTime), "yyyy-MM-dd hh:mm:ss");
    },
    formatBeginTime: function(row, column) {
      return !row.BeginTime || row.BeginTime == ""
        ? ""
        : util.formatDate.format(new Date(row.BeginTime), "yyyy-MM-dd hh:mm:ss");
    },
    formatEndTime: function(row, column) {
      return !row.EndTime || row.EndTime == ""
        ? ""
        : util.formatDate.format(new Date(row.EndTime), "yyyy-MM-dd hh:mm:ss");
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
    getTaskNameSpace() {
      let _this = this; 
      getTaskNameSpace({}).then(res => {
        this.namespace.tableData = res.data.response;
      });
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
      this.editForm.operType = '编辑'
    },
    //显示新增界面
    handleAdd() {
      this.editFormVisible = true;
      this.editForm = {
        Id: 0,
        Name: "",
        JobGroup: "",
        TriggerType: true,
        Cron: "",
        IntervalSecond: 1,
        CycleRunTimes:1,
        BeginTime: "",
        EndTime: "",
        AssemblyName: "",
        ClassName: "",
        Remark: "",
        JobParams:"",
        IsDeleted:false,
        IsStart: false
      };
      this.editForm.operType = '添加'
    },
    submit(){
      if(this.editForm.operType =='添加'){
        this.addSubmit();
      }else{
         this.editSubmit();
      }
    },
    //编辑
    editSubmit: function() {
      let _this = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            
            if (para.TriggerType) {
                para.TriggerType=1;
            }else{
                para.TriggerType=0;
            }

            editTask(para).then(res => {
              if (res.data.success) { 
                //NProgress.done();
                this.$message.success(res.data.msg);
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getTasks();
              } else { 
                this.$message.error(res.data.msg);
              }
            }).finally(()=>{
              this.editLoading = false;
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      let _this = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm); 
            
            if (para.TriggerType) {
                para.TriggerType=1;
            }else{
                para.TriggerType=0;
            }

            addTask(para).then(res => {
              if (res.data.success) { 
                //NProgress.done();
                this.$message.success(res.data.msg);
                this.$refs["editForm"].resetFields();
                 this.editFormVisible = false;
                this.getTasks();
              } else { 
                this.$message.error(res.data.msg);
              }
            }).finally(()=>{
              this.editLoading = false;
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
                message: res.data.msg,
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
    //停止job
    handleStopJob() {
      let row = this.currentRow;
      if (!row) {
        this.$message({
          message: "请选择要操作的一行数据！",
          type: "error"
        });

        return;
      }
      this.$confirm("确认停止该Job吗?", "提示", {
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
                message: res.data.msg,
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
                message: res.data.msg,
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
    },//暂停job
    handlePauseJob() {
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
          pauseJob(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: res.data.msg,
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
    //恢复job
    handleResumeJob() {
      let row = this.currentRow;
      if (!row) {
        this.$message({
          message: "请选择要操作的一行数据！",
          type: "error"
        });

        return;
      }
      this.$confirm("确认恢复该Job吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { jobId: row.Id };
          resumeJob(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: res.data.msg,
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
          let para = { jobId: row.Id };
          removeTask(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false;
              return;
            }
            this.listLoading = false;
            //NProgress.done();
            if (res.data.success) {
              this.$message({
                message: res.data.msg,
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
