import Vue from "vue"
import VueRouter from "vue-router"
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import Axios from "axios"
import http from "http"
import https from "https"
//import "https://unpkg.com/vue/dist/vue.js"
//import "https://unpkg.com/vue-router/dist/vue-router.js"
import App from "./App.vue"
import MachineList from "@/components/MachineList";
import EditMachine from "@/components/EditMachine";
import EditRepairLog from "@/components/EditRepairLog";

const equipmentApi = Axios.create({
  baseURL: process.env.VUE_APP_EQUIPMENT_MANAGER_BASE_URL,
  withCredentials: false,

  //60 sec timeout
  timeout: 60000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Master-Key": "DdyaVafchWLPyNFphVCRsRaukSPnrfVdUIBmgUEkVJCSsWncITQWLpEzgwsEmTypv"
  },

  //keepAlive pools and reuses TCP connections, so it's faster
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  //follow up to 10 HTTP 3xx redirects
  maxRedirects: 10,

  //cap the maximum content length we'll accept to 50MBs, just in case
  maxContentLength: 50 * 1000 * 1000
});

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter)

Vue.config.productionTip = false;
Vue.prototype.$http = equipmentApi;

const routes = [
  {
    path: "/",
    name: "Home",
    component: MachineList
  },
  {
    path: "/editmachine/:id",
    name: "EditMachine",
    component: EditMachine,
    props: true
  },
  {
    path: "/createmachine",
    name: "CreateMachine",
    component: EditMachine,
    props: true
  },
  {
    path: "/editrepairlog/:id",
    name: "EditRepairLog",
    component: EditRepairLog,
    props: true
  },
  {
    path: "/editrepairlog",
    name: "CreateRepairLog",
    component: EditRepairLog,
    props: true
  },
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
