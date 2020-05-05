<template>
    <div v-if="visible">
        <b-row class="mt-5">
            <b-col cols="3"></b-col>
            <b-col cols="3">
                <button v-google-signin-button="'280185683126-2i4joojl07nrdkioohi71sm7nro6v1cb.apps.googleusercontent.com'"
                        class="google-sign-in-button"> Continue with Google</button>
            </b-col>
            <b-col cols="3">
                <button v-facebook-signin-button="'appID'"
                        class="facebook-sign-in-button"> Continue with Facebook</button>
            </b-col>
        </b-row>
        <b-row v-if="error" class="mt-5 error-row">
            <b-col>
                    <span v-if="error.detail" class="align-middle">
                        <h3>{{error.status}}: {{error.statusText}} - {{error.detail}}</h3>
                    </span>
                <span class="align-middle">
                        <h3>{{error.message}}</h3>
                    </span>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import auth from "@/auth"
    import GoogleSignInButton from 'vue-google-signin-button-directive'
    import FacebookSignInButton from 'vue-facebook-signin-button-directive'

    export default {
        name: "Login",
        directives: {
            GoogleSignInButton,
            FacebookSignInButton
        },
        data() {
            return {
                visible: false,
                error: null
            }
        },
        mounted() {
            if (auth.isAuthenticated()) {
                this.$router.push({name: "MachineList"})
            } else {
                this.$http.get("/refresh", {withCredentials: true})
                    .then((response) => {
                        auth.login(response.data.access_token, response.data.expiry)
                        this.$router.push({name: "MachineList"})
                    }).catch((error) => {
                        this.visible = true
                        if (error.response.status !== 401) {
                            this.error = error
                        }
                        auth.logout()
                })
            }
        },
        computed: {
        },
        methods: {
            OnGoogleAuthSuccess(idToken) {
                this.error = null
                this.$http.post("/login", "", {
                    withCredentials: true,
                    headers: {"X-Login-Token": idToken}})
                    .then((response) => {
                        if (response.status === 200) {
                            auth.login(response.data.access_token, response.data.expiry)
                            this.$router.push({name: "MachineList"})
                        }
                    }).catch(error => {
                        this.error = error
                    })
            },
            OnGoogleAuthFail(error) {
                if (error.error !== "popup_closed_by_user") {
                    console.log(error)
                }
            },
            OnFacebookAuthSuccess (idToken) {
                this.error = null
                alert(idToken)
                auth.login(idToken)
                this.$router.push({name: "MachineList"})
            },
            OnFacebookAuthFail (error) {
                console.log(error)
            },
        }
    }
</script>

<style scoped>

</style>