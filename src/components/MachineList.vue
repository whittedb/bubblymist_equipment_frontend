<template>
    <div class="machine_list">
        <b-row class="mb-2" align-v="center">
            <b-col cols="3">
                <b-form-checkbox v-model="filter" value="include_inactive" unchecked-value="active_only"
                                 inline>Show Inactive</b-form-checkbox>
            </b-col>
            <b-col cols="6"></b-col>
            <b-col cols="3">
                <b-button pill class="p-2 mb-2" variant="primary"
                          :to="{name: 'CreateMachine', params: {id: null, usedNumbers: usedNumbers}}">
                    Create Machine
                </b-button>
            </b-col>
        </b-row>
        <b-table ref="machine_list_table" striped hover head-variant="dark"
                 primary-key="id" :items="machineList" :fields="fields" :busy="loading"
                 sticky-header="600px" no-border-collapse
                 selectable select-mode="single" @row-selected="onRowSelected"
                 sort-by="type"
                 :filter="filter" :filter-function="customFilter" @filtered="onFiltered">
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
            <template v-slot:thead-top>
                <b-tr><b-td colspan="12"><b>Machines</b></b-td></b-tr>
            </template>
            <template v-slot:cell(type)="data">
                <b-link :to="{name: 'EditMachine', params: {id: data.item.id, usedNumbers: usedNumbers}}">
                    {{ machineFieldFormatter(data.item) }}
                </b-link>
            </template>
            <template v-slot:cell(active)="data">
                <b-checkbox :id="`active_${data.item.id}`" v-model="data.item.active"
                            :checked="data.item.active" @input="handleActiveChange(data.item)"/>
            </template>
            <template v-slot:row-details="row">
                <b-card class="repair_log_card">
                    <b-table striped head-variant="dark"
                             primary-key="id" :items="row.item['repair_logs']" :fields="detailFields"
                             sticky-header="true" no-border-collapse sort-by="date">
                        <template v-slot:cell(date)="data">
                            <a href="http://localhost:8080">
                                {{data.item.date}}
                            </a>
                        </template>
                    </b-table>
                </b-card>
            </template>
            <template v-slot:custom-foot>
                <b-td>Total: {{totalRows}} of {{machineCnt}}</b-td>
                <b-td>Washers: {{washerRows}}</b-td>
                <b-td>Dryers: {{dryerRows}}</b-td>
            </template>
        </b-table>
    </div>
</template>

<script>
    export default {
        name: "MachineList",
        components: {},
        computed: {
            machineCnt: function () {
                return this.machineList.length
            },
            usedNumbers() {
                let used_numbers = {0: [], 1: []}
                this.machineList.forEach(machine => {
                    if (machine.active) {
                        used_numbers[machine.type].push(machine.number)
                    }
                })
                return used_numbers
            }
        },
        data: function () {
            return {
                loading: false,
                totalRows: 0,
                washerRows: 0,
                dryerRows: 0,
                filter: "active_only",
                filterOn: ["active"],
                fields: [
                    {key: "type", label: "Machine",
                        sortable: true,
                        sortByFormatted: (value, key, item) => {
                            return ("000" + item.type).slice(-2) + ("000000" + item.number).slice(-5)
                        }
                    },
                    {key: "model", sortable: true},
                    "serial",
                    {key: "numrepairs", label: "Repairs", sortable: true,
                        formatter: (value, key, item) => {
                            return this.repairInfo[item.id]["numRepairs"]
                        },
                        sortByFormatted: (value, key, item) => {
                            return this.repairInfo[item.id]["numRepairs"]
                        }
                    },
                    {key: "partscost", label: "Parts Cost", sortable: true,
                        formatter: (value, key, item) => {
                            return this.repairInfo[item.id]["partsCost"]
                        },
                        sortByFormatted: (value, key, item) => {
                            return this.repairInfo[item.id]["partsCost"]
                        }
                    },
                    {key: "laborcost", label: "Labor Cost", sortable: true,
                        formatter: (value, key, item) => {
                            return this.repairInfo[item.id]["laborCost"]
                        },
                        sortByFormatted: (value, key, item) => {
                            return this.repairInfo[item.id]["laborCost"]
                        }
                    },
                    {key: "active"}
                ],
                detailFields: [
                    {key: "date", sortable: true},
                    "description",
                    {key: "part_number", sortable: true},
                    {key: "part_name", sortable: true},
                    {key: "part_cost", sortable: true},
                    {key: "labor_cost", sortable: true}
                ],
                machineList: [],
                repairInfo: {},
                error: {},
            }
        },
        mounted() {
            this.loading = true;
            this.$http.get("/equipment_list/all")
                .then(response => {
                    response.data.forEach(this.addMachine)
                }).catch(error => {
                    this.updateError(error)
                }).finally(() => this.loading = false);
        },
        methods: {
            addMachine(item) {
                item["_showDetails"] = false
                let partsCost = 0
                let laborCost = 0
                let repairLogs = item["repair_logs"]
                for (let i = 0; i < repairLogs.length; ++i) {
                    partsCost += repairLogs[i]["part_cost"]
                    laborCost += repairLogs[i]["labor_cost"]
                }
                this.repairInfo[item.id] = {
                    numRepairs: repairLogs.length,
                    partsCost: partsCost,
                    laborCost: laborCost,
                }
                this.machineList.push(item)
            },
            handleActiveChange(item) {
                const options = {
                    url: `/equipment_${item.active ? "enable" : "disable"}/${item.id}`,
                    method: "put"
                }
                this.error = null
                this.$http.request(options)
                    // eslint-disable-next-line no-unused-vars
                    .then((response) => {

                    })
                    .catch((error) => {
                        this.updateError(error)
                    })
            },
            machineFieldFormatter(item) {
                return (item.type === 0 ? "Washer " : "Dryer ") + item.number.toString()
            },
            onRowSelected(items) {
                this.machineList.forEach(item => this.$set(item, '_showDetails', false))
                if (items[0]["repair_logs"].length > 0) {
                    this.$set(items[0], '_showDetails', !items[0]._showDetails)
                }
            },
            customFilter(row, filter) {
                if (filter === "" || filter === "active_only") {
                    return row["active"]
                } else if (filter === "include_inactive") {
                    return true
                }
            },
            onFiltered(filteredItems) {
                this.totalRows = filteredItems.length
                this.washerRows = 0
                this.dryerRows = 0
                filteredItems.forEach(value => {
                    this.washerRows += value.type === 0 ? 1 : 0
                    this.dryerRows += value.type === 1 ? 1 : 0
                })
            },
            updateError(error) {
                this.error = {}
                if (error.response) {
                    this.error.status = error.response.status
                    this.error.statusText = error.response.statusText
                    this.error.detail = error.response.data.detail
                } else {
                    this.error.message = error.message
                }
            }
        },
        onCreateMachine() {

        }
    }

</script>

<style scoped>
    .repair_log_card {
        background: #a0bed9;
    }
</style>
