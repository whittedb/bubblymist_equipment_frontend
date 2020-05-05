<template>
  <b-container id="app" fluid="xl">
    <TheTitleBar :title="title"/>
    <router-view></router-view>
  </b-container>
</template>

<script>
import TheTitleBar from "./TheTitleBar.vue"

export default {
  name: 'App',
  components: {
    TheTitleBar,
  },
  computed: {
    title() {
      return "Equipment Manager - " + this.env
    }
  },
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      env: process.env.NODE_ENV
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
/* Import custom SASS variable overrides, or alternatively
 define your variable overrides here instead
 */
@import '../assets/custom-vars.scss';

/* Import Bootstrap and BootstrapVue source SCSS files
 */
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

/* General style overrides and custom classes
 */
body {
  margin: 10px;
}

.my-widget {
  color: var(--danger);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
//  text-align: center;
  color: #2c495f;
  margin-outside: 30px;
}
.error-row {
  background: var(--danger);
}

.google-sign-in-button {
  color: white;
  background-color: red;
  height: 50px;
  font-size: 16px;
  border-radius: 10px;
  padding: 10px 20px 25px 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.facebook-sign-in-button {
  color: white;
  background-color: #3b5998;
  height: 50px;
  font-size: 16px;
  border-radius: 10px;
  padding: 10px 20px 25px 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
/*.title {*/
/*  font-family: Garamond, sans-serif;*/
/*  padding: 5px;*/
/*  alignment: center;*/
/*}*/
</style>
