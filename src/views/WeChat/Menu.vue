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
          <el-button type="primary" :disabled="selectWeChat==''" @click="getWxMenu(selectWeChat)">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <div class="public-account-management clearfix">
      <!--左边配置菜单-->
      <div class="left">
        <div class="menu clearfix">
          <div v-for="(item, i) of menu.button" :key="i" class="menu_bottom">
            <!-- 一级菜单 -->
            <div
              :class="{'active': isActive == i}"
              class="menu_item"
              @click="menuFun(i,item)"
            >{{ item.name }}</div>
            <!--以下为二级菜单-->
            <div v-if="isSubMenuFlag == i" class="submenu">
              <div v-for="(subItem, k) in item.sub_button" :key="k" class="subtitle">
                <div
                  :class="{'active': isSubMenuActive == i + '' + k}"
                  class="menu_subItem"
                  @click="subMenuFun(item, subItem, i, k)"
                >{{ subItem.name }}</div>
              </div>
              <!--二级菜单加号， 当长度 小于  5 才显示二级菜单的加号  -->
              <div
                v-if="item.sub_button.length < 5"
                class="menu_bottom menu_addicon"
                @click="addSubMenu(item)"
              >
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </div>
          <!-- 一级菜单加号 -->
          <div v-if="menuKeyLength < 3" class="menu_bottom menu_addicon" @click="addMenu">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <el-button
          :disabled="selectWeChat==''"
          class="save_btn"
          type="success"
          @click="saveFun(selectWeChat)"
        >保存并发布至菜单</el-button>
      </div>
      <!--右边配置-->
      <div v-if="!showRightFlag" class="right">
        <div class="configure_page">
          <div class="delete_btn">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteMenu(tempObj)"
            >删除当前菜单</el-button>
          </div>
          <div>
            <span>菜单名称：</span>
            <el-input
              v-model="tempObj.name"
              class="input_width"
              placeholder="请输入菜单名称"
              clearable
              style="margin-top: 12px;"
            ></el-input>
          </div>
          <div>
            <div class="menu_content">
              <span>菜单内容：</span>
              <el-radio-group v-model="tempObj.type">
                <el-radio :label="'media_id'">发送素材</el-radio>
                <el-radio :label="'view'">跳转链接</el-radio>
                <el-radio :label="'click'">发送关键词</el-radio>  
                <el-radio :label="'miniprogram'">小程序</el-radio>
                <el-radio :label="'event'">事件功能</el-radio> 
              </el-radio-group> 
            </div>
            <div class="configur_content">
              <div v-if="tempObj.type == 'media_id'" class="material">
                <span>素材内容：</span>
                <el-input
                  v-model="tempObj.media_id"
                  :disabled="true"
                  class="input_width"
                  placeholder="素材名称"
                ></el-input>
                <!--下面点击“选择素材”按钮，弹框框-->
                <el-popover v-model="visible2" placement="top">
                  <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="文件名" width="600">
                      <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                          <p>文件名: {{ scope.row.name }}</p>
                          <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                          </div>
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">选择</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" type="success">选择素材</el-button>
                </el-popover>
                <p class="blue">tips:需要调后台获取到内容，弹框出来，然后选择，把名字赋值上去！</p>
              </div>
              <div v-if="tempObj.type == 'view'">
                <span>跳转链接：</span>
                <el-input v-model="tempObj.url" class="input_width" placeholder="请输入链接" clearable></el-input>
              </div>
              <div v-if="tempObj.type == 'click'">
                <div>
                  <span>关键词：</span>
                  <el-input
                    v-model="tempObj.key"
                    class="input_width"
                    placeholder="请输入关键词"
                    clearable
                  ></el-input>
                </div>
                <p class="blue">tips:这里需要配合关键词推送消息一起使用</p>
              </div>
              <div v-if="tempObj.type == 'miniprogram'">
                <div class="applet">
                  <span>小程序的appid：</span>
                  <el-input
                    v-model="tempObj.appid"
                    class="input_width"
                    placeholder="请输入小程序的appid"
                    clearable
                  ></el-input>
                </div>
                <div>
                  <span>小程序的页面路径：</span>
                  <el-input
                    v-model="tempObj.pagepath"
                    class="input_width"
                    placeholder="请输入小程序的页面路径，如：pages/index"
                    clearable
                  ></el-input>
                </div>
                <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上哟！</p>
              </div>
              <div v-if="tempObj.type == 'event'">
                 <span>功能事件：</span>
                  <el-radio-group v-model="tempObj.key">
                  <el-radio :label="'pic_weixin'">微信相册</el-radio>
                  <el-radio :label="'pic_sysphoto'">拍照发图</el-radio>
                  <el-radio :label="'location_select'">位置选择</el-radio>
                  <el-radio :label="'scancode_push'">微信扫码</el-radio> 
                </el-radio-group> 
              </div>
            </div>
          </div>
        </div>
        <div>menu对象值：{{ menu }}</div>
      </div>
      <!--一进页面就显示的默认页面，当点击左边按钮的时候，就不显示了-->
      <div v-if="showRightFlag" class="right">
        <p>请选择菜单配置</p>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getWeChatMenu,
  updateWeChatMenu,
  getWeChatAccount
} from "../../api/api";
export default {
  name: "WeChatMenu",
  data() {
    return {
      showRightFlag: true, // 右边配置显示默认详情还是配置详情
      wechats: [], //微信公众号列表
      selectWeChat: "", //当前选中的微信公众号
      menu: {
        // 一级菜单
        button: [
          {
            type: "click",
            name: "菜单1",
            key: "menu1", // 关键词
            url: "", // 跳转链接
            media_id: "", // 素材名称--图文消息
            sub_button: [
              {
                //type: "",//media_id:素材内容; view:跳转链接
                name: "子菜单1"
                // url: "",//跳转链接
                // media_id:"",//素材名称--图文消息
              }
            ]
          }
        ]
      }, // 横向菜单
      isActive: -1, // 一级菜单点中样式
      isSubMenuActive: -1, // 一级菜单点中样式
      isSubMenuFlag: -1, // 二级菜单显示标志
      tempObj: {
        // type: "view",
        // media_id: 素材内容
        // view: 跳转链接
        // name: "",//菜单名称
        // material: "",//素材名称
        // link: "",//跳转链接
      }, // 右边临时变量，作为中间值牵引关系
      tempSelfObj: {
        // 一些临时值放在这里进行判断，如果放在tempObj，由于引用关系，menu也会多了多余的参数
        // grand:"" 1:表示一级菜单； 2:表示二级菜单
        // index:"" 表示一级菜单索引
        // secondIndex:"" 表示二级菜单索引
      },
      visible2: false, // 素材内容  "选择素材"按钮弹框显示隐藏
      tableData: [] // 素材内容弹框数据
    };
  },
  created() {
    
    this.getWeChats();
    this.mockMediaFun(); // 模拟获取素材
    this.mockMenuFun(); // 模拟调取菜单数据
    //this.getWxMenu();
  },
  methods: {
    getWeChats() {
      getWeChatAccount().then(res => {
        this.wechats = [];
        if (res.data.success) {
          res.data.response.data.forEach(element => {
            this.wechats.push({
              value: element.publicAccount,
              label: element.publicNick
            });
          });
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    // 模拟调取菜单数据
    getWxMenu(id) {
      //var id = "wx8fd620fd3f84c227";
      getWeChatMenu({ id: id }).then(res => {
        console.log(res);
        if (res.data.success) {
          this.menu = res.data.response.menu;
          this.$message.success("菜单获取成功!");
        }else{
          this.$message.error(res.data.msg);
        }
      }); 
    }, 
    // 素材内容弹框的选择按钮函数
    handleEdit(index, row) {
      this.visible2 = false;
      this.tempObj.media_id = row.name;
    },
    saveFun(id) {
      //var id = "wx8fd620fd3f84c227";
      updateWeChatMenu({ id: id, menu: this.menu }).then(res => { 
        if (res.data.success) {
          if (res.data.response.errcode == 0) {
            this.$message.success("设置成功!");
          } else {
            this.$message.error(res.data.response.errmsg); 
          }
        }else{
            this.$message.error(res.data.msg); 
        }
      });

       
    },
    // 一级菜单点击事件
    menuFun(i, item) {
      console.log(i);
      console.log(item);
      this.showRightFlag = false; //右边菜单隐藏
      // console.log(i)
      this.tempObj = item; //这个如果放在顶部，flag会没有。因为重新赋值了。
      this.tempSelfObj.grand = "1"; //表示一级菜单
      this.tempSelfObj.index = i; //表示一级菜单索引
      this.isActive = i; //一级菜单选中样式
      this.isSubMenuFlag = i; //二级菜单显示标志
      this.isSubMenuActive = -1; //二级菜单去除选中样式
    },
    // 二级菜单点击事件
    subMenuFun(item, subItem, index, k) {
      this.showRightFlag = false; //右边菜单隐藏
      this.tempObj = subItem; //将点击的数据放到临时变量，对象有引用作用
      this.tempSelfObj.grand = "2"; //表示二级菜单
      this.tempSelfObj.index = index; //表示一级菜单索引
      this.tempSelfObj.secondIndex = k; //表示二级菜单索引
      this.isSubMenuActive = index + "" + k; //二级菜单选中样式
      this.isActive = -1; //一级菜单去除样式
    },
    // 添加横向一级菜单
    addMenu() {
      console.log("addMenu");
      // 先判断1，再判断2,对象增加，会进行往下计算，所以必须先判断2，再判断1
      if (this.menuKeyLength == 2) {
        this.$set(this.menu.button, "2", {
          name: "菜单3",
          type: "click", 
          key: "菜单3",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
          sub_button: []
        });
      }
      if (this.menuKeyLength == 1) {
        this.$set(this.menu.button, "1", {
          name: "菜单2",
          type: "click", 
          key: "菜单2",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
          sub_button: []
        });
      }
      if (this.menuKeyLength == 0) {
        this.$set(this.menu.button, "0", {
          name: "菜单1",
           type: "click", 
          key: "菜单1",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
          sub_button: []
        });
      }
    },
    // 添加横向二级菜单
    addSubMenu(item) {
      let subMenuKeyLength = item.sub_button.length; //获取二级菜单key长度
      if (subMenuKeyLength == 4) {
        this.$set(item.sub_button, "4", {
          name: "子菜单5",
           type: "click", 
          key: "子菜单5",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 3) {
        this.$set(item.sub_button, "3", {
          name: "子菜单4",
           type: "click", 
          key: "子菜单4",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 2) {
        this.$set(item.sub_button, "2", {
          name: "子菜单3",
           type: "click", 
          key: "子菜单3",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 1) {
        this.$set(item.sub_button, "1", {
          name: "子菜单2",
           type: "click", 
          key: "子菜单2",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
      if (subMenuKeyLength == 0) {
        this.$set(item.sub_button, "0", {
          name: "子菜单1",
           type: "click", 
          key: "子菜单1",
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        });
      }
    },
    //删除当前菜单入口
    deleteMenu(obj) {
      var _this = this;
      this.$confirm("正在删除当前选中菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.deleteData(obj); // 删除菜单数据
        })
        .catch(e => {
          this.$message({
            type: "error",
            message: e
          });
        });
    },
    // 删除菜单数据
    deleteData(obj) {
      if (this.showRightFlag) {
        this.$message({
          type: "info",
          message: "请选择要删除的菜单!"
        });
      }
      if (this.tempSelfObj.grand == "1") {
        // 一级菜单的删除方法
        this.menu.button.splice(this.tempSelfObj.index, 1);
        this.isActive = -1;
      } else if (this.tempSelfObj.grand == "2") {
        //二级菜单的删除方法
        this.menu.button[this.tempSelfObj.index].sub_button.splice(
          this.tempSelfObj.secondIndex,
          1
        );
        this.isSubMenuActive = -1;
      } else {
        console.log("没有找到对应的值:" + this.tempSelfObj.grand);
      }
      this.showRightFlag = true;
      this.$message({
        type: "success",
        message: "删除成功!"
      });
    }
  },
  mounted() {},
  computed: {
    // menuObj的长度，当长度 小于 3 才显示一级菜单的加号
    menuKeyLength: function() {
      return this.menu.button.length;
    }
  },
  watch: {
    selectWeChat: function(newName, oldName) {
      console.log(newName);
      this.getWxMenu(newName);
    }
  }
};
</script> 
<style scoped>
@charset "UTF-8";
/* 公共颜色变量 */
.clearfix {
  *zoom: 1;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

div {
  text-align: left;
}

.public-account-management {
  padding: 20px;
  min-width: 1200px;
  width: 1200px;
  margin: 0 auto;
  /*右边菜单内容*/
}
.public-account-management .left {
  font-family: "Times New Roman", Times, serif;
  float: left;
  width: 301px;
  background-size: 100% auto;
  padding: 490px 25px 88px;
  position: relative;
  box-sizing: border-box;
  /*第一级菜单*/
}
.public-account-management .left .menu .menu_bottom {
  position: relative;
  float: left;
  box-sizing: border-box;
  width: 83px;
  /*height: 44px;*/
  /*line-height: 44px;*/
  text-align: center;
  background-color: #e2e2e2;
  border: 1px solid #ebedee;
  cursor: pointer;
}
.public-account-management .left .menu .menu_bottom.menu_addicon {
  height: 46px;
  line-height: 46px;
}
.public-account-management .left .menu .menu_bottom .menu_item {
  height: 44px;
  line-height: 44px;
  /*padding: 14px 0;*/
  text-align: center;
  box-sizing: border-box;
}
.public-account-management .left .menu .menu_bottom .menu_item.active {
  border: 1px solid #2bb673;
}
.public-account-management .left .menu .menu_bottom .menu_subItem {
  height: 44px;
  line-height: 44px;
  text-align: center;
  box-sizing: border-box;
  /*padding: 14px 0;*/
}
.public-account-management .left .menu .menu_bottom .menu_subItem.active {
  border: 1px solid #2bb673;
}
.public-account-management .left .menu i {
  color: #2bb673;
}
.public-account-management .left .menu .submenu {
  position: absolute;
  width: 83px;
  bottom: 45px;
}
.public-account-management .left .menu .submenu .subtitle {
  background-color: #e8e7e7;
  box-sizing: border-box;
  margin-bottom: 2px;
}
.public-account-management .left .save_btn {
  position: relative;
  margin-top: 100px;
  left: 45px;
}
.public-account-management .right {
  font-family: "Times New Roman", Times, serif;
  float: left;
  width: 70%;
  background-color: #e8e7e7;
  padding: 25px 10px 0px 20px;
  min-height: 610px;
  margin-left: 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.public-account-management .right p {
  font-size: 16px;
  margin-top: -10px;
  font-weight: bold;
}
.public-account-management .right .configure_page .delete_btn {
  text-align: right;
  margin-bottom: 15px;
}
.public-account-management .right .configure_page .menu_content {
  margin-top: 20px;
}
.public-account-management .right .configure_page .configur_content {
  margin-top: 20px;
}
.public-account-management .right .configure_page .blue {
  color: #29b6f6;
  margin-top: 10px;
}
.public-account-management .right .configure_page .applet {
  margin-bottom: 20px;
}
.public-account-management .right .configure_page .applet span {
  margin-right: 18px;
}
.public-account-management .right .configure_page .material .input_width {
  width: 30%;
}
.public-account-management .right .configure_page .material .el-textarea {
  width: 80%;
}
</style>
 

