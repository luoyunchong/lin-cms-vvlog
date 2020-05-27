import "@babel/polyfill";
import Vue from "vue";
import ElementUI from "element-ui";

import "@/lin/mixin";
import "@/lin/filter";
import "@/lin/plugin";
import "@/lin/directive";

import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import router from "@/router";
import store from "@/store";
import App from "@/App.vue";

import StickyTop from "@/component/base/sticky-top/sticky-top";
import LIcon from "@/component/base/icon/lin-icon";
import SourceCode from "@/component/base/source-code/source-code";

import "@/assets/styles/index.scss";
import "@/assets/styles/realize/element-variables.scss";
import "element-ui/lib/theme-chalk/base.css";
import '@/assets/styles/main.scss';
Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.component(CollapseTransition.name, CollapseTransition);

// base 组件注册
Vue.component("sticky-top", StickyTop);
Vue.component("l-icon", LIcon);
Vue.component("source-code", SourceCode);

const AppInstance = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// 设置 App 实例
window.App = AppInstance;
