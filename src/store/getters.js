export default {
    isAuthenticated(state) {
        return state.apiToken !== null
    },
    apiToken(state) {
        return state.apiToken
    },
    apiTokenExpiry(state) {
        return state.apiTokenExpiry
    },
    refreshInterval(state) {
        return state.refreshInterval
    },
    machineList(state) {
        return state.machineList
    },
    machineCount(state) {
        return state.machineList.length
    },
    enabledCount(state) {
        return state.machineList.filter(machine => machine.active).length
    },
    disabledCount(state) {
        return state.machineList.filter(machine => !machine.active).length
    },
    enabledWashers(state) {
        return state.machineList.filter(machine => machine.active && machine.type === 0)
    },
    enabledDryers(state) {
        return state.machineList.filter(machine => machine.active && machine.type === 1)
    },
    totalRepairs(state) {
        let repairCnt = 0
        state.machineList.filter(machine => machine.active)
            .forEach(machine => repairCnt += state.repairInfo[machine.id].numRepairs)
        return repairCnt
    },
    totalPartsCost(state) {
        let partsCost = 0
        state.machineList.filter(machine => machine.active)
            .forEach(machine => partsCost += state.repairInfo[machine.id].partsCost)
        return partsCost
    },
    totalLaborCost(state) {
        let laborCost = 0
        state.machineList.filter(machine => machine.active)
            .forEach(machine => laborCost += state.repairInfo[machine.id].laborCost)
        return laborCost
    },
    totalRepairCosts(state, getters) {
        return getters.totalPartsCost + getters.totalLaborCost
    },
    usedNumbers(state) {
        let used_numbers = {0: [], 1: []}
        state.machineList.filter(machine => machine.active).forEach(machine => {
            used_numbers[machine.type].push(machine.number)
        })
        return used_numbers
    },
    repairInfo(state) {
        return state.repairInfo
    },
    getMachineByNumber: (state) => (number) => {
        return state.machineList.filter(machine => machine.number === number)
    },
    getMachineById: (state) => (id) => {
        let filteredList = state.machineList.filter(machine => machine.id === id)
        return filteredList.length === 0 ? null : filteredList[0]
    },
    getMachineForRepairLog: (state) => (repair_log) => {
        let machines = state.machineList.filter(machine => machine.id === repair_log.machine_id)
        return machines.length > 0 ? machines[0] : null
    },
    refreshTokenTimerId(state) {
        return state.refreshTokenTimerId
    }
}
