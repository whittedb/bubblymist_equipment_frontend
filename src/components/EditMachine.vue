<template>
    <b-card v-if="loaded" id="edit_machine" align="left">
        <template v-slot:header>
            <h2 class="mb-2">{{title}}</h2>
        </template>
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
                    v-if="isCreate"
                    id="fieldset-0"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Select a machine type"
                    label="Machine Type:"
                    label-for="type">
                <b-form-select id="type" required v-model="updatedMachine.type" :options="typeOptions" :value="null"/>
            </b-form-group>
            <b-form-group id="fieldset-1"
                          label-cols-sm="2"
                          description="Enter a description"
                          label="Description"
                          label-for="description">
                <b-form-input id="description" v-model="updatedMachine.description"
                              :disabled="isCreate && updatedMachine.type == null"/>
            </b-form-group>
            <b-form-group id="fieldset-2"
                          label-cols-sm="2"
                          label-align-sm="left"
                          description="Enter the machine number"
                          label="Machine Number:"
                          label-for="number"
                          :invalid-feedback="numberInvalidFeedback"
                          :valid-feedback="numberValidFeedback"
                          :state="numberState">
                <b-form-input id="number" v-model="updatedMachine.number"
                              :disabled="isCreate && updatedMachine.type == null"
                              :state="numberState" type="number" number/>

            </b-form-group>
            <b-form-group
                    id="fieldset-3"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter the machines model number"
                    label="Model Number:"
                    label-for="model">
                <b-form-input id="model" v-model="updatedMachine.model"
                              :disabled="isCreate && updatedMachine.type == null"/>
            </b-form-group>
            <b-form-group
                    id="fieldset-4"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enter the machines serial number"
                    label="Serial Number:"
                    label-for="serial">
                <b-form-input id="serial" v-model="updatedMachine.serial"
                              :disabled="isCreate && updatedMachine.type == null"/>
            </b-form-group>
            <b-form-group
                    id="fieldset-5"
                    label-cols-sm="2"
                    label-align-sm="left"
                    description="Enabled or Disabled"
                    label="Active:"
                    label-for="active">
                <b-form-checkbox id="active" v-model="updatedMachine.active" switch
                                 :disabled="isCreate && updatedMachine.type == null"/>
            </b-form-group>
            <b-form-group id="fieldset-buttons">
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
        name: "EditMachine",
        mounted() {
            this.updatedMachine = {}
            this.error = null
            if (this.isCreate) {
                this.updatedMachine = Object.assign({}, this.originalMachine)
                this.watchUpdated()
                this.loaded = true
            } else {
                this.$http.get(`/equipment/${this.$route.params.id}`)
                    .then((response) => {
                        this.originalMachine = response.data
                        this.updatedMachine = Object.assign({}, this.originalMachine)
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
              return this.updatedMachine.type != null && this.numberState
            },
            machineType() {
                if (this.isCreate) {
                    if (this.updatedMachine.type == null) {
                        return null
                    } else {
                        return this.updatedMachine.type === 0 ? "Washer" : "Dryer"
                    }
                } else {
                    return this.originalMachine.type === 0 ? "Washer" : "Dryer"
                }
            },
            title() {
                let title = this.isCreate ? "Create " : "Edit "
                let number = this.isCreate ? this.updatedMachine.number : this.originalMachine.number
                let machineType = this.machineType == null ? "(Please select a machine type)" : this.machineType
                return `${title} ${machineType} ${number}`
            },
            numberState() {
                if (this.loaded) {
                    let new_number = this.updatedMachine.number
                    if (new_number == null || new_number === "" || new_number < 1) {
                        return false
                    }

                    let numbers = this.isCreate ?
                        this.$route.params.usedNumbers[this.updatedMachine.type] :
                        this.$route.params.usedNumbers[this.originalMachine.type]

                    for (let i=0; i < numbers.length; ++i) {
                        if (this.isCreate && this.updatedMachine.number === numbers[i]) {
                            return false
                        }

                        if (this.updatedMachine.number !== this.originalMachine.number &&
                            this.updatedMachine.number === numbers[i]) {
                            return false
                        }
                    }
                }
                return true
            },
            numberValidFeedback() {
                return ""
            },
            numberInvalidFeedback() {
                let new_number = this.updatedMachine.number
                if (new_number == null || new_number === "") {
                    return `${this.machineType == null ? 'A' : this.machineType} number is required`
                } else if (new_number != null && new_number < 1) {
                    return "Number must be greater than 0"
                }

                return `That ${this.machineType} already exists`
            }
        },
        data() {
            return {
                loaded: false,
                dirty: false,
                updatedMachine: {},
                unwatchUpdatedMachine: null,
                originalMachine: {
                    id: null,
                    type: null,
                    number: "",
                    description: "",
                    model: "",
                    serial: "",
                    active: true
                },
                typeOptions: [
                    {value: null, text: "Select a machine type"},
                    {value: 0, text: "Washer"},
                    {value: 1, text: "Dryer"}
                ],
                error: {}
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault()
                const options = {
                    url: `/${this.machineType.toLowerCase()}`,
                    method: this.isCreate ? "post" : "put",
                    data: this.updatedMachine
                }
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
                this.updatedMachine = Object.assign({}, this.originalMachine)
                this.loaded = true
            },
            onCancel(evt) {
                evt.preventDefault()
                this.$router.push({name: "Home"})
            },
            watchUpdated() {
                this.unwatchUpdatedMachine = this.$watch("updatedMachine", this.dirtyWatcher, {deep: true})
            },
            unwatchUpdated() {
                if (this.unwatchUpdatedMachine) {
                    this.unwatchUpdatedMachine()
                }
            },
            // eslint-disable-next-line no-unused-vars
            dirtyWatcher(oldValue, newValue) {
                if (this.loaded) {
                    this.dirty = this.originalMachine.number !== this.updatedMachine.number ||
                        this.originalMachine.model !== this.updatedMachine.model ||
                        this.originalMachine.serial !== this.updatedMachine.serial ||
                        this.originalMachine.active !== this.updatedMachine.active ||
                        this.originalMachine.description !== this.updatedMachine.description;
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