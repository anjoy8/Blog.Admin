<template>
  <div style="margin-top: 30px">
    <el-row class="panel-group">
      <el-col
        class="card-panel-col"
        style="float: left; width: calc(100% - 405px); margin: 0"
      >
        <el-card class="welcome-card activeuser note">
          <div slot="header" class="clearfix">
            <span>今日活跃用户</span>
          </div>

          <div
            class="bg-color-sub"
            style="background: rgb(236, 245, 255) none repeat scroll 0% 0%"
          >
            <div
              v-for="(item, index) in welcomeInitData.activeUsers"
              :key="item.user + index"
              class="bg-blue-sub-item"
              :style="getBck(index)"
            >
              <el-badge
                :value="item.count > 9999 ? '9999+' : item.count"
                class="item"
                :type="getTypeName(item.count)"
              >
                <label :title="item.user" class="acc-user">{{ item.user }}</label>
              </el-badge>
            </div>
          </div>
        </el-card>
      </el-col>
      <div class="statistical-cus">
        <el-col class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-description">
              <div class="card-panel-text">今日活跃</div>
              <span data-v-6723c96e class="card-acuser-num">{{
                welcomeInitData.activeUserCount > 9
                  ? welcomeInitData.activeUserCount
                  : "0" + welcomeInitData.activeUserCount
              }}</span>
            </div>
          </div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-description">
              <div class="card-panel-text">今日新增</div>
              <span data-v-6723c96e class="card-acuser-num">{{
                lineChartDataIDS4.today > 9
                  ? lineChartDataIDS4.today
                  : "0" + lineChartDataIDS4.today
              }}</span>
            </div>
          </div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="card-panel extoday" @click="toLogs">
            <div class="card-panel-description">
              <div class="card-panel-text">今日异常</div>
              <span data-v-6723c96e class="card-panel-num">{{
                welcomeInitData.errorCount > 9
                  ? welcomeInitData.errorCount
                  : "0" + welcomeInitData.errorCount
              }}</span>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row class="panel-group">
      <el-col
        class="card-panel-col"
        style="float: left; width: 100%; margin: 0"
      >
        <el-card class="welcome-card activeuser note">
          <div slot="header" class="clearfix">
            <span>本月活跃用户<span style="color: #ccc;font-size: 14px;">（使用任务调度，1分钟统计一次）</span></span>
          </div>

          <div
            class="bg-color-sub"
            style="background: rgb(236, 245, 255) none repeat scroll 0% 0%"
          >
            <div
              v-for="(item, index) in welcomeInitData.activeCount"
              :key="item.user + index"
              class="bg-blue-sub-item-m"
              :class="item.count > 9999 ? 'amazing':''"
              :style="getBck(index)"
            >
              <el-badge
                :value="item.count > 999999 ? '999999+' : item.count"
                class="item"
                :type="getTypeName(item.count)"
              >
                <label :title="item.user" class="acc-user">{{ item.user }}</label>
              </el-badge>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card
      class="welcome-card note note50"
      style="width: calc(49% - 10px); margin-right: 10px"
    >
      <div slot="header" class="clearfix">
        <span>操作指南</span>
      </div>
      <div class="text item">
        <i class="el-icon-edit"></i
        >、在vue.config.js中配置项目端口号，以及代理后端API项目域名。
      </div>
      <div class="text item">
        <i class="el-icon-edit"></i>、在global.js中配置授权方案global.IS_IDS4。
      </div>
      <div class="text item">
        <i class="el-icon-edit"></i>、动态添加页面以及权限配置，看右侧两个动图。
      </div>
      <div class="text item">
        <i class="el-icon-edit"></i>、更多内容，查看官方文档：
        <a href="http://vueadmin.neters.club/.doc/" target="_blank"
          >http://vueadmin.neters.club/.doc/</a
        >。
      </div>
    </el-card>
    <el-card
      class="welcome-card note50"
      style="width: 49%; margin: 0; font-size: 14px"
    >
      <div slot="header" class="clearfix">
        <span style="font-size: 16px">服务器</span>
      </div>
      <div class="text item">环境变量：{{ serverInfo.EnvironmentName }}</div>
      <div class="text item">系统架构：{{ serverInfo.OSArchitecture }}</div>
      <div class="text item">
        ContentRootPath：{{ serverInfo.ContentRootPath }}
      </div>
      <div class="text item">WebRootPath：{{ serverInfo.WebRootPath }}</div>
      <div class="text item">
        .NET Core版本：{{ serverInfo.FrameworkDescription }}
      </div>
      <div class="text item">内存占用：{{ serverInfo.MemoryFootprint }}</div>
      <div class="text item">启动时间：{{ serverInfo.WorkingTime }}</div>
      <div>
        <br />
      </div>
    </el-card>
    <el-card class="welcome-card note" style="width: 98%; margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>30天用户注册曲线图</span>
      </div>

      <el-col :span="24" class="echarts-item">
        <ve-line
          :data="lineChartDataIDS4"
          :extend="extend"
          :settings="lineChartSettings7Day"
          :mark-point="lineChartMarkPoint"
        ></ve-line>
      </el-col>
    </el-card>
    <el-card class="welcome-card" style="margin-top: 20px; width: 98%">
      <div slot="header" class="clearfix">
        <span>
          访问日志
          <span style="font-size: 12px">(Top 50 desc)</span>
        </span>
      </div>
      <el-table
        :data="welcomeInitData.logs"
        highlight-current-row
        border
        v-loading="listLoading"
        style="width: 100%; font-size: 12px"
      >
        <el-table-column
          prop="User"
          label="访问者"
          width="150px"
          sortable
        ></el-table-column>
        <el-table-column
          prop="IP"
          label="请求地址"
          width="150px"
        ></el-table-column>
        <el-table-column
          prop="BeginTime"
          label="请求时间"
          width="150px"
        ></el-table-column>
        <el-table-column prop="API" label="访问接口" width></el-table-column>
        <el-table-column
          prop="RequestMethod"
          label="Method"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="OPTime"
          label="响应时长"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="RequestData"
          label="参数"
          width
        ></el-table-column>
        <el-table-column
          prop="Agent"
          label="Agent"
          width="80"
          show-overflow-tooltip
        >
          <template scope="scope">
            <div style="text-decoration: underline; cursor: pointer">
              {{ scope.row.Agent }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <br />
    </el-card>

    <el-card class="welcome-card" style="margin-top: 20px; width: 98%">
      <div slot="header" class="clearfix">
        <span>相关配置</span>
      </div>

      <el-aside>1、动态添加一个vue页面：</el-aside>

      <br />

      <div class="text item">
        <i class="el-icon-edit"></i>、更多内容，查看博客园文档：
        <a
          href="https://www.cnblogs.com/laozhang-is-phi/p/10643993.html#autoid-2-6-0"
          target="_blank"
          >https://www.cnblogs.com/laozhang-is-phi/p/10643993.html#autoid-2-6-0</a
        >。
      </div>

      <br />
      <hr />
      <br />

      <el-aside>2、快速配置接口权限：</el-aside>

      <br />
      <div style="height: 300px; overflow-y: auto">
        <el-steps direction="vertical">
          <el-step
            title="步骤 1"
            description="创建一个测试控制器 DemoController"
          ></el-step>
          <el-step
            title="步骤 2"
            description="修改接口路由地址，带上 [action] ，比如，/api/[controller]/[action]，编译是否正常"
          ></el-step>
          <el-step
            title="步骤 3"
            description="给需要加权限的路由api上，增加授权特性[[Authorize(Permissions.Name)]]"
          ></el-step>
          <el-step
            title="步骤 4"
            description="测试 /api/demo/get 接口，是否已经被保护"
          ></el-step>
          <el-step
            title="步骤 5.1"
            description="vueadmin 后台 配置权限：第一步：登录后台，新建api接口"
          ></el-step>
          <el-step
            title="步骤 5.2"
            description="第二步：添加一个菜单，可以是一个查询按钮，也可以是一个路由页面"
          ></el-step>
          <el-step
            title="步骤 5.3"
            description="第三步：权限分配！勾选角色和刚刚的菜单"
          ></el-step>
          <el-step
            title="步骤 6"
            description="如果后端netcore资源服务器有缓存，记得清理"
          ></el-step>
          <el-step
            title="步骤 7"
            description="重新登录Admin管理后台，访问接口，查看是否有权限"
          ></el-step>
        </el-steps>
      </div>

      <br />
    </el-card>
  </div>
</template>

<script>
import Vue from "vue";
import VCharts from "v-charts";
Vue.use(VCharts);

import applicationUserManager from "../Auth/applicationusermanager";
import {
  getServerInfo,
  getAccessLogs,
  getIds4UsersGrow,
  getActiveUsers,
  getAchieveUsers_IS4,
} from "../api/api";

export default {
  name: "Welcome",
  data() {
    return {
      listLoading: false,
      welcomeInitData: {
        activeUsers: [],
        activeUserCount: 0,
        logs: [],
        errorCount: 0,
      },
      serverInfo: {},
      extend: {
        series: {
          label: {
            normal: {
              show: true,
            },
          },
        },
      },
      lineChartDataIDS4: {
        columns: [],
        rows: [],
        today: 0,
      },
      lineChartSettings7Day: {
        metrics: ["count"],
        dimension: ["date"],
      },
      lineChartMarkPoint: {
        data: [
          {
            name: "最大值",
            type: "max",
          },
          {
            name: "最小值",
            type: "min",
          },
        ],
      },
    };
  },
  methods: {
    getTypeName(count) {
      if (count >= 10 && count < 50) {
        return "warning";
      }
      if (count < 10) {
        return "primary";
      }
      return "danger";
    },
    getBck(index) {
      return `background: rgb(${43 + index * 14}, ${
        148 + index * 7
      }, 255) none repeat scroll 0% 0%;`;
    },
    toLogs() {
      this.$router.replace({
        path: "/Logs/Index",
      });
    },
  },
  mounted() {
    var curTime = new Date();
    if (window.localStorage.TokenExpire) {
      var expiretime = new Date(Date.parse(window.localStorage.TokenExpire));
      if (curTime >= expiretime) {
        if (global.IS_IDS4) {
          applicationUserManager.login();
        } else {
          this.$router.push("/login");
        }
      }
    } else {
      if (global.IS_IDS4) {
        applicationUserManager.login();
      } else {
        this.$router.push("/login");
      }
    }

    if (global.IS_IDS4) {
      getAchieveUsers_IS4({}).then((res) => {
        this.lineChartDataIDS4 = res.data.response;
      });
    }

    getServerInfo({}).then((res) => {
      this.serverInfo = res.data.response;
    });

    getActiveUsers({}).then((res) => {
      this.welcomeInitData = res.data.response;
    });
  },
};
</script>

<style scoped>
.amazing /deep/ .el-badge__content{
  background-color: purple !important;
}
.bg-blue-sub-item {
  max-width: 120px !important;
  height: 50px;
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
  padding: 0 10px;
}
.bg-blue-sub-item .acc-user {
  max-width: 115px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bg-blue-sub-item-m {
  height: 50px;
  float: left;
  color: #fff;
  font-size: 12px;
  line-height: 50px;
  padding: 0 10px;
}
.bg-blue-sub-item-m .acc-user {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.note .text {
  font-size: 14px;
}

.note .item {
  margin-bottom: 18px;
}
</style>

<style scoped>
.panel-group {
  margin-bottom: 18px;
  margin-right: 2%;
}
.card-panel-col {
  /* margin-bottom: 32px; */
  width: 113px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-left: 15px;
  float: right;
}

.card-panel {
  height: 108px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
}

.card-panel .card-panel-icon-wrapper {
  color: #fff;
}

.card-panel .card-panel .icon-people {
  background: #40c9c6;
}

.card-panel .card-panel .icon-message {
  background: #36a3f7;
}

.card-panel .card-panel .icon-money {
  background: #f4516c;
}

.card-panel .card-panel .icon-shopping {
  background: #34bfa3;
}

.card-panel .icon-people {
  color: #40c9c6;
}

.card-panel .icon-message {
  color: #36a3f7;
}

.card-panel .icon-money {
  color: #f4516c;
}

.card-panel .icon-shopping {
  color: #34bfa3;
}

.card-panel .card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}

.card-panel .card-panel-icon {
  float: left;
  font-size: 48px;
}

.card-panel .card-panel-description {
  float: left;
  font-weight: bold;
  margin-left: 30px;
  margin-top: 20px;
}
.card-panel .card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel .card-panel-description .card-panel-num {
  font-size: 36px;
  color: #f4516c;
}
.extoday {
  cursor: pointer;
}
.card-acuser-num {
  font-size: 36px;
  color: #40c9c6;
}
.bg-blue-sub-item /deep/ .el-badge__content.is-fixed {
  top: 5px !important;
}
.bg-blue-sub-item-m /deep/ .el-badge__content.is-fixed {
  top: 5px !important;
}

@media (max-width: 550px) {
  .note50 {
    width: 100% !important;
  }
  .statistical-cus {
    width: 100%;
  }

  .card-panel-col {
    margin-bottom: 5px !important;
    width: 100% !important;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
  }
  .card-panel-icon-wrapper .svg-icon {
    display: block;
    margin: 14px auto !important;
    float: none !important;
  }
}
</style>
