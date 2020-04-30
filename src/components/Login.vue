<template>
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
</template>

<script>
    import auth from "../auth"
    import GoogleSignInButton from 'vue-google-signin-button-directive'
    import FacebookSignInButton from 'vue-facebook-signin-button-directive'

    export default {
        name: "Login",
        directives: {
            GoogleSignInButton,
            FacebookSignInButton
        },
        data() {
            return {}
        },
        mounted() {
            if (auth.isAuthenticated()) {
                this.$router.push({name: "MachineList"})
            } else {
                auth.logout()
            }
        },
        computed: {
        },
        methods: {
            OnGoogleAuthSuccess(idToken) {
                auth.googleAuthenticate(idToken)
                this.$router.push({name: "MachineList"})
            },
            OnGoogleAuthFail(error) {
                if (error.error !== "popup_closed_by_user") {
                    console.log(error)
                }
            },
            OnFacebookAuthSuccess (idToken) {
                alert(idToken)
                auth.facebookAuthenticate(idToken)
                this.$router.push({name: "MachineList"})
            },
            OnFacebookAuthFail (error) {
                console.log(error)
            }
        }
    }
</script>

<style scoped>

</style>