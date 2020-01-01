<template>
  <div>
    <div desktop="12" tablet="8">
      <dl>
        <dt>Login successful</dt>
        <dt>Your browser should be redirected soon</dt>
      </dl>
    </div>
  </div>
</template>

<script>
import applicationUserManager from "../Auth/applicationusermanager";

import {
  requestLogin,
  requestLoginMock,
  getUserByToken,
  getNavigationBar
} from "../api/api";

import router from "@/router";
import { resetRouter, filterAsyncRouter } from "@/router/index";

export default {
  name: "logincallback-view",
  data() {
    return {};
  },
  async created() {
    try {
      await applicationUserManager.signinRedirectCallback();
      let _this = this;
      let user = await applicationUserManager.getUser();
      _this.$store.commit("saveToken", user.access_token);

      var curTime = new Date();
      var expiredate = new Date(
        curTime.setSeconds(curTime.getSeconds() + user.expires_in)
      );
      _this.$store.commit("saveTokenExpire", expiredate);

      window.localStorage.refreshtime = expiredate;
      window.localStorage.expires_in = user.expires_in;

      _this.$notify({
        type: "success",
        message: `成功获取令牌，项目初始化中...`,
        duration: 3000
      });
      
      user.uRealName=user.profile.name;
      user.uLoginName=user.profile.preferred_username;
      user.uID=user.profile.sub;
      window.localStorage.user = JSON.stringify(user);
      if (user.uID > 0) {
        _this.GetNavigationBar(user.uID);
      }

    } catch (e) {
      this.$root.$emit("show-snackbar", { message: e });
    }
  },
  methods: {
    // 获取路由树
    GetNavigationBar(uid) {
      var _this = this;
      var loginParams = { uid: uid, t: new Date() };

      getNavigationBar(loginParams).then(data => {

        if (!data.success) {
          _this.$message({
            message: data.message,
            type: "error"
          });
        } else {
          // _this.closeAlert()

          _this.$message({
            message: "后台初始化成功",
            type: "success"
          });
          let userinfo = JSON.parse(
            window.localStorage.user ? window.localStorage.user : null
          );
          _this.$notify({
            type: "success",
            message: `登录成功 \n 欢迎管理员：${
              userinfo.uRealName
            } ！Token 将在 ${parseInt(window.localStorage.expires_in / 60)} 分钟后过期！`,
            duration: 6000
          });

          window.localStorage.router = JSON.stringify(data.response.children);

          let getRouter = data.response.children; //后台拿到路由
          getRouter = filterAsyncRouter(getRouter); //过滤路由
          router.$addRoutes(getRouter); //动态添加路由

          _this.$router.replace(
            _this.$route.query.redirect ? _this.$route.query.redirect : "/"
          );
        }
      });
    }
  }
};
</script>

<style>
</style>
