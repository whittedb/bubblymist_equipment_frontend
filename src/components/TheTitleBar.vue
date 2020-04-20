<template>
    <b-row class="mb-5">
        <b-col class="logo_image" cols="1">
            <b-link to="/">
                <b-img src="../assets/logo_800x617.png" :alt="version" height="70"></b-img>
            </b-link>
        </b-col>
        <b-col class="title" cols="11">
            <h1>{{ title }}</h1>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: "TitleBar",
        props: {
            title: String
        },
        data: function () {
            return {
                version: "V" + process.env.VUE_APP_VERSION,
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
    .title {
        font-family: Garamond, sans-serif;
        padding: 5px;
        alignment: center;
    }
</style>
