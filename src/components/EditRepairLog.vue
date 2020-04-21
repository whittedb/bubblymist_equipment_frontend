<template>
    <b-card v-if="loaded" id="edit_repair_log" align="left">
        <template v-slot:header>
            <h2 class="mb-2">{{title}}</h2>
        </template>
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
                    id="fieldset-1"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter the log date"
                    label="Date:"
                    label-for="date">
                <b-datepicker id="date" v-model="updatedLog.date"
                              today-button reset-button close-button dark required
                              :date-format-options="{month: 'numeric', day: 'numeric', year: 'numeric'}"
                              :reset-value="originalLog.date"/>
            </b-form-group>
            <b-form-group
                    id="fieldset-2"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter a description"
                    label="Description:"
                    label-for="description">
                <b-form-input id="description" v-model="updatedLog.description"/>
            </b-form-group>
            <b-form-group
                    id="fieldset-3"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter part number"
                    label="Part Number:"
                    label-for="partnum">
                <b-form-input id="partnum" v-model="updatedLog.part_number"/>
            </b-form-group>
            <b-form-group
                    id="fieldset-4"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter part name"
                    label="Part Name:"
                    label-for="partname">
                <b-form-input id="partname" v-model="updatedLog.part_name"/>
            </b-form-group>
            <b-form-group
                    id="fieldset-5"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter part cost"
                    label="Part Cost:"
                    label-for="partcost">
                <b-form-input id="partcost" v-model="updatedLog.part_cost" type="number" step="any"/>
            </b-form-group>
            <b-form-group
                    id="fieldset-6"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter labor cost"
                    label="Labor Cost:"
                    label-for="laborcost">
                <b-form-input id="laborcost" v-model="updatedLog.labor_cost" type="number" step="any"/>
            </b-form-group>
            <b-form-group id="fieldset-7">
                <b-button-group>
                    <b-button pill class="mx-2" variant="danger" type="cancel" @click="onCancel">Cancel</b-button>
                    <b-button v-if="isCreate && createable"
                              pill class="mx-2" variant="success" type="submit">Create</b-button>
                    <b-button v-if="!isCreate && dirty"
                              pill class="mx-2" variant="success" type="submit">Update</b-button>
                    <b-button v-if="dirty" pill class="mx-2" variant="warning" type="reset">Reset</b-button>
                </b-button-group>
            </b-form-group>
        </b-form>
        <template v-slot:footer>
            <div v-if="error">
                <div v-if="error.detail">
                    <h4>{{error.status}}: {{error.statusText}} - {{error.detail}}</h4>
                </div>
                <div v-else>
                    <h4>{{error.message}}</h4>
                </div>
            </div>
        </template>
    </b-card>
</template>

<script>
    export default {
        name: "EditRepairLog",
        mounted() {
            this.updatedLog = {}
            this.error = null
            this.loaded = false
            if (this.isCreate) {
                this.updatedLog = Object.assign({}, this.originalLog)
                this.watchUpdated()
                this.loaded = true
            } else {
                this.$http.get(`/repair_log/${this.$route.params.id}`)
                    .then((response) => {
                        this.originalLog = response.data
                        this.updatedLog = Object.assign({}, this.originalLog)
                        this.watchUpdated()
                    })
                    .catch((error) => {
                        this.updateError(error)
                    })
                    .finally(() => this.loaded = true)
            }
        },
        computed: {
            isCreate() {
                return !this.$route.params.id
            },
            createable() {
                return this.updatedLog.date != null && this.numberState
            },
            title() {
                let title = this.isCreate ? "Create " : "Edit "
                return `${title} Repair Log`
            },
        },
        data() {
            return {
                loaded: false,
                dirty: false,
                unwatchUpdatedLog: null,
                updatedLog: {},
                originalLog: {
                    id: null,
                    date: null,
                    description: "",
                    partNumber: "",
                    partName: "",
                    partCost: 0.0,
                    laborCost: 0.0
                },
                error: {}
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault()
                const options = {
                    url: `/repair_log`,
                    method: this.isCreate ? "post" : "put",
                    data: this.updatedLog
                }
                options.data.part_cost = parseFloat(options["data"].part_cost)
                options.data.labor_cost = parseFloat(options["data"].labor_cost)
                this.error = null
                this.$http.request(options)
                    // eslint-disable-next-line no-unused-vars
                    .then((response) => {
                        this.$router.push({name: "Home"})
                    })
                    .catch((error) => {
                        this.updateError(error)
                    })
            },
            async onReset(evt) {
                evt.preventDefault()
                this.loaded = false
                await this.$nextTick()
                this.dirty = false
                this.updatedLog = Object.assign({}, this.originalLog)
                this.loaded = true
            },
            onCancel(evt) {
                evt.preventDefault()
                this.$router.push({name: "Home"})
            },
            watchUpdated() {
                this.unwatchUpdatedLog = this.$watch("updatedLog", this.dirtyWatcher, {deep: true})
            },
            unwatchUpdated() {
                if (this.unwatchUpdatedLog) {
                    this.unwatchUpdatedLog()
                }
            },
            // eslint-disable-next-line no-unused-vars
            dirtyWatcher(oldValue, newValue) {
                if (this.loaded) {
                    this.dirty = this.originalLog.date !== this.updatedLog.date ||
                        this.originalLog.description !== this.updatedLog.description ||
                        this.originalLog.part_number !== this.updatedLog.part_number ||
                        this.originalLog.part_name !== this.updatedLog.part_name ||
                        this.originalLog.part_cost !== this.updatedLog.part_cost ||
                        this.originalLog.labor_cost !== this.updatedLog.labor_cost;
                }
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
        }
    }
</script>

<style scoped>

</style>