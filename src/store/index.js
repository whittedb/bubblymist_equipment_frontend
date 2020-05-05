import Vue from "vue"
import Vuex from "vuex"
import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters";


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        apiToken: null,
        apiTokenExpiry: null,
        refreshTokenTimerId: null,
        refreshInterval: 0,
        machineList: [],
        machineCount: [],
        repairInfo: {},
    },
    getters: getters,
    mutations: mutations,
    actions: actions,
    strict: process.env.NODE_ENV !== 'production'
})

if (module.hot) {
    // accept actions and mutations as hot modules
    module.hot.accept([
        "./getters",
        "./mutations",
        "./actions"], () => {
        // require the updated modules
        // have to add .default here due to babel 6 module output
        const newGetters = require("./getters").default
        const newMutations = require("./mutations").default
        const newActions = require("./actions").default
        // swap in the new modules and mutations
        store.hotUpdate({
            mutations: newMutations,
            actions: newActions,
            getters: newGetters
        })
    })
}

export default store
