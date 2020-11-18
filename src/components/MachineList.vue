<template>
  <b-row class="machine_list">
    <b-col>
      <b-row class="mb-2" align-v="center">
        <b-col cols="3">
          <b-form-checkbox v-model="filter.active" inline
                           value="include_inactive"
                           unchecked-value="active_only"
                           :disabled="disabledCount === 0">
            Show Inactive
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table ref="machine_list_table" striped hover table-variant="success" head-variant="light"
                   primary-key="id" :items="dataProvider" show-empty
                   no-provider-filtering no-provider-paging no-provider-sorting
                   :fields="fields" :busy.sync="isBusy"
                   sticky-header="650px" no-border-collapse
                   selectable select-mode="single" @row-selected="onRowSelected"
                   sort-by="type"
                   :filter="filter.active" :filter-function="customFilter" @filtered="onFiltered">
            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:thead-top>
              <b-tr>
                <b-td colspan="10" style="text-align: center">
                  <b-link :to="{name: 'CreateMachine', params: {id: null}}">
                    <b-icon-hammer/>
                  </b-link>
                  &nbsp;<b>Machines</b>
                </b-td>
                <b-td>
                  <b-icon-arrow-clockwise @click="$refs.machine_list_table.refresh()"/>
                </b-td>
              </b-tr>
            </template>
            <template v-slot:cell(wrench)="data">
              <b-icon-wrench v-if="data.item['repair_logs'].length > 0" variant="danger"/>
            </template>
            <template v-slot:cell(type)="data">
              <b-link :to="{name: 'EditMachine', params: {id: data.item.id}}">
                {{ machineFieldFormatter(data.item) }}
              </b-link>
            </template>
            <template v-slot:cell(active)="data">
              <b-checkbox :id="`active_${data.item.id}`" v-model="data.item.active"
                          :checked="data.item.active" @change="handleActiveChange(data)"/>
            </template>
            <template v-slot:cell(create_repair_log)="data">
              <b-link class="create_log"
                      :to="{name: 'CreateRepairLog',
                                params: {machine_id: data.item.id}}">
                <b-icon-hammer/>
              </b-link>
            </template>
            <template v-slot:row-details="row">
              <b-card class="repair_log_card">
                <b-table striped table-variant="primary" head-variant="light"
                         primary-key="id" :items="row.item['repair_logs']" :fields="detailFields"
                         no-border-collapse sort-by="date">
                  <template v-slot:thead-top>
                    <b-tr>
                      <b-td colspan="10" style="text-align: center">
                        <b-link :to="{name: 'CreateRepairLog',
                                        params: {machine_id: row.item.id}}">
                          <b-icon-hammer/>
                        </b-link>
                        &nbsp;<b>Repair Logs</b>
                      </b-td>
                    </b-tr>
                  </template>
                  <template v-slot:cell(date)="data">
                    <b-link :to="{name: 'EditRepairLog', params: {id: data.item.id}}">
                      {{ dateFieldFormatter(data.item.date) }}
                    </b-link>
                  </template>
                  <template v-slot:cell(delete_repair_log)="data">
                    <b-icon-trash-fill variant="danger" style="text-align: center"
                                       @click="deleteRepairLog(data.item)"/>
                  </template>
                </b-table>
              </b-card>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col>Total: {{ totalRows }} of {{ machineCount }}</b-col>
        <b-col>Washers: {{ washerRows }}</b-col>
        <b-col>Dryers: {{ dryerRows }}</b-col>
        <b-col>Inactive: {{ disabledCount }}</b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col>Total Repairs: {{ totalRepairs }}</b-col>
        <b-col>Total Parts Costs: {{ totalPartsCost }}</b-col>
        <b-col>Total Labor Costs: {{ totalLaborCost }}</b-col>
        <b-col>Total Repair Costs: {{ totalPartsCost + totalLaborCost }}</b-col>
      </b-row>
      <b-row v-if="error" class="error-row">
        <b-col>
          <span v-if="error.detail" class="align-middle">
            <h3>{{ error.status }}: {{ error.statusText }} - {{ error.detail }}</h3>
          </span>
          <span class="align-middle">
            <h3>{{ error.message }}</h3>
          </span>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from "vuex"
import {bus} from "@/main"

export default {
  name: "MachineList",
  computed: {
    ...mapGetters([
      "machineList",
      "repairInfo",
      "enabledWashers",
      "enabledDryers",
      "usedNumbers",
      "machineCount",
      "enabledCount",
      "disabledCount",
      "getMachineByNumber",
      "getMachineById",
      "repairInfo",
      "totalRepairs",
      "totalPartsCost",
      "totalLaborCost"
    ])
  },
  data: function () {
    return {
      isBusy: false,
      totalRows: 0,
      washerRows: 0,
      dryerRows: 0,
      filter: {
        active: "active_only"
      },
      filterOn: ["active"],
      fields: [
        {key: "wrench", label: ""},
        {
          key: "type", label: "Machine",
          sortable: true,
          sortByFormatted: (value, key, item) => {
            return ("000" + item.type).slice(-2) + ("000000" + item.number).slice(-5)
          }
        },
        {key: "description", sortable: true, thStyle: {"text-align": "center"}},
        {key: "model", sortable: true, thStyle: {"text-align": "center"}},
        {key: "serial", thStyle: {"text-align": "center"}},
        {
          key: "numrepairs", label: "Repairs", sortable: true,
          thStyle: {"text-align": "center"}, tdClass: "bmapp-repairs",
          formatter: (value, key, item) => {
            return this.repairInfo[item.id]["numRepairs"]
          },
          sortByFormatted: (value, key, item) => {
            return this.repairInfo[item.id]["numRepairs"]
          }
        },
        {
          key: "partscost", label: "Parts Cost", sortable: true,
          thStyle: {"text-align": "center"}, tdClass: "bmapp-money",
          formatter: (value, key, item) => {
            return this.repairInfo[item.id]["partsCost"]
          },
          sortByFormatted: (value, key, item) => {
            return this.repairInfo[item.id]["partsCost"]
          }
        },
        {
          key: "laborcost", label: "Labor Cost", sortable: true,
          thStyle: {"text-align": "center"}, tdClass: "bmapp-money",
          formatter: (value, key, item) => {
            return this.repairInfo[item.id]["laborCost"]
          },
          sortByFormatted: (value, key, item) => {
            return this.repairInfo[item.id]["laborCost"]
          }
        },
        {
          key: "active",
          thStyle: {"text-align": "center"}, tdClass: "bmapp-checkbox"
        },
        {key: "create_repair_log", label: ""}
      ],
      detailFields: [
        {key: "date", sortable: true, thStyle: {"text-align": "center"}},
        {key: "description", label: "Description", thStyle: {"text-align": "center"}},
        {key: "part_number", sortable: true, thStyle: {"text-align": "center"}},
        {key: "part_name", sortable: true, thStyle: {"text-align": "center"}},
        {key: "part_cost", sortable: true, thStyle: {"text-align": "center"}, tdClass: "bmapp-money"},
        {key: "labor_cost", sortable: true, thStyle: {"text-align": "center"}, tdClass: "bmapp-money"},
        {key: "delete_repair_log", label: ""}
      ],
      error: null,
    }
  },
  methods: {
    ...mapActions([
      "addMachine",
      "removeRepairLog"
    ]),
    ...mapMutations([
      "emptyMachineList",
      "enableMachineDetails",
      "toggleMachineDetails",
    ]),
    dataProvider(ctx, callback) {
      this.emptyMachineList()
      this.$http.get("/equipment_list/all")
          .then(response => {
            response.data.forEach(this.addMachine)
            callback(this.machineList)
          }).catch(error => {
        if (error.response.status === 401) {
          bus.$emit("logout")
        }
        this.updateError(error)
        callback([])
      });
    },
    handleActiveChange(data) {
      this.error = null
      let old_value = data.item.active
      let new_value = !old_value
      const options = {
        url: `/equipment_${new_value ? "enable" : "disable"}/${data.item.id}`,
        method: "put"
      }
      this.$http.request(options)
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            if (this.disabledCount === 0) {
              this.filter.active = "active_only"
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            data.item.active = old_value
            if (error.response.status === 409) {
              error.message = error.response.data.detail
              error.response = null
            }
            this.updateError(error)
          })
    },
    deleteRepairLog(repair_log) {
      const options = {
        url: `/repair_log/${repair_log.id}`,
        method: "delete",
      }
      this.error = null
      this.isBusy = true
      this.$http.request(options)
          // eslint-disable-next-line no-unused-vars
          .then((response) => {
            this.removeRepairLog(repair_log)
          })
          .catch((error) => {
            this.updateError(error)
          })
          .finally(() => {
            this.isBusy = false
          })
    },
    machineFieldFormatter(item) {
      return (item.type === 0 ? "Washer " : "Dryer ") + item.number.toString()
    },
    dateFieldFormatter(date) {
      return `${date.substring(5, 7)}/${date.substring(8)}/${date.substring(0, 4)}`
    },
    // eslint-disable-next-line no-unused-vars
    onRowSelected(items) {
      this.machineList.forEach(machine => this.enableMachineDetails({machine, enabled: false}))
      if (items[0] && items[0]["repair_logs"].length > 0) {
        this.toggleMachineDetails(items[0])
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
}

</script>

<style>
.bmapp-money {
  text-align: right;
}

.bmapp-checkbox {
  text-align: center;
}

.bmapp-repairs {
  text-align: center;
}
</style>

<style scoped>
.create_log {
  alignment: center;
}
</style>
