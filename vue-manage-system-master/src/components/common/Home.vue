<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "./bus";
// 在单独构建的版本中辅助函数为 Vuex.mapState 辅助生成计算属性
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      tagsList: [],
      collapse: false
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  //mapState 映射到vue的this
  computed: {
    ...mapState(["tt"]), //mapState(['IsLogin','tt'])
    //注意 页面刷新后 store存储的数据就丢失了
    ...mapGetters(["IsLogin"]) //同样的方法获取getter的属性 ，可以传入一个数组，数组的元素就是对应store中定义的key
  },
  methods: {
    //将mutation映射到methods
    ...mapMutations(["login", "logout"])
  },
  created() {
    //监听collapse 事件 header-侧边栏折叠 发送coolapse事件
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    //监听tags事件 接收到tags 列表
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }
};
</script>
