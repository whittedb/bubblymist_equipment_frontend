import Vue from "vue"
import VueRouter from "vue-router"
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import Axios from "axios"
import http from "http"
import https from "https"
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate"
import en from "vee-validate/dist/locale/en.json"
import * as rules from "vee-validate/dist/rules"

import App from "./App.vue"
import MachineList from "@/components/MachineList";
import EditMachine from "@/components/EditMachine";
import EditRepairLog from "@/components/EditRepairLog";

// Install VeeValidate rules and localization
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
})

// Create a VeeValidate validation rule allowing decimal numbers
extend("decimal", {
  validate: (value, { decimals = '*', separator = '.' } = {}) => {
    if (value === null || value === undefined || value === '') {
      return {
        valid: false
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);
    return {
      valid: regex.test(value),
      data: {
        serverMessage: 'Only decimal values are available'
      }
    };
  },
  message: `{serverMessage}`
})
localize("en", en)

// Install VeeValidate components globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);


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
