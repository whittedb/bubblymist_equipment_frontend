export default {
    isAuthenticated(state) {
        return state.authenticated
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
    }
}
