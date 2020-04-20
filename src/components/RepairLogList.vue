<template>
    <div class="repair_log_list">
        <b-table striped hover :items="logList" :fields="fields">
            <template v-slot:thead-top>
                <b-tr><b-th variant="danger" colspan="6">Repairs</b-th></b-tr>
            </template>
        </b-table>
    </div>
</template>

<script>
    export default {
        name: "RepairLogList",
        components: {},
        data: function () {
            return {
                fields: [
                    {key: "date", sortable: true},
                    "description", "part_number", "part_name", "part_cost", "labor_cost"
                ],
                logList: [
                    {id: 1, date: "04/01/2020", description: "Replace supply valve diaphragm",
                        part_number: "SVD", part_name: "Supply Valve Diaphragm", part_cost: 2.25, labor_cost: 0.0},
                    {id: 2, date: "04/06/2020", description: "Replace motor",
                        part_number: "MOT1", part_name: "Motor", part_cost: 523.15, labor_cost: 0.0},
                    {id: 3, date: "04/11/2020", description: "Replace drain valve",
                        part_number: "DV20", part_name: "Drain Valve", part_cost: 32.50, labor_cost: 0.0}
                ]
            }
        }
    }
</script>

<style scoped>

</style>