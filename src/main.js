import Vue from "vue"
import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import {
    ValidationObserver,
    ValidationProvider,
    extend,
    localize
} from "vee-validate"
import en from "vee-validate/dist/locale/en.json"
import * as rules from "vee-validate/dist/rules"

import App from "@/components/App.vue"
import store from "@/store"
import router from "@/router"
import api from "@/api"
import auth from "@/auth"


router.beforeEach((to, from, next) => {
    if (!to.matched.some(record => record.meta.ignoreAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!auth.isAuthenticated()) {
            next({
                name: 'Login',
//                query: {redirect: to.fullPath}
            })
        } else {
            next()
        }
    } else {
        // make sure to always call next()!
        next()
    }
})

Vue.prototype.$http = api.api

// Install VeeValidate rules and localization
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
})

// Create a VeeValidate validation rule allowing decimal numbers
extend("decimal", {
    validate: (value, {decimals = '*', separator = '.'} = {}) => {
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


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
