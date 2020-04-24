<template>
    <b-card v-if="loaded" id="edit_repair_log" align="left">
        <template v-slot:header>
            <h2 class="mb-2">{{title}}</h2>
        </template>
        <validation-observer ref="observer" v-slot="{handleSubmit, invalid}">
            <b-form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="onReset">
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
                <validation-provider name="Description" immediate
                                     :rules="{required: true, min: 3, max:128}"
                                     v-slot="validationContext">
                    <b-form-group
                            id="fieldset-2"
                            label-cols-sm="2"
                            label-align-sm="left"
                            description="Enter a description"
                            label="Description:"
                            label-for="description">
                        <b-form-input id="description" v-model="updatedLog.description" required
                                      :state="getValidationState(validationContext)"
                                      aria-describedby="input-description-live-feedback"/>
                        <b-form-invalid-feedback id="input-description-live-feedback">
                            {{ validationContext.errors[0]}}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider name="Part Name" immediate
                                     :rules="{required: true, min:4, max:64}"
                                     v-slot="validationContext">
                    <b-form-group
                            id="fieldset-3"
                            label-cols-sm="2"
                            label-align-sm="left"
                            description="Enter part name"
                            label="Part Name:"
                            label-for="partname">
                        <b-form-input id="partname" v-model="updatedLog.part_name"
                                      :state="getValidationState(validationContext)"
                                      aria-describedBy="input-partname-live-feedback"/>
                        <b-form-invalid-feedback id="input-partname-live-feedback">
                            {{validationContext.errors[0]}}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider name="Part Number"
                                     :rules="{min:2, max:64}"
                                     v-slot="validationContext">
                    <b-form-group
                            id="fieldset-4"
                            label-cols-sm="2"
                            label-align-sm="left"
                            description="Enter part number"
                            label="Part Number:"
                            label-for="partnum">
                        <b-form-input id="partnum" v-model="updatedLog.part_number"
                                      :state="getValidationState(validationContext)"
                                      aria-describedBy="input-partnum-live-feedback"/>
                        <b-form-invalid-feedback id="input-partnum-live-feedback">
                            {{validationContext.errors[0]}}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider name="Part Cost"
                                     :rules="{min_value: 0, decimal: true}"
                                     v-slot="validationContext">
                    <b-form-group
                            id="fieldset-5"
                            label-cols-sm="2"
                            label-align-sm="left"
                            description="Enter part cost"
                            label="Part Cost:"
                            label-for="partcost">
                        <b-form-input id="partcost" v-model="updatedLog.part_cost"
                                      type="number" step="any"
                                      :state="getValidationState(validationContext)"
                                      aria-describedBy="input-partcost-live-feedback"/>
                        <b-form-invalid-feedback id="input-partcost-live-feedback">
                            {{validationContext.errors[0]}}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider name="Labor Cost"
                                     :rules="{min_value:0, decimal: true}"
                                     v-slot="validationContext">
                    <b-form-group
                            id="fieldset-6"
                            label-cols-sm="2"
                            label-align-sm="left"
                            description="Enter labor cost"
                            label="Labor Cost:"
                            label-for="laborcost">
                        <b-form-input id="laborcost" v-model="updatedLog.labor_cost"
                                      type="number" step="any"
                                      :state="getValidationState(validationContext)"
                                      aria-describedBy="input-laborcost-live-feedback"/>
                        <b-form-invalid-feedback id="input-laborcost-live-feedback">
                            {{validationContext.errors[0]}}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <b-form-group id="fieldset-7">
                    <b-button-group>
                        <b-button pill class="mx-2" variant="danger" type="cancel" @click="onCancel">Cancel</b-button>
                        <b-button v-if="isCreate && !invalid"
                                  pill class="mx-2" variant="success" type="submit">Create</b-button>
                        <b-button v-if="!isCreate && !invalid && dirty"
                                  pill class="mx-2" variant="success" type="submit">Update</b-button>
                        <b-button v-if="dirty" pill class="mx-2" variant="warning" type="reset">Reset</b-button>
                    </b-button-group>
                </b-form-group>
            </b-form>
        </validation-observer>
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
                let now = new Date()
                this.originalLog.date = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
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
            // createable() {
            //     return this.updatedLog.date != null && this.getValidationState()
            // },
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
                    part_number: "",
                    part_name: "",
                    part_cost: 0.0,
                    labor_cost: 0.0
                },
                error: {},
            }
        },
        methods: {
            getValidationState({dirty, validated, valid=null}) {
                return dirty || validated ? valid : null
            },
            onSubmit() {
                const options = {
                    url: `/repair_log`,
                    method: this.isCreate ? "post" : "put",
                    data: Object.assign({}, this.updatedLog, {machine_id: this.$route.params.machine_id})
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
            async onReset() {
                this.loaded = false
                await this.$nextTick()
                this.dirty = false
                this.updatedLog = Object.assign({}, this.originalLog)
                this.loaded = true
            },
            onCancel() {
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