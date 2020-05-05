export default {
    setApiToken(state, {token, expiry}) {
        state.apiToken = token
        // Set refresh interval to be 5 minutes before API token expires
        let interval = expiry - new Date() - (1000 * 60 * 5)
        // If interval is less than 1 second, use a 10 second interval
        if (interval < 1000) {
            interval = 10000
        }
        state.refreshInterval = interval
        state.apiTokenExpiry = expiry
    },
    emptyMachineList(state) {
        state.machineList = []
    },
    insertMachine(state, machine) {
        machine["_showDetails"] = false
        state.machineList.push(machine)
    },
    enableMachineDetails(state, {machine, enabled}) {
        machine._showDetails = enabled
    },
    toggleMachineDetails(state, machine) {
        machine._showDetails = !machine._showDetails
    },
    removeRepairLog(state, repair_log) {
        let machines = state.machineList.filter(machine => machine.id === repair_log.machine_id)
        if (machines.length > 0) {
            let machine = machines[0]
            let logs = machine["repair_logs"]
            for (let log_i = 0; log_i < logs.length; ++log_i) {
                if (logs[log_i].id === repair_log.id) {
                    logs.splice(log_i, 1)
                    if (logs.length === 0) {
                        machine["_showDetails"] = false
                    }
                    return machine
                }
            }
        }
        return null
    },
    calculateRepairLogInfo(state, machine) {
        let partsCost = 0
        let laborCost = 0
        let repairLogs = machine["repair_logs"]
        for (let i = 0; i < repairLogs.length; ++i) {
            partsCost += repairLogs[i]["part_cost"]
            laborCost += repairLogs[i]["labor_cost"]
        }
        partsCost = partsCost.toFixed(2)
        laborCost = laborCost.toFixed(2)
        state.repairInfo = Object.assign(state.repairInfo,{ [machine.id]: {
            numRepairs: repairLogs.length,
            partsCost: partsCost,
            laborCost: laborCost,
        }})
    },
    setRefreshTokenTimerId(state, id) {
        state.refreshTokenTimerId = id
    }
}
