<template>
  <div>
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
            <el-menu-item v-else :key="child.path" :index="child.path" @click="cop">
              <!-- {{child.name}}2 -->
              <i class="fa" :class="child.iconCls"></i>
              <template slot="title">
                <span class="title-name" slot="title">{{child.name}}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-submenu>
      <template v-else>
        <el-menu-item v-if="!item.IsButton" :index="item.path" :key="item.path+'d'">
          <i class="fa" :class="item.iconCls"></i>
          <template slot="title">
            <span class="title-name" slot="title">{{item.name}}</span>
          </template>
        </el-menu-item>
      </template>
    </template>
    <!-- 没有子节点，直接输出 -->
    <template v-else>
      <el-menu-item :index="item.path" :key="item.path+'d'" @click="cop">
        <i class="fa" :class="item.iconCls"></i>
        <template slot="title">
          <span class="title-name" slot="title">{{item.name}}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    cop: function() {
      // 子组件中触发父组件方法collaFa并传值123
      this.$emit("collaFa", "123");
    }
  }
};
</script>
