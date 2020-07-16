<template>
  <div>
    <!-- if 有子节点，渲染节点递归 -->
    <template v-if="item.children">
      <el-submenu
        v-if="!(item.path!=''&&item.path!=' '&&item.path!='-')&&!item.IsButton"
        :index="item.id+'index'"
        :key="item.path"
      >
        <template slot="title">
          <i
            v-if="item.children&&item.children.length>0&&item.iconCls&&!item.IsButton"
            class="fa"
            :class="item.iconCls"
          ></i>
          <span class="title-name" slot="title">{{item.name}}</span>
        </template>
        <template v-for="child in item.children">
          <!-- 这里实现自己递归嵌套 -->
          <template v-if="!child.IsHide&&!item.IsButton">
            <sidebar
              v-if="child.children&&child.children.length>0"
              :item="child"
              :index="child.id"
              :key="child.path"
            />
            <app-link :to="child.path" v-else :key="child.path">
              <el-menu-item :key="child.path" 
          :index="isExternalLink(child.path)? '':child.path"
               @click="cop">
                <i class="fa" :class="child.iconCls"></i>
                <template slot="title">
                  <span class="title-name" slot="title">{{child.name}}</span>
                </template>
              </el-menu-item>
            </app-link>
          </template>
        </template>
      </el-submenu>
      <template v-else>
        <app-link :to="item.path" v-if="!item.IsButton" :key="item.path+'d'">
          <el-menu-item
          :index="isExternalLink(item.path)? '':item.path"
           :key="item.path+'d'">
            <i class="fa" :class="item.iconCls"></i>
            <template slot="title">
              <span class="title-name" slot="title">{{item.name}}</span>
            </template>
          </el-menu-item>
        </app-link>
      </template>
    </template>
    <!-- else 没有子节点，直接输出 -->
    <template v-else>
      <app-link :to="item.path" :key="item.path+'d'">
        <el-menu-item
          :index="isExternalLink(item.path)? '':item.path"
          :key="item.path+'d'"
          @click="cop"
        >
          <i class="fa" :class="item.iconCls"></i>
          <template slot="title">
            <span class="title-name" slot="title">{{item.name}}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>

<script>
import AppLink from "./AppLink";
import { isExternal } from "../../util/validate";

export default {
  name: "Sidebar",
  components: { AppLink },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    isExternalLink(to) {
      return isExternal(to);
    },
    cop: function() {
      // 子组件中触发父组件方法collaFa并传值123
      this.$emit("collaFa", "123");
    }
  }
};
</script>
