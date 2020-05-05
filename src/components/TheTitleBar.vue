<template>
    <b-row class="mb-3 mt-4">
        <b-col class="logo_image" cols="2">
            <b-link to="/">
                <b-img src="../assets/logo_800x617.png" :alt="version" height="70"></b-img>
            </b-link>
        </b-col>
        <b-col class="title" cols="9" style="text-align: center">
            <h1>{{ title }}</h1>
        </b-col>
        <b-col cols="1" v-if="isAuthenticated" >
            <span style="text-align: right">
            <b-link @click="logout">Logout</b-link>
            </span>
        </b-col>
    </b-row>
</template>

<script>
    import auth from "@/auth"
    import {mapGetters} from "vuex"
    import {bus} from "@/main"

    export default {
        name: "TitleBar",
        props: {
            title: String
        },
        data: function () {
            return {
                version: "V" + process.env.VUE_APP_VERSION,
            }
        },
        created() {
            bus.$on("logout", () => { this.logout()})
        },
        computed: {
            ...mapGetters([
                "isAuthenticated"
            ])
        },
        methods: {
            logout() {
                this.$http.post("/logout", "", {withCredentials: true})
                    .then(() => {
                        auth.logout()
                        this.$router.push({name: "Login"})
                    })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>
