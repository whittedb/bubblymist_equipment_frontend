import store from "@/store"
import axios from "@/api"
import {bus} from "@/main"

export default {
    login(access_token, expiry) {
        this._cancelRefreshTimer()
        expiry = new Date(expiry)
        store.commit("setApiToken", {token: access_token, expiry: expiry})
        this._startRefreshTimer()
    },
    logout() {
        this._cancelRefreshTimer()
        store.commit("setApiToken", {token: null, expiry: null})
    },
    isAuthenticated() {
        return store.getters.isAuthenticated
    },
    getApiToken() {
        return store.getters.apiToken
    },
    _startRefreshTimer() {
        this._cancelRefreshTimer()
        let id = setTimeout(() => {
            axios.get("/refresh", {withCredentials: true})
                .then((response) => {
                    if (response.status === 200) {
                        this.login(response.data.access_token, response.data.expiry)
                        this._startRefreshTimer()
                    }
                }).catch((error) =>{
                    console.log(error)
                    bus.$emit("logout")
                    this._startRefreshTimer()
            })
        }, store.getters.refreshInterval != null ? store.getters.refreshInterval : 1000 * 60)
        store.commit("setRefreshTokenTimerId", id)
    },
    _cancelRefreshTimer() {
        let id = store.getters.refreshTokenTimerId
        if (id !== null) {
            clearTimeout(id)
            store.commit("setRefreshTokenTimerId", null)
        }
    }
}
