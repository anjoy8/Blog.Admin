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
          <el-select v-model="selectOperate" placeholder="请选择要发送的集合">
            <el-option
              v-for="item in operate"
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
          <el-select v-model="selectBindOrSub" placeholder="请选择要发送的对象">
            <el-option
              v-for="item in bindOrSub"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="selectBindOrSub=='bind'">
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
          <el-select v-model="selectMsgType" placeholder="请选择消息类型">
            <el-option
              v-for="item in msgTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="selectOperate=='one'">
          <el-input v-model="selectUser" placeholder="请输入要发送的用户"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :disabled="checkIsOk()==false" @click="searchWeChatAccount">发送消息</el-button>
        </el-form-item>

        <el-card class="box-card" v-if="selectMsgType=='text'">
            <div slot="header" class="clearfix">
              <span>推送文本</span>
            </div>
            <el-form-item label="文本内容">
              <el-input v-model="textContent.text"></el-input>
            </el-form-item> 
        </el-card> 
        <el-card class="box-card" v-if="selectMsgType=='image'">
            <div slot="header" class="clearfix">
              <span>推送图片</span>
            </div>
            <el-form-item label="图片mediaID">
              <el-input v-model="pictureContent.pictureMediaID"></el-input>
            </el-form-item> 
        </el-card> 
        <el-card class="box-card" v-if="selectMsgType=='voice'">
            <div slot="header" class="clearfix">
              <span>推送语音</span>
            </div>
            <el-form-item label="语音mediaID">
              <el-input v-model="voiceContent.voiceMediaID"></el-input>
            </el-form-item> 
        </el-card> 
        <el-card class="box-card" v-if="selectMsgType=='mpvideo'">
            <div slot="header" class="clearfix">
              <span>推送视频</span>
            </div>
            <!-- <el-form-item label="标题">
              <el-input v-model="videoContent.title"></el-input>
            </el-form-item> 
             <el-form-item label="封面mediaID">
              <el-input v-model="videoContent.pictureMediaID"></el-input>
            </el-form-item>  -->
             <el-form-item label="视频mediaID">
              <el-input v-model="videoContent.videoMediaID"></el-input>
            </el-form-item> 
        </el-card> 
      </el-form>
    </el-col>
     
    
  </div> 
  </section>
</template>

<script>
import { getWeChatAccount,getWeChatCompany ,pushTestMsg} from "../../api/api";
export default {
  name: "WeChatCompany",
  data() {
    return {
      wechats: [], //微信公众号列表
      companys: [], //客户列表
      operate: [{value:"one",label:"单个用户"},{value:"all",label:"所有用户"}], //操作类型
      bindOrSub: [{value:"sub",label:"订阅用户"},{value:"bind",label:"绑定用户"}], //发送的对象 
      msgTypes:[{value:"text",label:"文本消息"},{value:"image",label:"图片消息"},{value:"voice",label:"语音消息"},{value:"mpvideo",label:"视频消息"}],

      selectWeChat: "", //当前选中的微信公众号  
      selectOperate: "", //当前选中的操作集合
      selectBindOrSub: "", //当前选中的绑定还是订阅
      selectCompany: "", //当前选中的微信客户
      selectMsgType:"",//当前选中的消息类型
      selectUser:"",//当前选中要发送的用户

      textContent:{
        text:''
      },
      pictureContent:{
        pictureMediaID:''
      },
      voiceContent:{  
        voiceMediaID:''
      },
      videoContent:{  
        title:'',
        pictureMediaID:'',
        videoMediaID:''
      },
      linkMsgContent:{  
        title:'',
        description:'',
        viewUrl:'',
        pictureUrl:''
      },
      
    };
  },
  created() {
    this.getWeChats();
    this.getWeCompanys();
  },
  methods: {   
    checkIsOk(){
      if(this.selectWeChat == '' || this.selectOperate == '' || this.selectBindOrSub == '' || this.selectMsgType == '') 
        return false; //必填 
      if(this.selectOperate == 'one' && this.selectBindOrSub == 'sub' && this.selectUser != '')
        return true;  
      if(this.selectOperate == 'one' && this.selectBindOrSub == 'bind' && this.selectCompany != '' && this.selectUser != '')
        return true;  
      if(this.selectOperate == 'all' && this.selectBindOrSub =='sub')
        return true; 
      if(this.selectOperate == 'all' && this.selectBindOrSub =='bind' && this.selectCompany != '')
        return true; 
      return false;
    },
    searchWeChatAccount() {  
      pushTestMsg(
        {
        selectWeChat : this.selectWeChat,
        selectOperate : this.selectOperate,
        selectBindOrSub : this.selectBindOrSub,
        selectCompany : this.selectCompany,
        selectMsgType : this.selectMsgType,
        selectUser : this.selectUser,
        textContent : this.textContent,
        pictureContent : this.pictureContent,
        voiceContent : this.voiceContent,
        videoContent : this.videoContent,
        linkMsgContent : this.linkMsgContent
      }
      ).then(res=>{
        if(res.data.success){
            this.$message.success(res.data.msg);
        }else{ 
            this.$message.error(res.data.msg);
        }
      })
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
      //this.searchWeChatAccount();
    },
    selectCompany: function(newName, oldName) {
      //this.searchWeChatAccount();
    }
  }
};
</script> 
