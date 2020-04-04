<template>
  <el-form
    ref="editForm"
    :model="editForm"
    label-width="80px"
    @submit.prevent="onSubmit"
    style="margin:20px;width:60%;min-width:600px;"
  >
    <el-form-item label="我的昵称">
      <el-input v-model="editForm.uRealName"></el-input>
    </el-form-item>

    <el-form-item label="旧密码" prop="uLoginPWD">
      <el-input v-model="editForm.uLoginPWD" type="text" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="uLoginPWD">
      <el-input v-model="editForm.uLoginPWD" show-password auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="uLoginPWD">
      <el-input v-model="editForm.uLoginPWD" show-password auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="头像">
      <el-upload
        class="avatar-uploader"
        action="/images/Upload/Pic"
        :show-file-list="false"
        :headers="token"
        :data="ruleForm"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="editForm.tdLogo" :src="editForm.tdLogo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon plus-sign"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="留言/备注">
      <el-input type="textarea" v-model="editForm.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="onSubmit" type="primary">更新</el-button>
      <el-button @click.native.prevent>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      editForm: {
        id: 0,
        uID: 0,
        RID: 0,
        uLoginName: "",
        uRealName: "",
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        desc: "",
        addr: "",
        tdLogo: ""
      },
      token: {
        Authorization: "Bearer "
      },
      ruleForm: {
        max_ver: "",
        min_ver: "",
        enable: ""
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt1M = file.size / 1024 / 1024 < 1;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!')
        // }
        if (!isLt1M) {
          this.$message.error("上传头像图片大小不能超过 1MB!");
        }
        return isLt1M;
      }
    };
  },
  methods: {
    onSubmit() {
      this.$message({
        message: "失败！该操作无权限",
        type: "error"
      });
    },
    handleAvatarSuccess(res, file) {
      this.editForm.tdLogo = "/" + res.response;
    }
  },
  mounted() {
    let tokenStr = window.localStorage.Token;
    this.token = {
      Authorization: "Bearer " + tokenStr
    };

    var user = JSON.parse(window.localStorage.user);
    this.editForm.uRealName = user ? user.uRealName : "";
  }
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    text-align: center;
  }
  .plus-sign{
    line-height: 120px !important;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }

  .markdown-body{
    height: 500px !important;
  }
</style>