export default {
    addMachine({commit}, machine) {
        commit("insertMachine", machine)
        commit("calculateRepairLogInfo", machine)
    },
    removeRepairLog({getters, commit}, repair_log) {
        commit("removeRepairLog", repair_log)
        let machine = getters.getMachineForRepairLog(repair_log)
        if (machine) {
            commit("calculateRepairLogInfo", machine)
        }
    },
}
