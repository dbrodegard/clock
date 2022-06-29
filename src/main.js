import Vue from "vue";
import App from "./App.vue";

import VueCompositionApi from "@vue/composition-api";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "./registerServiceWorker";
import VueMask from "v-mask";

Vue.use(VueCompositionApi);
Vue.use(VueMask);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
