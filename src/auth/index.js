import store from "@/store"

export default {
    googleAuthToken: "",
    facebookAuthToken: "",
    authenticated: false,

    logout() {
        localStorage.setItem("googleAuthToken", null)
        localStorage.setItem("facebookAuthToken", null)
        this.googleAuthToken = null
        this.facebookAuthToken = null
        this.authenticated = false
    },

    googleAuthenticate(authToken) {
        localStorage.setItem("googleAuthToken", authToken)
        this.googleAuthToken = authToken
    },

    facebookAuthenticate(authToken) {
        localStorage.setItem("facebookAuthToken", authToken)
        this.facebookAuthToken = authToken
    },

    checkAuth() {
        this.googleAuthToken = localStorage.getItem("googleAuthToken")
        this.facebookAuthToken = localStorage.getItem("facebookAuthToken")
        this.authenticated = !(this.googleAuthToken == null || this.googleAuthToken === "null") ||
            !(this.facebookAuthToken == null || this.googleAuthToken === "null")
        store.commit("setAuthenticated", {authenticated: this.authenticated})
    },

    isAuthenticated() {
        this.checkAuth()
        return this.authenticated
    },

    isGoogleAuth() {
        return this.googleAuthToken != null
    },
    isFacebookAuth() {
        return this.facebookAuthToken != null
    },

    getAuthInfo() {
        return  {
            authenticated: this.authenticated,
            type: this.isGoogleAuth() ? "Google" : this.isFacebookAuth() ? "Facebook" : "None",
            token: this.isGoogleAuth() ? this.googleAuthToken() : this.isFacebookAuth() ? this.facebookAuthToken : null
        }
    },
}
