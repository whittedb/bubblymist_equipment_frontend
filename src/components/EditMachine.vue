<template>
    <b-card v-if="loaded" id="edit_machine" align="left">
        <template v-slot:header>
            <h2 class="mb-2">{{title}}</h2>
        </template>
        <b-card-body>
            <validation-observer ref="observer" v-slot="{valid}">
                <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
                    <validation-provider v-if="isCreate" name="Machine Type" immediate
                                         :rules="{required: true, oneOf: [0,1]}"
                                         v-slot="validationContext">
                        <b-form-group
                                id="fieldset-0"
                                label-cols-sm="2"
                                label-align-sm="left"
                                description="Select a machine type"
                                label="Machine Type:"
                                label-for="type">
                            <b-form-select id="type" required v-model="updatedMachine.type"
                                           :options="typeOptions" :value="null"
                                           :state="getValidationState(validationContext)"
                                           @input="validateNumber"
                                           aria-describedby="input-machine-type-live-feedback"/>
                            <b-form-invalid-feedback id="input-machine-type-live-feedback">
                                {{validationContext.errors[0]}}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                    <validation-provider name="Description" immediate
                                         rules="max:32"
                                         v-slot="validationContext">
                        <b-form-group id="fieldset-1"
                                      label-cols-sm="2"
                                      description="Enter a description"
                                      label="Description"
                                      label-for="description">
                            <b-form-input id="description" v-model="updatedMachine.description"
                                          :state="getValidationState(validationContext)"
                                          :disabled="isCreate && updatedMachine.type == null"
                                          aria-describedby="input-description-live-feedback"/>
                            <b-form-invalid-feedback id="input-description-live-feedback">
                                {{validationContext.errors[0]}}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                    <validation-provider ref="number_provider" vid="number" name="Machine Number" immediate
                                         :rules="{required: true, numeric: true, min_value: 1}"
                                         v-slot="validationContext">
                        <b-form-group id="fieldset-2"
                                      label-cols-sm="2"
                                      label-align-sm="left"
                                      description="Enter the machine number"
                                      label="Machine Number:"
                                      label-for="number">
                            <b-form-input id="number" v-model="updatedMachine.number"
                                          :disabled="isCreate && updatedMachine.type == null"
                                          :state="getValidationState(validationContext)"
                                          @input="validateNumber"
                                          @focusout="validateNumber"
                                          aria-describedby="input-number-live-feedback"/>
                            <b-form-invalid-feedback id="input-number-live-feedback">
                                {{validationContext.errors[0]}}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                    <validation-provider name="Model Number" immediate
                                         :rules="{required: true, min: 3, max: 32}"
                                         v-slot="validationContext">
                        <b-form-group
                                id="fieldset-3"
                                label-cols-sm="2"
                                label-align-sm="left"
                                description="Enter the machines model number"
                                label="Model Number:"
                                label-for="model">
                            <b-form-input id="model" v-model="updatedMachine.model"
                                          :disabled="isCreate && updatedMachine.type == null"
                                          :state="getValidationState(validationContext)"
                                          aria-describedby="input-model-live-feedback"/>
                            <b-form-invalid-feedback id="input-model-live-feedback">
                                {{validationContext.errors[0]}}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                    <validation-provider name="Serial Number" immediate
                                         rules="max: 64"
                                         v-slot="validationContext">
                        <b-form-group
                                id="fieldset-4"
                                label-cols-sm="2"
                                label-align-sm="left"
                                description="Enter the machines serial number"
                                label="Serial Number:"
                                label-for="serial">
                            <b-form-input id="serial" v-model="updatedMachine.serial"
                                          :disabled="isCreate && updatedMachine.type == null"
                                          :state="getValidationState(validationContext)"
                                          aria-describedby="input-serial-live-feedback"/>
                            <b-form-invalid-feedback id="input-serial-live-feedback">
                                {{validationContext.errors[0]}}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
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
                            <b-button pill class="mx-2" variant="primary" type="cancel" @click="onCancel">Cancel</b-button>
                            <b-button v-if="!isCreate && formChanged && valid"
                                      pill class="mx-2" variant="success" type="submit">Update</b-button>
                            <b-button v-if="isCreate && formChanged && valid"
                                      pill class="mx-2" variant="success" type="submit">Create</b-button>
                            <b-button v-if="formChanged" pill class="mx-2" variant="warning" type="reset">Reset</b-button>
                        </b-button-group>
                    </b-form-group>
                </b-form>
            </validation-observer>
        </b-card-body>
        <template v-slot:footer>
            <b-row v-if="error" class="error-row">
                <b-col>
                    <span v-if="error.detail" class="align-middle">
                        <h3>{{error.status}}: {{error.statusText}} - {{error.detail}}</h3>
                    </span>
                    <span class="align-middle">
                        <h3>{{error.message}}</h3>
                    </span>
                </b-col>
            </b-row>
        </template>
    </b-card>
</template>

<script>
    import {mapGetters} from "vuex"

    export default {
        name: "EditMachine",
        mounted() {
            this.updatedMachine = {}
            this.error = null
            this.formChanged = false
            if (this.isCreate) {
                this.updatedMachine = Object.assign({}, this.originalMachine)
                this.watchUpdated()
                this.loaded = true
            } else {
                this.loaded = false
                this.$http.get(`/equipment/${this.$route.params.id}`)
                    .then((response) => {
                        this.originalMachine = response.data
                        this.updatedMachine = Object.assign({}, this.originalMachine)
                        this.watchUpdated()
                    })
                    .catch((error) => {
                        this.updateError(error)
                    }).finally(() => this.loaded = true)
            }
        },
        computed: {
            ...mapGetters([
                "usedNumbers"
            ]),
            isCreate() {
                return !this.$route.params.id
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
        },
        data() {
            return {
                loaded: false,
                formChanged: false,
                unwatchUpdatedMachine: null,
                updatedMachine: {},
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
           getValidationState({errors, valid = null}) {
               return errors[0] ? false : (valid ? true : null)
           },
            validateNumber(value) {
               let observer = this.$refs.observer
                let provider = this.$refs.number_provider
                let new_number = parseInt(this.updatedMachine.number)
                let original_number = this.originalMachine.number
                let machine_type = this.updatedMachine.type === 0 ? "Washer" : "Dryer"
                provider.validate(value)
                    .then(validationContext => {
                        if (validationContext.valid) {
                            let existingNumbers = this.isCreate ?
                                this.usedNumbers[this.updatedMachine.type] :
                                this.usedNumbers[this.originalMachine.type]

                            for (let i=0; i < existingNumbers.length; ++i) {
                                if (this.isCreate && new_number === existingNumbers[i]) {
                                    provider.setFlags({invalid: true, valid: false})
                                    provider.syncValue(this.updatedMachine.number)
                                    observer.setErrors({number: `That ${machine_type} Number already exists`})
                                    break
                                }

                                if (new_number !== original_number && new_number === existingNumbers[i]) {
                                    provider.setFlags({invalid: true, valid: false})
                                    provider.syncValue(this.updatedMachine.number)
                                    observer.setErrors({number: `That ${machine_type} Number already exists`})
                                    break
                                }
                            }
                        }
                    }).catch(error => {
                        this.$refs.number_provider.setFlags({invalid: true, valid: false})
                        this.$refs.observer.setErrors({number: error})
                    })
            },
            onSubmit() {
                const options = {
                    url: `/${this.machineType.toLowerCase()}`,
                    method: this.isCreate ? "post" : "put",
                    data: this.updatedMachine
                }
                options.data.number = parseInt(options["data"].number)
                this.error = null
                this.$http.request(options)
                    // eslint-disable-next-line no-unused-vars
                    .then((response) => {
                        this.$router.push({name: "MachineList"})
                    })
                    .catch((error) => {
                        if (error.response.status === 409) {
                            error.message = error.response.data.detail
                            error.response = null
                        }
                        this.updateError(error)
                    })
            },
            async onReset() {
                this.updatedMachine = Object.assign({}, this.originalMachine)
                requestAnimationFrame(() => {
                    this.$refs.observer.reset()
                    this.formChanged = false
                    this.error = null
                })
            },
            onCancel() {
                this.$router.push({name: "MachineList"})
            },
            watchUpdated() {
                this.unwatchUpdated()
                this.unwatchUpdatedMachine = this.$watch("updatedMachine", this.dirtyWatcher, {deep: true})
            },
            unwatchUpdated() {
                if (this.unwatchUpdatedMachine) {
                    this.unwatchUpdatedMachine()
                    this.unwatchUpdatedMachine = null
                }
            },
            // eslint-disable-next-line no-unused-vars
            dirtyWatcher(oldValue, newValue) {
                let new_number = this.updatedMachine.number
                if (new_number && new_number !== "") {
                    new_number = parseInt(new_number)
                }
                let t = this.originalMachine.number !== new_number ||
                    this.originalMachine.model !== this.updatedMachine.model ||
                    this.originalMachine.serial !== this.updatedMachine.serial ||
                    this.originalMachine.active !== this.updatedMachine.active ||
                    this.originalMachine.description !== this.updatedMachine.description;
                this.formChanged = t
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