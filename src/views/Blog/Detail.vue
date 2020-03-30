<template>
  <div>
    <el-row class="warp">
      <!--
            Form 组件提供了表单验证的功能，只需要通过 rule 属性传入约定的验证规则，并 Form-Item 的 prop 属性设置为需校验的字段名即可。具体可以参考官网：http://element.eleme.io/#/zh-CN/component/form
      -->
      <el-col :span="24" class="warp-main">
        <el-form ref="infoForm" :model="infoForm" :rules="rules" label-width="120px">
          <el-form-item label="标题" prop="btitle">
            <el-input v-model="infoForm.btitle"></el-input>
          </el-form-item>

          <el-form-item label="分类">
            <el-select v-model="infoForm.bcategory" placeholder="请选择文章分类">
              <el-option label="技术博文" value="技术博文"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="作者" prop="bsubmitter">
            <el-input v-model="infoForm.bsubmitter"></el-input>
          </el-form-item>
          <!--使用编辑器
          -->
          <el-form-item label="详细" prop="bcontent">
            <div class="edit_container">
              <quill-editor
                v-model="infoForm.bcontent"
                ref="myQuillEditor"
                class="editer"
                :options="editorOption"
                @ready="onEditorReady($event)"
              ></quill-editor>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { getBlogDeatil, editBlog } from "../../api/api";

export default {
  data() {
    return {
      id: this.$route.params.id,
      infoForm: {
        btitle: "",
        bsubmitter: "",
        bcategory: "技术博文",
        bcontent: ""
      },
      editorOption: {},
      //表单验证
      rules: {
        btitle: [{ required: true, message: "请输入标题", trigger: "blur" }],
        bcontent: [
          { required: true, message: "请输入详细内容", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    //初始化
    var para = { id: this.id };
    getBlogDeatil(para).then(res => {
      this.infoForm = res.data.response;
    });
  },
  methods: {
    onEditorReady(editor) {},
    onSubmit() {
      //提交
      //this.$refs.infoForm.validate，这是表单验证
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          console.log(this.infoForm);
          var postPara = this.infoForm;

          editBlog(postPara).then(res => {
            if (res.data.success) {
              this.$notify({
                type: "success",
                message: "修改成功!",
                duration: 3000
              });
              this.$router.replace(`/Blog/Blogs`);
            } else {
              var errorMsg = res.data.msg;
              this.$message({
                type: "error",
                message: errorMsg,
                showClose: true
              });
            }
          });
        }
      });
    }
  },
  components: {
    //使用编辑器
    quillEditor
  }
};
</script>

<style>
.warp {
  background: #fff;
  padding-top: 20px;
  width: 90%;
  margin: 0 auto;
}
.ql-container.ql-snow,
.ql-editor.ql-blank {
  min-height: 500px !important;
}
</style>
