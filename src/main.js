import Vue from "vue";
import App from "./App.vue";

import VueCompositionApi from "@vue/composition-api";
import vuetify from "./plugins/vuetify";
import router from './router'
import './registerServiceWorker'
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App)
}).$mount("#app");
